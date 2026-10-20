import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Header 
} from './components/Header';
import { 
  Footer 
} from './components/Footer';
import { 
  ContactDonorModal 
} from './components/ContactDonorModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  MobileBottomNav 
} from './components/MobileBottomNav';
import { 
  HomeView 
} from './views/HomeView';
import { 
  FindDonorsView 
} from './views/FindDonorsView';
import { 
  DonorProfileView 
} from './views/DonorProfileView';
import { 
  RequestBloodView 
} from './views/RequestBloodView';
import { 
  EmergencyView 
} from './views/EmergencyView';
import { 
  HospitalsView 
} from './views/HospitalsView';
import { 
  CampaignsView 
} from './views/CampaignsView';
import { 
  OrganizationsView 
} from './views/OrganizationsView';
import { 
  VolunteerPortalView 
} from './views/VolunteerPortalView';
import { 
  FounderView 
} from './views/FounderView';
import { 
  AboutView 
} from './views/AboutView';
import { 
  BecomeDonorView 
} from './views/BecomeDonorView';
import { 
  DashboardView 
} from './views/DashboardView';
import { 
  LoginView 
} from './views/LoginView';
import { 
  UserProfileView 
} from './views/UserProfileView';
import { 
  AdminProfileView 
} from './views/AdminProfileView';

import { 
  Donor, 
  BloodRequest, 
  User, 
  UserRole, 
  BloodGroup, 
  NotificationItem, 
  AuditLog 
} from './types';
import { 
  getStoredDonors, 
  saveDonors, 
  getStoredRequests, 
  saveRequests, 
  getCurrentUser, 
  setCurrentUser, 
  logoutUser,
  DEFAULT_USER,
  getStoredAuditLogs, 
  addAuditLog, 
  getStoredNotifications, 
  addNotification, 
  getPlatformStats 
} from './services/storageService';
import { INITIAL_CAMPAIGNS, INITIAL_ORGANIZATIONS } from './data/seedData';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const activeUser = currentUser || getCurrentUser();
  const [donors, setDonors] = useState<Donor[]>(getStoredDonors());
  const [requests, setRequests] = useState<BloodRequest[]>(getStoredRequests());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getStoredAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
  
  // Selected Donor for Profile / Contact
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [contactModalDonor, setContactModalDonor] = useState<Donor | null>(null);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Search filter handover from Home to FindDonors
  const [searchBloodGroup, setSearchBloodGroup] = useState<BloodGroup | undefined>(undefined);
  const [searchDistrict, setSearchDistrict] = useState<string | undefined>(undefined);
  const [searchUpazila, setSearchUpazila] = useState<string | undefined>(undefined);

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogout = () => {
    setUser(null);
    logoutUser();
    showToast('সফলভাবে লগআউট সম্পন্ন হয়েছে।');
    navigate('/login');
  };

  const handleRoleChange = (role: UserRole) => {
    let name = 'Mojibur Rahman';
    let username = 'mojibur_founder';

    if (role === 'admin') {
      name = 'Farhana Sultana (Admin)';
      username = 'admin_farhana';
    } else if (role === 'moderator') {
      name = 'Kamal Uddin (Moderator)';
      username = 'mod_kamal';
    } else if (role === 'donor') {
      name = 'Md. Rahim Ullah (Donor)';
      username = 'rahim_ramu';
    } else if (role === 'user') {
      name = 'Alamgir Hossain (Requester)';
      username = 'alamgir_cox';
    } else if (role === 'organization') {
      name = 'Bangladesh Red Crescent Society';
      username = 'org_redcrescent';
    } else if (role === 'volunteer') {
      name = 'Tanzim Hasan (Volunteer)';
      username = 'vol_tanzim';
    }

    const baseUser = currentUser || DEFAULT_USER;
    const updatedUser: User = {
      ...baseUser,
      role,
      name,
      username
    };

    setUser(updatedUser);
    setCurrentUser(updatedUser);
    addAuditLog(name, role, 'ROLE_SWITCHED', `Switched active portal view to ${role}`);
    showToast(`Switched active view to ${role.toUpperCase()} mode.`);
  };

  // Handlers for Donor & Request updates
  const handleUpdateDonorAvailability = (donorId: string, status: Donor['availability']) => {
    const updated = donors.map(d => d.id === donorId ? { ...d, availability: status } : d);
    setDonors(updated);
    saveDonors(updated);
    addAuditLog(currentUser?.name || 'ব্যবহারকারী', currentUser?.role || 'user', 'AVAILABILITY_CHANGED', `Donor #${donorId} status: ${status}`);
    showToast(`Availability status updated to ${status === 'available' ? 'Available' : 'Resting'}.`);
  };

  const handleVerifyDonor = (donorId: string) => {
    const updated = donors.map(d => d.id === donorId ? { ...d, verificationStatus: 'blood_group_verified' as const } : d);
    setDonors(updated);
    saveDonors(updated);
    addAuditLog(currentUser?.name || 'অ্যাডমিন', currentUser?.role || 'admin', 'DONOR_VERIFIED', `Donor #${donorId} verified by ${currentUser?.name || 'Admin'}`);
    showToast('Donor successfully verified!');
  };

  const handleUpdateRequestStatus = (requestId: string, status: BloodRequest['status']) => {
    const updated = requests.map(r => r.id === requestId ? { ...r, status, fulfilledAt: status === 'fulfilled' ? new Date().toISOString() : undefined } : r);
    setRequests(updated);
    saveRequests(updated);
    addAuditLog(currentUser?.name || 'ব্যবহারকারী', currentUser?.role || 'user', 'REQUEST_STATUS_UPDATED', `Request #${requestId} status: ${status}`);
    showToast(`Blood request marked as ${status}.`);
  };

  const handleAddMigratedDonors = (newDonors: Donor[]) => {
    const combined = [...donors, ...newDonors];
    setDonors(combined);
    saveDonors(combined);
    addAuditLog(currentUser?.name || 'অ্যাডমিন', currentUser?.role || 'admin', 'TURSO_MIGRATION_COMMITTED', `Imported ${newDonors.length} donors from Turso SQLite database.`);
    addNotification('Turso Database Migration Completed', `Successfully cleaned and imported ${newDonors.length} donors into TotthoHub Blood.`, 'system');
    setNotifications(getStoredNotifications());
    showToast(`Successfully imported ${newDonors.length} donors from Turso!`);
  };

  const handleRegisterNewDonor = (newDonor: Donor) => {
    const combined = [newDonor, ...donors];
    setDonors(combined);
    saveDonors(combined);
    addAuditLog(newDonor.name, 'donor', 'DONOR_REGISTERED', `New voluntary donor: ${newDonor.name} (${newDonor.bloodGroup}) in ${newDonor.upazilaName}`);
    showToast('Congratulations! You are now registered on TotthoHub Blood.');
  };

  const handleCreateRequest = (reqData: any) => {
    const newReq: BloodRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      uuid: `uuid-${Date.now()}`,
      matchedDonorIds: [],
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const combined = [newReq, ...requests];
    setRequests(combined);
    saveRequests(combined);
    addAuditLog(reqData.requesterName, 'user', 'REQUEST_CREATED', `Blood Request for ${reqData.patientName} (${reqData.bloodGroup})`);
    addNotification(`🚨 New Blood Request: ${reqData.bloodGroup}`, `Needed at ${reqData.hospitalName} for ${reqData.patientName}`, 'request');
    setNotifications(getStoredNotifications());
    showToast('Blood request submitted and matching donors alerted!');
  };

  const handleContactDonorSubmit = (donor: Donor, message: string, requesterPhone: string, hospital: string) => {
    addAuditLog(requesterPhone, 'user', 'DONOR_CONTACTED', `Contacted donor ${donor.name} (${donor.bloodGroup}) for hospital: ${hospital}`);
    addNotification(`Blood Request for ${donor.name}`, `Patient attendant at ${hospital} sent a contact request.`, 'match');
    setNotifications(getStoredNotifications());
    showToast(`Request sent to ${donor.name}!`);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNotifications(updated);
    try {
      localStorage.setItem('totthohub_blood_notifications', JSON.stringify(updated));
    } catch (e) {}

    if (item.type === 'emergency' || item.type === 'request') {
      navigate('/emergency');
    } else if (item.type === 'campaign') {
      navigate('/campaigns');
    }
  };

  const stats = getPlatformStats();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const urgentCount = requests.filter(r => r.urgency === 'critical' && r.status !== 'fulfilled').length;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 font-sans selection:bg-rose-500 selection:text-white">
      <ScrollToTop />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200 text-center sm:text-left">
          {toastMessage}
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentUser={activeUser}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        unreadCount={unreadNotifs}
        onNotificationClick={handleNotificationClick}
        urgentCount={urgentCount}
        onLogout={handleLogout}
        onOpenAuth={() => {
          navigate('/login');
        }}
      />

      {/* Main Content Area with React Router */}
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                donors={donors}
                requests={requests}
                campaigns={INITIAL_CAMPAIGNS}
                organizations={INITIAL_ORGANIZATIONS}
                stats={stats}
                onSelectDonor={(donor) => {
                  setSelectedDonor(donor);
                }}
              />
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* Find Donors and Blood-group specific SEO landing pages */}
          <Route
            path="/donors"
            element={
              <FindDonorsView
                donors={donors}
                initialBloodGroup={searchBloodGroup}
                initialDistrict={searchDistrict}
                initialUpazila={searchUpazila}
                onSelectDonor={(donor) => setSelectedDonor(donor)}
                onContactDonor={(donor) => setContactModalDonor(donor)}
              />
            }
          />
          <Route
            path="/donors/:groupSlug"
            element={
              <FindDonorsView
                donors={donors}
                onSelectDonor={(donor) => setSelectedDonor(donor)}
                onContactDonor={(donor) => setContactModalDonor(donor)}
              />
            }
          />

          {/* Individual Donor Profile */}
          <Route
            path="/donor/:id"
            element={
              <DonorProfileView
                donor={selectedDonor || undefined}
                donors={donors}
                onBack={() => navigate('/donors')}
                onContact={(donor) => setContactModalDonor(donor)}
              />
            }
          />

          {/* Blood Requests */}
          <Route
            path="/request-blood"
            element={
              <RequestBloodView
                donors={donors}
                onSubmitRequest={handleCreateRequest}
                onNavigateEmergency={() => navigate('/emergency')}
              />
            }
          />
          <Route
            path="/requests"
            element={
              <RequestBloodView
                donors={donors}
                onSubmitRequest={handleCreateRequest}
                onNavigateEmergency={() => navigate('/emergency')}
              />
            }
          />

          {/* Emergency Blood */}
          <Route
            path="/emergency"
            element={
              <EmergencyView
                requests={requests}
                donors={donors}
                onSubmitEmergencyRequest={handleCreateRequest}
                onContactDonor={(donor) => setContactModalDonor(donor)}
              />
            }
          />

          {/* Campaigns */}
          <Route path="/campaigns" element={<CampaignsView />} />

          {/* Organizations */}
          <Route path="/organizations" element={<OrganizationsView />} />

          {/* Volunteer Portal (supports both singular and plural paths) */}
          <Route path="/volunteer" element={<VolunteerPortalView />} />
          <Route path="/volunteers" element={<VolunteerPortalView />} />

          {/* Hospitals and Blood Banks */}
          <Route path="/hospitals" element={<HospitalsView />} />

          {/* About TotthoHub Blood & Blood Info */}
          <Route path="/about" element={<AboutView />} />
          <Route path="/founder" element={<Navigate to="/about" replace />} />

          {/* Register / Become a Donor */}
          <Route
            path="/become-donor"
            element={
              <BecomeDonorView
                onRegisterDonor={handleRegisterNewDonor}
                onNavigateDonors={() => navigate('/donors')}
                onAutoLogin={(donorUser) => {
                  setCurrentUser(donorUser);
                  setUser(donorUser);
                  showToast(`${donorUser.name} হিসেবে রেজিস্ট্রেশন ও লগইন সফল হয়েছে!`);
                }}
              />
            }
          />

          {/* Role-based Dashboard (Protected: login required) */}
          <Route
            path="/dashboard"
            element={
              activeUser ? (
                <DashboardView
                  currentUser={activeUser}
                  donors={donors}
                  requests={requests}
                  auditLogs={auditLogs}
                  onUpdateDonorAvailability={handleUpdateDonorAvailability}
                  onVerifyDonor={handleVerifyDonor}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                  onAddMigratedDonors={handleAddMigratedDonors}
                  onLogNewDonation={(donorId, date) => {
                    const updated = donors.map(d => d.id === donorId ? { ...d, lastDonationDate: date, donationCount: d.donationCount + 1 } : d);
                    setDonors(updated);
                    saveDonors(updated);
                    showToast('রক্তদান সফলভাবে রেকর্ড করা হয়েছে!');
                  }}
                />
              ) : (
                <Navigate to="/login?redirect=/dashboard" replace />
              )
            }
          />

          {/* Role-based Login Routes */}
          <Route 
            path="/login" 
            element={
              <LoginView 
                currentUser={activeUser}
                onLogout={handleLogout}
                onLoginSuccess={(userObj) => {
                  setCurrentUser(userObj);
                  setUser(userObj);
                  showToast(`${userObj.name} হিসেবে লগইন সফল হয়েছে!`);
                }}
              />
            } 
          />
          <Route 
            path="/login/:roleParam" 
            element={
              <LoginView 
                currentUser={activeUser}
                onLogout={handleLogout}
                onLoginSuccess={(userObj) => {
                  setCurrentUser(userObj);
                  setUser(userObj);
                  showToast(`${userObj.name} হিসেবে লগইন সফল হয়েছে!`);
                }}
              />
            } 
          />

          {/* User Profile (Protected: login required) */}
          <Route 
            path="/profile" 
            element={
              activeUser ? (
                <UserProfileView 
                  currentUser={activeUser}
                  requests={requests}
                  donors={donors}
                  onLogout={handleLogout}
                  onUpdateAvailability={(status) => {
                    showToast(`প্রাপ্যতা স্ট্যাটাস আপডেট: ${status === 'available' ? 'প্রস্তুত' : 'বিশ্রামে'}`);
                  }}
                />
              ) : (
                <Navigate to="/login?redirect=/profile" replace />
              )
            } 
          />
          <Route path="/user/profile" element={<Navigate to="/profile" replace />} />

          {/* Admin Profile (Protected: admin login required) */}
          <Route 
            path="/admin/profile" 
            element={
              activeUser && activeUser.role === 'admin' ? (
                <AdminProfileView 
                  currentUser={activeUser}
                  donors={donors}
                  requests={requests}
                  auditLogs={auditLogs}
                  onVerifyDonor={handleVerifyDonor}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login/admin?redirect=/admin/profile" replace />
              )
            } 
          />
          <Route path="/admin" element={<Navigate to="/admin/profile" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Contact Donor Modal */}
      <ContactDonorModal
        donor={contactModalDonor}
        onClose={() => setContactModalDonor(null)}
        onSubmitContact={handleContactDonorSubmit}
      />

      {/* Global Phone Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(phone) => {
          const normalized = phone.replace(/[^0-9]/g, '');
          const allDonors = getStoredDonors();
          const matchedDonor = allDonors.find(d => {
            const dPhone = (d.phone || '').replace(/[^0-9]/g, '');
            return dPhone === normalized || (dPhone.length === 11 && normalized.length === 11 && dPhone.endsWith(normalized.slice(-10)));
          });

          const loggedUser: User = {
            id: matchedDonor ? matchedDonor.userId || `user-${matchedDonor.id}` : `user-${Date.now()}`,
            uuid: `uuid-user-${normalized}`,
            name: matchedDonor ? matchedDonor.name : 'রক্তদাতা ও সদস্য',
            username: matchedDonor ? matchedDonor.username : `user_${normalized.slice(-4)}`,
            email: matchedDonor?.email || `${normalized}@totthohub.com`,
            phone: normalized,
            role: matchedDonor ? 'donor' : 'user',
            status: 'active',
            emailVerified: true,
            phoneVerified: true,
            districtId: matchedDonor?.districtId || 'cox-bazar',
            upazilaId: matchedDonor?.upazilaId || 'cox-bazar-sadar',
            districtName: matchedDonor?.districtName || "Cox's Bazar",
            upazilaName: matchedDonor?.upazilaName || "কক্সবাজার সদর",
            createdAt: matchedDonor?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setCurrentUser(loggedUser);
          setUser(loggedUser);
          showToast(`${loggedUser.name} হিসেবে লগইন সফল হয়েছে!`);
        }}
        onNavigateToBecomeDonor={() => {
          navigate('/become-donor');
        }}
      />

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav currentUser={activeUser} />

    </div>
  );
}
