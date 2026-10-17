import { BloodGroup, Donor, BloodRequest } from '../types';

// Blood compatibility matrix for whole blood / RBC
export const COMPATIBLE_BLOOD_GROUPS: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal donor
};

export interface MatchScoreResult {
  donor: Donor;
  matchScore: number;
  matchReasons: string[];
  distanceLabel: string;
}

export function findMatchingDonors(
  request: Partial<BloodRequest>,
  donors: Donor[],
  allowCompatible: boolean = true
): MatchScoreResult[] {
  if (!request.bloodGroup) return [];

  const neededGroup = request.bloodGroup as BloodGroup;
  const acceptableGroups = allowCompatible 
    ? COMPATIBLE_BLOOD_GROUPS[neededGroup] 
    : [neededGroup];

  const results: MatchScoreResult[] = [];

  for (const donor of donors) {
    // Check blood group compatibility
    if (!acceptableGroups.includes(donor.bloodGroup)) continue;

    // Availability check
    if (donor.availability === 'unavailable') continue;

    let score = 0;
    const reasons: string[] = [];
    let distanceLabel = 'Other District';

    // 1. Exact vs Compatible group
    if (donor.bloodGroup === neededGroup) {
      score += 40;
      reasons.push('Exact blood group match');
    } else {
      score += 25;
      reasons.push(`Compatible group (${donor.bloodGroup})`);
    }

    // 2. Location proximity
    if (request.upazilaName && donor.upazilaName.toLowerCase() === request.upazilaName.toLowerCase()) {
      score += 35;
      reasons.push(`Same upazila (${donor.upazilaName})`);
      distanceLabel = 'Nearby (< 10 km)';
    } else if (request.districtName && donor.districtName.toLowerCase() === request.districtName.toLowerCase()) {
      score += 20;
      reasons.push(`Same district (${donor.districtName})`);
      distanceLabel = 'Same District (~15-30 km)';
    } else {
      score += 5;
      distanceLabel = 'Adjacent District';
    }

    // 3. Availability status
    if (donor.availability === 'available') {
      score += 15;
      reasons.push('🟢 Available right now');
    } else if (donor.availability === 'temporarily_unavailable') {
      score -= 10;
      reasons.push('🟡 Donated recently');
    }

    // 4. Emergency readiness
    if (donor.isAvailableForEmergency) {
      score += 10;
      reasons.push('Emergency volunteer badge');
    }

    // 5. Verification status
    if (donor.verificationStatus === 'blood_group_verified') {
      score += 10;
      reasons.push('Verified blood group');
    } else if (donor.verificationStatus === 'phone_verified') {
      score += 5;
      reasons.push('Verified phone');
    }

    results.push({
      donor,
      matchScore: score,
      matchReasons: reasons,
      distanceLabel
    });
  }

  // Sort by highest match score first
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
