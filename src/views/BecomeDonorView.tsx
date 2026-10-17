import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Droplet,
  Send,
  LayoutDashboard
} from 'lucide-react';
import { BloodGroup, Donor, User } from '../types';
import { DISTRICTS } from '../data/seedData';
import { cleanBangladeshiPhone } from './LoginView';

interface BecomeDonorViewProps {
  onRegisterDonor: (newDonor: Donor) => void;
  onNavigateDonors: () => void;
  onAutoLogin?: (user: User) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BecomeDonorView: React.FC<BecomeDonorViewProps> = ({
  onRegisterDonor,
  onNavigateDonors,
  onAutoLogin
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [districtId, setDistrictId] = useState('cox-bazar');
  const [upazilaName, setUpazilaName] = useState('Ramu');
  const [area, setArea] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [donationCount, setDonationCount] = useState(1);
  const [bio, setBio] = useState('');
  const [isAvailableForEmergency, setIsAvailableForEmergency] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const currentDistrict = DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Normalizing phone
    const cleanedPhone = cleanBangladeshiPhone(phone);

    const newDonor: Donor = {
      id: `donor-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name,
      username: name.toLowerCase().replace(/[^a-z0-9]/g, '_') + `_${Math.floor(Math.random() * 1000)}`,
      phone: cleanedPhone,
      email: email || `${cleanedPhone}@donor.totthohub.com`,
      bloodGroup,
      gender,
      districtId,
      districtName: currentDistrict.name,
      upazilaId: upazilaName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      upazilaName,
      area: area || `${upazilaName}, ${currentDistrict.name}`,
      availability: 'available',
      lastDonationDate: lastDonationDate || '২০২৬-০৫-০১',
      donationCount: donationCount || 1,
      verificationStatus: 'phone_verified',
      bio: bio || 'জরুরি প্রয়োজনে রোগীদের রক্তদানে প্রস্তুত স্বেচ্ছাসেবী রক্তদাতা।',
      isAvailableForEmergency,
      totalHelpedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onRegisterDonor(newDonor);

    if (onAutoLogin) {
      const donorUser: User = {
        id: newDonor.userId,
        uuid: `uuid-donor-${cleanedPhone}`,
        name: newDonor.name,
        username: newDonor.username,
        email: newDonor.email,
        phone: newDonor.phone,
        role: 'donor',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        districtId: newDonor.districtId,
        upazilaId: newDonor.upazilaId,
        districtName: newDonor.districtName,
        upazilaName: newDonor.upazilaName,
        createdAt: newDonor.createdAt,
        updatedAt: newDonor.updatedAt
      };
      onAutoLogin(donorUser);
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          <span>স্বেচ্ছাসেবী রেজিস্ট্রেশন</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          রক্তদাতা হিসেবে যুক্ত হোন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          আপনার এলাকার রোগীদের জীবন বাঁচাতে এগিয়ে আসুন। রক্তদাতার ব্যক্তিগত তথ্যের পূর্ণ সুরক্ষা বজায় রাখা হয়।
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">তথ্যহাব ব্লাড পরিবারে আপনাকে স্বাগতম!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {upazilaName}, {currentDistrict.name}-এ <strong>{bloodGroup}</strong> গ্রুপের একজন স্বেচ্ছাসেবী রক্তদাতা হিসেবে আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে।
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>আমার ড্যাশবোর্ডে প্রবেশ করুন</span>
              </Link>
              <button
                onClick={onNavigateDonors}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                রক্তদাতা তালিকা দেখুন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ০১. ব্যক্তিগত পরিচয়
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো. রহিম উল্লাহ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নম্বর (১১ ডিজিট) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg} রক্ত গ্রুপ</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">লিঙ্গ</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="male">পুরুষ (Male)</option>
                    <option value="female">নারী (Female)</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Location */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ০২. বর্তমান ঠিকানা ও এলাকা
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জেলা *</label>
                  <select
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                      const d = DISTRICTS.find(dist => dist.id === e.target.value);
                      if (d && d.upazilas.length > 0) setUpazilaName(d.upazilas[0]);
                    }}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.bangla})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">উপজেলা *</label>
                  <select
                    value={upazilaName}
                    onChange={(e) => setUpazilaName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    {currentDistrict.upazilas.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্রাম / পাড়া / এলাকা</label>
                <input
                  type="text"
                  placeholder="যেমন: রামু চৌমুহনী, ফটিকছড়ি রোড"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* 3. Donation History */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ০৩. রক্তদানের পূর্ব অভিজ্ঞতা
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোট রক্তদানের সংখ্যা</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={donationCount}
                    onChange={(e) => setDonationCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">রক্তদাতা সম্পর্কে সংক্ষিপ্ত তথ্য</label>
                <textarea
                  rows={2}
                  placeholder="আপনার প্রাপ্যতা, কলেজ, বিশ্ববিদ্যালয় বা কোনো বার্তা লিখতে পারেন..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isAvailableForEmergency}
                  onChange={(e) => setIsAvailableForEmergency(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
                <span className="font-semibold text-slate-800">
                  আমার উপজেলায় জরুরি জীবন-ঝুঁকিপূর্ণ পরিস্থিতিতে জরুরি কলের অনুমতি দিচ্ছি
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>স্বেচ্ছাসেবী রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করুন</span>
            </button>

          </form>
        )}
      </div>

    </div>
  );
};
