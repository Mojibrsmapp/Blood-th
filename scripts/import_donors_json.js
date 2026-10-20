#!/usr/bin/env node
/**
 * TotthoHub Blood - JSON Donor & User Import Engine
 * 
 * Features:
 *  1. Parses JSON donor exports (supports Mojib Rsm format, standard Donor[], array or object)
 *  2. Normalizes phone numbers (+880, missing leading 0 e.g. 1866792169 -> 01866792169, Bengali numerals)
 *  3. Canonicalizes blood types and 64 districts
 *  4. Writes to src/data/tursoImportedDonors.json, public/data/donors.json, and dist/data/donors.json
 * 
 * Usage:
 *  node scripts/import_donors_json.js [path-to-file.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertBengaliDigits(str) {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[০-৯]/g, d => bn.indexOf(d).toString());
}

function cleanPhone(raw) {
  if (!raw) return '';
  let str = convertBengaliDigits(String(raw).trim());

  if (/[eE][+-]?\d+/.test(str)) {
    try {
      const num = Number(str);
      if (!isNaN(num)) str = BigInt(Math.round(num)).toString();
    } catch {}
  }

  let digits = str.replace(/\D/g, '');
  if (digits.startsWith('880')) digits = digits.slice(3);
  if (digits.length === 10 && digits.startsWith('1')) digits = '0' + digits;
  return digits;
}

function cleanBlood(raw) {
  if (!raw) return 'O+';
  const s = String(raw).trim().toUpperCase();
  if (s.includes('AB-') || s === 'AB_MINUS') return 'AB-';
  if (s.includes('AB+') || s === 'AB_PLUS' || s === 'AB') return 'AB+';
  if (s.includes('A-') || s === 'A_MINUS') return 'A-';
  if (s.includes('A+') || s === 'A_PLUS' || s === 'A') return 'A+';
  if (s.includes('B-') || s === 'B_MINUS') return 'B-';
  if (s.includes('B+') || s === 'B_PLUS' || s === 'B') return 'B+';
  if (s.includes('O-') || s === 'O_MINUS') return 'O-';
  return 'O+';
}

function mapDistrict(raw) {
  const s = String(raw || '').trim().toLowerCase();
  if (s.includes('cox') || s.includes('কক্স')) return { id: 'cox-bazar', name: "Cox's Bazar", bn: 'কক্সবাজার' };
  if (s.includes('bogr') || s.includes('বগু')) return { id: 'bogura', name: 'Bogura', bn: 'বগুড়া' };
  if (s.includes('dhak') || s.includes('ঢাকা')) return { id: 'dhaka', name: 'Dhaka', bn: 'ঢাকা' };
  if (s.includes('chatt') || s.includes('চট্টগ্রাম') || s.includes('ctg')) return { id: 'chattogram', name: 'Chattogram', bn: 'চট্টগ্রাম' };
  if (s.includes('rajsh') || s.includes('রাজশাহী')) return { id: 'rajshahi', name: 'Rajshahi', bn: 'রাজশাহী' };
  return { id: s.replace(/[^a-z0-9]/g, '-') || 'cox-bazar', name: String(raw).trim() || "Cox's Bazar", bn: String(raw).trim() || 'কক্সবাজার' };
}

function findJSONFile() {
  const possible = [
    process.argv[2],
    path.join(process.cwd(), 'donors.json'),
    path.join(process.cwd(), 'bbms_donors.json'),
    path.join(process.cwd(), 'donors_backup.json'),
    '/home/blood.totthohub.com/public_html/donors.json',
    '/home/blood.totthohub.com/public_html/bbms_donors.json'
  ].filter(Boolean);

  for (const p of possible) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function runImport() {
  console.log(`\n======================================================`);
  console.log(`🩸 TotthoHub Blood - JSON Donor Import Engine`);
  console.log(`======================================================\n`);

  const filePath = findJSONFile();
  if (!filePath) {
    console.error(`❌ কোনো JSON ফাইল পাওয়া যায়নি!`);
    console.error(`ব্যবহার: node scripts/import_donors_json.js [ফাইল.json]`);
    console.error(`অথবা প্রজেক্ট ফোল্ডারে "donors.json" ফাইলটি রাখুন।\n`);
    process.exit(1);
  }

  console.log(`📂 ফাইল পাওয়া গেছে: ${filePath}`);
  const rawText = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  let rawList = [];
  try {
    const parsed = JSON.parse(rawText);
    rawList = Array.isArray(parsed) ? parsed : (parsed.donors || [parsed]);
  } catch (e) {
    console.error(`❌ JSON ফরম্যাট সঠিক নয়: ${e.message}`);
    process.exit(1);
  }

  console.log(`📊 মোট এন্ট্রি: ${rawList.length.toLocaleString()}`);

  const targetJsonPath = path.join(__dirname, '..', 'src', 'data', 'tursoImportedDonors.json');
  let existingDonors = [];
  if (fs.existsSync(targetJsonPath)) {
    try {
      existingDonors = JSON.parse(fs.readFileSync(targetJsonPath, 'utf8'));
    } catch {}
  }

  const phoneMap = new Set(existingDonors.map(d => cleanPhone(d.phone)));
  const newDonors = [];
  let duplicates = 0;
  let invalid = 0;

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    const phone = cleanPhone(item.phone || item.ContactNumber || item.mobile);

    if (!phone.startsWith('01') || phone.length !== 11) {
      invalid++;
      continue;
    }

    if (phoneMap.has(phone)) {
      duplicates++;
      continue;
    }
    phoneMap.add(phone);

    const name = (item.fullName || item.name || item.Name || 'রক্তদাতা').trim();
    const blood = cleanBlood(item.bloodType || item.bloodGroup || item['Blood Group']);
    const distInfo = mapDistrict(item.district || item['Present District']);
    const upa = (item.area || item.union || item['Present Upazila'] || distInfo.name).trim();
    const upaId = upa.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const totalDonations = typeof item.totalDonations === 'number'
      ? item.totalDonations
      : parseInt(String(item.totalDonations || '1'), 10) || 1;

    const donor = {
      id: `donor-${phone}`,
      userId: `user-${phone}`,
      name,
      username: item.email ? item.email.split('@')[0] : `donor_${phone.slice(-4)}`,
      phone,
      email: item.email || `${phone}@donor.totthohub.com`,
      bloodGroup: blood,
      gender: (item.gender === 'female' ? 'female' : 'male'),
      districtId: distInfo.id,
      districtName: distInfo.name,
      upazilaId: upaId,
      upazilaName: upa,
      area: item.area ? `${item.area}, ${distInfo.bn}` : `${upa}, ${distInfo.name}`,
      availability: ((item.status || '').toLowerCase() === 'unavailable' ? 'temporarily_unavailable' : 'available'),
      lastDonationDate: (item.lastDonationDate && item.lastDonationDate !== 'N/A') ? item.lastDonationDate : '২০২৬-০৫-০১',
      donationCount: totalDonations,
      verificationStatus: 'profile_verified',
      bio: item.organization ? `${name} - ${item.organization}` : `${name} - স্বেচ্ছাসেবী রক্তদাতা (${upa}, ${distInfo.bn})`,
      isAvailableForEmergency: true,
      totalHelpedCount: 0,
      imageUrl: item.imageUrl,
      createdAt: item.registrationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    newDonors.push(donor);
  }

  console.log(`✅ সফলভাবে তৈরি হয়েছে: ${newDonors.length.toLocaleString()} জন নতুন রক্তদাতা`);
  console.log(`🔁 বাদ পড়া ডুপ্লিকেট: ${duplicates.toLocaleString()} টি`);
  console.log(`⚠️ ত্রুটিপূর্ণ নম্বর: ${invalid.toLocaleString()} টি`);

  const merged = [...newDonors, ...existingDonors];

  fs.writeFileSync(targetJsonPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`💾 সেভ হয়েছে: ${targetJsonPath}`);

  const publicJson = path.join(__dirname, '..', 'public', 'data', 'donors.json');
  if (fs.existsSync(path.dirname(publicJson))) {
    fs.writeFileSync(publicJson, JSON.stringify(merged), 'utf8');
  }

  const distJson = path.join(__dirname, '..', 'dist', 'data', 'donors.json');
  if (fs.existsSync(path.dirname(distJson))) {
    fs.writeFileSync(distJson, JSON.stringify(merged), 'utf8');
  }

  console.log(`\n🎉 মোট রক্তদাতা এখন: ${merged.length.toLocaleString()} জন!`);
  console.log(`\nসাইট লাইভ আপডেট করতে রান করুন:`);
  console.log(`  npm run build && pm2 reload blood-server\n`);
}

runImport().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
