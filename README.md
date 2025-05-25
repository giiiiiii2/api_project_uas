<h1 align="center">🏥 MediTrack</h1>
<p align="center">
  <i>A smart, real-time healthcare platform for patients and doctors across Indonesia.</i><br/>
  <b>Track medical history · Find specialists · View prescriptions · Check live hospital beds</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Role-Patient%20%7C%20Doctor-blue" />
  <img src="https://img.shields.io/badge/API-SIRANAP-green" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## 🧠 What is MediTrack?

**MediTrack** is a full-featured web platform built to make healthcare more accessible and organized in Indonesia. Patients can log their medical history, consult doctors based on specialties, track prescription dosages, and even check **real-time hospital bed availability** via SIRANAP API. Doctors, on the other hand, can provide consultations, manage patient records, and offer tailored medical guidance — all in one place.

### 👥 Key Features

- 📋 **Log Medical History** — Patients can record past and ongoing illnesses, diagnoses, and treatments.
- 💊 **Prescription Tracking** — View and manage dosage schedules for prescribed medications.
- 💬 **Doctor Consultation** — Role-based access where patients can consult doctors by specialty.
- 🏥 **Live Hospital Bed Check** — Fetches bed availability across Indonesian hospitals using [SIRANAP](https://yankes.kemkes.go.id/app/siranap/).

> Whether you're a patient looking for help, or a doctor looking to help — MediTrack brings it all together.

---

## ⚙️ Technologies Used

This project was built using the following stack:

| Layer         | Tech                            |
|---------------|---------------------------------|
| Frontend      | React.js + Tailwind CSS         |
| Backend       | Node.js + Express               |
| Authentication| JWT (JSON Web Tokens)           |
| Database      | MySQL                           |
| Realtime Data | SIRANAP API (Hospital Beds)     |
| Deployment    | Vercel / Railway                |

---

## 🚀 Ready to Run?

Here’s how you get started with MediTrack:

### 🔧 Step 1: Clone the Repo

```bash
git clone https://github.com/giiiiiii2/
cd meditrack
```
### 🔧 Step 2: Install Dependencies
```bash
npm Install
```
### 🔧 Step 2: COnfigure your dependencies
```bash
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SIRANAP_API=https://yankes.kemkes.go.id/app/siranap/pencarian
```
### 🔧 Step 2: Run the Development Server
```bash
npm run dev
```
