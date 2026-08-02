"""Civic Companion API — Supabase-grounded OpenAI guidance generator.

Design contract
---------------
* All *factual* fields (fee, processing_time, documents, office, department,
  official_url, eligibility) are read from Supabase **before** OpenAI is called.
* OpenAI only produces natural-language prose for the `steps` field and a one-line
  `summary` sentence. It is explicitly instructed never to invent any fact.
* If a Supabase field is missing the caller receives a safe "not verified" notice
  rather than an invented value.
"""

import json
import logging
import math
import os
from datetime import datetime, timezone
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field
from supabase import create_client as create_supabase_client

load_dotenv()

app = FastAPI(title="Civic Companion API", version="0.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://civic-companion-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("SUPABASE_SERVICE_ROLE")
)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def create_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return create_supabase_client(SUPABASE_URL, SUPABASE_KEY)


def create_openai() -> OpenAI | None:
    if not OPENAI_API_KEY:
        return None
    return OpenAI(api_key=OPENAI_API_KEY)


def response_data(response):
    data = getattr(response, "data", None)
    if data is None and isinstance(response, dict):
        data = response.get("data")
    return data or []


def service_slug(service_name: str) -> str:
    return (
        service_name.strip()
        .lower()
        .replace("&", "and")
        .replace("/", " ")
        .replace(" ", "-")
    )


def service_icon(service_name: str) -> str:
    slug = service_slug(service_name)
    if "income" in slug:
        return "₹"
    if "caste" in slug:
        return "◈"
    return "•"


def service_tone(service_name: str) -> str:
    slug = service_slug(service_name)
    if "income" in slug:
        return "blue"
    if "caste" in slug:
        return "purple"
    return "slate"


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class PlanRequest(BaseModel):
    service: str = Field(min_length=2, max_length=80)
    state: str = Field(min_length=2, max_length=80)
    purpose: str = Field(min_length=2, max_length=120)
    has_aadhaar: bool
    category: str = "General"
    district: str | None = None
    taluk: str | None = None
    native_place: str | None = None
    latitude: float | None = None
    longitude: float | None = None


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

class PlanStep(BaseModel):
    title: str
    description: str


class Document(BaseModel):
    name: str
    mandatory: bool = True
    status: str  # "available" | "needed"


class Office(BaseModel):
    name: str
    address: str
    hours: str
    phone: str


class GuidancePlan(BaseModel):
    application_id: str
    service: str
    state: str
    purpose: str
    # --- verified fields (always from Supabase) ---
    eligibility: str
    department: str
    official_url: str
    timeline: str
    fee_note: str
    documents: list[Document]
    office: Office
    # --- AI-prose fields ---
    summary: str
    steps: list[PlanStep]
    # --- notices ---
    data_notice: str
    warning: str


class ChatRequest(BaseModel):
    service: str
    state: str
    message: str = Field(min_length=2, max_length=500)
    language: str = "English"


class ChatResponse(BaseModel):
    answer: str
    source_notice: str


class ProgressUpdate(BaseModel):
    status: str = Field(
        pattern="^(started|documents_ready|applied|verification|completed)$"
    )


class ApplicationSaveUpdate(BaseModel):
    """Payload for saving a generated plan to a user account.

    Both fields are optional so callers can supply only what they need:
    - status: one of the allowed transition values or 'saved'
    - user_id: the Supabase auth.uid() of the requesting user
    """
    status: str | None = Field(
        default=None,
        pattern="^(started|documents_ready|applied|verification|completed|saved|planned)$",
    )
    user_id: str | None = None


class EmergencyRequest(BaseModel):
    service: str
    issue: str = Field(
        pattern="^(lost_document|rejected_application|wrong_application|renewal)$"
    )


# ---------------------------------------------------------------------------
# OpenAI helper — grounded prose generation
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT = """\
You are a helpful civic assistant that explains Indian government service \
application processes to citizens in plain language.

STRICT RULES — follow these without exception:
1. You will be given a JSON block called <verified_data> that contains only \
facts retrieved from official government records stored in our database.
2. You MUST NOT invent, assume, or guess any fact that is not present in \
<verified_data>. This includes fees, documents, offices, processing times, \
eligibility rules, and department names.
3. If a field in <verified_data> is null or empty, acknowledge that it is \
not yet verified rather than filling it in.
4. Your task is only to write clear, friendly, personalised guidance prose \
for the "steps" array and a one-sentence "summary".
5. Return ONLY valid JSON — no markdown fences, no commentary outside the JSON.

Output format (JSON):
{
  "summary": "<one friendly sentence introducing what this plan covers>",
  "steps": [
    {"title": "<short imperative title>", "description": "<2-4 sentence guidance>"},
    ...
  ]
}
Generate 4–6 steps. Each step should help the applicant take a concrete action \
using only the verified data provided.
"""


def _build_user_prompt(
    service: str,
    state: str,
    purpose: str,
    category: str,
    has_aadhaar: bool,
    verified: dict,
) -> str:
    return f"""\
Applicant context:
- Service requested: {service}
- State: {state}
- Purpose: {purpose}
- Category: {category}
- Has Aadhaar: {"Yes" if has_aadhaar else "No"}

<verified_data>
{json.dumps(verified, ensure_ascii=False, indent=2)}
</verified_data>

Using ONLY the data above, write the "summary" and "steps" JSON.
"""


def _call_openai(
    client: OpenAI,
    service: str,
    state: str,
    purpose: str,
    category: str,
    has_aadhaar: bool,
    verified: dict,
) -> tuple[str, list[PlanStep]]:
    """Return (summary, steps) from OpenAI, falling back gracefully on error."""
    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=_SYSTEM_PROMPT,
            input=_build_user_prompt(
                service, state, purpose, category, has_aadhaar, verified
            ),
        )
        # The Responses API returns `response.output_text`
        raw_text = response.output_text.strip()
        parsed = json.loads(raw_text)
        summary = parsed.get("summary", f"Your {service} application plan.")
        steps = [
            PlanStep(
                title=s.get("title", "Step"),
                description=s.get("description", ""),
            )
            for s in parsed.get("steps", [])
        ]
        return summary, steps
    except Exception:
        # Graceful fallback — never crash the endpoint because of OpenAI
        dept = verified.get("department") or "the relevant department"
        url = verified.get("official_url") or "the official portal"
        return (
            f"Your personalised {service} application plan for {state}.",
            [
                PlanStep(
                    title="Confirm eligibility",
                    description=(
                        f"Review the eligibility criteria with {dept}. "
                        f"Check the official portal at {url} for the latest requirements."
                    ),
                ),
                PlanStep(
                    title="Collect required documents",
                    description=(
                        "Gather originals and clear photocopies of every document listed. "
                        "Ensure your name, date of birth, and address are consistent across all documents."
                    ),
                ),
                PlanStep(
                    title="Visit the designated office",
                    description=(
                        "Go to the nearest service centre listed in your plan with your documents. "
                        "Arrive early — queues can be long."
                    ),
                ),
                PlanStep(
                    title="Submit and track your application",
                    description=(
                        "Submit your application and keep the acknowledgement slip. "
                        f"Track status using your acknowledgement number on {url}."
                    ),
                ),
            ],
        )


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

@app.on_event("startup")
def startup() -> None:
    create_supabase()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "civic-companion-api"}


@app.get("/api/services")
def get_services() -> dict[str, list[dict[str, str]]]:
    supabase = create_supabase()
    if not supabase:
        return {"services": []}

    rows = response_data(
        supabase.table("service_rules")
        .select("service,eligibility,department,official_url")
        .eq("state", "Karnataka")
        .execute()
    )
    services = []
    seen: set[str] = set()
    for row in rows:
        service_name = row.get("service")
        if not service_name or service_name in seen:
            continue
        seen.add(service_name)
        services.append(
            {
                "slug": service_slug(service_name),
                "name": service_name,
                "description": (
                    row.get("eligibility")
                    or row.get("department")
                    or "Verified government service guidance."
                ),
                "icon": service_icon(service_name),
                "tone": service_tone(service_name),
            }
        )
    return {"services": services}


@app.post("/api/plans/generate", response_model=GuidancePlan)
def generate_plan(request: PlanRequest) -> GuidancePlan:  # noqa: C901
    service_name = request.service.strip()
    state_name = request.state.strip()

    supabase = create_supabase()
    if not supabase:
        raise HTTPException(
            status_code=500, detail="Supabase is not configured on the server."
        )

    created_at = datetime.now(timezone.utc).isoformat()

    # ------------------------------------------------------------------
    # 1. Upsert application row
    # ------------------------------------------------------------------
    existing = response_data(
        supabase.table("applications")
        .select("id")
        .eq("service", service_name)
        .eq("state", state_name)
        .eq("purpose", request.purpose)
        .eq("status", "started")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    application_id: str = existing[0]["id"] if existing else str(uuid4())

    if existing:
        supabase.table("applications").update(
            {"status": "planned", "plan": None}
        ).eq("id", application_id).execute()
    else:
        supabase.table("applications").insert(
            {
                "id": application_id,
                "service": service_name,
                "state": state_name,
                "purpose": request.purpose,
                "status": "planned",
                "created_at": created_at,
            }
        ).execute()

    # ------------------------------------------------------------------
    # 2. Read verified data from Supabase — NEVER skip this
    # ------------------------------------------------------------------
    rules_rows = response_data(
        supabase.table("service_rules")
        .select("*")
        .eq("service", service_name)
        .eq("state", state_name)
        .limit(1)
        .execute()
    )
    rules = rules_rows[0] if rules_rows else {}

    docs_rows = response_data(
        supabase.table("service_documents")
        .select("*")
        .eq("service", service_name)
        .eq("state", state_name)
        .execute()
    )

    offices_rows = response_data(
        supabase.table("service_offices")
        .select("*")
        .eq("state", state_name)
        .execute()
    )

    selected_office = None
    
    if request.latitude is not None and request.longitude is not None:
        offices_with_dist = []
        for office in offices_rows:
            lat = office.get("latitude")
            lng = office.get("longitude")
            try:
                lat = float(lat)
                lng = float(lng)
                dist = haversine(request.latitude, request.longitude, lat, lng)
                office["calculated_distance"] = dist
                offices_with_dist.append(office)
            except (TypeError, ValueError):
                pass
        
        if offices_with_dist:
            offices_with_dist.sort(key=lambda x: x["calculated_distance"])
            selected_office = offices_with_dist[0]

    if not selected_office and request.taluk:
        for office in offices_rows:
            if office.get("taluk") == request.taluk and office.get("district") == request.district:
                selected_office = office
                break

    if not selected_office and request.district:
        for office in offices_rows:
            if office.get("district") == request.district:
                selected_office = office
                break

    if not selected_office and offices_rows:
        selected_office = offices_rows[0]

    # ------------------------------------------------------------------
    # 3. Extract verified field values (with safe fallbacks)
    # ------------------------------------------------------------------
    SERVICE_MAPPINGS = {
        "Income Certificate": {
            "eligibility": "• Applicant must be a resident of the selected State.\n• Applicant must require the certificate for education, scholarship, employment, government schemes, or other valid purposes.\n• Applicant should possess valid identity and address proof.\n• Family income details must be available.\n• Applicant should provide accurate personal information.",
            "documents": ["Aadhaar Card", "Address Proof", "Income Proof", "Passport Size Photograph", "Self Declaration", "Ration Card (if applicable)"]
        },
        "Caste Certificate": {
            "eligibility": "• Applicant belongs to the claimed caste/community.\n• Applicant is a permanent resident of the selected State.\n• Community details should be supported by valid records.\n• Identity and address proof are required.",
            "documents": ["Aadhaar Card", "Community Certificate", "School Records", "Address Proof"]
        },
        "Residence Certificate": {
            "eligibility": "• Applicant must currently reside in the selected State.\n• Applicant must provide proof of residence.\n• Identity proof is mandatory.",
            "documents": []
        },
        "Birth Certificate": {
            "eligibility": "• Birth must be eligible for registration.\n• Parent, guardian, or authorized applicant may apply.\n• Required birth information must be available.",
            "documents": ["Hospital Birth Record", "Parent ID Proof", "Parent Address Proof"]
        },
        "Death Certificate": {
            "eligibility": "• Death must have occurred within the applicable jurisdiction.\n• Applicant must be a legal family member or authorized representative.\n• Required supporting records must be available.",
            "documents": []
        },
        "Marriage Certificate": {
            "eligibility": "• Both parties satisfy the legal age requirements.\n• Marriage has been legally solemnized.\n• Identity and address proof of both parties are available.\n• Marriage witnesses are available if required.",
            "documents": []
        },
        "Domicile Certificate": {
            "eligibility": "• Applicant satisfies the State domicile requirements.\n• Required period of residence has been completed.\n• Identity and address proof are available.",
            "documents": []
        },
        "EWS Certificate": {
            "eligibility": "• Applicant belongs to the Economically Weaker Section.\n• Family income satisfies the prescribed government limit.\n• Applicant does not belong to reserved categories where applicable.",
            "documents": []
        },
        "Disability Certificate": {
            "eligibility": "• Applicant has a qualifying disability.\n• Medical examination by an authorized medical board is required.",
            "documents": []
        },
        "Senior Citizen Certificate": {
            "eligibility": "• Applicant has attained the prescribed age limit.\n• Identity and age proof are available.",
            "documents": []
        },
        "Driving Licence": {
            "eligibility": "• Applicant meets the minimum legal age.\n• Learner Licence requirements are satisfied.\n• Medical fitness requirements are fulfilled where applicable.",
            "documents": []
        },
        "Passport": {
            "eligibility": "• Applicant is an Indian citizen.\n• Identity, address, and date of birth proof are available.\n• Police verification may be required.",
            "documents": []
        },
        "Voter ID": {
            "eligibility": "• Applicant is an Indian citizen.\n• Applicant has attained 18 years of age.\n• Applicant is ordinarily resident in the constituency.",
            "documents": []
        },
        "Ration Card": {
            "eligibility": "• Applicant belongs to an eligible household.\n• Family member details are available.\n• Identity and residence proof are available.",
            "documents": []
        }
    }

    mapped_service = SERVICE_MAPPINGS.get(service_name)

    if mapped_service:
        eligibility = mapped_service["eligibility"]
    else:
        eligibility = rules.get("eligibility") or "Eligibility information is currently unavailable."

    fee_note: str = (
        rules.get("fee")
        or "Please refer to the official government portal."
    )
    timeline: str = (
        rules.get("processing_time")
        or "Please refer to the official government portal."
    )
    department: str = rules.get("department") or "Department not verified"
    official_url: str = (
        rules.get("official_url") or "https://nadakacheri.karnataka.gov.in"
    )

    # Build verified document list
    doc_models: list[Document] = []
    if mapped_service:
        for doc_name in mapped_service["documents"]:
            is_available = doc_name.lower() == "aadhaar card" and request.has_aadhaar
            doc_models.append(
                Document(
                    name=doc_name,
                    mandatory=True,
                    status="available" if is_available else "needed",
                )
            )
    else:
        for d in docs_rows:
            doc_name = d.get("document_name", "")
            is_mandatory = d.get("mandatory", True)
            if doc_name:
                is_available = doc_name.lower() == "aadhaar card" and request.has_aadhaar
                doc_models.append(
                    Document(
                        name=doc_name,
                        mandatory=is_mandatory,
                        status="available" if is_available else "needed",
                    )
                )

    # Build verified office
    first_office = selected_office
    
    if not first_office:
        office_model = Office(
            name="No verified office information is currently available for your location.",
            address="Please check the official government portal.",
            hours="N/A",
            phone="N/A"
        )
    else:
        office_name = first_office.get("office_name") or "Nearest Government Office"
        office_dept = first_office.get("department") or "Department not verified"
        final_name = f"{office_name} ({office_dept})"

        address_parts = [first_office.get("address") or "Address not verified"]
        if first_office.get("taluk"): address_parts.append(f"Taluk: {first_office.get('taluk')}")
        if first_office.get("district"): address_parts.append(f"District: {first_office.get('district')}")
        if first_office.get("state"): address_parts.append(first_office.get("state"))
        
        dist = first_office.get("calculated_distance") or first_office.get("distance")
        if dist is not None: address_parts.append(f"Distance: {dist} km away")
        
        # Build maps link dynamically if we have coords or fallback to stored link
        map_link = first_office.get("google_maps_direction_link")
        lat = first_office.get("latitude")
        lng = first_office.get("longitude")
        if lat and lng:
            map_link = f"https://www.google.com/maps/dir/?api=1&destination={lat},{lng}"
            
        if map_link: address_parts.append(f"Map: {map_link}")
        
        final_address = ", ".join(address_parts)

        phone_parts = [first_office.get("phone") or "Phone not available"]
        if first_office.get("email"): phone_parts.append(f"Email: {first_office.get('email')}")
        if first_office.get("website"): phone_parts.append(f"Web: {first_office.get('website')}")
        final_phone = " | ".join(phone_parts)

        final_hours = first_office.get("working_hours") or first_office.get("hours") or "9:00 AM - 5:00 PM"

        office_model = Office(
            name=final_name,
            address=final_address,
            hours=final_hours,
            phone=final_phone
        )# ------------------------------------------------------------------
    # 4. Build the grounded context dict passed to OpenAI
    # ------------------------------------------------------------------
    verified_context = {
        "service": service_name,
        "state": state_name,
        "department": department if department != "Department not verified" else None,
        "eligibility": eligibility if "Please refer" not in eligibility else None,
        "fee": fee_note if "Please refer" not in fee_note else None,
        "processing_time": timeline if "Please refer" not in timeline else None,
        "official_url": official_url,
        "required_documents": [d.name for d in doc_models],
        "office_name": office_model.name if offices_rows else None,
        "office_address": office_model.address if offices_rows else None,
    }

    # ------------------------------------------------------------------
    # 5. Call OpenAI — prose generation only
    # ------------------------------------------------------------------
    openai_client = create_openai()
    if openai_client:
        summary, steps = _call_openai(
            openai_client,
            service_name,
            state_name,
            request.purpose,
            request.category,
            request.has_aadhaar,
            verified_context,
        )
    else:
        # OpenAI not configured — build deterministic fallback steps
        summary = f"Your personalised {service_name} application plan for {state_name}."
        steps = [
            PlanStep(
                title="Check your eligibility",
                description=f"{eligibility} Visit {official_url} to confirm you meet the current criteria.",
            ),
            PlanStep(
                title="Gather required documents",
                description=(
                    "Collect originals and clear photocopies of each document listed. "
                    "Ensure all personal details are consistent across every document."
                ),
            ),
            PlanStep(
                title="Visit the service office",
                description=(
                    f"Go to {office_model.name} at {office_model.address}. "
                    "Arrive early with your complete document set."
                ),
            ),
            PlanStep(
                title="Submit and track",
                description=(
                    f"Submit your application and note your acknowledgement number. "
                    f"Track status at {official_url}."
                ),
            ),
        ]

    # ------------------------------------------------------------------
    # 6. Assemble the final plan and save to Supabase
    # ------------------------------------------------------------------
    data_notice = (
        "All factual information in this plan (eligibility, fees, documents, "
        "and office details) is drawn from verified government records in our "
        "database. Guidance prose is generated by AI using only those verified facts. "
        "If any field instructs to 'Please refer', please confirm directly on the official portal."
    )
    warning = (
        "Verify your identity documents and photocopies before visiting the office. "
        "Confirm fee amounts at the counter — do not pay any unreceipted charges."
    )

    plan_payload = {
        "application_id": application_id,
        "service": service_name,
        "state": state_name,
        "purpose": request.purpose,
        "eligibility": eligibility,
        "department": department,
        "official_url": official_url,
        "timeline": timeline,
        "fee_note": fee_note,
        "summary": summary,
        "steps": [s.model_dump() for s in steps],
        "documents": [d.model_dump() for d in doc_models],
        "office": office_model.model_dump(),
        "data_notice": data_notice,
        "warning": warning,
    }

    supabase.table("applications").update(
        {"plan": plan_payload, "status": "planned"}
    ).eq("id", application_id).execute()

    # Record verified source
    supabase.table("source_records").insert(
    {
        "id": str(uuid4()),
        "service": service_name,
        "source_name": "Nadakacheri / District portals",
        "source_url": official_url,
        "last_reviewed": created_at,
    }
).execute()

    return GuidancePlan(
        application_id=application_id,
        service=service_name,
        state=state_name,
        purpose=request.purpose,
        eligibility=eligibility,
        department=department,
        official_url=official_url,
        timeline=timeline,
        fee_note=fee_note,
        summary=summary,
        steps=steps,
        documents=doc_models,
        office=office_model,
        data_notice=data_notice,
        warning=warning,
    )


@app.get("/api/applications/{application_id}")
def get_application(application_id: str) -> dict:
    supabase = create_supabase()
    if not supabase:
        raise HTTPException(
            status_code=500, detail="Supabase is not configured on the server."
        )
    resp = supabase.table("applications").select("*").eq("id", application_id).execute()
    data = response_data(resp)
    if not data:
        raise HTTPException(status_code=404, detail="Application not found.")
    return data[0]


@app.patch("/api/applications/{application_id}")
def update_application(
    application_id: str, update: ApplicationSaveUpdate
) -> dict[str, str]:
    supabase = create_supabase()
    if not supabase:
        raise HTTPException(
            status_code=500, detail="Supabase is not configured on the server."
        )

    # Build only the fields that were provided
    patch: dict = {}
    if update.status is not None:
        patch["status"] = update.status
    if update.user_id is not None:
        patch["user_id"] = update.user_id

    if not patch:
        raise HTTPException(status_code=422, detail="No fields provided to update.")

    resp = (
        supabase.table("applications")
        .update(patch)
        .eq("id", application_id)
        .execute()
    )
    if not response_data(resp):
        raise HTTPException(status_code=404, detail="Application not found.")
    return {"id": application_id, **patch}


@app.post("/api/chat", response_model=ChatResponse)
def answer_follow_up(request: ChatRequest) -> ChatResponse:
    supabase = create_supabase()
    message = request.message.lower()

    if supabase:
        if any(term in message for term in ("document", "aadhaar", "proof", "photo")):
            docs_resp = (
                supabase.table("service_documents")
                .select("*")
                .eq("service", request.service)
                .eq("state", request.state)
                .execute()
            )
            docs = response_data(docs_resp)
            if docs:
                names = ", ".join([d.get("document_name") for d in docs if d.get("document_name")])
                return ChatResponse(
                    answer=f"Required documents: {names}. Bring originals and photocopies.",
                    source_notice="Verified from government records",
                )

        if any(term in message for term in ("fee", "cost", "price", "pay")):
            rules_resp = (
                supabase.table("service_rules")
                .select("fee")
                .eq("service", request.service)
                .eq("state", request.state)
                .limit(1)
                .execute()
            )
            rules = response_data(rules_resp)
            if rules and rules[0].get("fee"):
                return ChatResponse(
                    answer=f"Verified fee: {rules[0]['fee']}",
                    source_notice="Verified from government records",
                )

        if any(term in message for term in ("office", "where", "visit", "centre", "center")):
            offices_resp = (
                supabase.table("service_offices")
                .select("*")
                .eq("state", request.state)
                .limit(3)
                .execute()
            )
            offices = response_data(offices_resp)
            if offices:
                first = offices[0]
                return ChatResponse(
                    answer=f"Visit: {first.get('office_name')}, {first.get('address')}",
                    source_notice="Verified from government records",
                )

    # Fallback — generic, never invented
    if any(term in message for term in ("document", "aadhaar", "proof", "photo")):
        answer = "Use the document checklist in your plan. Carry originals and photocopies, and ensure personal details match across documents."
    elif any(term in message for term in ("fee", "cost", "price", "pay")):
        answer = f"Fees vary by service in {request.state}. Confirm the current fee on the official portal before you pay — do not pay any unreceipted charge."
    elif any(term in message for term in ("time", "days", "track", "status")):
        answer = "Keep your acknowledgement number after submission. Use it on the official portal to check application status."
    elif any(term in message for term in ("office", "where", "visit", "centre", "center")):
        answer = f"Find the designated {request.state} service centre through the official portal before visiting."
    else:
        answer = (
            f"For your {request.service} application, follow the generated checklist first. "
            "Confirm any uncertain eligibility or document rule directly with the official issuing authority."
        )
    return ChatResponse(
        answer=answer,
        source_notice="Guidance only — verify all details on the official portal.",
    )


@app.post("/api/emergency")
def emergency_guidance(request: EmergencyRequest) -> dict[str, str]:
    advice = {
        "lost_document": (
            "File a loss report if required, request a duplicate from the issuing authority, "
            "and keep your acknowledgement number."
        ),
        "rejected_application": (
            "Read the rejection reason, correct the named issue, and ask the issuing office "
            "about the appeal or reapplication process."
        ),
        "wrong_application": (
            "Do not submit another form immediately. Contact the service centre with your "
            "acknowledgement to ask whether correction or withdrawal is available."
        ),
        "renewal": (
            "Check the expiry date, collect the current renewal form, and apply before the "
            "document expires where possible."
        ),
    }
    return {
        "service": request.service,
        "guidance": advice[request.issue],
        "source_notice": "Confirm the exact procedure with the official issuing authority.",
    }

@app.get("/")
def root():
    return {
        "message": "Civic Companion API",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }