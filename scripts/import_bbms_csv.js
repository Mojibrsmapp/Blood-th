#!/usr/bin/env node
/**
 * TotthoHub Blood - BBMS CSV Donor Import Engine (24,000+ Donors)
 * 
 * Target File: bbms_donors_backup_24700.csv
 * 
 * Features:
 *  1. Parses 24,000+ donors from BBMS CSV exports
 *  2. Handles Excel scientific notation phone numbers (e.g. 1.75E+09)
 *  3. Normalizes all 64 districts of Bangladesh (Bogura, Rajshahi, Dhaka, Cox's Bazar, etc.)
 *  4. Canonicalizes blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-)
 *  5. Phone deduplication & formatting (+880, 880, 01xxxxxxxxx)
 *  6. Writes directly to src/data/tursoImportedDonors.json & public/data/donors.json
 * 
 * Usage:
 *  node scripts/import_bbms_csv.js
 *  node scripts/import_bbms_csv.js [path-to-file.csv]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All 64 Districts of Bangladesh with canonical IDs, English names and Bangla names
const BANGLADESH_DISTRICTS = {
  // Rajshahi Division
  'bogura': { id: 'bogura', name: 'Bogura', bn: 'বগুড়া', aliases: ['bogura', 'bogra', 'বগুড়া', 'বগুরা'] },
  'rajshahi': { id: 'rajshahi', name: 'Rajshahi', bn: 'রাজশাহী', aliases: ['rajshahi', 'রাজশাহী'] },
  'sirajganj': { id: 'sirajganj', name: 'Sirajganj', bn: 'সিরাজগঞ্জ', aliases: ['sirajganj', 'সিরাজগঞ্জ', 'serajganj'] },
  'pabna': { id: 'pabna', name: 'Pabna', bn: 'পাবনা', aliases: ['pabna', 'পাবনা'] },
  'naogaon': { id: 'naogaon', name: 'Naogaon', bn: 'নওগাঁ', aliases: ['naogaon', 'নওগাঁ', 'nowgaon'] },
  'natore': { id: 'natore', name: 'Natore', bn: 'নাটোর', aliases: ['natore', 'নাটোর'] },
  'joypurhat': { id: 'joypurhat', name: 'Joypurhat', bn: 'জয়পুরহাট', aliases: ['joypurhat', 'জয়পুরহাট', 'jaipurhat'] },
  'chapainawabganj': { id: 'chapainawabganj', name: 'Chapainawabganj', bn: 'চাঁপাইনবাবগঞ্জ', aliases: ['chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'nawabganj'] },

  // Chattogram Division
  'cox-bazar': { id: 'cox-bazar', name: "Cox's Bazar", bn: 'কক্সবাজার', aliases: ['cox\'s bazar', 'coxs bazar', 'cox bazar', 'কক্সবাজার', 'coxsbazar'] },
  'chattogram': { id: 'chattogram', name: 'Chattogram', bn: 'চট্টগ্রাম', aliases: ['chattogram', 'chittagong', 'চট্টগ্রাম', 'ctg'] },
  'cumilla': { id: 'cumilla', name: 'Cumilla', bn: 'কুমিল্লা', aliases: ['cumilla', 'comilla', 'কুমিল্লা'] },
  'feni': { id: 'feni', name: 'Feni', bn: 'ফেনী', aliases: ['feni', 'ফেনী'] },
  'brahmanbaria': { id: 'brahmanbaria', name: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া', aliases: ['brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'b.baria'] },
  'noakhali': { id: 'noakhali', name: 'Noakhali', bn: 'নোয়াখালী', aliases: ['noakhali', 'নোয়াখালী'] },
  'lakshmipur': { id: 'lakshmipur', name: 'Lakshmipur', bn: 'লক্ষ্মীপুর', aliases: ['lakshmipur', 'লক্ষ্মীপুর', 'laxmipur'] },
  'chandpur': { id: 'chandpur', name: 'Chandpur', bn: 'চাঁদপুর', aliases: ['chandpur', 'চাঁদপুর'] },
  'khagrachhari': { id: 'khagrachhari', name: 'Khagrachhari', bn: 'খাগড়াছড়ি', aliases: ['khagrachhari', 'খাগড়াছড়ি', 'khagrachari'] },
  'rangamati': { id: 'rangamati', name: 'Rangamati', bn: 'রাঙ্গামাটি', aliases: ['rangamati', 'রাঙ্গামাটি'] },
  'bandarban': { id: 'bandarban', name: 'Bandarban', bn: 'বান্দরবান', aliases: ['bandarban', 'বান্দরবান'] },

  // Dhaka Division
  'dhaka': { id: 'dhaka', name: 'Dhaka', bn: 'ঢাকা', aliases: ['dhaka', 'ঢাকা', 'dacca'] },
  'gazipur': { id: 'gazipur', name: 'Gazipur', bn: 'গাজীপুর', aliases: ['gazipur', 'গাজীপুর'] },
  'narayanganj': { id: 'narayanganj', name: 'Narayanganj', bn: 'নারায়ণগঞ্জ', aliases: ['narayanganj', 'নারায়ণগঞ্জ'] },
  'tangail': { id: 'tangail', name: 'Tangail', bn: 'টাঙ্গাইল', aliases: ['tangail', 'টাঙ্গাইল'] },
  'kishoreganj': { id: 'kishoreganj', name: 'Kishoreganj', bn: 'কিশোরগঞ্জ', aliases: ['kishoreganj', 'কিশোরগঞ্জ'] },
  'manikganj': { id: 'manikganj', name: 'Manikganj', bn: 'মানিকগঞ্জ', aliases: ['manikganj', 'মানিকগঞ্জ'] },
  'munshiganj': { id: 'munshiganj', name: 'Munshiganj', bn: 'মুন্সীগঞ্জ', aliases: ['munshiganj', 'মুন্সীগঞ্জ'] },
  'narsingdi': { id: 'narsingdi', name: 'Narsingdi', bn: 'নরসিংদী', aliases: ['narsingdi', 'নরসিংদী'] },
  'faridpur': { id: 'faridpur', name: 'Faridpur', bn: 'ফরিদপুর', aliases: ['faridpur', 'ফরিদপুর'] },
  'gopalganj': { id: 'gopalganj', name: 'Gopalganj', bn: 'গোপালগঞ্জ', aliases: ['gopalganj', 'গোপালগঞ্জ'] },
  'madaripur': { id: 'madaripur', name: 'Madaripur', bn: 'মাদারীপুর', aliases: ['madaripur', 'মাদারীপুর'] },
  'rajbari': { id: 'rajbari', name: 'Rajbari', bn: 'রাজবাড়ী', aliases: ['rajbari', 'রাজবাড়ী'] },
  'shariatpur': { id: 'shariatpur', name: 'Shariatpur', bn: 'শরীয়তপুর', aliases: ['shariatpur', 'শরীয়তপুর'] },

  // Khulna Division
  'khulna': { id: 'khulna', name: 'Khulna', bn: 'খুলনা', aliases: ['khulna', 'খুলনা'] },
  'jashore': { id: 'jashore', name: 'Jashore', bn: 'যশোর', aliases: ['jashore', 'jessore', 'যশোর'] },
  'kushtia': { id: 'kushtia', name: 'Kushtia', bn: 'কুষ্টিয়া', aliases: ['kushtia', 'কুষ্টিয়া'] },
  'jhenaidah': { id: 'jhenaidah', name: 'Jhenaidah', bn: 'ঝিনাইদহ', aliases: ['jhenaidah', 'ঝিনাইদহ'] },
  'satkhira': { id: 'satkhira', name: 'Satkhira', bn: 'সাতক্ষীরা', aliases: ['satkhira', 'সাতক্ষীরা'] },
  'bagerhat': { id: 'bagerhat', name: 'Bagerhat', bn: 'বাগেরহাট', aliases: ['bagerhat', 'বাগেরহাট'] },
  'chuadanga': { id: 'chuadanga', name: 'Chuadanga', bn: 'চুয়াডাঙ্গা', aliases: ['chuadanga', 'চুয়াডাঙ্গা'] },
  'meherpur': { id: 'meherpur', name: 'Meherpur', bn: 'মেহেরপুর', aliases: ['meherpur', 'মেহেরপুর'] },
  'magura': { id: 'magura', name: 'Magura', bn: 'মাগুরা', aliases: ['magura', 'মাগুরা'] },
  'narail': { id: 'narail', name: 'Narail', bn: 'নড়াইল', aliases: ['narail', 'নড়াইল'] },

  // Barishal Division
  'barishal': { id: 'barishal', name: 'Barishal', bn: 'বরিশাল', aliases: ['barishal', 'barisal', 'বরিশাল'] },
  'patuakhali': { id: 'patuakhali', name: 'Patuakhali', bn: 'পটুয়াখালী', aliases: ['patuakhali', 'পটুয়াখালী'] },
  'bhola': { id: 'bhola', name: 'Bhola', bn: 'ভোলা', aliases: ['bhola', 'ভোলা'] },
  'pirojpur': { id: 'pirojpur', name: 'Pirojpur', bn: 'পিরোজপুর', aliases: ['pirojpur', 'পিরোজপুর'] },
  'barguna': { id: 'barguna', name: 'Barguna', bn: 'বরগুনা', aliases: ['barguna', 'বরগুনা'] },
  'jhalokathi': { id: 'jhalokathi', name: 'Jhalokathi', bn: 'ঝালকাঠি', aliases: ['jhalokathi', 'jhalakati', 'ঝালকাঠি'] },

  // Sylhet Division
  'sylhet': { id: 'sylhet', name: 'Sylhet', bn: 'সিলেট', aliases: ['sylhet', 'সিলেট'] },
  'moulvibazar': { id: 'moulvibazar', name: 'Moulvibazar', bn: 'মৌলভীবাজার', aliases: ['moulvibazar', 'maulvibazar', 'মৌলভীবাজার'] },
  'habiganj': { id: 'habiganj', name: 'Habiganj', bn: 'হবিগঞ্জ', aliases: ['habiganj', 'হবিগঞ্জ'] },
  'sunamganj': { id: 'sunamganj', name: 'Sunamganj', bn: 'সুনামগঞ্জ', aliases: ['sunamganj', 'সুনামগঞ্জ'] },

  // Rangpur Division
  'rangpur': { id: 'rangpur', name: 'Rangpur', bn: 'রংপুর', aliases: ['rangpur', 'রংপুর'] },
  'dinajpur': { id: 'dinajpur', name: 'Dinajpur', bn: 'দিনাজপুর', aliases: ['dinajpur', 'দিনাজপুর'] },
  'kurigram': { id: 'kurigram', name: 'Kurigram', bn: 'কুড়িগ্রাম', aliases: ['kurigram', 'কুড়িগ্রাম'] },
  'gaibandha': { id: 'gaibandha', name: 'Gaibandha', bn: 'গাইবান্ধা', aliases: ['gaibandha', 'গাইবান্ধা'] },
  'nilphamari': { id: 'nilphamari', name: 'Nilphamari', bn: 'নীলফামারী', aliases: ['nilphamari', 'নীলফামারী'] },
  'lalmonirhat': { id: 'lalmonirhat', name: 'Lalmonirhat', bn: 'লালমনিরহাট', aliases: ['lalmonirhat', 'লালমনিরহাট'] },
  'thakurgaon': { id: 'thakurgaon', name: 'Thakurgaon', bn: 'ঠাকুরগাঁও', aliases: ['thakurgaon', 'ঠাকুরগাঁও'] },
  'panchagarh': { id: 'panchagarh', name: 'Panchagarh', bn: 'পঞ্চগড়', aliases: ['panchagarh', 'পঞ্চগড়'] },

  // Mymensingh Division
  'mymensingh': { id: 'mymensingh', name: 'Mymensingh', bn: 'ময়মনসিংহ', aliases: ['mymensingh', 'ময়মনসিংহ'] },
  'jamalpur': { id: 'jamalpur', name: 'Jamalpur', bn: 'জামালপুর', aliases: ['jamalpur', 'জামালপুর'] },
  'netrokona': { id: 'netrokona', name: 'Netrokona', bn: 'নেত্রকোণা', aliases: ['netrokona', 'নেত্রকোণা', 'netrakona'] },
  'sherpur': { id: 'sherpur', name: 'Sherpur', bn: 'শেরপুর', aliases: ['sherpur', 'শেরপুর'] }
};

// Normalize district lookup
function resolveDistrict(rawDistrict) {
  if (!rawDistrict) return BANGLADESH_DISTRICTS['bogura'];
  const clean = String(rawDistrict).trim().toLowerCase().replace(/['\.]/g, '');
  
  for (const key of Object.keys(BANGLADESH_DISTRICTS)) {
    const d = BANGLADESH_DISTRICTS[key];
    if (d.id === clean || d.name.toLowerCase() === clean || d.bn === rawDistrict) {
      return d;
    }
    if (d.aliases.some(a => a.toLowerCase().replace(/['\.]/g, '') === clean || clean.includes(a))) {
      return d;
    }
  }

  // Fallback to Bogura or Rajshahi if found
  if (clean.includes('bogr') || clean.includes('বগু')) return BANGLADESH_DISTRICTS['bogura'];
  if (clean.includes('cox') || clean.includes('কক্স')) return BANGLADESH_DISTRICTS['cox-bazar'];
  if (clean.includes('dhak') || clean.includes('ঢাকা')) return BANGLADESH_DISTRICTS['dhaka'];

  return {
    id: clean.replace(/[^a-z0-9]/g, '-') || 'other-district',
    name: String(rawDistrict).trim(),
    bn: String(rawDistrict).trim()
  };
}

// Clean phone number (Excel scientific notation, +880, leading zeros)
function cleanPhone(raw) {
  if (!raw) return '';
  let str = String(raw).trim();

  // If scientific notation like 1.75E+09 or 1.6e+09
  if (/[eE][+-]?\d+/.test(str)) {
    try {
      const num = Number(str);
      if (!isNaN(num)) {
        str = BigInt(Math.round(num)).toString();
      }
    } catch {}
  }

  // Strip all non-digit characters
  let digits = str.replace(/\D/g, '');

  // Strip 880 or +880
  if (digits.startsWith('880')) {
    digits = digits.slice(3);
  }

  // If 10 digits starting with 1 (e.g. 1712345678) -> add 0 -> 01712345678
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits;
  }

  return digits;
}

// Clean blood group
function cleanBlood(raw) {
  if (!raw) return 'O+';
  const s = String(raw).trim().toUpperCase();
  if (s === 'A+' || s === 'A_PLUS' || s === 'A' || s === 'A POSITIVE' || s === 'A POS') return 'A+';
  if (s === 'A-' || s === 'A_MINUS' || s === 'A NEGATIVE' || s === 'A NEG') return 'A-';
  if (s === 'B+' || s === 'B_PLUS' || s === 'B' || s === 'B POSITIVE' || s === 'B POS') return 'B+';
  if (s === 'B-' || s === 'B_MINUS' || s === 'B NEGATIVE' || s === 'B NEG') return 'B-';
  if (s === 'O+' || s === 'O_PLUS' || s === 'O' || s === 'O POSITIVE' || s === 'O POS') return 'O+';
  if (s === 'O-' || s === 'O_MINUS' || s === 'O NEGATIVE' || s === 'O NEG') return 'O-';
  if (s === 'AB+' || s === 'AB_PLUS' || s === 'AB' || s === 'AB POSITIVE' || s === 'AB POS') return 'AB+';
  if (s === 'AB-' || s === 'AB_MINUS' || s === 'AB NEGATIVE' || s === 'AB NEG') return 'AB-';
  return 'O+';
}

function parseCreatedAt(dateStr) {
  if (!dateStr) return new Date().toISOString();
  try {
    // Check if DD-MM-YYYY format e.g. "17-10-2026 07:00 pm"
    const match = String(dateStr).trim().match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
}
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Find target CSV file
function findCSVFile() {
  const possiblePaths = [
    process.argv[2],
    path.join(process.cwd(), 'bbms_donors_backup_24700.csv'),
    path.join(__dirname, '..', 'bbms_donors_backup_24700.csv'),
    '/home/blood.totthohub.com/public_html/bbms_donors_backup_24700.csv',
    path.join(process.cwd(), 'bbms_donors.csv')
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

async function runImport() {
  console.log(`\n======================================================`);
  console.log(`🩸 TotthoHub Blood - BBMS CSV 24,000+ Donors Import`);
  console.log(`======================================================\n`);

  const csvPath = findCSVFile();

  if (!csvPath) {
    console.error(`❌ CSV ফাইল পাওয়া যায়নি!`);
    console.error(`অনুগ্রহ করে "bbms_donors_backup_24700.csv" ফাইলটি প্রজেক্ট রুটে রাখুন:`);
    console.error(`  /home/blood.totthohub.com/public_html/bbms_donors_backup_24700.csv`);
    console.error(`অথবা পাথ দিয়ে রান করুন: node scripts/import_bbms_csv.js [পাথ/ফাইল.csv]\n`);
    process.exit(1);
  }

  console.log(`📂 ফাইল পাওয়া গেছে: ${csvPath}`);
  const stats = fs.statSync(csvPath);
  console.log(`📊 ফাইলের সাইজ: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

  console.log(`⏳ ফাইল পড়া ও পার্স করা হচ্ছে...`);
  const content = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, ''); // strip BOM
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    console.error(`❌ ফাইলে কোনো ডাটা পাওয়া যায়নি!`);
    process.exit(1);
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.trim().toLowerCase());
  console.log(`📋 কলামসমূহ (${headers.length}):`, headers.join(', '));

  // Map header indexes
  const colIndex = {
    id: headers.findIndex(h => h.includes('donor id') || h === 'id'),
    name: headers.findIndex(h => h === 'name' || h.includes('donor name')),
    age: headers.findIndex(h => h === 'age'),
    gender: headers.findIndex(h => h === 'gender'),
    blood: headers.findIndex(h => h.includes('blood')),
    phone: headers.findIndex(h => h.includes('contact') || h.includes('phone') || h.includes('mobile')),
    presentAddress: headers.findIndex(h => h.includes('present ad') || h === 'address'),
    presentDistrict: headers.findIndex(h => h.includes('present dis') || h.includes('district')),
    presentUpazila: headers.findIndex(h => h.includes('present up') || h.includes('upazila') || h.includes('thana')),
    permanentAddress: headers.findIndex(h => h.includes('permanent ad')),
    permanentDistrict: headers.findIndex(h => h.includes('permanent dis')),
    permanentUpazila: headers.findIndex(h => h.includes('permanent up')),
    lastDonation: headers.findIndex(h => h.includes('last donat')),
    createdBy: headers.findIndex(h => h.includes('created by')),
    createdAt: headers.findIndex(h => h.includes('created at'))
  };

  const donors = [];
  const phoneMap = new Map();
  let duplicates = 0;
  let invalidPhones = 0;

  const bloodCounts = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 };
  const districtCounts = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;

    const rawId = colIndex.id >= 0 ? cols[colIndex.id] : String(i);
    const rawName = colIndex.name >= 0 ? cols[colIndex.name] : `Donor #${rawId}`;
    const rawAge = colIndex.age >= 0 ? parseInt(cols[colIndex.age], 10) : undefined;
    const rawGender = colIndex.gender >= 0 ? cols[colIndex.gender].toLowerCase() : 'male';
    const rawBlood = colIndex.blood >= 0 ? cols[colIndex.blood] : 'O+';
    const rawPhone = colIndex.phone >= 0 ? cols[colIndex.phone] : '';
    const rawAddress = colIndex.presentAddress >= 0 ? cols[colIndex.presentAddress] : '';
    const rawDistrict = colIndex.presentDistrict >= 0 ? cols[colIndex.presentDistrict] : '';
    const rawUpazila = colIndex.presentUpazila >= 0 ? cols[colIndex.presentUpazila] : '';
    const rawLastDonation = colIndex.lastDonation >= 0 ? cols[colIndex.lastDonation] : '';
    const rawCreatedAt = colIndex.createdAt >= 0 ? cols[colIndex.createdAt] : '';

    const phone = cleanPhone(rawPhone);

    // Validate phone
    if (!phone || phone.length !== 11 || !phone.startsWith('01')) {
      invalidPhones++;
      continue;
    }

    // Deduplicate by phone
    if (phoneMap.has(phone)) {
      duplicates++;
      continue;
    }

    const bloodGroup = cleanBlood(rawBlood);
    const districtInfo = resolveDistrict(rawDistrict);
    const upazilaName = (rawUpazila || rawAddress || `${districtInfo.name} Sadar`).trim();
    const upazilaId = upazilaName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'sadar';

    const cleanName = (rawName || 'স্বেচ্ছাসেবী রক্তদাতা').trim();
    const donorId = `donor-${rawId || (i + 1000)}`;

    const donorObj = {
      id: donorId,
      userId: `user-${rawId || (i + 1000)}`,
      name: cleanName,
      username: `donor_${phone.slice(-4)}_${rawId}`,
      phone: phone,
      email: `${phone}@donor.totthohub.com`,
      bloodGroup: bloodGroup,
      gender: rawGender === 'female' ? 'female' : 'male',
      dateOfBirth: rawAge && !isNaN(rawAge) ? `${2026 - rawAge}-01-01` : undefined,
      districtId: districtInfo.id,
      districtName: districtInfo.name,
      upazilaId: upazilaId,
      upazilaName: upazilaName,
      area: rawAddress || `${upazilaName}, ${districtInfo.name}`,
      availability: 'available',
      lastDonationDate: rawLastDonation || '২০২৬-০৫-০১',
      donationCount: 1,
      verificationStatus: 'phone_verified',
      bio: `${cleanName} - স্বেচ্ছাসেবী রক্তদাতা (${upazilaName}, ${districtInfo.name})`,
      isAvailableForEmergency: true,
      totalHelpedCount: 0,
      createdAt: parseCreatedAt(rawCreatedAt),
      updatedAt: new Date().toISOString()
    };

    donors.push(donorObj);
    phoneMap.set(phone, true);

    bloodCounts[bloodGroup] = (bloodCounts[bloodGroup] || 0) + 1;
    districtCounts[districtInfo.name] = (districtCounts[districtInfo.name] || 0) + 1;
  }

  console.log(`\n✅ মোট প্রসেসকৃত লাইন: ${lines.length - 1}`);
  console.log(`🌟 সফলভাবে প্রস্তুতকৃত রক্তদাতা: ${donors.length.toLocaleString()} জন`);
  console.log(`🔁 বাদ পড়া ডুপ্লিকেট নম্বর: ${duplicates.toLocaleString()} টি`);
  console.log(`⚠️ ত্রুটিপূর্ণ বা অনুপস্থিত নম্বর: ${invalidPhones.toLocaleString()} টি`);

  console.log(`\n🩸 রক্তের গ্রুপ অনুযায়ী পরিসংখ্যান:`);
  Object.keys(bloodCounts).forEach(g => {
    console.log(`   ${g.padEnd(5)} : ${bloodCounts[g].toLocaleString()} জন`);
  });

  console.log(`\n📍 শীর্ষ জেলাসমূহ:`);
  Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([dist, count]) => {
      console.log(`   ${dist.padEnd(16)} : ${count.toLocaleString()} জন`);
    });

  // Save to JSON targets
  const targetJsonPath = path.join(__dirname, '..', 'src', 'data', 'tursoImportedDonors.json');
  const publicDataDir = path.join(__dirname, '..', 'public', 'data');
  const publicJsonPath = path.join(publicDataDir, 'donors.json');

  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  console.log(`\n💾 ফাইল সংরক্ষণ করা হচ্ছে...`);
  fs.writeFileSync(targetJsonPath, JSON.stringify(donors, null, 2), 'utf8');
  console.log(`   ✓ সেভ হয়েছে: ${targetJsonPath} (${(fs.statSync(targetJsonPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  fs.writeFileSync(publicJsonPath, JSON.stringify(donors), 'utf8');
  console.log(`   ✓ সেভ হয়েছে: ${publicJsonPath} (${(fs.statSync(publicJsonPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  const distDataDir = path.join(__dirname, '..', 'dist', 'data');
  if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
    if (!fs.existsSync(distDataDir)) fs.mkdirSync(distDataDir, { recursive: true });
    fs.writeFileSync(path.join(distDataDir, 'donors.json'), JSON.stringify(donors), 'utf8');
    console.log(`   ✓ সেভ হয়েছে: ${path.join(distDataDir, 'donors.json')}`);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 অভিনন্দন! মোট ${donors.length.toLocaleString()} জন রক্তদাতা সফলভাবে ইমপোর্ট সম্পন্ন হয়েছে!`);
  console.log(`\nএখন সাইটটি লাইভ আপডেট করতে নিচের কমান্ডগুলো চালান:`);
  console.log(`  npm run build`);
  console.log(`  pm2 reload blood-server`);
  console.log(`======================================================\n`);
}

runImport().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
