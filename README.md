# 🏛️ Civic Companion

> **AI-Powered Government Service Guidance Platform**

Civic Companion is an AI-powered web application that simplifies the process of applying for government services in India. It provides citizens with personalized guidance, service-specific eligibility criteria, required documents, application steps, estimated processing time, fees, and relevant government office information—all in one place.

Built for the **Hackathon**, Civic Companion aims to make government services more accessible, understandable, and user-friendly.

---

## 🌐 Live Demo

🔗 **https://civic-companion-nu.vercel.app/**

---

# 📌 Problem Statement

Applying for government services is often confusing because information is scattered across multiple websites and official portals. Citizens frequently struggle to understand:

- Eligibility criteria
- Required documents
- Application procedures
- Processing time
- Government fees
- Which government office to visit

This particularly affects students, job seekers, senior citizens, rural residents, and first-time applicants, resulting in incomplete applications, repeated office visits, and unnecessary delays.

---

# 💡 Solution

Civic Companion provides a single AI-powered platform where users can generate a personalized application guide for various government services.

The platform analyzes the selected service and user-provided details to generate:

- ✅ Eligibility Criteria
- ✅ Required Documents
- ✅ Step-by-Step Application Process
- ✅ Estimated Processing Time
- ✅ Government Fees
- ✅ Relevant Government Office Information
- ✅ Personalized Guidance

The objective is to simplify government services and reduce confusion for citizens.

---

# ✨ Features

- 🤖 AI-powered personalized guidance
- 📋 Service-specific eligibility criteria
- 📄 Dynamic document checklist
- 📝 Step-by-step application guidance
- 🏢 Government office recommendations
- 📊 User dashboard for managing applications
- 🔒 Secure authentication
- 📱 Responsive user interface
- 🌐 Modern web application

---

# 🤖 AI Integration

Artificial Intelligence is used to:

- Generate personalized application guidance
- Simplify complex government procedures
- Present easy-to-understand application steps
- Organize eligibility and document requirements
- Improve the user experience through intelligent assistance

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- FastAPI
- Python

## Database

- Supabase

## AI

- OpenAI API

## Deployment

- Vercel

---

# 📂 Project Structure

```
Civic_Companion
│
├── client/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── server/
│   ├── app/
│   ├── scripts/
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/CambridgeinstitutetechnologyBLR-Dhanush/Civic_Companion.git
```

## Frontend

```bash
cd client

npm install

npm run dev
```

## Backend

```bash
cd server

python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\Activate.ps1
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Server

```bash
python -m uvicorn app.main:app --reload
```

---

# 📖 How It Works

1. User signs in.
2. Selects a government service.
3. Enters basic details.
4. AI generates a personalized application guide.
5. User reviews:
   - Eligibility
   - Required documents
   - Application steps
   - Processing time
   - Fees
   - Government office information
6. User saves the application.
7. Dashboard stores application history.

---

# 📌 Supported Government Services

Examples include:

- Income Certificate
- Caste Certificate
- Residence Certificate
- Domicile Certificate
- Birth Certificate
- Death Certificate
- Marriage Certificate
- Driving Licence
- Passport
- Voter ID
- Ration Card

The platform is designed to support many more government services.

---

# 🔮 Future Scope

The architecture has been designed for future enhancements, including:

- Additional government services across India
- More comprehensive state and district coverage
- Enhanced nearby government office recommendations
- Multilingual support
- OCR-based document verification
- Voice assistance
- Real-time application status tracking
- Integration with official government APIs and verified datasets

---

# 🎯 Why Civic Companion?

Government services should be simple, transparent, and accessible to everyone.

Civic Companion helps citizens prepare applications with confidence by providing personalized AI-powered guidance, reducing confusion, saving time, and making government information easier to understand.

---

# 👨‍💻 Team

**Team Nexus**

Cambridge Institute of Technology, Bengaluru

---

# 📜 License

This project was developed for a Hackathon.

It is intended for educational and demonstration purposes.
