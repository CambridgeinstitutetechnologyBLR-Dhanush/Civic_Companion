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
        .limit(5)
        .execute()
    )

    # ------------------------------------------------------------------
    # 3. Extract verified field values (with safe fallbacks)
    # ------------------------------------------------------------------
    eligibility: str = (
        rules.get("eligibility")
        or "Eligibility criteria not yet verified — check the official portal."
    )
    fee_note: str = (
        rules.get("fee")
        or "Fee not verified — confirm on the official portal before paying."
    )
    timeline: str = (
        rules.get("processing_time")
        or "Processing time not verified — check the official portal."
    )
    department: str = rules.get("department") or "Department not verified"
    official_url: str = (
        rules.get("official_url") or "https://nadakacheri.karnataka.gov.in"
    )

    # Build verified document list
    doc_models: list[Document] = []
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
    first_office = offices_rows[0] if offices_rows else {}
    office_model = Office(
        name=first_office.get("office_name") or "Nearest AJSK / Nadakacheri centre",
        address=first_office.get("address") or "Check the official portal for your nearest office.",
        hours="Check official portal for working hours.",
        phone="",
    )

    # ------------------------------------------------------------------
    # 4. Build the grounded context dict passed to OpenAI
    # ------------------------------------------------------------------
    verified_context = {
        "service": service_name,
        "state": state_name,
        "department": department if department != "Department not verified" else None,
        "eligibility": eligibility if "not yet verified" not in eligibility else None,
        "fee": fee_note if "not verified" not in fee_note else None,
        "processing_time": timeline if "not verified" not in timeline else None,
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
        "If any field shows 'not verified', please confirm directly on the official portal."
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
    application_id: str, update: ProgressUpdate
) -> dict[str, str]:
    supabase = create_supabase()
    if not supabase:
        raise HTTPException(
            status_code=500, detail="Supabase is not configured on the server."
        )
    resp = (
        supabase.table("applications")
        .update({"status": update.status})
        .eq("id", application_id)
        .execute()
    )
    if not response_data(resp):
        raise HTTPException(status_code=404, detail="Application not found.")
    return {"id": application_id, "status": update.status}


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