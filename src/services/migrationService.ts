import { BloodGroup, Donor, MigrationResult, TursoRawDonorRecord } from '../types';
import { DISTRICTS } from '../data/seedData';

// Normalizes Bangladeshi mobile phones into standard 11-digit canonical form: 01xxxxxxxxx
export function normalizePhone(raw: string): { normalized: string; isValid: boolean } {
  if (!raw) return { normalized: '', isValid: false };
  let cleaned = raw.replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+880')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.substring(3);
  }
  // Standard Bangladeshi mobile prefixes: 013, 014, 015, 016, 017, 018, 019
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  const isValid = bdPhoneRegex.test(cleaned);
  return { normalized: cleaned, isValid };
}

// Normalizes various spellings of blood groups into canonical BloodGroup
export function normalizeBloodGroup(raw: string): BloodGroup | null {
  if (!raw) return null;
  const s = raw.trim().toUpperCase();
  if (s === 'A+' || s === 'A POSITIVE' || s === 'A POS') return 'A+';
  if (s === 'A-' || s === 'A NEGATIVE' || s === 'A NEG') return 'A-';
  if (s === 'B+' || s === 'B POSITIVE' || s === 'B POS') return 'B+';
  if (s === 'B-' || s === 'B NEGATIVE' || s === 'B NEG') return 'B-';
  if (s === 'O+' || s === 'O POSITIVE' || s === 'O POS') return 'O+';
  if (s === 'O-' || s === 'O NEGATIVE' || s === 'O NEG') return 'O-';
  if (s === 'AB+' || s === 'AB POSITIVE' || s === 'AB POS') return 'AB+';
  if (s === 'AB-' || s === 'AB NEGATIVE' || s === 'AB NEG') return 'AB-';
  return null;
}

// Maps fuzzy location names from old DB to canonical district and upazila
export function mapLocation(rawLocation: string): { districtId: string; districtName: string; upazilaName: string } {
  const loc = (rawLocation || '').toLowerCase();

  if (loc.includes('ramu') || loc.includes('রামু')) {
    return { districtId: 'cox-bazar', districtName: "Cox's Bazar", upazilaName: 'Ramu' };
  }
  if (loc.includes('cox') || loc.includes('কক্সবাজার')) {
    if (loc.includes('chakaria') || loc.includes('চকরিয়া')) {
      return { districtId: 'cox-bazar', districtName: "Cox's Bazar", upazilaName: 'Chakaria' };
    }
    if (loc.includes('ukhia') || loc.includes('উখিয়া')) {
      return { districtId: 'cox-bazar', districtName: "Cox's Bazar", upazilaName: 'Ukhia' };
    }
    return { districtId: 'cox-bazar', districtName: "Cox's Bazar", upazilaName: "Cox's Bazar Sadar" };
  }
  if (loc.includes('chattogram') || loc.includes('chittagong') || loc.includes('চট্টগ্রাম')) {
    return { districtId: 'chattogram', districtName: 'Chattogram', upazilaName: 'Panchlaish' };
  }
  if (loc.includes('dhaka') || loc.includes('ঢাকা') || loc.includes('dhanmondi') || loc.includes('mirpur')) {
    const upazila = loc.includes('mirpur') ? 'Mirpur' : 'Dhanmondi';
    return { districtId: 'dhaka', districtName: 'Dhaka', upazilaName: upazila };
  }
  if (loc.includes('sylhet') || loc.includes('সিলেট')) {
    return { districtId: 'sylhet', districtName: 'Sylhet', upazilaName: 'Sylhet Sadar' };
  }

  // Fallback to default
  return { districtId: 'cox-bazar', districtName: "Cox's Bazar", upazilaName: "Cox's Bazar Sadar" };
}

// Complete Migration Runner with Dry Run & Commit capabilities
export function executeTursoMigration(
  rawRecords: TursoRawDonorRecord[],
  existingDonors: Donor[],
  isDryRun: boolean = true
): { result: MigrationResult; newDonorsToAppend: Donor[] } {
  const startTime = Date.now();
  const logs: string[] = [];
  logs.push(`[${new Date().toISOString()}] Starting Turso -> TotthoHub Blood Migration Pipeline...`);
  logs.push(`Mode: ${isDryRun ? 'DRY-RUN (Simulation only, no DB commit)' : 'PRODUCTION EXECUTION (Committing to DB)'}`);
  logs.push(`Total source records to process: ${rawRecords.length}`);

  const existingPhoneSet = new Set(existingDonors.map(d => normalizePhone(d.phone).normalized));
  const newDonorsToAppend: Donor[] = [];
  const processedRecords: MigrationResult['records'] = [];

  let successCount = 0;
  let duplicatesSkipped = 0;
  let invalidCount = 0;
  let warningCount = 0;

  for (const record of rawRecords) {
    const { normalized: normPhone, isValid: isPhoneValid } = normalizePhone(record.raw_phone);
    const cleanedBlood = normalizeBloodGroup(record.raw_blood);
    const mappedLoc = mapLocation(record.raw_location);

    if (!isPhoneValid) {
      invalidCount++;
      logs.push(`[WARN] Record #${record.old_id} "${record.full_name}" skipped: Invalid BD phone "${record.raw_phone}".`);
      processedRecords.push({
        originalName: record.full_name,
        originalBlood: record.raw_blood,
        cleanedBlood: 'O+',
        originalPhone: record.raw_phone,
        normalizedPhone: normPhone,
        originalDistrict: record.raw_location,
        mappedDistrict: mappedLoc.districtName,
        status: 'invalid_phone',
        message: 'Phone format not 11-digit Bangladeshi mobile'
      });
      continue;
    }

    if (!cleanedBlood) {
      warningCount++;
      logs.push(`[WARN] Record #${record.old_id} "${record.full_name}" has unresolvable blood group "${record.raw_blood}". Defaulting to O+.`);
    }

    const effectiveBlood: BloodGroup = cleanedBlood || 'O+';

    if (existingPhoneSet.has(normPhone)) {
      duplicatesSkipped++;
      logs.push(`[DUPLICATE] Record #${record.old_id} "${record.full_name}" skipped: Phone ${normPhone} already exists in TotthoHub Blood.`);
      processedRecords.push({
        originalName: record.full_name,
        originalBlood: record.raw_blood,
        cleanedBlood: effectiveBlood,
        originalPhone: record.raw_phone,
        normalizedPhone: normPhone,
        originalDistrict: record.raw_location,
        mappedDistrict: mappedLoc.districtName,
        status: 'duplicate',
        message: `Duplicate phone detected (${normPhone})`
      });
      continue;
    }

    // Register phone in tracking set to prevent intra-batch duplicates
    existingPhoneSet.add(normPhone);
    successCount++;

    const newDonor: Donor = {
      id: `migrated-donor-${record.old_id}`,
      userId: `user-migrated-${record.old_id}`,
      name: record.full_name,
      username: record.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_') + `_${record.old_id}`,
      phone: normPhone,
      email: `${normPhone}@migrated.totthohub.com`,
      bloodGroup: effectiveBlood,
      gender: 'male',
      districtId: mappedLoc.districtId,
      districtName: mappedLoc.districtName,
      upazilaId: mappedLoc.upazilaName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      upazilaName: mappedLoc.upazilaName,
      area: `${mappedLoc.upazilaName} (Migrated from Turso/RoktoDao)`,
      availability: 'available',
      lastDonationDate: record.last_donated_str && record.last_donated_str !== 'N/A' ? record.last_donated_str : '2026-04-01',
      donationCount: 2,
      verificationStatus: 'phone_verified',
      bio: `Verified donor migrated from Turso database. ${record.legacy_notes || ''}`,
      isAvailableForEmergency: true,
      totalHelpedCount: 1,
      createdAt: '2026-10-03T05:00:00Z',
      updatedAt: '2026-10-03T05:00:00Z'
    };

    if (!isDryRun) {
      newDonorsToAppend.push(newDonor);
    }

    processedRecords.push({
      originalName: record.full_name,
      originalBlood: record.raw_blood,
      cleanedBlood: effectiveBlood,
      originalPhone: record.raw_phone,
      normalizedPhone: normPhone,
      originalDistrict: record.raw_location,
      mappedDistrict: `${mappedLoc.districtName} (${mappedLoc.upazilaName})`,
      status: 'imported',
      message: `Cleaned "${record.raw_blood}" -> ${effectiveBlood}, Phone ${normPhone}`
    });

    logs.push(`[SUCCESS] Record #${record.old_id} "${record.full_name}": ${effectiveBlood} | ${mappedLoc.districtName} | Phone: ${normPhone} -> READY`);
  }

  const executionTimeMs = Date.now() - startTime;
  logs.push(`[${new Date().toISOString()}] Migration Pipeline finished in ${executionTimeMs}ms.`);
  logs.push(`Summary: Processed: ${rawRecords.length} | Imported/Ready: ${successCount} | Duplicates: ${duplicatesSkipped} | Invalid: ${invalidCount}`);

  return {
    result: {
      totalProcessed: rawRecords.length,
      successCount,
      duplicatesSkipped,
      invalidCount,
      warningCount,
      records: processedRecords,
      logs,
      executionTimeMs,
      isDryRun
    },
    newDonorsToAppend
  };
}
