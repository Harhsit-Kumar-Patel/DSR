# Dutro Privacy Operations Platform (DSR & Grievance Redressal)

A production-grade, unified Data Subject Request (DSR / DSAR) operations and statutory grievance redressal platform built for compliance with the **Digital Personal Data Protection (DPDP) Act 2023 (Sections 11 & 13)** and the **General Data Protection Regulation (GDPR Article 15)**.

---

## 🌟 Key Capabilities

### 1. Data Principal (Customer) Portal
- **2FA OTP Authentication & Verified Registration**: Secure identity verification prior to request intake.
- **Statutory Right of Access Intake**: Submit statutory access requests with audit-logged metadata and document references.
- **Real-Time Statutory SLA Countdown Clocks**: Live visual countdown for the 30-day DSR statutory deadline and 15-day grievance SLA.
- **Automated Communication Center**: Instant access to official statutory communications and email delivery receipts.
- **Statutory Grievance Redressal (DPDP Sec. 13)**: Multi-stage redressal initiation (Initial Review, Senior Privacy Review, and Final DPO Review).
- **Secure Email Delivery**: Upon closure, final verified response packages and compliance certificates are automatically dispatched directly to the customer's registered email.

### 2. Privacy Consultant & Compliance Operations Workspace
- **Executive Overview Dashboard**: High-level KPI metrics, DSR stage pipeline distribution, and live active requests tracking.
- **10-Stage Unified DSR Case Lifecycle**: End-to-end management spanning Ingestion, Verification, Data Discovery (RoPA Catalog & Location Checks), Department Retrieval Tasks, Redaction Review, Consultant Validation, and Closure.
- **Inter-Departmental Retrieval Tasks**: Dispatch and track data queries across CRM, Customer Support, and Finance Operations teams.
- **Redaction & Safeguards Review**: Structured 9-point confidentiality checklist to sanitize internal employee and third-party PII.
- **Immutable Platform Audit Trail**: Chronological, cryptographically sound event logging for all data operations and statutory determinations.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: Synchronous `localStorage` with reactive multi-tab sync

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd DSR

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Production Build
```bash
npm run build
```

---

## 👥 Demo Profiles

- **End Customer**: Rohan Mehta (`rohan.mehta@example.com` / `+91 90000 12345`)
- **Lead Consultant**: Harshit Patel (`harshit.patel@dutro.example` / `Dutro Privacy Advisory`)

---

## 📄 License
Internal Proprietary Platform for Dutro Privacy Advisory & Client Operations.
