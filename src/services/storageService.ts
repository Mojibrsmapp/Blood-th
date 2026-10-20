import { 
  Donor, 
  BloodRequest, 
  User, 
  UserRole, 
  AuditLog, 
  NotificationItem, 
  Hospital, 
  BloodBank, 
  Campaign, 
  Organization 
} from '../types';
import { 
  INITIAL_DONORS, 
  INITIAL_REQUESTS, 
  INITIAL_HOSPITALS, 
  INITIAL_BLOOD_BANKS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/seedData';

const STORAGE_KEYS = {
  DONORS: 'totthohub_blood_donors',
  REQUESTS: 'totthohub_blood_requests',
  CURRENT_USER: 'totthohub_blood_current_user',
  AUDIT_LOGS: 'totthohub_blood_audit_logs',
  NOTIFICATIONS: 'totthohub_blood_notifications',
  HOSPITALS: 'totthohub_blood_hospitals',
  CAMPAIGNS: 'totthohub_blood_campaigns'
};

export const DEFAULT_USER: User = {
  id: 'user-default-1',
  uuid: 'uuid-user-default',
  name: 'সাধারণ ব্যবহারকারী',
  username: 'user_018',
  phone: '01812345678',
  email: 'user@totthohub.com',
  role: 'user',
  status: 'active',
  emailVerified: true,
  phoneVerified: true,
  districtId: 'cox-bazar',
  upazilaId: 'ramu',
  districtName: "Cox's Bazar",
  upazilaName: 'রামু',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2026-10-07T05:00:00Z'
};

export const FOUNDER_ADMIN_USER: User = {
  id: 'user-01601519007',
  uuid: 'uuid-admin-mojib',
  name: 'Mojibur Rahman',
  username: 'mojibrsm',
  phone: '01601519007',
  email: 'mojibrsm@gmail.com',
  role: 'admin',
  status: 'active',
  emailVerified: true,
  phoneVerified: true,
  avatarUrl: 'https://ik.imagekit.io/uekohag7w/roktodao/avatars/Image_-_Mojibur_Rahman_3RYwZ7Kdx.png?updatedAt=1754838793398',
  password: 'adminmojib',
  districtId: 'cox-bazar',
  upazilaId: 'ramu',
  districtName: "Cox's Bazar",
  upazilaName: 'রামু',
  createdAt: '2026-03-29T23:57:13.121Z',
  updatedAt: '2026-10-20T12:00:00Z'
};

export const FOUNDER_USER: User = FOUNDER_ADMIN_USER;

const CUSTOM_DONORS_KEY = 'totthohub_blood_custom_donors';
const CUSTOM_USERS_KEY = 'totthohub_blood_custom_users';
const STATUS_OVERRIDES_KEY = 'totthohub_blood_donor_status_overrides';

export const SEED_SPECIAL_DONORS: Donor[] = [
  {
    id: 'donor-01601519007',
    userId: 'user-01601519007',
    name: 'Mojibur Rahman',
    username: 'mojibrsm',
    phone: '01601519007',
    email: 'mojibrsm@gmail.com',
    bloodGroup: 'AB+',
    gender: 'male',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaId: 'ramu',
    upazilaName: 'রামু',
    area: 'রামু, কক্সবাজার',
    availability: 'available',
    lastDonationDate: '২০২৬-০৫-০১',
    donationCount: 4,
    verificationStatus: 'profile_verified',
    bio: 'Mojibur Rahman - Oftern IT (অ্যাডমিন ও নিয়মিত রক্তদাতা)',
    imageUrl: 'https://ik.imagekit.io/uekohag7w/roktodao/avatars/Image_-_Mojibur_Rahman_3RYwZ7Kdx.png?updatedAt=1754838793398',
    isAvailableForEmergency: true,
    totalHelpedCount: 4,
    createdAt: '2026-03-29T23:57:13.121Z',
    updatedAt: '2026-10-20T12:00:00Z'
  },
  {
    id: 'donor-01866792169',
    userId: 'user-01866792169',
    name: 'মোঃ ইমরান',
    username: 'imran_2169',
    phone: '01866792169',
    email: 'mohammedimran712159@gmail.com',
    bloodGroup: 'B+',
    gender: 'male',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaId: 'ramu',
    upazilaName: 'রামু',
    area: 'খুনিয়াপালং ইউনিয়ন, রামু, কক্সবাজার',
    availability: 'available',
    lastDonationDate: '২০২৬-০২-২৮',
    donationCount: 0,
    verificationStatus: 'phone_verified',
    bio: 'মোঃ ইমরান - স্বেচ্ছাসেবী রক্তদাতা (খুনিয়াপালং ইউনিয়ন, রামু)',
    isAvailableForEmergency: true,
    totalHelpedCount: 0,
    createdAt: '2026-02-28T17:22:03.606Z',
    updatedAt: '2026-10-20T12:00:00Z'
  }
];

export function getStoredCustomUsers(): User[] {
  try {
    const raw = localStorage.getItem(CUSTOM_USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];
    if (!users.some(u => u.phone === FOUNDER_ADMIN_USER.phone || u.email === FOUNDER_ADMIN_USER.email)) {
      users.unshift(FOUNDER_ADMIN_USER);
    }
    return users;
  } catch {
    return [FOUNDER_ADMIN_USER];
  }
}

export function saveCustomUsers(users: User[]) {
  try {
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users.slice(0, 500)));
  } catch (e) {
    console.error('Failed to save custom users', e);
  }
}

export function addCustomUsers(newUsers: User[]) {
  const existing = getStoredCustomUsers();
  const phoneMap = new Set(existing.map(u => (u.phone || '').replace(/\D/g, '')));
  const toAdd: User[] = [];
  for (const u of newUsers) {
    const cleanP = (u.phone || '').replace(/\D/g, '');
    if (!phoneMap.has(cleanP)) {
      phoneMap.add(cleanP);
      toAdd.push(u);
    }
  }
  const merged = [...toAdd, ...existing];
  saveCustomUsers(merged);
  return merged;
}

export function getStoredDonors(): Donor[] {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_DONORS_KEY);
    const customDonors: Donor[] = rawCustom ? JSON.parse(rawCustom) : [];

    const rawOverrides = localStorage.getItem(STATUS_OVERRIDES_KEY);
    const overrides: Record<string, Partial<Donor>> = rawOverrides ? JSON.parse(rawOverrides) : {};

    const customPhones = new Set(customDonors.map(d => (d.phone || '').replace(/\D/g, '')));

    // Ensure seed special donors exist
    const specialToAdd = SEED_SPECIAL_DONORS.filter(s => !customPhones.has((s.phone || '').replace(/\D/g, '')));

    const allCustomAndSpecial = [...customDonors, ...specialToAdd];
    const allKnownPhones = new Set(allCustomAndSpecial.map(d => (d.phone || '').replace(/\D/g, '')));

    const mergedBase = INITIAL_DONORS.filter(d => 
      !allKnownPhones.has((d.phone || '').replace(/\D/g, ''))
    ).map(d => {
      if (overrides[d.id]) {
        return { ...d, ...overrides[d.id] };
      }
      return d;
    });

    return [...allCustomAndSpecial, ...mergedBase];
  } catch {
    return [...SEED_SPECIAL_DONORS, ...INITIAL_DONORS];
  }
}

export function saveDonors(donors: Donor[]) {
  try {
    // Save newly created or imported custom donors
    const customDonors = donors.filter(d => 
      !INITIAL_DONORS.some(base => base.id === d.id)
    );
    if (customDonors.length > 0) {
      localStorage.setItem(CUSTOM_DONORS_KEY, JSON.stringify(customDonors.slice(0, 3000)));
    }

    // Save status overrides (availability or verification changes)
    const overrides: Record<string, Partial<Donor>> = {};
    for (const d of donors) {
      const base = INITIAL_DONORS.find(b => b.id === d.id);
      if (base) {
        if (base.availability !== d.availability || base.verificationStatus !== d.verificationStatus || base.donationCount !== d.donationCount) {
          overrides[d.id] = {
            availability: d.availability,
            verificationStatus: d.verificationStatus,
            donationCount: d.donationCount,
            lastDonationDate: d.lastDonationDate
          };
        }
      }
    }
    localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to save donors to localStorage', e);
  }
}

export function addImportedDonors(newDonors: Donor[], newUsers?: User[]): { updatedDonors: Donor[]; addedCount: number } {
  const currentDonors = getStoredDonors();
  const phoneMap = new Set(currentDonors.map(d => (d.phone || '').replace(/\D/g, '')));
  
  const toAdd: Donor[] = [];
  for (const d of newDonors) {
    const cleanP = (d.phone || '').replace(/\D/g, '');
    if (!phoneMap.has(cleanP)) {
      phoneMap.add(cleanP);
      toAdd.push(d);
    }
  }

  const merged = [...toAdd, ...currentDonors];
  saveDonors(merged);

  if (newUsers && newUsers.length > 0) {
    addCustomUsers(newUsers);
  }

  return {
    updatedDonors: merged,
    addedCount: toAdd.length
  };
}

export function getStoredRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    if (parsed.length <= 4 && INITIAL_REQUESTS.length > 5) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return parsed;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: BloodRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

export function getStoredAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(actorName: string, actorRole: UserRole, action: string, target: string, details?: string) {
  const current = getStoredAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    actorName,
    actorRole,
    action,
    target,
    ipAddress: '103.114.98.24',
    timestamp: new Date().toISOString(),
    details
  };
  const updated = [newLog, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error(e);
  }
  return newLog;
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(title: string, message: string, type: NotificationItem['type'] = 'system', link?: string) {
  const current = getStoredNotifications();
  const item: NotificationItem = {
    id: `notif-${Date.now()}`,
    userId: 'all',
    title,
    message,
    type,
    read: false,
    timestamp: 'Just now',
    link
  };
  const updated = [item, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated.slice(0, 30)));
  } catch (e) {
    console.error(e);
  }
  return item;
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error(e);
  }
}

export function logoutUser() {
  setCurrentUser(null);
}

export function getPlatformStats() {
  const donors = getStoredDonors();
  const requests = getStoredRequests();
  const activeDonors = donors.filter(d => d.availability === 'available');
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');

  return {
    registeredDonors: donors.length,
    activeDonors: activeDonors.length,
    bloodRequests: requests.length,
    successfulConnections: fulfilledRequests.length + donors.reduce((sum, d) => sum + (d.totalHelpedCount || 0), 0),
    organizations: INITIAL_ORGANIZATIONS.length,
    volunteers: 45 + donors.filter(d => d.isAvailableForEmergency).length
  };
}
