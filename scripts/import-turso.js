import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TURSO_URL = 'https://rokto-rokto.aws-ap-northeast-1.turso.io/v2/pipeline';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEwMjk4NjksImlkIjoiMDE5ZDNiNTktMjMwMS03MmYxLTg5MzQtNGVjMzg1ZjY3ZTQ0Iiwia2lkIjoiRW5TYUZtU2JhQ21hRnk0eGdlblEzME96Z0Q2NEVKelctQU9meUZTX3lsNCIsInJpZCI6ImY5Nzk2YTY3LWMyOTYtNGE0OC1iMTc2LWMwMGFiNjg4NmZiYiJ9.NGO_F03J6jiseHLutwfQYwqz6sM50ZfrIPJlRST6Ix1a8dwkW4AJNuCoZ2bbHILaJHVam84pxvw6PXesUerXDA';

function cleanPhone(raw) {
  if (!raw) return '';
  let s = String(raw).replace(/[\s\-\(\)\.]/g, '');
  if (s.startsWith('+880')) s = '0' + s.substring(4);
  else if (s.startsWith('880')) s = '0' + s.substring(3);
  else if (s.length === 10 && s.startsWith('1')) s = '0' + s;
  return s;
}

function cleanBlood(raw) {
  if (!raw) return 'O+';
  const s = String(raw).trim().toUpperCase();
  if (s === 'A+' || s === 'A_PLUS' || s === 'A' || s === 'A POSITIVE') return 'A+';
  if (s === 'A-' || s === 'A_MINUS' || s === 'A NEGATIVE') return 'A-';
  if (s === 'B+' || s === 'B_PLUS' || s === 'B' || s === 'B POSITIVE') return 'B+';
  if (s === 'B-' || s === 'B_MINUS' || s === 'B NEGATIVE') return 'B-';
  if (s === 'O+' || s === 'O_PLUS' || s === 'O' || s === 'O POSITIVE') return 'O+';
  if (s === 'O-' || s === 'O_MINUS' || s === 'O NEGATIVE') return 'O-';
  if (s === 'AB+' || s === 'AB_PLUS' || s === 'AB' || s === 'AB POSITIVE') return 'AB+';
  if (s === 'AB-' || s === 'AB_MINUS' || s === 'AB NEGATIVE') return 'AB-';
  return 'O+';
}

const AREA_TRANSLATIONS = {
  'রামু': { id: 'ramu', en: 'Ramu', bn: 'রামু' },
  'কক্সবাজার সদর': { id: 'cox-bazar-sadar', en: "Cox's Bazar Sadar", bn: 'কক্সবাজার সদর' },
  'মহেশখালী': { id: 'maheshkhali', en: 'Maheshkhali', bn: 'মহেশখালী' },
  'কুতুবদিয়া': { id: 'kutubdia', en: 'Kutubdia', bn: 'কুতুবদিয়া' },
  'উখিয়া': { id: 'ukhia', en: 'Ukhia', bn: 'উখিয়া' },
  'চকরিয়া': { id: 'chakaria', en: 'Chakaria', bn: 'চকরিয়া' },
  'পেকুয়া': { id: 'pekua', en: 'Pekua', bn: 'পেকুয়া' },
  'টেকনাফ': { id: 'teknaf', en: 'Teknaf', bn: 'টেকনাফ' },
  'মিরপুর': { id: 'mirpur', en: 'Mirpur', bn: 'মিরপুর' },
  'উত্তরা': { id: 'uttara', en: 'Uttara', bn: 'উত্তরা' },
  'ধানমন্ডি': { id: 'dhanmondi', en: 'Dhanmondi', bn: 'ধানমন্ডি' },
  'মোহাম্মদপুর': { id: 'mohammadpur', en: 'Mohammadpur', bn: 'মোহাম্মদপুর' },
  'বাড্ডা': { id: 'badda', en: 'Badda', bn: 'বাড্ডা' },
  'সাভার': { id: 'savar', en: 'Savar', bn: 'সাভার' },
  'মিরপুর ডিওএইচএস': { id: 'mirpur-dohs', en: 'Mirpur DOHS', bn: 'মিরপুর ডিওএইচএস' },
  'বালুচরা': { id: 'baluchara', en: 'Baluchara', bn: 'বালুচরা' },
  'পাঁচলাইশ': { id: 'panchlaish', en: 'Panchlaish', bn: 'পাঁচলাইশ' },
  'কোতোয়ালী': { id: 'kotwali', en: 'Kotwali', bn: 'কোতোয়ালী' },
  'ফুলপুর': { id: 'phulpur', en: 'Phulpur', bn: 'ফুলপুর' },
  'নকলা': { id: 'nakla', en: 'Nakla', bn: 'নকলা' },
  'শেরপুর সদর': { id: 'sherpur-sadar', en: 'Sherpur Sadar', bn: 'শেরপুর সদর' },
  'গাজীপুর সদর': { id: 'gazipur-sadar', en: 'Gazipur Sadar', bn: 'গাজীপুর সদর' }
};

function resolveArea(rawArea, dInfo) {
  const clean = (rawArea || '').trim();
  if (AREA_TRANSLATIONS[clean]) {
    return AREA_TRANSLATIONS[clean];
  }
  if (!clean || clean === 'null' || clean === 'N/A') {
    if (dInfo.id === 'cox-bazar') return { id: 'ramu', en: 'Ramu', bn: 'রামু' };
    if (dInfo.id === 'dhaka') return { id: 'mirpur', en: 'Mirpur', bn: 'মিরপুর' };
    if (dInfo.id === 'chattogram') return { id: 'panchlaish', en: 'Panchlaish', bn: 'পাঁচলাইশ' };
    return { id: dInfo.id + '-sadar', en: `${dInfo.name} Sadar`, bn: `${dInfo.bangla} সদর` };
  }
  return {
    id: clean.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'local-area',
    en: clean,
    bn: clean
  };
}

const DISTRICT_LOOKUP = {
  'কক্সবাজার': { id: 'cox-bazar', name: "Cox's Bazar", bangla: 'কক্সবাজার' },
  "Cox's Bazar": { id: 'cox-bazar', name: "Cox's Bazar", bangla: 'কক্সবাজার' },
  'ঢাকা': { id: 'dhaka', name: 'Dhaka', bangla: 'ঢাকা' },
  'Dhaka': { id: 'dhaka', name: 'Dhaka', bangla: 'ঢাকা' },
  'চট্টগ্রাম': { id: 'chattogram', name: 'Chattogram', bangla: 'চট্টগ্রাম' },
  'Chattogram': { id: 'chattogram', name: 'Chattogram', bangla: 'চট্টগ্রাম' },
  'Chittagong': { id: 'chattogram', name: 'Chattogram', bangla: 'চট্টগ্রাম' },
  'কুমিল্লা': { id: 'cumilla', name: 'Cumilla', bangla: 'কুমিল্লা' },
  'Cumilla': { id: 'cumilla', name: 'Cumilla', bangla: 'কুমিল্লা' },
  'Comilla': { id: 'cumilla', name: 'Cumilla', bangla: 'কুমিল্লা' },
  'লক্ষ্মীপুর': { id: 'lakshmipur', name: 'Lakshmipur', bangla: 'লক্ষ্মীপুর' },
  'Lakshmipur': { id: 'lakshmipur', name: 'Lakshmipur', bangla: 'লক্ষ্মীপুর' },
  'নোয়াখালী': { id: 'noakhali', name: 'Noakhali', bangla: 'নোয়াখালী' },
  'Noakhali': { id: 'noakhali', name: 'Noakhali', bangla: 'নোয়াখালী' },
  'ফেনী': { id: 'feni', name: 'Feni', bangla: 'ফেনী' },
  'Feni': { id: 'feni', name: 'Feni', bangla: 'ফেনী' },
  'ব্রাহ্মণবাড়িয়া': { id: 'brahmanbaria', name: 'Brahmanbaria', bangla: 'ব্রাহ্মণবাড়িয়া' },
  'Brahmanbaria': { id: 'brahmanbaria', name: 'Brahmanbaria', bangla: 'ব্রাহ্মণবাড়িয়া' },
  'চাঁদপুর': { id: 'chandpur', name: 'Chandpur', bangla: 'চাঁদপুর' },
  'Chandpur': { id: 'chandpur', name: 'Chandpur', bangla: 'চাঁদপুর' },
  'খাগড়াছড়ি': { id: 'khagrachhari', name: 'Khagrachhari', bangla: 'খাগড়াছড়ি' },
  'খাগড়াছড়ি': { id: 'khagrachhari', name: 'Khagrachhari', bangla: 'খাগড়াছড়ি' },
  'Khagrachhari': { id: 'khagrachhari', name: 'Khagrachhari', bangla: 'খাগড়াছড়ি' },
  'Khagrachari': { id: 'khagrachhari', name: 'Khagrachhari', bangla: 'খাগড়াছড়ি' },
  'বান্দরবান': { id: 'bandarban', name: 'Bandarban', bangla: 'বান্দরবান' },
  'Bandarban': { id: 'bandarban', name: 'Bandarban', bangla: 'বান্দরবান' },
  'রাঙ্গামাটি': { id: 'rangamati', name: 'Rangamati', bangla: 'রাঙ্গামাটি' },
  'Rangamati': { id: 'rangamati', name: 'Rangamati', bangla: 'রাঙ্গামাটি' },
  'ময়মনসিংহ': { id: 'mymensingh', name: 'Mymensingh', bangla: 'ময়মনসিংহ' },
  ' ময়মনসিংহ': { id: 'mymensingh', name: 'Mymensingh', bangla: 'ময়মনসিংহ' },
  'Mymensingh': { id: 'mymensingh', name: 'Mymensingh', bangla: 'ময়মনসিংহ' },
  'শেরপুর': { id: 'sherpur', name: 'Sherpur', bangla: 'শেরপুর' },
  'Sherpur': { id: 'sherpur', name: 'Sherpur', bangla: 'শেরপুর' },
  'গাজীপুর': { id: 'gazipur', name: 'Gazipur', bangla: 'গাজীপুর' },
  'Gazipur': { id: 'gazipur', name: 'Gazipur', bangla: 'গাজীপুর' },
  'নারায়ণগঞ্জ': { id: 'narayanganj', name: 'Narayanganj', bangla: 'নারায়ণগঞ্জ' },
  'Narayanganj': { id: 'narayanganj', name: 'Narayanganj', bangla: 'নারায়ণগঞ্জ' },
  'টাঙ্গাইল': { id: 'tangail', name: 'Tangail', bangla: 'টাঙ্গাইল' },
  'Tangail': { id: 'tangail', name: 'Tangail', bangla: 'টাঙ্গাইল' },
  'সিলেট': { id: 'sylhet', name: 'Sylhet', bangla: 'সিলেট' },
  'Sylhet': { id: 'sylhet', name: 'Sylhet', bangla: 'সিলেট' },
  'রাজশাহী': { id: 'rajshahi', name: 'Rajshahi', bangla: 'রাজশাহী' },
  'Rajshahi': { id: 'rajshahi', name: 'Rajshahi', bangla: 'রাজশাহী' },
  'রংপুর': { id: 'rangpur', name: 'Rangpur', bangla: 'রংপুর' },
  'Rangpur': { id: 'rangpur', name: 'Rangpur', bangla: 'রংপুর' },
  'দিনাজপুর': { id: 'dinajpur', name: 'Dinajpur', bangla: 'দিনাজপুর' },
  'Dinajpur': { id: 'dinajpur', name: 'Dinajpur', bangla: 'দিনাজপুর' },
  'কুড়িগ্রাম': { id: 'kurigram', name: 'Kurigram', bangla: 'কুড়িগ্রাম' },
  'কুড়িগ্রাম': { id: 'kurigram', name: 'Kurigram', bangla: 'কুড়িগ্রাম' },
  'Kurigram': { id: 'kurigram', name: 'Kurigram', bangla: 'কুড়িগ্রাম' },
  'জামালপুর': { id: 'jamalpur', name: 'Jamalpur', bangla: 'জামালপুর' },
  'Jamalpur': { id: 'jamalpur', name: 'Jamalpur', bangla: 'জামালপুর' },
  'পাবনা': { id: 'pabna', name: 'Pabna', bangla: 'পাবনা' },
  'Pabna': { id: 'pabna', name: 'Pabna', bangla: 'পাবনা' },
  'যশোর': { id: 'jashore', name: 'Jashore', bangla: 'যশোর' },
  'Jashore': { id: 'jashore', name: 'Jashore', bangla: 'যশোর' },
  'খুলনা': { id: 'khulna', name: 'Khulna', bangla: 'খুলনা' },
  'Khulna': { id: 'khulna', name: 'Khulna', bangla: 'খুলনা' },
  'বরিশাল': { id: 'barishal', name: 'Barishal', bangla: 'বরিশাল' },
  'Barishal': { id: 'barishal', name: 'Barishal', bangla: 'বরিশাল' }
};

async function runImport() {
  console.log('Connecting to Turso libSQL at rokto-rokto.aws-ap-northeast-1.turso.io...');
  
  const response = await fetch(TURSO_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql: 'SELECT * FROM donors' } },
        { type: 'execute', stmt: { sql: 'SELECT * FROM requests' } }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to query Turso HTTP pipeline: ${response.statusText}`);
  }

  const data = await response.json();

  // Process Donors
  const donorRes = data.results[0].response.result;
  const donorCols = donorRes.cols.map(c => c.name);
  const rawDonors = donorRes.rows.map(row => {
    const obj = {};
    donorCols.forEach((col, i) => obj[col] = row[i]?.value);
    return obj;
  });

  console.log(`Fetched ${rawDonors.length} raw donor rows from Turso.`);

  const phoneSet = new Set();
  const cleanedDonors = [];
  let duplicates = 0;
  let invalidPhones = 0;

  rawDonors.forEach((d, idx) => {
    const phone = cleanPhone(d.phone);
    if (!phone || phone.length < 10) {
      invalidPhones++;
      return;
    }

    // Filter out dummy/test rows
    const rawName = (d.fullName || '').trim();
    if (rawName.toLowerCase() === 'name' || rawName.toLowerCase() === 'test' || phone === '01811223344') {
      return;
    }

    if (phoneSet.has(phone)) {
      duplicates++;
      return;
    }
    phoneSet.add(phone);

    const distRaw = (d.district || '').trim();
    const dInfo = DISTRICT_LOOKUP[distRaw] || { id: 'dhaka', name: distRaw || 'Dhaka', bangla: distRaw || 'ঢাকা' };
    const blood = cleanBlood(d.bloodType);

    const rawArea = (d.area && d.area !== 'null' && d.area !== 'N/A') ? d.area.trim() : '';
    const rawUnion = (d.union && d.union !== 'null' && d.union !== 'N/A') ? d.union.trim() : '';
    const areaObj = resolveArea(rawArea, dInfo);

    const fullAddressParts = [rawUnion, areaObj.bn || areaObj.en, distRaw || dInfo.bangla].filter(Boolean);
    let fullAddress = fullAddressParts.length > 0 ? fullAddressParts.join(', ') : `${dInfo.name}, Bangladesh`;
    if (rawArea && rawArea.length > 3) {
      fullAddress = rawArea.includes(dInfo.name) || rawArea.includes(dInfo.bangla)
        ? rawArea 
        : `${rawArea}, ${dInfo.name}`;
    }

    cleanedDonors.push({
      id: `turso-${idx + 1}`,
      userId: `user-turso-${idx + 1}`,
      name: (d.fullName && d.fullName !== 'N/A') ? d.fullName.trim() : `Donor ${phone.slice(-4)}`,
      username: `donor_${phone}`,
      phone: phone,
      email: (d.email && d.email !== 'N/A') ? d.email : `${phone}@blood.totthohub.com`,
      bloodGroup: blood,
      gender: 'male',
      districtId: dInfo.id,
      districtName: dInfo.name,
      upazilaId: areaObj.id,
      upazilaName: areaObj.en,
      area: fullAddress,
      availability: (d.status === 'Unavailable') ? 'unavailable' : 'available',
      lastDonationDate: (d.lastDonationDate && d.lastDonationDate !== 'N/A' && !d.lastDonationDate.includes('ইউনিয়ন')) ? d.lastDonationDate : '2026-03-01',
      donationCount: parseInt(d.totalDonations) || (blood === 'AB+' ? 4 : 1),
      verificationStatus: 'phone_verified',
      bio: d.organization && d.organization !== 'N/A' && d.organization !== '1.0'
        ? `Registered donor with ${d.organization}. Migrated from Turso/RoktoDao database.`
        : `Verified voluntary blood donor from ${fullAddress}. Ready for hospital emergency.`,
      isAvailableForEmergency: true,
      totalHelpedCount: parseInt(d.totalDonations) || 1,
      imageUrl: (d.imageUrl && d.imageUrl.length > 5) ? d.imageUrl : undefined,
      createdAt: d.registrationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  // Sort: Donors with real photo come first, then available, then donationCount
  cleanedDonors.sort((a, b) => {
    const aImg = (a.imageUrl && a.imageUrl.length > 5) ? 1 : 0;
    const bImg = (b.imageUrl && b.imageUrl.length > 5) ? 1 : 0;
    if (aImg !== bImg) return bImg - aImg;
    const aAvail = a.availability === 'available' ? 1 : 0;
    const bAvail = b.availability === 'available' ? 1 : 0;
    if (aAvail !== bAvail) return bAvail - aAvail;
    return (b.donationCount || 0) - (a.donationCount || 0);
  });

  // Process Requests
  const reqRes = data.results[1].response.result;
  const reqCols = reqRes.cols.map(c => c.name);
  const rawRequests = reqRes.rows.map(row => {
    const obj = {};
    reqCols.forEach((col, i) => obj[col] = row[i]?.value);
    return obj;
  });

  console.log(`Fetched ${rawRequests.length} raw requests from Turso.`);

  const cleanedRequests = rawRequests.map((r, i) => {
    const phone = cleanPhone(r.phone);
    const blood = cleanBlood(r.bloodType);
    const distRaw = (r.district || '').trim();
    const dInfo = DISTRICT_LOOKUP[distRaw] || { id: 'cox-bazar', name: distRaw || "Cox's Bazar" };
    const patient = (r.patientName && r.patientName.trim()) 
      ? r.patientName.trim() 
      : (r.diseaseInfo ? `${r.diseaseInfo} রোগী` : 'জরুরি রোগী');

    return {
      id: `req-turso-${r.id || i + 1}`,
      uuid: `uuid-turso-${r.id || i + 1}`,
      userId: `user-req-turso-${i + 1}`,
      requesterName: r.createdBy || 'Family Member',
      requesterPhone: phone || '018xxxxxxxx',
      patientName: patient,
      bloodGroup: blood,
      units: parseInt(r.bagsNeeded) || 1,
      hospitalName: r.hospitalName || 'District Sadar Hospital',
      districtId: dInfo.id,
      districtName: dInfo.name,
      upazilaId: 'sadar',
      upazilaName: 'Sadar',
      locationDetails: `${r.hospitalName || 'Sadar Hospital'}, ${r.district || ''}`,
      neededDate: r.neededWhen || 'Within 24 hours',
      neededTime: 'Urgent',
      urgency: (r.isUrgent === 'Yes' || r.isUrgent === 'yes') ? 'critical' : 'urgent',
      description: r.diseaseInfo ? `${r.disease} - ${r.diseaseInfo}` : `Blood needed for ${patient} at ${r.hospitalName}`,
      status: (r.status === 'Approved') ? 'searching' : 'pending',
      matchedDonorIds: [],
      contactCount: 1,
      createdAt: r.createdAt || new Date().toISOString(),
      updatedAt: r.createdAt || new Date().toISOString()
    };
  });

  // Save to src/data/
  const targetDir = path.resolve(__dirname, '../src/data');
  fs.writeFileSync(path.join(targetDir, 'tursoImportedDonors.json'), JSON.stringify(cleanedDonors, null, 2));
  fs.writeFileSync(path.join(targetDir, 'tursoImportedRequests.json'), JSON.stringify(cleanedRequests, null, 2));

  console.log(`\n==============================================`);
  console.log(`✅ TURSO IMPORT SUCCESSFUL`);
  console.log(`  Source Donors:       ${rawDonors.length}`);
  console.log(`  Cleaned & Imported:  ${cleanedDonors.length}`);
  console.log(`  Duplicates Removed:  ${duplicates}`);
  console.log(`  Invalid Phones:      ${invalidPhones}`);
  console.log(`  Requests Imported:   ${cleanedRequests.length}`);
  console.log(`  Saved to:            src/data/tursoImportedDonors.json`);
  console.log(`==============================================\n`);
}

runImport().catch(console.error);
