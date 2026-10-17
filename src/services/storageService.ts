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

export const FOUNDER_USER: User = DEFAULT_USER;

const CUSTOM_DONORS_KEY = 'totthohub_blood_custom_donors';
const STATUS_OVERRIDES_KEY = 'totthohub_blood_donor_status_overrides';

export function getStoredDonors(): Donor[] {
  try {
    const rawCustom = localStorage.getItem(CUSTOM_DONORS_KEY);
    const customDonors: Donor[] = rawCustom ? JSON.parse(rawCustom) : [];

    const rawOverrides = localStorage.getItem(STATUS_OVERRIDES_KEY);
    const overrides: Record<string, Partial<Donor>> = rawOverrides ? JSON.parse(rawOverrides) : {};

    const customIds = new Set(customDonors.map(d => d.id));
    const customPhones = new Set(customDonors.map(d => (d.phone || '').replace(/\D/g, '')));

    const mergedBase = INITIAL_DONORS.filter(d => 
      !customIds.has(d.id) && !customPhones.has((d.phone || '').replace(/\D/g, ''))
    ).map(d => {
      if (overrides[d.id]) {
        return { ...d, ...overrides[d.id] };
      }
      return d;
    });

    return [...customDonors, ...mergedBase];
  } catch {
    return INITIAL_DONORS;
  }
}

export function saveDonors(donors: Donor[]) {
  try {
    // Save newly created custom donors
    const customDonors = donors.filter(d => 
      d.id.startsWith('donor-custom-') || 
      d.id.startsWith('donor-17') || 
      d.id.startsWith('donor-20') ||
      !INITIAL_DONORS.some(base => base.id === d.id)
    );
    if (customDonors.length > 0) {
      localStorage.setItem(CUSTOM_DONORS_KEY, JSON.stringify(customDonors.slice(0, 1000)));
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
