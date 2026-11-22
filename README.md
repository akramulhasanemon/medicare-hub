# 🏥 MediCare Hub - Modern Medical & Healthcare Web Application

A full-stack, modern healthcare and clinic management web portal built with **React**, **Tailwind CSS**, **PHP REST API**, and **MySQL**.

---

## 🌟 Features (মূল সুবিধাসমূহ)

### 1. 👥 Patient Portal (রোগী ও সাধারণ ইউজার)
- **Modern Landing Page**: আকর্ষক হিরো সেকশন, স্পেশালিটি ডিপার্টমেন্ট কার্ড, টপ-রেটেড ডাক্তারদের তালিকা।
- **Doctor Directory**: ডিপার্টমেন্ট অনুসারে ফিল্টার এবং নাম বা ডিগ্রি দিয়ে লাইভ সার্চ সুবিধা।
- **Instant Slot Booking**: ডাক্তার নির্বাচন করে তারিখ, সময় এবং সমস্যার লক্ষণ (Symptoms) দিয়ে তাৎক্ষণিক অ্যাপয়েন্টমেন্ট বুকিং।
- **User Dashboard**:
  - নিজের বুক করা সকল অ্যাপয়েন্টমেন্টের রিয়েল-টাইম স্ট্যাটাস (Pending, Confirmed, Completed, Cancelled)।
  - ক্লিনিক থেকে দেওয়া ডিজিটাল প্রেসক্রিপশন / চেম্বার স্লিপ দেখা ও PDF প্রিন্ট করার সুবিধা।

### 2. 🛡️ Admin Dashboard (অ্যাডমিন প্যানেল)
- **Live Metrics**: মোট অ্যাপয়েন্টমেন্ট, পেন্ডিং রিকোয়েস্ট, কনফার্মড স্লট, সক্রিয় ডাক্তার সংখ্যা এবং আনুমানিক রেভিনিউ গণনা।
- **Appointment Manager**:
  - নতুন অ্যাপয়েন্টমেন্ট অনুমোদন (Approve / Confirm Slot)।
  - রিজেক্ট / বাতিলকরণ (Cancel) অথবা সমাপ্ত ঘোষণা (Complete)।
  - রোগীর জন্য নির্দেশিকা ও চেম্বার রুম নম্বর (Notes) যুক্ত ও এডিট করার সুবিধা।
- **Doctor Roster & Management**:
  - নতুন বিশেষজ্ঞ ডাক্তারের প্রোফাইল, ডিগ্রি, ভিজিট ফি ও শিডিউল যুক্ত করার সুবিধা।
  - বর্তমান ডাক্তারদের তালিকা ও বিস্তারিত তথ্য।

### 3. 🔐 Authentication & Security
- **Role-based Authentication**: সাধারণ রোগী ও অ্যাডমিনের জন্য আলাদা সিকিউর লগইন সিস্টেম।
- **1-Click Demo Login**: সহজে টেস্ট করার জন্য ১-ক্লিকেই ডেমো পেশেন্ট বা ডেমো অ্যাডমিন ক্রেডেনশিয়াল পূরণ করার সুবিধা।
- **PHP REST API & PDO**: SQL Injection প্রটেক্টেড এবং CORS সাপোর্টেড ব্যাকএন্ড।

---

## 🛠️ Tech Stack (ব্যবহৃত প্রযুক্তি)

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React (Icons) |
| **Backend** | PHP 8 (RESTful JSON API with PDO) |
| **Database** | MySQL (Relational Schema with Foreign Keys) |

---

## 📁 Project Structure (ফোল্ডার পরিচিতি)

```text
medicare-hub/
├── frontend/                     # React + Tailwind CSS ক্লায়েন্ট
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Hero, Services, DoctorCard, AppointmentModal
│   │   ├── pages/                # Home, Doctors, Login, Register, UserDashboard, AdminDashboard
│   │   ├── context/              # AuthContext, DataContext (State & LocalStorage sync)
│   │   ├── data/                 # Default mock doctors & appointments data
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # PHP REST API
│   ├── config/
│   │   └── database.php          # MySQL PDO Connection & CORS setup
│   ├── api/
│   │   ├── login.php             # User & Admin Login endpoint
│   │   ├── register.php          # Patient registration endpoint
│   │   ├── doctors.php           # GET / POST doctors
│   │   ├── appointments.php      # GET / POST appointments
│   │   ├── admin_stats.php       # Dashboard metrics & analytics
│   │   └── update_appointment.php# Update appointment status & notes
│   └── database/
│       └── schema.sql            # Full MySQL schema & initial seed data
└── README.md
```

---

## 🚀 How to Run the Project (চালানোর নিয়ম)

### ধাপ ১: ফ্রন্টএন্ড চালানো (React Frontend)

১. টার্মিনাল বা PowerShell খুলে `frontend` ফোল্ডারে যান:
   ```bash
   cd "C:\Users\Akramul Hasan\.gemini\antigravity\scratch\medicare-hub\frontend"
   ```
২. ডিপেন্ডেন্সি ইনস্টল করুন (যদি করা না থাকে):
   ```bash
   npm install
   ```
৩. ডেভেলপমেন্ট সার্ভার চালু করুন:
   ```bash
   npm run dev
   ```
৪. ব্রাউজারে `http://localhost:3000` (অথবা টার্মিনালে দেখানো পোর্টে) প্রবেশ করুন।

---

### ধাপ ২: ব্যাকএন্ড ও ডাটাবেজ সেটআপ (PHP & MySQL via XAMPP)

১. আপনার কম্পিউটারে **XAMPP** চালু করে **Apache** এবং **MySQL** স্টার্ট করুন।
২. `medicare-hub` ফোল্ডারটি XAMPP এর `htdocs` ফোল্ডারে কপি করে রাখুন:
   ```text
   C:\xampp\htdocs\medicare-hub
   ```
৩. ব্রাউজারে `http://localhost/phpmyadmin` এ যান।
৪. `medicare_db` নামে একটি নতুন ডাটাবেজ তৈরি করুন অথবা সরাসরি **Import** ট্যাবে গিয়ে নিচের ফাইলটি সিলেক্ট করে রান করুন:
   ```text
   backend/database/schema.sql
   ```
৫. এখন ব্যাকএন্ডের API স্বয়ংক্রিয়ভাবে `http://localhost/medicare-hub/backend/api/...` তে চালু হয়ে যাবে।

> **💡 চমৎকার সুবিধা:** আপনি XAMPP ছাড়াও শুধুমাত্র React ফ্রন্টএন্ড রান করলেই সম্পূর্ণ ফাংশনালিটি (লগইন, অ্যাপয়েন্টমেন্ট বুকিং, অ্যাডমিন প্যানেল) টেস্ট করতে পারবেন! কারণ এতে স্বয়ংক্রিয়ভাবে অফলাইন সিঙ্ক ও লোকাল স্টোরেজ ব্যাকআপ যুক্ত করা আছে।

---

## 🔑 Demo Login Accounts (টেস্ট একাউন্ট)

| Role | Email | Password |
|---|---|---|
| **Admin Panel** | `admin@medicare.com` | `admin123` |
| **Patient Portal** | `patient@medicare.com` | `patient123` |

*(লগইন পেজে **"1-Click Demo Login"** বাটনে ক্লিক করলেই এক ক্লিকে লগইন হয়ে যাবে)*
