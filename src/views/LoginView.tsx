import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  LogIn, 
  ShieldCheck, 
  Phone, 
  Lock, 
  User, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  LayoutDashboard,
  LogOut,
  KeyRound,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { User as UserType, Donor } from '../types';
import { getStoredDonors, setCurrentUser } from '../services/storageService';
import { SEO } from '../components/SEO';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
  currentUser: UserType | null;
  onLogout?: () => void;
}

// Convert Bangla numerals to standard English digits
export const normalizeBanglaDigits = (str: string): string => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, d => bn.indexOf(d).toString());
};

// Clean and normalize Bangladeshi mobile number to 11 digits (01xxxxxxxxx)
export const cleanBangladeshiPhone = (raw: string): string => {
  let cleaned = normalizeBanglaDigits(raw.trim()).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.length === 10 && cleaned.startsWith('1')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLoginSuccess, 
  currentUser,
  onLogout 
}) => {
  const { roleParam } = useParams<{ roleParam?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '';

  const getInitialRole = (): 'user' | 'admin' => {
    if (roleParam === 'admin') return 'admin';
    return 'user';
  };

  const [activeRole, setActiveRole] = useState<'user' | 'admin'>(getInitialRole());
  const [phone, setPhone] = useState('');
  const [customName, setCustomName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  // Admin login credentials
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load donors to check matches in real time
  const allDonors = useMemo(() => getStoredDonors(), []);

  // Compute matched donor based on entered phone
  const cleanedPhone = cleanBangladeshiPhone(phone);
  const matchedDonor: Donor | undefined = useMemo(() => {
    if (cleanedPhone.length < 10) return undefined;
    return allDonors.find(d => {
      const dPhone = cleanBangladeshiPhone(d.phone || '');
      return dPhone === cleanedPhone || (dPhone.length === 11 && cleanedPhone.length === 11 && dPhone.endsWith(cleanedPhone.slice(-10)));
    });
  }, [allDonors, cleanedPhone]);

  useEffect(() => {
    if (roleParam === 'admin') {
      setActiveRole('admin');
    } else {
      setActiveRole('user');
    }
    setError('');
  }, [roleParam]);

  const handleRoleSelect = (role: 'user' | 'admin') => {
    setActiveRole(role);
    setError('');
    setSuccessMsg('');
    const redirectQuery = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : '';
    navigate(`/login/${role}${redirectQuery}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (activeRole === 'user') {
      const normalized = cleanBangladeshiPhone(phone);
      if (!normalized.startsWith('01') || normalized.length !== 11) {
        setError('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01812345678 বা ০১৮১২৩৪৫৬৭৮)');
        setIsSubmitting(false);
        return;
      }

      const userName = matchedDonor 
        ? matchedDonor.name 
        : (customName.trim() || 'রক্তদাতা ও সদস্য');

      const loggedUser: UserType = {
        id: matchedDonor ? matchedDonor.userId || `user-${matchedDonor.id}` : `user-${Date.now()}`,
        uuid: `uuid-user-${normalized}`,
        name: userName,
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

      const destination = redirectUrl || '/dashboard';
      setCurrentUser(loggedUser);
      onLoginSuccess(loggedUser);
      setSuccessMsg(`স্বাগতম ${loggedUser.name}! সফলভাবে লগইন হয়েছে...`);
      setIsSubmitting(false);
      navigate(destination, { replace: true });
    } else {
      // Admin Login
      const trimmedUser = adminUsername.trim().toLowerCase();
      const trimmedPass = adminPassword.trim();

      if (!trimmedUser) {
        setError('অ্যাডমিন ইউজারনেম বা ইমেইল প্রদান করুন।');
        setIsSubmitting(false);
        return;
      }

      if (!trimmedPass) {
        setError('অ্যাডমিন পাসওয়ার্ড বা নিরাপত্তা পিন প্রদান করুন।');
        setIsSubmitting(false);
        return;
      }

      const adminUser: UserType = {
        id: 'admin-1',
        uuid: 'uuid-admin-primary',
        name: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
        username: trimmedUser.includes('@') ? trimmedUser.split('@')[0] : trimmedUser,
        email: trimmedUser.includes('@') ? trimmedUser : `${trimmedUser}@totthohub.com`,
        phone: '01819000001',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        districtId: 'cox-bazar',
        upazilaId: 'cox-bazar-sadar',
        districtName: "Cox's Bazar",
        upazilaName: "কক্সবাজার সদর",
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      const destination = redirectUrl || '/dashboard';
      setCurrentUser(adminUser);
      onLoginSuccess(adminUser);
      setSuccessMsg('অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
      setIsSubmitting(false);
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      <SEO
        title={activeRole === 'admin' ? 'অ্যাডমিন লগইন' : 'ব্যবহারকারী ও রক্তদাতা লগইন'}
        description="তথ্যহাব ব্লাড অ্যাকাউন্টে প্রবেশ করুন। মোবাইল নম্বর দিয়ে রক্তদাতা প্রোফাইল বা অ্যাডমিন ক্রেডেনশিয়াল দিয়ে অ্যাডমিন কনসোলে লগইন করুন।"
        canonical="https://blood.totthohub.com/login"
      />
      
      {/* Back to Home */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>হোম পেজে ফিরে যান</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            {activeRole === 'admin' ? (
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            ) : (
              <Heart className="w-7 h-7 text-rose-600" />
            )}
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {activeRole === 'admin' ? 'অ্যাডমিন লগইন' : 'ব্যবহারকারী ও রক্তদাতা লগইন'}
          </h1>
          
          <p className="text-xs text-slate-500">
            {activeRole === 'admin' 
              ? 'সিস্টেম অ্যাডমিন ও ভেরিফিকেশন প্যানেলে প্রবেশ' 
              : 'মোবাইল নম্বর দিয়ে আপনার রক্তদাতা প্রোফাইল বা অ্যাকাউন্টে প্রবেশ করুন'}
          </p>
        </div>

        {/* Redirect Notice Banner (if user tried to open protected page like dashboard) */}
        {redirectUrl && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <div className="font-medium">
              ড্যাশবোর্ড অ্যাক্সেস করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
            </div>
          </div>
        )}

        {/* Already Logged In Banner */}
        {currentUser && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>আপনি বর্তমানে লগইন আছেন: {currentUser.name}</span>
            </div>
            <p className="text-emerald-700 text-[11px]">
              রোল: <span className="font-semibold uppercase">{currentUser.role === 'admin' ? 'অ্যাডমিন' : 'রক্তদাতা / ব্যবহারকারী'}</span> ({currentUser.phone})
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              </Link>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Role Segmented Tabs (Only user and admin) */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => handleRoleSelect('user')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeRole === 'user' 
                ? 'bg-white text-rose-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            রক্তদাতা ও সাধারণ ইউজার
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeRole === 'admin' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            অ্যাডমিন
          </button>
        </div>

        {/* Feedback / Error Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {activeRole === 'user' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  মোবাইল নম্বর (১১ ডিজিট) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01812345678 বা ০১৮১২৩৪৫৬৭৮"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Matched Donor Live Banner */}
              {matchedDonor ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>স্বাগতম, {matchedDonor.name}!</span>
                    <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black font-mono">
                      {matchedDonor.bloodGroup}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    আপনার নিবন্ধিত রক্তদাতা প্রোফাইল সক্রিয় রয়েছে ({matchedDonor.upazilaName}, {matchedDonor.districtName})।
                  </p>
                </div>
              ) : cleanedPhone.length === 11 ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আপনার পূর্ণ নাম (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: মো. শাকিল আহমেদ"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    নতুন নম্বর হলে স্বয়ংক্রিয়ভাবে একটি অ্যাকাউন্ট তৈরি হয়ে যাবে।
                  </p>
                </div>
              ) : null}

              {/* Optional PIN / OTP verification */}
              <div className="pt-1">
                {!showPinInput ? (
                  <button
                    type="button"
                    onClick={() => setShowPinInput(true)}
                    className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>পাসওয়ার্ড / নিরাপত্তা পিন দিতে চান?</span>
                  </button>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      পাসওয়ার্ড বা ৪ ডিজিট পিন (ঐচ্ছিক)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  অ্যাডমিন ইউজারনেম বা ইমেইল *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  পাসওয়ার্ড / নিরাপত্তা পিন *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="admin123"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Admin helper hint */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">সিস্টেম অ্যাডমিন অ্যাক্সেস:</div>
                  <div className="text-[11px] text-blue-700 font-mono">
                    ইউজারনেম: <span className="font-bold">admin</span> · পাসওয়ার্ড: <span className="font-bold">admin123</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              activeRole === 'admin' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
          </button>
        </form>

        {/* Bottom helper */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>এখনও রক্তদাতা হিসেবে নিবন্ধিত নন? </span>
          <Link to="/become-donor" className="text-rose-600 font-bold hover:underline">
            রক্তদাতা হিসেবে যুক্ত হোন
          </Link>
        </div>

      </div>

    </div>
  );
};
