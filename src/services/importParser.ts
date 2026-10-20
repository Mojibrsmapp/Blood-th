import { Donor, User, BloodGroup, RawImportedDonorJson, DonorAvailability, VerificationStatus } from '../types';

// Map of 64 districts in Bangladesh for instant canonical lookup
const BANGLADESH_DISTRICT_MAP: Record<string, { id: string; name: string; bn: string }> = {
  // Chattogram Division
  'cox-bazar': { id: 'cox-bazar', name: "Cox's Bazar", bn: 'কক্সবাজার' },
  'chattogram': { id: 'chattogram', name: 'Chattogram', bn: 'চট্টগ্রাম' },
  'cumilla': { id: 'cumilla', name: 'Cumilla', bn: 'কুমিল্লা' },
  'feni': { id: 'feni', name: 'Feni', bn: 'ফেনী' },
  'brahmanbaria': { id: 'brahmanbaria', name: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া' },
  'noakhali': { id: 'noakhali', name: 'Noakhali', bn: 'নোয়াখালী' },
  'lakshmipur': { id: 'lakshmipur', name: 'Lakshmipur', bn: 'লক্ষ্মীপুর' },
  'chandpur': { id: 'chandpur', name: 'Chandpur', bn: 'চাঁদপুর' },
  'khagrachhari': { id: 'khagrachhari', name: 'Khagrachhari', bn: 'খাগড়াছড়ি' },
  'rangamati': { id: 'rangamati', name: 'Rangamati', bn: 'রাঙ্গামাটি' },
  'bandarban': { id: 'bandarban', name: 'Bandarban', bn: 'বান্দরবান' },

  // Rajshahi Division
  'bogura': { id: 'bogura', name: 'Bogura', bn: 'বগুড়া' },
  'rajshahi': { id: 'rajshahi', name: 'Rajshahi', bn: 'রাজশাহী' },
  'sirajganj': { id: 'sirajganj', name: 'Sirajganj', bn: 'সিরাজগঞ্জ' },
  'pabna': { id: 'pabna', name: 'Pabna', bn: 'পাবনা' },
  'naogaon': { id: 'naogaon', name: 'Naogaon', bn: 'নওগাঁ' },
  'natore': { id: 'natore', name: 'Natore', bn: 'নাটোর' },
  'joypurhat': { id: 'joypurhat', name: 'Joypurhat', bn: 'জয়পুরহাট' },
  'chapainawabganj': { id: 'chapainawabganj', name: 'Chapainawabganj', bn: 'চাঁপাইনবাবগঞ্জ' },

  // Dhaka Division
  'dhaka': { id: 'dhaka', name: 'Dhaka', bn: 'ঢাকা' },
  'gazipur': { id: 'gazipur', name: 'Gazipur', bn: 'গাজীপুর' },
  'narayanganj': { id: 'narayanganj', name: 'Narayanganj', bn: 'নারায়ণগঞ্জ' },
  'tangail': { id: 'tangail', name: 'Tangail', bn: 'টাঙ্গাইল' },
  'kishoreganj': { id: 'kishoreganj', name: 'Kishoreganj', bn: 'কিশোরগঞ্জ' },
  'manikganj': { id: 'manikganj', name: 'Manikganj', bn: 'মানিকগঞ্জ' },
  'munshiganj': { id: 'munshiganj', name: 'Munshiganj', bn: 'মুন্সীগঞ্জ' },
  'narsingdi': { id: 'narsingdi', name: 'Narsingdi', bn: 'নরসিংদী' },
  'faridpur': { id: 'faridpur', name: 'Faridpur', bn: 'ফরিদপুর' },
  'gopalganj': { id: 'gopalganj', name: 'Gopalganj', bn: 'গোপালগঞ্জ' },
  'madaripur': { id: 'madaripur', name: 'Madaripur', bn: 'মাদারীপুর' },
  'rajbari': { id: 'rajbari', name: 'Rajbari', bn: 'রাজবাড়ী' },
  'shariatpur': { id: 'shariatpur', name: 'Shariatpur', bn: 'শরীয়তপুর' },

  // Khulna Division
  'khulna': { id: 'khulna', name: 'Khulna', bn: 'খুলনা' },
  'jashore': { id: 'jashore', name: 'Jashore', bn: 'যশোর' },
  'kushtia': { id: 'kushtia', name: 'Kushtia', bn: 'কুষ্টিয়া' },
  'jhenaidah': { id: 'jhenaidah', name: 'Jhenaidah', bn: 'ঝিনাইদহ' },
  'satkhira': { id: 'satkhira', name: 'Satkhira', bn: 'সাতক্ষীরা' },
  'bagerhat': { id: 'bagerhat', name: 'Bagerhat', bn: 'বাগেরহাট' },
  'chuadanga': { id: 'chuadanga', name: 'Chuadanga', bn: 'চুয়াডাঙ্গা' },
  'meherpur': { id: 'meherpur', name: 'Meherpur', bn: 'মেহেরপুর' },
  'magura': { id: 'magura', name: 'Magura', bn: 'মাগুরা' },
  'narail': { id: 'narail', name: 'Narail', bn: 'নড়াইল' },

  // Barishal Division
  'barishal': { id: 'barishal', name: 'Barishal', bn: 'বরিশাল' },
  'patuakhali': { id: 'patuakhali', name: 'Patuakhali', bn: 'পটুয়াখালী' },
  'bhola': { id: 'bhola', name: 'Bhola', bn: 'ভোলা' },
  'pirojpur': { id: 'pirojpur', name: 'Pirojpur', bn: 'পিরোজপুর' },
  'barguna': { id: 'barguna', name: 'Barguna', bn: 'বরগুনা' },
  'jhalokathi': { id: 'jhalokathi', name: 'Jhalokathi', bn: 'ঝালকাঠি' },

  // Sylhet Division
  'sylhet': { id: 'sylhet', name: 'Sylhet', bn: 'সিলেট' },
  'moulvibazar': { id: 'moulvibazar', name: 'Moulvibazar', bn: 'মৌলভীবাজার' },
  'habiganj': { id: 'habiganj', name: 'Habiganj', bn: 'হবিগঞ্জ' },
  'sunamganj': { id: 'sunamganj', name: 'Sunamganj', bn: 'সুনামগঞ্জ' },

  // Rangpur Division
  'rangpur': { id: 'rangpur', name: 'Rangpur', bn: 'রংপুর' },
  'dinajpur': { id: 'dinajpur', name: 'Dinajpur', bn: 'দিনাজপুর' },
  'kurigram': { id: 'kurigram', name: 'Kurigram', bn: 'কুড়িগ্রাম' },
  'gaibandha': { id: 'gaibandha', name: 'Gaibandha', bn: 'গাইবান্ধা' },
  'nilphamari': { id: 'nilphamari', name: 'Nilphamari', bn: 'নীলফামারী' },
  'lalmonirhat': { id: 'lalmonirhat', name: 'Lalmonirhat', bn: 'লালমনিরহাট' },
  'thakurgaon': { id: 'thakurgaon', name: 'Thakurgaon', bn: 'ঠাকুরগাঁও' },
  'panchagarh': { id: 'panchagarh', name: 'Panchagarh', bn: 'পঞ্চগড়' },

  // Mymensingh Division
  'mymensingh': { id: 'mymensingh', name: 'Mymensingh', bn: 'ময়মনসিংহ' },
  'jamalpur': { id: 'jamalpur', name: 'Jamalpur', bn: 'জামালপুর' },
  'netrokona': { id: 'netrokona', name: 'Netrokona', bn: 'নেত্রকোণা' },
  'sherpur': { id: 'sherpur', name: 'Sherpur', bn: 'শেরপুর' }
};

// Normalize Bengali numbers to English digits
export function convertBengaliDigits(str: string): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, d => bn.indexOf(d).toString());
}

// Clean phone number (Excel scientific notation, missing leading 0, +880)
export function normalizePhoneNumber(raw: any): string {
  if (raw === null || raw === undefined) return '';
  let str = String(raw).trim();

  // Convert Bengali numerals
  str = convertBengaliDigits(str);

  // Handle scientific notation e.g. 1.688888888E+09 or 1.755123456e+09
  if (/[eE][+-]?\d+/.test(str)) {
    try {
      const num = Number(str);
      if (!isNaN(num)) {
        str = BigInt(Math.round(num)).toString();
      }
    } catch {}
  }

  // Strip non-digits
  let digits = str.replace(/\D/g, '');

  // Strip international prefix +880 or 880
  if (digits.startsWith('880')) {
    digits = digits.slice(3);
  }

  // If 10 digits starting with 1 (e.g. 1866792169, 1601519007) -> prepend 0
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits;
  }

  return digits;
}

// Canonicalize blood group
export function canonicalizeBloodGroup(raw: any): BloodGroup {
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

// Map district by English/Bangla text
export function mapDistrict(raw: any): { id: string; name: string; bn: string } {
  if (!raw) return BANGLADESH_DISTRICT_MAP['cox-bazar'];
  const clean = String(raw).trim().toLowerCase();

  for (const [key, info] of Object.entries(BANGLADESH_DISTRICT_MAP)) {
    if (
      clean === key || 
      clean === info.name.toLowerCase() || 
      clean === info.bn || 
      clean.includes(info.bn) || 
      clean.includes(info.name.toLowerCase())
    ) {
      return info;
    }
  }

  if (clean.includes('cox') || clean.includes('কক্স')) return BANGLADESH_DISTRICT_MAP['cox-bazar'];
  if (clean.includes('bogr') || clean.includes('বগু')) return BANGLADESH_DISTRICT_MAP['bogura'];
  if (clean.includes('dhak') || clean.includes('ঢাকা')) return BANGLADESH_DISTRICT_MAP['dhaka'];
  if (clean.includes('chatt') || clean.includes('চট্টগ্রাম') || clean.includes('ctg')) return BANGLADESH_DISTRICT_MAP['chattogram'];
  if (clean.includes('rajsh') || clean.includes('রাজশাহী')) return BANGLADESH_DISTRICT_MAP['rajshahi'];

  const fallbackId = clean.replace(/[^a-z0-9]/g, '-') || 'cox-bazar';
  return {
    id: fallbackId,
    name: String(raw).trim(),
    bn: String(raw).trim()
  };
}

export interface ParseResult {
  donors: Donor[];
  users: User[];
  total: number;
  validCount: number;
  duplicateCount: number;
  adminUsersCount: number;
  errors: string[];
}

/**
 * Parse donors and users from JSON input (supports array or single object)
 */
export function parseDonorsFromJSON(
  input: string | any[], 
  existingDonors: Donor[] = []
): ParseResult {
  const result: ParseResult = {
    donors: [],
    users: [],
    total: 0,
    validCount: 0,
    duplicateCount: 0,
    adminUsersCount: 0,
    errors: []
  };

  let rawList: any[] = [];
  try {
    if (typeof input === 'string') {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.donors)) {
          rawList = parsed.donors;
        } else {
          rawList = [parsed];
        }
      }
    } else if (Array.isArray(input)) {
      rawList = input;
    }
  } catch (err: any) {
    result.errors.push(`JSON পার্স করতে সমস্যা হয়েছে: ${err.message || 'Invalid format'}`);
    return result;
  }

  result.total = rawList.length;
  const seenPhones = new Set(existingDonors.map(d => normalizePhoneNumber(d.phone)));

  for (let i = 0; i < rawList.length; i++) {
    const item: RawImportedDonorJson = rawList[i];
    if (!item || typeof item !== 'object') continue;

    const rawPhone = item.phone || '';
    const cleanPhone = normalizePhoneNumber(rawPhone);

    if (!cleanPhone.startsWith('01') || cleanPhone.length !== 11) {
      result.errors.push(`সারি #${i + 1}: অবৈধ মোবাইল নম্বর (${rawPhone || 'খালি'})`);
      continue;
    }

    if (seenPhones.has(cleanPhone)) {
      result.duplicateCount++;
      continue;
    }
    seenPhones.add(cleanPhone);

    const fullName = (item.fullName || item.name || 'রক্তদাতা').trim();
    const blood = canonicalizeBloodGroup(item.bloodType || item.bloodGroup);
    const districtInfo = mapDistrict(item.district);
    const upazilaName = (item.area || item.union || districtInfo.name).trim();
    const upazilaId = upazilaName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const donorId = `donor-${cleanPhone}`;
    const userId = `user-${cleanPhone}`;

    const totalDonationsNum = typeof item.totalDonations === 'number' 
      ? item.totalDonations 
      : parseInt(String(item.totalDonations || '1'), 10) || 1;

    const lastDonation = (item.lastDonationDate && item.lastDonationDate !== 'N/A') 
      ? item.lastDonationDate 
      : '২০২৬-০৫-০১';

    const isAvailable = (item.status || '').toLowerCase() !== 'unavailable';

    const donor: Donor = {
      id: donorId,
      userId: userId,
      name: fullName,
      username: item.email ? item.email.split('@')[0] : `donor_${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      email: item.email || `${cleanPhone}@donor.totthohub.com`,
      bloodGroup: blood,
      gender: (item.gender === 'female' ? 'female' : 'male'),
      districtId: districtInfo.id,
      districtName: districtInfo.name,
      upazilaId: upazilaId,
      upazilaName: upazilaName,
      area: item.area ? `${item.area}, ${districtInfo.bn}` : `${upazilaName}, ${districtInfo.name}`,
      availability: (isAvailable ? 'available' : 'temporarily_unavailable') as DonorAvailability,
      lastDonationDate: lastDonation,
      donationCount: totalDonationsNum,
      verificationStatus: 'profile_verified' as VerificationStatus,
      bio: item.organization 
        ? `${fullName} - ${item.organization}` 
        : `${fullName} - স্বেচ্ছাসেবী রক্তদাতা (${upazilaName}, ${districtInfo.bn})`,
      isAvailableForEmergency: true,
      totalHelpedCount: 0,
      imageUrl: item.imageUrl,
      createdAt: item.registrationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    result.donors.push(donor);
    result.validCount++;

    // If role or credentials are present, generate corresponding User account
    const userRole = (item.role || 'donor').toLowerCase();
    const isSpecialRole = userRole === 'admin' || userRole === 'moderator' || userRole === 'volunteer';

    const user: User = {
      id: userId,
      uuid: `uuid-${cleanPhone}`,
      name: fullName,
      username: item.email ? item.email.split('@')[0] : `user_${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      email: item.email || `${cleanPhone}@totthohub.com`,
      role: (isSpecialRole ? userRole : 'donor') as any,
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      avatarUrl: item.imageUrl,
      password: item.password || undefined,
      districtId: districtInfo.id,
      upazilaId: upazilaId,
      districtName: districtInfo.name,
      upazilaName: upazilaName,
      createdAt: item.registrationDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    result.users.push(user);
    if (userRole === 'admin') {
      result.adminUsersCount++;
    }
  }

  return result;
}

/**
 * Helper to split CSV line respecting double quotes
 */
function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Parse donors from CSV string
 */
export function parseDonorsFromCSV(
  csvContent: string, 
  existingDonors: Donor[] = []
): ParseResult {
  const result: ParseResult = {
    donors: [],
    users: [],
    total: 0,
    validCount: 0,
    duplicateCount: 0,
    adminUsersCount: 0,
    errors: []
  };

  const lines = csvContent.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) {
    result.errors.push('CSV ফাইলে কোনো পর্যাপ্ত ডেটা পাওয়া যায়নি');
    return result;
  }

  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  
  // Detect column indexes
  const idIdx = headers.findIndex(h => h.includes('donor id') || h === 'id');
  const nameIdx = headers.findIndex(h => h === 'name' || h.includes('donor name') || h === 'fullname');
  const bloodIdx = headers.findIndex(h => h.includes('blood'));
  const phoneIdx = headers.findIndex(h => h.includes('contact') || h.includes('phone') || h.includes('mobile'));
  const ageIdx = headers.findIndex(h => h === 'age');
  const genderIdx = headers.findIndex(h => h === 'gender');
  const distIdx = headers.findIndex(h => h.includes('present dis') || h === 'district');
  const upaIdx = headers.findIndex(h => h.includes('present up') || h === 'upazila' || h === 'area' || h.includes('thana'));
  const addrIdx = headers.findIndex(h => h.includes('present ad') || h === 'address');
  const lastDonationIdx = headers.findIndex(h => h.includes('last donation'));
  const createdIdx = headers.findIndex(h => h.includes('created at'));

  result.total = lines.length - 1;
  const seenPhones = new Set(existingDonors.map(d => normalizePhoneNumber(d.phone)));

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVLine(lines[i]);
    if (row.length < 2) continue;

    const rawPhone = phoneIdx >= 0 ? row[phoneIdx] : '';
    const cleanPhone = normalizePhoneNumber(rawPhone);

    if (!cleanPhone.startsWith('01') || cleanPhone.length !== 11) {
      continue;
    }

    if (seenPhones.has(cleanPhone)) {
      result.duplicateCount++;
      continue;
    }
    seenPhones.add(cleanPhone);

    const name = (nameIdx >= 0 && row[nameIdx]) ? row[nameIdx].trim() : 'স্বেচ্ছাসেবী রক্তদাতা';
    const blood = canonicalizeBloodGroup(bloodIdx >= 0 ? row[bloodIdx] : 'O+');
    const rawDist = distIdx >= 0 ? row[distIdx] : "Cox's Bazar";
    const districtInfo = mapDistrict(rawDist);
    const upa = (upaIdx >= 0 && row[upaIdx]) ? row[upaIdx].trim() : 'Ramu';
    const addr = (addrIdx >= 0 && row[addrIdx]) ? row[addrIdx].trim() : '';
    const age = (ageIdx >= 0 && !isNaN(Number(row[ageIdx]))) ? Number(row[ageIdx]) : undefined;
    const gender = (genderIdx >= 0 && row[genderIdx]?.toLowerCase() === 'female') ? 'female' : 'male';
    const lastDonation = (lastDonationIdx >= 0 && row[lastDonationIdx]) ? row[lastDonationIdx] : '২০২৬-০৫-০১';
    const oldId = (idIdx >= 0 && row[idIdx]) ? row[idIdx] : `${Date.now()}-${i}`;
    const donorId = `donor-${oldId}`;
    const userId = `user-${donorId}`;

    const donor: Donor = {
      id: donorId,
      userId: userId,
      name,
      username: `donor_${cleanPhone.slice(-4)}_${i}`,
      phone: cleanPhone,
      email: `${cleanPhone}@donor.totthohub.com`,
      bloodGroup: blood,
      gender,
      dateOfBirth: age ? `${2026 - age}-01-01` : undefined,
      districtId: districtInfo.id,
      districtName: districtInfo.name,
      upazilaId: upa.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      upazilaName: upa,
      area: addr || `${upa}, ${districtInfo.bn}`,
      availability: 'available',
      lastDonationDate: lastDonation,
      donationCount: 1,
      verificationStatus: 'phone_verified',
      bio: `${name} - স্বেচ্ছাসেবী রক্তদাতা (${upa}, ${districtInfo.bn})`,
      isAvailableForEmergency: true,
      totalHelpedCount: 0,
      createdAt: (createdIdx >= 0 && row[createdIdx]) ? row[createdIdx] : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    result.donors.push(donor);
    result.validCount++;
  }

  return result;
}
