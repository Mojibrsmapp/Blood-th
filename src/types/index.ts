export type UserRole = 
  | 'founder'
  | 'admin'
  | 'moderator'
  | 'volunteer'
  | 'organization'
  | 'donor'
  | 'user';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'banned' | 'deleted';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type DonorAvailability = 'available' | 'temporarily_unavailable' | 'unavailable';

export type VerificationStatus = 'phone_verified' | 'profile_verified' | 'blood_group_verified' | 'pending';

export type RequestStatus = 
  | 'pending'
  | 'approved'
  | 'searching'
  | 'matched'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'cancelled'
  | 'expired'
  | 'rejected';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical';

export interface User {
  id: string;
  uuid: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  districtId: string;
  upazilaId?: string;
  districtName?: string;
  upazilaName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donor {
  id: string;
  userId: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  bloodGroup: BloodGroup;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
  area: string;
  availability: DonorAvailability;
  lastDonationDate: string;
  donationCount: number;
  verificationStatus: VerificationStatus;
  bio?: string;
  isAvailableForEmergency: boolean;
  totalHelpedCount: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  uuid: string;
  userId: string;
  requesterName: string;
  requesterPhone: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  hospitalId?: string;
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
  locationDetails: string;
  neededDate: string;
  neededTime: string;
  urgency: UrgencyLevel;
  description: string;
  status: RequestStatus;
  approvedBy?: string;
  fulfilledAt?: string;
  matchedDonorIds: string[];
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  banglaName: string;
  districtId: string;
  districtName: string;
  upazilaName: string;
  address: string;
  phone: string;
  emergencyHotline: string;
  services: string[];
  hasBloodBank: boolean;
  isVerified: boolean;
}

export interface BloodBank {
  id: string;
  name: string;
  districtName: string;
  upazilaName: string;
  address: string;
  phone: string;
  openingHours: string;
  isVerified: boolean;
  notes?: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  organizerName: string;
  organizerType: 'organization' | 'volunteer_group' | 'college' | 'ngo';
  districtName: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  targetUnits: number;
  registeredDonorsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  districtName: string;
  phone: string;
  email: string;
  website?: string;
  isVerified: boolean;
  activeVolunteersCount: number;
  totalDonationsCoordinated: number;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
  details?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'match' | 'emergency' | 'system' | 'campaign';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface TursoRawDonorRecord {
  old_id: number;
  full_name: string;
  raw_phone: string;
  raw_blood: string;
  raw_location: string;
  last_donated_str?: string;
  legacy_notes?: string;
}

export interface MigrationResult {
  totalProcessed: number;
  successCount: number;
  duplicatesSkipped: number;
  invalidCount: number;
  warningCount: number;
  records: Array<{
    originalName: string;
    originalBlood: string;
    cleanedBlood: BloodGroup;
    originalPhone: string;
    normalizedPhone: string;
    originalDistrict: string;
    mappedDistrict: string;
    status: 'imported' | 'duplicate' | 'invalid_phone';
    message: string;
  }>;
  logs: string[];
  executionTimeMs: number;
  isDryRun: boolean;
}
