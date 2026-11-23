# 🏥 MediCare Hub - Smart Hospital & Healthcare Management System

A full-stack, enterprise-grade healthcare management portal built with **React 18**, **Tailwind CSS**, **PHP REST API**, and **MySQL**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/akramulhasanemon/medicare-hub)
[![React](https://img.shields.io/badge/React-18.x-cyan?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-teal?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 Core Modules & Portals (প্রধান সুবিধাসমূহ)

### 1. 👥 Patient Portal (`PID`)
- **Interactive Medical Vault**: বুক করা সকল ডাক্তার অ্যাপয়েন্টমেন্টের স্ট্যাটাস ট্র্যাকিং।
- **Diagnostic Lab Test Records**: অটোমেটিক সিকোয়েন্সিয়াল টেস্ট আইডি (যেমন `LAB-112233`), নমুনা সংগ্রহের স্ট্যাটাস এবং ফুল প্যাথলজি রিপোর্ট দেখা ও প্রিন্ট করার সুবিধা।
- **Strict Privacy Isolation**: শুধুমাত্র সংশ্লিষ্ট রোগীর আইডি (`PID`) অথবা ভেরিফাইড ফোন নাম্বারের রিপোর্ট ও প্রেসক্রিপশন সংরক্ষিত থাকে।
- **Digital Health Vitals**: রিয়েল-টাইম লাইভ ইসিজি টেলিমেট্রি এবং ভাইটালস মনিটর (BP, SpO2, Heart Rate, Blood Sugar, Temperature)।

### 2. 🧪 Pathology & Diagnostic Lab Portal (`LID` / `TID`)
- **Sequential Lab Test Processing**: টেস্টের ধরন অনুযায়ী স্বয়ংক্রিয় ইউনিক টেস্ট নম্বর (CBC: 112233, Creatinine: 112234 ইত্যাদি)।
- **Specimen Tracking**: Blood, Urine, Serum ট্র্যাকিং এবং স্পেসিমেন কালেক্টেড স্ট্যাটাস।
- **Standardized Medical Investigation Catalog**: ২৯টি মানসম্পন্ন হাসপাতাল ইনভেস্টিগেশন (CBC with ESR, Serum Creatinine, Lipid Profile, LFT, Dengue NS1, HbA1c ইত্যাদি)।
- **Official Pathology Report Generator**: নরমাল রেফারেন্স রেঞ্জ, ফ্ল্যাগ ও সিনিয়র প্যাথলজিস্ট ভেরিফিকেশন সহ এ-৪ সাইজে প্রেসক্রিপশন ও টেস্ট রিপোর্ট প্রিন্টআউট।

### 3. 💳 Accounts Counter & POS Billing (`AID`)
- **Universal Multi-Entity Search**: যেকোনো আইডি দিয়ে তাৎক্ষণিক অনুসন্ধান (`PID` = Patient, `DID` = Doctor, `TID` = Test/Token, `AID` = Staff Cashier)।
- **Smart Percentage Discount**: ০%, ৫%, ১০%, ১৫%, ২০%, ২৫%, ৫০% প্রি-সেট ডিসকাউন্ট চিপ এবং লাইভ টাকা ডিসকাউন্ট হিসাব।
- **Instant Money Receipt**: বারকোড, ক্যাশিয়ার আইডি ও পেইড সিল সহ অফিশিয়াল ইনভয়েস জেনারেশন ও প্রিন্ট।
- **Lab Auto-Sync**: একাউন্টস থেকে টেস্টের ফি আদায় ও সাবমিট করার সাথে সাথেই তা স্বয়ংক্রিয়ভাবে ল্যাব পোর্টালে ইনভেস্টিগেশনের তালিকায় যুক্ত হয়।

### 4. 👨‍⚕️ Specialist Doctor Portal (`DID`)
- কনসাল্টেশন শিডিউল, রোগীর সমস্যা ও ডিজিটাল প্রেসক্রিপশন প্রদান।
- চেম্বার স্লিপ এবং নির্দেশিকা সংযোজন।

### 5. 💊 Online Pharmacy & Medicine Delivery
- প্রেসক্রিপশন ড্রাগ ও ওটিসি মেডিসিন কার্ট ও ডেলিভারি ট্র্যাকিং।

### 6. 🛡️ Hospital Admin Control Center
- রিয়েল-টাইম রেভিনিউ, সক্রিয় ডাক্তার, প্যাথলজিস্ট এবং একাউন্টস কর্মীদের রোস্টার ম্যানেজমেন্ট।

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Framer-ready CSS Animations |
| **Backend** | PHP 8 RESTful JSON API with PDO & CORS handling |
| **Database** | MySQL (Relational Schema with Foreign Keys) |
| **Persistence** | Real-time state with LocalStorage fallback & offline resilience |

---

## 📁 Project Structure

```text
medicare-hub/
├── frontend/                     # React 18 + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Hero, Services, DoctorCard, AppointmentModal, QuickReportTrackerModal, FloatingQuickActionDial, ProfileSettingsView
│   │   ├── pages/                # Home, Doctors, Pharmacy, LabTests, SymptomChecker, HealthTools, Login, Register, UserDashboard, AdminDashboard, DoctorPortal, LabPortal, AccountsPortal
│   │   ├── context/              # AuthContext, DataContext
│   │   ├── data/                 # mockData.js (Standard test investigations, default doctors, initial catalog)
│   │   ├── App.jsx               # ErrorBoundary, Global Routing & Protected Portals
│   │   ├── main.jsx
│   │   └── index.css             # Medical theme, animations & print media CSS
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # PHP REST API
│   ├── config/database.php       # MySQL PDO Connection
│   ├── api/                      # Auth, Doctors, Appointments, Admin stats endpoints
│   └── database/schema.sql       # MySQL Schema & seed data
├── .gitignore
└── README.md
```

---

## 🚀 How to Run

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001).

### Backend (Optional with XAMPP):
```bash
# Place in C:\xampp\htdocs\medicare-hub
# Import backend/database/schema.sql into MySQL via phpMyAdmin
```

---

## 🔑 Demo Access IDs & Portals

| Portal / Role | ID Format | Example Login |
|---|---|---|
| **Patient Portal** | `PID` | `P05` (devid) / `P01` |
| **Doctor Portal** | `DID` | `D101` / `D102` |
| **Pathology Lab** | `LID` / `TID` | `L101` (Md. Rafiqul Islam) |
| **Accounts / Billing** | `AID` | `A101` (Kamal Hossain) |
| **Hospital Admin** | `Admin` | `admin@medicare.com` / `admin123` |

---

## 📄 License
MIT © 2026 Akramul Hasan
