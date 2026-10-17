# 🩸 TotthoHub Blood (তথ্যহাব ব্লাড)

> **রক্ত দিন, জীবন বাঁচান** — আধুনিক, নিরাপদ ও সমন্বিত রক্তদান, জরুরি ব্লাড রিকোয়েস্ট ও রক্তদাতা ম্যাচিং প্ল্যাটফর্ম।

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 বিষয়সূচি (Table of Contents)
- [বৈশিষ্ট্যসমূহ (Features)](#-বৈশিষ্ট্যসমূহ-features)
- [প্রযুক্তিগত কাঠামো (Tech Stack)](#-প্রযুক্তিগত-কাঠামো-tech-stack)
- [প্রজেক্ট ডিরেক্টরি কাঠামো (Project Structure)](#-প্রজেক্ট-ডিরেক্টরি-কাঠামো-project-structure)
- [লোকাল কম্পিউটারে রান করার নিয়ম (Local Development)](#-লোকাল-কম্পিউটারে-রান-করার-নিয়ম-local-development)
- [VPS সার্ভারে ডিপ্লয় করার নিয়ম - Port 1000 (VPS Deployment)](#-vps-সার্ভারে-ডিপ্লয়-করার-নিয়ম---port-1000-vps-deployment)
- [রাউট ও পেজসমূহ (Application Routes)](#-রাউট-ও-পেজসমূহ-application-routes)
- [নিরাপত্তা ও অথেন্টিকেশন (Security & Authentication)](#-নিরাপত্তা-ও-অথেন্টিকেশন-security--authentication)
- [স্ক্রিপ্টসমূহ (Available Scripts)](#-স্ক্রিপ্টসমূহ-available-scripts)

---

## 🌟 বৈশিষ্ট্যসমূহ (Features)

1. **রক্তদাতা অনুসন্ধান ও ফিল্টারিং (Smart Donor Matching)**:
   - রক্তের গ্রুপ (A+, A-, B+, B-, AB+, AB-, O+, O-), জেলা এবং উপজেলা ভিত্তিক তাৎক্ষণিক ফিল্টারিং।
   - রক্তদাতার প্রাপ্যতা স্ট্যাটাস (প্রস্তুত, সাময়িক বিশ্রামে, অনুপলব্ধ)।
   - সরাসরি ফোন কল ও এসএমএস এর মাধ্যমে যোগাযোগের সুবিধা।

2. **জরুরি রক্তের অনুরোধ (Emergency Blood Request)**:
   - রোগীর নাম, রক্তের গ্রুপ, ব্যাগ সংখ্যা, হাসপাতালের ঠিকানা ও প্রয়োজনীয় তারিখ দিয়ে অনুরোধ তৈরি।
   - সংকটকালীন রোগীদের জন্য তাৎক্ষণিক জরুরি নোটিশ বোর্ড।

3. **লগইন ছাড়া ড্যাশবোর্ড সুরক্ষিত (Protected Dashboard & Profile)**:
   - লগইন ছাড়া ড্যাশবোর্ড বা প্রোফাইলে প্রবেশ সম্পূর্ণ বন্ধ (স্বয়ংক্রিয়ভাবে `/login?redirect=...` পেজে নিয়ে যাবে)।
   - ১১ ডিজিটের মোবাইল নম্বর যাচাইকরণ দিয়ে সাধারণ ব্যবহারকারী বা রক্তদাতার নিরাপদ লগইন।
   - পাসওয়ার্ড ও ইউজারনেম দিয়ে সিস্টেম অ্যাডমিন লগইন (`/login/admin`)।
   - তাৎক্ষণিক লগআউট সুবিধা এবং সেশন নিয়ন্ত্রণ।

4. **ইন্টারেক্টিভ অ্যাডমিন ও ইউজার ড্যাশবোর্ড (Dashboard)**:
   - রক্তদাতাদের ভেরিফিকেশন ও স্ট্যাটাস পরিবর্তন।
   - রক্তের অনুরোধ অনুমোদন ও সম্পন্ন (Fulfilled) চিহ্নিতকরণ।
   - সিস্টেম অডিট লগ (Audit Logs) পর্যবেক্ষণ।
   - টার্সো (Turso SQLite) ডাটাবেজ মাইগ্রেশন ইঞ্জিন।

5. **ডিরেক্টরি ও সহায়ক তথ্য (Directory & Info)**:
   - দেশের প্রধান হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি।
   - রক্তদান ক্যাম্পেইন ও সহযোগী সংগঠনসমূহের তথ্য।
   - রক্তদানের বৈজ্ঞানিক নির্দেশিকা ও নিয়মাবলী।

---

## 🛠 প্রযুক্তিগত কাঠামো (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React Icons, React Router v7
- **Backend / Production Server**: Node.js (ES Module), Express 4
- **State & Data Layer**: LocalStorage Engine with Auto-fallback, Turso Raw JSON Migration Pipeline
- **Production Port**: `1000` (Configurable via `PORT` environment variable)
- **Dev Port**: `3000`

---

## 📁 প্রজেক্ট ডিরেক্টরি কাঠামো (Project Structure)

```text
totthohub-blood/
├── dist/                      # প্রোডাকশন বিল্ড ফাইলসমূহ (npm run build এর পর তৈরি হয়)
├── public/                    # স্ট্যাটিক অ্যাসেটস
├── src/
│   ├── components/            # রিইউজেবল কম্পোনেন্টস (Header, Footer, Modals)
│   ├── data/                  # প্রাক-সংরক্ষিত ডাটা (seedData, Turso JSONs)
│   ├── services/              # ডাটাবেজ ও স্টোরেজ লজিক (storageService, migrationService)
│   ├── types/                 # TypeScript টাইপ ও ইন্টারফেস
│   ├── views/                 # পেজ ভিউসমূহ:
│   │   ├── HomeView.tsx           # হোমপেজ
│   │   ├── FindDonorsView.tsx     # রক্তদাতা অনুসন্ধান
│   │   ├── RequestBloodView.tsx   # রক্তের অনুরোধ ফর্ম
│   │   ├── EmergencyView.tsx      # জরুরি নোটিশ
│   │   ├── DashboardView.tsx      # সুরক্ষিত ড্যাশবোর্ড
│   │   ├── LoginView.tsx          # ইউজার ও অ্যাডমিন লগইন
│   │   ├── UserProfileView.tsx    # ব্যবহারকারী প্রোফাইল
│   │   ├── AdminProfileView.tsx   # অ্যাডমিন প্রোফাইল
│   │   ├── HospitalsView.tsx      # হাসপাতাল ও ব্লাড ব্যাংক
│   │   ├── CampaignsView.tsx      # রক্তদান ক্যাম্পেইন
│   │   ├── OrganizationsView.tsx  # সহযোগী সংগঠন
│   │   ├── VolunteerPortalView.tsx# স্বেচ্ছাসেবক পোর্টাল
│   │   └── AboutView.tsx          # আমাদের সম্পর্কে
│   ├── App.tsx                # প্রধান অ্যাপ্লিকেশন ও রাউটিং লজিক
│   └── main.tsx               # রিঅ্যাক্ট এন্ট্রি পয়েন্ট
├── server.js                  # প্রোডাকশন Express সার্ভার (Port 1000)
├── ecosystem.config.cjs       # PM2 ক্লাস্টার কনফিগারেশন
├── Dockerfile                 # মাল্টি-স্টেজ ডকার বিল্ড ফাইল
├── docker-compose.yml         # ডকার কম্পোজ কনফিগারেশন (1000:1000)
├── nginx.conf.example         # Nginx রিভার্স প্রক্সি কনফিগারেশন
├── totthohub-blood.service    # Linux systemd সার্ভিস ফাইল
├── DEPLOYMENT.md              # বিস্তারিত VPS ডিপ্লয়মেন্ট নির্দেশিকা
├── package.json
└── vite.config.ts
```

---

## 💻 লোকাল কম্পিউটারে রান করার নিয়ম (Local Development)

১. প্রজেক্টের ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm install
```

২. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

---

## 🚀 VPS সার্ভারে ডিপ্লয় করার নিয়ম - Port 1000 (VPS Deployment)

এই প্রজেক্টটি সরাসরি যেকোনো Linux VPS (যেমন: Ubuntu, Debian)-এ **Port 1000**-এ চলার জন্য প্রস্তুত।

### পদ্ধতি ১: PM2 দিয়ে ডিপ্লয় (সুপারিশকৃত)
```bash
# ১. ডিপেন্ডেন্সি ইনস্টল
npm install

# ২. প্রোডাকশন বিল্ড তৈরি
npm run build

# ৩. PM2 দিয়ে পোর্ট ১০০০-এ সার্ভার চালু
pm2 start ecosystem.config.cjs

# ৪. সার্ভার রিস্টার্ট হলেও যেন চালু থাকে
pm2 save
pm2 startup
```

### পদ্ধতি ২: সরাসরি Node দিয়ে
```bash
npm run build
npm start
```
সার্ভারটি পোর্ট ১০০০-এ চালু হবে: `http://YOUR_VPS_IP:1000`

### পদ্ধতি ৩: Docker দিয়ে
```bash
docker compose up -d --build
```

### ফায়ারওয়ালে Port 1000 ওপেন করার নিয়ম:
```bash
sudo ufw allow 1000/tcp
sudo ufw reload
```

> বিস্তারিত Nginx কনফিগারেশন ও ফ্রি SSL সার্টিফিকেট (Let's Encrypt) সেটআপের জন্য [`DEPLOYMENT.md`](./DEPLOYMENT.md) ফাইলটি দেখুন।

---

## 🔗 রাউট ও পেজসমূহ (Application Routes)

| রাউট (Route) | বিবরণ (Description) | অ্যাক্সেস (Access) |
| :--- | :--- | :--- |
| `/` | প্রধান হোমপেজ | সর্বজনীন (Public) |
| `/donors` | রক্তদাতা অনুসন্ধান ও ফিল্টারিং | সর্বজনীন (Public) |
| `/request-blood` | রক্তের অনুরোধ পোস্ট করার পেজ | সর্বজনীন (Public) |
| `/emergency` | জরুরি রক্তের নোটিশ ও হটলাইন | সর্বজনীন (Public) |
| `/login` | সাধারণ ব্যবহারকারী ও রক্তদাতা লগইন | সর্বজনীন (Public) |
| `/login/admin` | সিস্টেম অ্যাডমিন লগইন | সর্বজনীন (Public) |
| `/dashboard` | ইন্টারেক্টিভ ড্যাশবোর্ড ও বিশ্লেষণ | 🔒 **লগইন আবশ্যক** |
| `/profile` | ব্যবহারকারীর ব্যক্তিগত প্রোফাইল | 🔒 **লগইন আবশ্যক** |
| `/admin/profile` | অ্যাডমিন ম্যানেজমেন্ট কনসোল | 🔒 **অ্যাডমিন লগইন আবশ্যক** |
| `/become-donor` | নতুন রক্তদাতা হিসেবে নিবন্ধন | সর্বজনীন (Public) |
| `/hospitals` | হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি | সর্বজনীন (Public) |
| `/campaigns` | রক্তদান ক্যাম্পেইন ক্যালেন্ডার | সর্বজনীন (Public) |
| `/organizations`| রক্তদান সংগঠনসমূহের তালিকা | সর্বজনীন (Public) |
| `/volunteers` | স্বেচ্ছাসেবক পোর্টাল | সর্বজনীন (Public) |
| `/about` | তথ্যহাব ব্লাড পরিচিতি | সর্বজনীন (Public) |
| `/api/health` | সার্ভার হেলথ চেক ও পোর্ট স্ট্যাটাস | সর্বজনীন (Public) |

---

## 🔐 নিরাপত্তা ও অথেন্টিকেশন (Security & Authentication)

- **ব্যবহারকারী লগইন**: ১১ ডিজিটের যেকোনো বৈধ বাংলাদেশি মোবাইল নম্বর (যেমন: `01812345678`) প্রবেশ করিয়ে সরাসরি নিজের অ্যাকাউন্টে লগইন করা যায়।
- **অ্যাডমিন লগইন**: ইউজারনেম `admin` অথবা `admin@totthohub.com` এবং আপনার পছন্দের নিরাপত্তা পাসওয়ার্ড দিয়ে অ্যাডমিন কনসোলে প্রবেশ করা যায়।
- **সুরক্ষিত রাউট**: লগইন ছাড়া `/dashboard` বা `/profile`-এ প্রবেশ করলে স্বয়ংক্রিয়ভাবে লগইন পেজে পাঠিয়ে দেওয়া হবে এবং লগইন করার পর স্বয়ংক্রিয়ভাবে আবার ড্যাশবোর্ডে নিয়ে যাওয়া হবে।

---

## ⚡ স্ক্রিপ্টসমূহ (Available Scripts)

```bash
npm run dev      # ডেভেলপমেন্ট সার্ভার চালু করে (Port 3000)
npm run build    # প্রোডাকশনের জন্য অপ্টিমাইজড বান্ডেল তৈরি করে (dist/)
npm start        # প্রোডাকশন Express সার্ভার চালু করে (Port 1000)
npm run preview  # বিল্ড ফাইল প্রিভিউ করে (Port 1000)
npm run lint     # TypeScript ও কোড কোয়ালিটি যাচাই করে
npm run clean    # পুরানো dist ফোল্ডার মুছে ফেলে
```

---

## 📄 লাইসেন্স (License)
এই প্রজেক্টটি [MIT License](LICENSE) এর আওতাভুক্ত।
