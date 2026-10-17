import React, { useState, useEffect } from 'react';
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
  LogOut
} from 'lucide-react';
import { User as UserType } from '../types';
import { getStoredDonors } from '../services/storageService';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
  currentUser: UserType | null;
  onLogout?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLoginSuccess, 
  currentUser,
  onLogout 
}) => {
  const { roleParam } = useParams<{ roleParam?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '';

  // Role can only be 'user' or 'admin'
  const getInitialRole = (): 'user' | 'admin' => {
    if (roleParam === 'admin') return 'admin';
    return 'user';
  };

  const [activeRole, setActiveRole] = useState<'user' | 'admin'>(getInitialRole());
  const [phone, setPhone] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      let cleanedPhone = phone.trim().replace(/[\s\-]/g, '');
      if (cleanedPhone.startsWith('+880')) cleanedPhone = '0' + cleanedPhone.substring(4);
      if (!cleanedPhone.startsWith('01') || cleanedPhone.length !== 11) {
        setError('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01812345678)');
        setIsSubmitting(false);
        return;
      }

      // Check if phone matches an existing donor
      const allDonors = getStoredDonors();
      const matchedDonor = allDonors.find(d => d.phone.replace(/[\s\-]/g, '') === cleanedPhone);

      const loggedUser: UserType = {
        id: matchedDonor ? matchedDonor.userId || `user-${matchedDonor.id}` : `user-${Date.now()}`,
        uuid: `uuid-user-${cleanedPhone}`,
        name: matchedDonor ? matchedDonor.name : 'রক্তদাতা ও সদস্য',
        username: matchedDonor ? matchedDonor.username : `user_${cleanedPhone.slice(-4)}`,
        email: matchedDonor?.email || `${cleanedPhone}@user.totthohub.com`,
        phone: cleanedPhone,
        role: 'user',
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
      setSuccessMsg('সফলভাবে লগইন হয়েছে! পাঠানো হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess(loggedUser);
        navigate(destination);
      }, 500);
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
        setError('অ্যাডমিন পাসওয়ার্ড বা পিন প্রদান করুন।');
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
      setSuccessMsg('অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
      setTimeout(() => {
        onLoginSuccess(adminUser);
        navigate(destination);
      }, 500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
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
              ? 'রক্তদাতা ও রক্তের অনুরোধ ব্যবস্থাপনা ও ভেরিফিকেশন প্যানেল' 
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
              <span>আপনি ইতিমধ্যে লগইন আছেন: {currentUser.name}</span>
            </div>
            <p className="text-emerald-700 text-[11px]">
              রোল: <span className="font-semibold uppercase">{currentUser.role === 'admin' ? 'অ্যাডমিন' : 'ব্যবহারকারী'}</span>
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
            ব্যবহারকারী
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                মোবাইল নম্বর (১১ ডিজিট) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                আপনার নিবন্ধিত ফোন নম্বর দিলে পূর্বের রক্তদান ইতিহাস যুক্ত থাকবে।
              </p>
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
                    placeholder="admin@totthohub.com"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
            <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
          </button>
        </form>

        {/* Bottom helper */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>এখনও রক্তদাতা হিসেবে নিবন্ধিত নন? </span>
          <Link to="/become-donor" className="text-rose-600 font-bold hover:underline">
            রক্তদাতা হোন
          </Link>
        </div>

      </div>

    </div>
  );
};
