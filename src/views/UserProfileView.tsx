import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Droplet, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Heart, 
  LogOut, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Edit3
} from 'lucide-react';
import { User as UserType, BloodRequest, Donor } from '../types';
import { SEO } from '../components/SEO';

interface UserProfileViewProps {
  currentUser: UserType;
  requests: BloodRequest[];
  donors: Donor[];
  onLogout: () => void;
  onUpdateAvailability?: (status: 'available' | 'unavailable') => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  requests,
  donors,
  onLogout,
  onUpdateAvailability
}) => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Clean phone matching
  const cleanPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');

  // Find linked donor record if exists
  const matchingDonor = donors.find(d => {
    const dPhone = (d.phone || '').replace(/[^0-9]/g, '');
    return (
      (cleanPhone && dPhone && (dPhone === cleanPhone || (dPhone.length === 11 && cleanPhone.length === 11 && dPhone.endsWith(cleanPhone.slice(-10))))) ||
      d.id === currentUser.id ||
      d.userId === currentUser.id
    );
  });

  const isRegisteredDonor = Boolean(matchingDonor);
  const bloodGroup = matchingDonor?.bloodGroup || 'অনির্ধারিত';
  const donationCount = matchingDonor?.donationCount || 0;
  const lastDonation = matchingDonor?.lastDonationDate || 'এখনও রক্তদান করেননি';

  const userRequests = requests.filter(r => 
    (cleanPhone && (r.requesterPhone || '').replace(/[^0-9]/g, '') === cleanPhone) ||
    r.userId === currentUser.id ||
    r.requesterName === currentUser.name
  );

  const handleToggleAvailability = () => {
    const nextStatus = !isAvailable;
    setIsAvailable(nextStatus);
    if (onUpdateAvailability) {
      onUpdateAvailability(nextStatus ? 'available' : 'unavailable');
    }
    setToast(nextStatus ? 'আপনার প্রাপ্যতা: রক্তদানে প্রস্তুত' : 'আপনার প্রাপ্যতা: বিশ্রামে আছেন');
    setTimeout(() => setToast(null), 3000);
  };

  const userDistrict = matchingDonor?.districtName || currentUser.districtName || 'বাংলাদেশ';
  const userUpazila = matchingDonor?.upazilaName || currentUser.upazilaName || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <SEO
        title={`আমার প্রোফাইল (${currentUser.name})`}
        description="তথ্যহাব ব্লাড ব্যক্তিগত ইউজার প্রোফাইল। আপনার রক্তদান হিস্ট্রি, প্রাপ্যতা এবং সক্রিয় রক্তের অনুরোধ পর্যবেক্ষণ করুন।"
        canonical="https://blood.totthohub.com/profile"
      />
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner */}
        <div className="h-24 sm:h-28 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 relative" />

        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 sm:-mt-12 mb-6 gap-4">
            
            {/* Avatar & Name */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                {matchingDonor?.imageUrl ? (
                  <img
                    src={matchingDonor.imageUrl}
                    alt={currentUser.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-rose-50 border-4 border-white shadow-md flex items-center justify-center text-rose-600 text-2xl sm:text-3xl font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                {isRegisteredDonor && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-xs" title="ভেরিফাইড প্রোফাইল">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                    {currentUser.name}
                  </h1>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{userUpazila ? `${userUpazila}, ` : ''}{userDistrict}</span>
                </div>
              </div>
            </div>

            {/* Blood Group & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center font-black shadow-sm shrink-0">
                <span className="text-base sm:text-lg leading-none">{isRegisteredDonor ? bloodGroup : '?'}</span>
                <span className="text-[9px] sm:text-[10px] font-normal opacity-90">গ্রুপ</span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                title="লগআউট"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>

          {/* Prompt to Become Donor if not registered yet */}
          {!isRegisteredDonor && (
            <div className="mb-6 p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-rose-900">
                  রক্তদাতা প্রোফাইল সম্পূর্ণ করুন
                </div>
                <p className="text-slate-600 text-[11px]">
                  আপনার রক্তের গ্রুপ ও এলাকা তালিকাভুক্ত করে জরুরি সেবায় অংশ নিন।
                </p>
              </div>
              <Link
                to="/become-donor"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl whitespace-nowrap shadow-xs"
              >
                রক্তদাতা হোন
              </Link>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">রক্তদানের প্রাপ্যতা</span>
              {isRegisteredDonor ? (
                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  className={`font-semibold cursor-pointer hover:underline flex items-center gap-1 ${
                    isAvailable ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  <span>{isAvailable ? '🟢 রক্তদানে প্রস্তুত' : '🟡 বিশ্রামে আছেন'}</span>
                  <Edit3 className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <span className="text-slate-500">নিবন্ধন আবশ্যক</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">মোট রক্তদান</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {donationCount > 0 ? `${donationCount} বার রক্ত দিয়েছেন` : '০ বার'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">সর্বশেষ রক্তদান</span>
              <span className="font-medium text-slate-800 font-mono tabular-nums">
                {lastDonation}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">প্রোফাইল স্ট্যাটাস</span>
              <span className={`font-semibold ${isRegisteredDonor ? 'text-emerald-700' : 'text-slate-600'}`}>
                {isRegisteredDonor ? '✓ যাচাইকৃত রক্তদাতা' : 'সাধারণ ব্যবহারকারী'}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">মোবাইল নম্বর</span>
                <span className="font-semibold text-slate-800 font-mono">{currentUser.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px]">ইমেইল ঠিকানা</span>
                <span className="font-semibold text-slate-800">{currentUser.email || 'তথ্য দেওয়া হয়নি'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 flex flex-wrap gap-3">
            <Link
              to="/request-blood"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>রক্তের অনুরোধ করুন</span>
            </Link>

            <Link
              to="/donors"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
            >
              <Droplet className="w-4 h-4 text-rose-600" />
              <span>রক্তদাতা তালিকায় খুঁজুন</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <span>ড্যাশবোর্ডে যান</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Voluntary Blood Donor Digital ID Card */}
      {isRegisteredDonor && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-rose-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                ডিজিটাল রক্তদাতা সম্মাননা কার্ড
              </span>
            </div>
            <span className="text-[11px] font-mono text-rose-300">
              ID: THB-{currentUser.phone.slice(-6)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div>
              <h3 className="text-xl font-bold">{currentUser.name}</h3>
              <p className="text-xs text-rose-200 mt-0.5">
                স্বেচ্ছাসেবী মানবিক রক্তদাতা · তথ্যহাব ব্লাড পরিবার
              </p>
              <p className="text-[11px] text-rose-300 mt-2">
                অবস্থান: {userUpazila ? `${userUpazila}, ` : ''}{userDistrict}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-rose-200 block">রক্তের গ্রুপ</span>
              <span className="text-3xl font-black text-white">{bloodGroup}</span>
            </div>
          </div>
        </div>
      )}

      {/* My Blood Requests Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <span>আমার রক্তের অনুরোধসমূহ</span>
          </h2>
          <Link
            to="/request-blood"
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            + নতুন অনুরোধ
          </Link>
        </div>

        {userRequests.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            আপনি এখনও কোনো রক্তের অনুরোধ করেননি। জরুরি প্রয়োজনে সহজেই অনুরোধ করতে পারেন।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {userRequests.map(req => (
              <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{req.patientName}</span>
                    <span className="text-rose-600 font-extrabold font-mono">({req.bloodGroup})</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                      {req.units} ব্যাগ
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {req.hospitalName} ({req.upazilaName}, {req.districtName}) · {req.neededDate}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    req.status === 'fulfilled'
                      ? 'bg-emerald-50 text-emerald-700'
                      : req.status === 'matched'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {req.status === 'fulfilled' ? 'সম্পন্ন' : req.status === 'matched' ? 'ম্যাচড' : 'খোঁজা হচ্ছে'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
