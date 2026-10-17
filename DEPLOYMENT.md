# TotthoHub Blood (তথ্যহাব ব্লাড) - VPS Deployment Guide (Port 1000)

এই প্রজেক্টটি সরাসরি যেকোনো Linux VPS (যেমন: Ubuntu, Debian, CentOS, AlmaLinux)-এ **Port 1000**-এ ডিপ্লয় করার জন্য প্রস্তুত করা হয়েছে।

---

## 📋 প্রাক-প্রস্তুতি (Prerequisites on VPS)
আপনার VPS সার্ভারে Node.js (v18 বা v20+) ইনস্টল থাকতে হবে:
```bash
# Ubuntu / Debian এ Node.js 20 ইনস্টল করার নিয়ম:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
node -v # নিশ্চিত করুন v18 বা v20
```

---

## 🚀 অপশন ১: PM2 দিয়ে ডিপ্লয় (সবচেয়ে সহজ ও জনপ্রিয়)

১. প্রজেক্ট ফাইল VPS এ কপি বা ক্লোন করুন:
```bash
git clone <your-repository-url> /var/www/totthohub-blood
cd /var/www/totthohub-blood
```

২. ডিপেন্ডেন্সি ইনস্টল ও বিল্ড তৈরি করুন:
```bash
npm install
npm run build
```

৩. গ্লোবালভাবে PM2 ইনস্টল করুন (যদি ইনস্টল না থাকে):
```bash
npm install -g pm2
```

৪. প্রজেক্টের সাথে দেওয়া `ecosystem.config.cjs` দিয়ে পোর্ট ১০০০-এ সার্ভার চালু করুন:
```bash
pm2 start ecosystem.config.cjs
```
*(অথবা সরাসরি: `pm2 start server.js --name totthohub-blood`)*

৫. VPS রিস্টার্ট হলেও যেন সাইট স্বয়ংক্রিয়ভাবে চালু থাকে:
```bash
pm2 save
pm2 startup
```

৬. স্ট্যাটাস চেক করুন:
```bash
pm2 status
pm2 logs totthohub-blood
```

---

## 🔄 চলমান VPS সাইটে নতুন ফাইল আপডেট করার নিয়ম (Updating Live VPS Site)

আপনার সার্ভারে (`/home/blood.totthohub.com/public_html`) ইতিমধ্যে **`blood-server`** চালু থাকলে, পরবর্তী যেকোনো কোড পরিবর্তন বা আপডেট লাইভ করার নিয়ম:

```bash
# ১. আপনার ডিরেক্টরিতে যান
cd /home/blood.totthohub.com/public_html

# ২. গিট থেকে নতুন ফাইল নামান (বা আপলোড করুন)
git pull origin main

# ৩. কোনো নতুন প্যাকেজ থাকলে ইনস্টল করুন
npm install

# ৪. নতুন প্রোডাকশন বিল্ড তৈরি করুন
npm run build

# ৫. চলমান PM2 প্রসেস রিস্টার্ট / রিলোড করুন (জিরো-ডাউনটাইম)
pm2 reload blood-server
# অথবা:
pm2 restart blood-server

# ৬. স্ট্যাটাস ও লাইভ লগ চেক করুন
pm2 status
pm2 logs blood-server --lines 20
```

---

## 🐳 অপশন ২: Docker & Docker Compose দিয়ে ডিপ্লয়

আপনার VPS এ যদি Docker ইনস্টল থাকে, তবে এক কমান্ডেই পোর্ট ১০০০-এ চলবে:
```bash
docker compose up -d --build
```
লগ দেখতে:
```bash
docker compose logs -f
```

---

## ⚙️ অপশন ৩: Linux Systemd Service দিয়ে চালানো

১. সার্ভিস ফাইলটি কপি করুন:
```bash
sudo cp totthohub-blood.service /etc/systemd/system/
sudo systemctl daemon-reload
```

২. সার্ভিসটি চালু ও এনাবল করুন:
```bash
sudo systemctl start totthohub-blood
sudo systemctl enable totthohub-blood
```

৩. স্ট্যাটাস দেখুন:
```bash
sudo systemctl status totthohub-blood
```

---

## 🛡️ VPS Firewall এ Port 1000 ওপেন করার নিয়ম
যদি VPS এর ফায়ারওয়াল (UFW) চালু থাকে:
```bash
sudo ufw allow 1000/tcp
sudo ufw reload
```
এখন ব্রাউজারে প্রবেশ করুন: `http://YOUR_VPS_IP:1000`

---

## 🌐 Nginx দিয়ে ডোমেইন ও SSL (HTTPS) যুক্ত করা (ঐচ্ছিক কিন্তু সুপারিশকৃত)

আপনার কাস্টম ডোমেইন (যেমন: `blood.totthohub.com`) দিয়ে পোর্ট ১০০০ প্রক্সি করতে:

১. `nginx.conf.example` ফাইলটি দেখুন:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/totthohub-blood
# ফাইলটি এডিট করে আপনার domain name বসান:
sudo nano /etc/nginx/sites-available/totthohub-blood

sudo ln -s /etc/nginx/sites-available/totthohub-blood /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

২. ফ্রী SSL সার্টিফিকেট সেটআপ (Let's Encrypt Certbot):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🩺 হেলথ চেক
সাইট চালু থাকলে নিচের লিংকে রেসপন্স পাবেন:
`http://YOUR_VPS_IP:1000/api/health`
রেসপন্স: `{"status":"ok","app":"TotthoHub Blood","port":1000}`
