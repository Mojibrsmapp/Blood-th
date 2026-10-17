import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Droplet, 
  Search, 
  AlertCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Building,
  Quote,
  ShieldAlert,
  Heart,
  PlusCircle,
  PhoneCall,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle,
  Activity,
  CheckCircle2,
  Share2,
  Hospital
} from 'lucide-react';
import { BloodGroup, Donor, BloodRequest, Campaign, Organization } from '../types';
import { DISTRICTS } from '../data/seedData';

interface HomeViewProps {
  donors: Donor[];
  requests: BloodRequest[];
  campaigns: Campaign[];
  organizations: Organization[];
  stats: {
    registeredDonors: number;
    activeDonors: number;
    bloodRequests: number;
    successfulConnections: number;
    organizations: number;
    volunteers: number;
  };
  onSelectDonor?: (donor: Donor) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const GROUP_TO_SLUG: Record<string, string> = {
  'A+': 'a-positive',
  'A-': 'a-negative',
  'B+': 'b-positive',
  'B-': 'b-negative',
  'O+': 'o-positive',
  'O-': 'o-negative',
  'AB+': 'ab-positive',
  'AB-': 'ab-negative'
};

// Divisions in Bangladesh mapped to District IDs
const DIVISIONS = [
  { id: 'chittagong', name: 'চট্টগ্রাম বিভাগ', districtIds: ['chattogram', 'cox-bazar', 'cumilla', 'lakshmipur', 'noakhali', 'feni', 'brahmanbaria', 'chandpur', 'khagrachhari', 'bandarban', 'rangamati'] },
  { id: 'dhaka', name: 'ঢাকা বিভাগ', districtIds: ['dhaka', 'gazipur', 'narayanganj', 'tangail'] },
  { id: 'mymensingh', name: 'ময়মনসিংহ বিভাগ', districtIds: ['mymensingh', 'sherpur', 'jamalpur'] },
  { id: 'sylhet', name: 'সিলেট বিভাগ', districtIds: ['sylhet'] },
  { id: 'rajshahi', name: 'রাজশাহী বিভাগ', districtIds: ['rajshahi', 'pabna'] },
  { id: 'rangpur', name: 'রংপুর বিভাগ', districtIds: ['rangpur', 'dinajpur', 'kurigram'] },
  { id: 'khulna', name: 'খুলনা বিভাগ', districtIds: ['khulna', 'jashore'] },
  { id: 'barishal', name: 'বরিশাল বিভাগ', districtIds: ['barishal'] }
];

export const HomeView: React.FC<HomeViewProps> = ({
  donors,
  requests,
  campaigns,
  organizations,
  stats,
  onSelectDonor
}) => {
  const navigate = useNavigate();

  // Filter state for Section 5
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');

  // FAQ Accordion State for Section 18
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Filter districts based on selected division
  const availableDistricts = useMemo(() => {
    if (!selectedDivision) return DISTRICTS;
    const div = DIVISIONS.find(d => d.id === selectedDivision);
    if (!div) return DISTRICTS;
    return DISTRICTS.filter(d => div.districtIds.includes(d.id));
  }, [selectedDivision]);

  // Filter upazilas based on selected district
  const availableUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];
    const dist = DISTRICTS.find(d => d.id === selectedDistrict);
    return dist ? dist.upazilas : [];
  }, [selectedDistrict]);

  // Featured donors: 4-6 donors prioritizing available and real photos
  const featuredDonors = useMemo(() => {
    return [...donors]
      .sort((a, b) => {
        const aImg = (a.imageUrl && a.imageUrl.length > 5) ? 1 : 0;
        const bImg = (b.imageUrl && b.imageUrl.length > 5) ? 1 : 0;
        if (aImg !== bImg) return bImg - aImg;
        const aAvail = a.availability === 'available' ? 1 : 0;
        const bAvail = b.availability === 'available' ? 1 : 0;
        if (aAvail !== bAvail) return bAvail - aAvail;
        return (b.donationCount || 0) - (a.donationCount || 0);
      })
      .slice(0, 6);
  }, [donors]);

  // Filter submit handler
  const handleDonorFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup && !selectedDistrict && !selectedUpazila) {
      const slug = GROUP_TO_SLUG[selectedGroup];
      if (slug) {
        navigate(`/donors/${slug}`);
        return;
      }
    }
    const params = new URLSearchParams();
    if (selectedGroup) params.set('group', selectedGroup);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (selectedUpazila) params.set('upazila', selectedUpazila);
    navigate(`/donors?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      
      {/* ========================================================
          ২. Hero Section
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/80 via-white to-slate-50/60 pt-10 sm:pt-16 pb-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-semibold">
              <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>তথ্যহাব ব্লাড · রক্ত দিন, জীবন বাঁচান</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              এক ব্যাগ রক্ত, একটি জীবনের আশার আলো
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              প্রয়োজনের সময়ে কাছাকাছি সম্ভাব্য রক্তদাতার কাছে পৌঁছাতে তথ্যহাব ব্লাডের মাধ্যমে রক্ত খুঁজুন, রক্তের অনুরোধ করুন এবং স্বেচ্ছায় রক্তদাতা হিসেবে যুক্ত হোন।
            </p>

            {/* Two Primary Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/donors"
                className="w-full sm:w-auto px-7 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Droplet className="w-5 h-5 fill-white" />
                <span>রক্তদাতা খুঁজুন</span>
              </Link>

              <Link
                to="/request-blood"
                className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5 text-rose-600" />
                <span>রক্তের অনুরোধ করুন</span>
              </Link>
            </div>

            {/* Urgent Notice Line */}
            <div className="pt-6 border-t border-slate-200/80 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs text-slate-600">
              <span className="font-medium text-slate-700">জরুরি রক্ত প্রয়োজন? দ্রুত একটি জরুরি রক্তের অনুরোধ তৈরি করুন।</span>
              <Link
                to="/emergency"
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>জরুরি রক্ত প্রয়োজন</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          ৩. দ্রুত সেবা (Quick Services - ৪টি বড় Card)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: রক্ত খুঁজুন */}
          <Link 
            to="/donors"
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-rose-600 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                রক্ত খুঁজুন
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার প্রয়োজনীয় রক্তের গ্রুপের সম্ভাব্য রক্তদাতা খুঁজুন।
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
              <span>দাতা তালিকা দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: রক্তের অনুরোধ */}
          <Link 
            to="/request-blood"
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                📢
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                রক্তের অনুরোধ
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                রক্তের প্রয়োজন জানিয়ে একটি অনুরোধ তৈরি করুন।
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
              <span>অনুরোধ তৈরি করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: রক্তদাতা হোন */}
          <Link 
            to="/become-donor"
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                ❤️
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                রক্তদাতা হোন
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার রক্ত কারও কঠিন সময়ে আশার কারণ হতে পারে।
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
              <span>নিবন্ধন করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: জরুরি রক্ত */}
          <Link 
            to="/emergency"
            className="group cursor-pointer bg-red-50/70 p-6 rounded-3xl border border-red-200 hover:border-red-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-xs">
                🚨
              </div>
              <h3 className="text-lg font-bold text-red-950">
                জরুরি রক্ত
              </h3>
              <p className="text-xs text-red-800 leading-relaxed">
                জরুরি প্রয়োজনের জন্য দ্রুত অনুরোধ তৈরি করুন।
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-red-700 flex items-center gap-1">
              <span>জরুরি ডেসপ্যাচ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* ========================================================
          ৪. Live Statistics (Database থেকে Dynamic, কোনো Fake Number নয়)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
          
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              আমাদের রক্তদাতা পরিবার
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              লাইভ ডাটাবেজ অনুযায়ী সক্রিয় সদস্য ও মানবিক সেবার পরিসংখ্যান
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
            
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                {stats.registeredDonors}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                নিবন্ধিত রক্তদাতা
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                {stats.activeDonors}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                সক্রিয় রক্তদাতা
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono tabular-nums">
                {stats.bloodRequests}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                রক্তের অনুরোধ
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
                {stats.successfulConnections}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                সম্পন্ন সংযোগ
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono tabular-nums">
                {stats.volunteers}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                স্বেচ্ছাসেবক
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tabular-nums">
                {stats.organizations}+
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                সংগঠন
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ৫. রক্তদাতা খুঁজুন (Filter ও ৪-৬টি Donor Card)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আপনার প্রয়োজনের রক্তদাতা খুঁজুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            রক্তের গ্রুপ ও অবস্থান নির্বাচন করে আপনার কাছাকাছি সম্ভাব্য রক্তদাতাদের খুঁজে দেখুন।
          </p>
        </div>

        {/* Filter Form */}
        <form 
          onSubmit={handleDonorFilterSubmit}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* রক্তের গ্রুপ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                রক্তের গ্রুপ
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">সকল গ্রুপ</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg} রক্ত গ্রুপ</option>
                ))}
              </select>
            </div>

            {/* বিভাগ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                বিভাগ
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict('');
                  setSelectedUpazila('');
                }}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">সকল বিভাগ</option>
                {DIVISIONS.map(div => (
                  <option key={div.id} value={div.id}>{div.name}</option>
                ))}
              </select>
            </div>

            {/* জেলা */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                জেলা
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila('');
                }}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">সকল জেলা</option>
                {availableDistricts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.bangla})</option>
                ))}
              </select>
            </div>

            {/* উপজেলা */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                উপজেলা
              </label>
              <select
                value={selectedUpazila}
                disabled={!selectedDistrict}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
              >
                <option value="">সকল উপজেলা / এলাকা</option>
                {availableUpazilas.map(up => (
                  <option key={up} value={up}>{up}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>🔎 রক্তদাতা খুঁজুন</span>
            </button>
          </div>
        </form>

        {/* ৪-৬টি Donor Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredDonors.map(donor => {
            const isAvailable = donor.availability === 'available';
            return (
              <div 
                key={donor.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top: Avatar, Name, Blood Group */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0">
                        {donor.imageUrl ? (
                          <img
                            src={donor.imageUrl}
                            alt={donor.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.avatar-box-fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`avatar-box-fallback w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-200 shrink-0 ${donor.imageUrl ? 'hidden' : ''}`}>
                          {donor.name.charAt(0)}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                          {donor.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5" title={donor.area}>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[170px] sm:max-w-[200px]">{donor.area || `${donor.upazilaName}, ${donor.districtName}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  {/* Status & Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className={isAvailable ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-medium'}>
                      {isAvailable ? '🟢 বর্তমানে উপলভ্য' : '🟡 বিশ্রামে আছেন'}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ যাচাইকৃত</span>
                    </span>
                  </div>
                </div>

                {/* Profile View Button */}
                <Link
                  to={`/donor/${donor.id}`}
                  onClick={() => onSelectDonor && onSelectDonor(donor)}
                  className="w-full py-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-center block"
                >
                  প্রোফাইল দেখুন
                </Link>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          ৬. Blood Group Grid (৮টি সুন্দর Card -> /donors/:slug)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আপনার প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করুন
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            গ্রুপ নির্বাচন করে সরাসরি সংশ্লিষ্ট গ্রুপের সক্রিয় রক্তদাতাদের তালিকা দেখুন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {BLOOD_GROUPS.map(bg => {
            const count = donors.filter(d => d.bloodGroup === bg).length;
            const slug = GROUP_TO_SLUG[bg] || 'a-positive';
            return (
              <Link
                key={bg}
                to={`/donors/${slug}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center space-y-2 block"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 group-hover:bg-rose-600 text-rose-600 group-hover:text-white flex items-center justify-center font-black text-lg transition-colors shadow-xs">
                  {bg}
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {bg} রক্ত
                </div>
                <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {count} জন দাতা
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          ৭. জরুরি রক্তের Section (লাল / গাঢ় Crimson Section)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>জরুরি ডেসপ্যাচ হেল্পডেস্ক</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              🚨 জরুরি রক্ত প্রয়োজন?
            </h2>

            <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
              দুর্ঘটনা, অপারেশন বা অন্য কোনো জরুরি চিকিৎসা পরিস্থিতিতে রক্তের প্রয়োজন হলে দ্রুত একটি অনুরোধ তৈরি করুন। তথ্যহাব ব্লাড সম্ভাব্য রক্তদাতাদের কাছে আপনার অনুরোধ পৌঁছাতে সহায়তা করবে।
            </p>

            <div className="pt-2">
              <Link
                to="/request-blood"
                className="px-6 py-3 bg-white hover:bg-rose-50 text-red-700 font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>এখনই রক্তের অনুরোধ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-rose-200/90 leading-normal pt-2 border-t border-rose-500/40">
              * গুরুতর বা জীবন-ঝুঁকিপূর্ণ পরিস্থিতিতে অনুগ্রহ করে সরাসরি হাসপাতাল বা জরুরি চিকিৎসা সেবার সঙ্গে যোগাযোগ করুন।
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none hidden md:block">
            <Droplet className="w-96 h-96 fill-white" />
          </div>

        </div>
      </section>

      {/* ========================================================
          ৮. কীভাবে কাজ করে? (তিনটি সহজ ধাপে)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-100/70 rounded-3xl border border-slate-200">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            কীভাবে কাজ করে?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            তিনটি সহজ ধাপে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-xs font-black text-rose-600 tracking-wider">ধাপ ০১</div>
            <h3 className="text-lg font-bold text-slate-900">
              ১. 🔎 খুঁজুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              প্রয়োজনীয় রক্তের গ্রুপ ও অবস্থান নির্বাচন করে সম্ভাব্য রক্তদাতা খুঁজুন।
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-xs font-black text-rose-600 tracking-wider">ধাপ ০২</div>
            <h3 className="text-lg font-bold text-slate-900">
              ২. 🤝 যোগাযোগ করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              উপযুক্ত রক্তদাতার সঙ্গে যোগাযোগের অনুরোধ পাঠান।
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="text-xs font-black text-rose-600 tracking-wider">ধাপ ০৩</div>
            <h3 className="text-lg font-bold text-slate-900">
              ৩. ❤️ সাহায্য করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              সম্ভব হলে রক্তদাতা রোগীর পাশে দাঁড়ান।
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================
          ৯. সাম্প্রতিক রক্তের অনুরোধ (যাদের রক্ত প্রয়োজন)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              যাদের রক্ত প্রয়োজন
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              সাম্প্রতিক রক্তের অনুরোধসমূহ · জরুরি সহায়তার জন্য এগিয়ে আসুন
            </p>
          </div>

          <Link
            to="/emergency"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <span>সব রক্তের অনুরোধ দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.slice(0, 4).map(req => {
            const isCritical = req.urgency === 'critical';
            return (
              <div 
                key={req.id} 
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-black flex items-center justify-center text-base border border-rose-100 shrink-0">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isCritical ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isCritical ? '🚨 জরুরি' : '🩸 নিয়মিত'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {req.bloodGroup} রক্ত প্রয়োজন
                        </h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        রোগী: <span className="font-medium text-slate-700">{req.patientName.replace(/[A-Za-z0-9]/g, '*')}</span> · হাসপাতাল: {req.hospitalName}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-xl shrink-0">
                    {req.units} ব্যাগ
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>প্রয়োজনের সময়: {req.neededDate}</span>
                  </span>

                  <Link
                    to="/emergency"
                    className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <span>অনুরোধ দেখুন →</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/emergency"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-block"
          >
            সব রক্তের অনুরোধ দেখুন
          </Link>
        </div>

      </section>

      {/* ========================================================
          ১০. রক্তদাতা হওয়ার Section
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আপনার এক ব্যাগ রক্ত কারও জন্য নতুন আশার শুরু হতে পারে
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            আপনি যদি রক্তদানের জন্য উপযুক্ত হন, তাহলে আজই তথ্যহাব ব্লাডের রক্তদাতা তালিকায় যুক্ত হতে পারেন।
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/become-donor"
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>❤️ রক্তদাতা হিসেবে যুক্ত হোন</span>
            </Link>

            <Link
              to="/donors"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-colors inline-block text-center"
            >
              আমি ইতিমধ্যে রক্তদাতা
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          ১১. কেন তথ্যহাব ব্লাড? (চারটি Feature)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            কেন তথ্যহাব ব্লাড?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            শুধু একটি ওয়েবসাইট নয়, একটি মানবিক সংযোগ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900">
              সহজে রক্ত খোঁজা
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              রক্তের গ্রুপ ও অবস্থান অনুযায়ী সম্ভাব্য রক্তদাতা খুঁজে পাওয়া।
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
              📍
            </div>
            <h3 className="text-base font-bold text-slate-900">
              অবস্থানভিত্তিক অনুসন্ধান
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              বিভাগ, জেলা ও উপজেলা অনুযায়ী donor search।
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
              🔐
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ব্যক্তিগত তথ্যের সুরক্ষা
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              রক্তদাতার প্রয়োজনীয় তথ্য ছাড়া অপ্রয়োজনীয় ব্যক্তিগত তথ্য প্রকাশ করা হবে না।
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
              🤝
            </div>
            <h3 className="text-base font-bold text-slate-900">
              স্বেচ্ছাসেবী সংযোগ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              রক্তদাতা, রোগীর স্বজন, স্বেচ্ছাসেবক ও সংগঠনকে একটি প্ল্যাটফর্মে যুক্ত করা।
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================
          ১২. ⭐ Founder Message (প্রতিষ্ঠাতার বার্তা)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Founder Image / Portrait */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-800 shrink-0">
                <img
                  src="https://bloodhelpbd.com/uploads/profiles/profile_1791030432_fba1c5db0eb8a920.jpg"
                  alt="মুজিবুর রহমান - প্রতিষ্ঠাতা"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.founder-img-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="founder-img-fallback w-full h-full bg-gradient-to-tr from-rose-900 to-slate-800 flex items-center justify-center text-4xl font-extrabold text-white hidden">
                  MR
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                  মুজিবুর রহমান
                </h3>
                <div className="text-xs text-rose-400 font-medium">
                  প্রতিষ্ঠাতা, TotthoHub Blood
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  তথ্যপ্রযুক্তি উদ্যোক্তা ও সমাজকর্মী
                </div>
              </div>
            </div>

            {/* Founder Message Content */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
                <Quote className="w-5 h-5" />
                <span>প্রতিষ্ঠাতার বার্তা</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                মানুষের প্রয়োজনে মানুষই সবচেয়ে বড় শক্তি
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  রক্তের প্রয়োজন কখনও বলে আসে না। একটি দুর্ঘটনা, একটি অপারেশন, একজন মায়ের প্রসবকালীন জটিলতা কিংবা কোনো অসুস্থ মানুষের চিকিৎসায় হঠাৎ করেই রক্তের প্রয়োজন হতে পারে।
                </p>
                <p>
                  সেই কঠিন সময়ে প্রয়োজন হয় একজন উপযুক্ত রক্তদাতার। কিন্তু অনেক সময় রক্তদাতা আমাদের আশেপাশেই থাকেন, শুধু প্রয়োজনের মুহূর্তে তাকে খুঁজে পাওয়া যায় না।
                </p>
                <p>
                  এই জায়গা থেকেই TotthoHub Blood-এর পথচলা।
                </p>
                <p>
                  আমাদের লক্ষ্য হলো প্রযুক্তির মাধ্যমে রক্তদাতা ও রক্তের প্রয়োজন থাকা মানুষদের মধ্যে একটি সহজ, দ্রুত এবং দায়িত্বশীল যোগাযোগের সুযোগ তৈরি করা।
                </p>
                <p>
                  আমরা বিশ্বাস করি, একজন মানুষের ছোট একটি উদ্যোগ অন্য একজন মানুষের জন্য বড় আশার কারণ হতে পারে।
                </p>
                <p className="text-rose-200 font-medium">
                  আপনি রক্ত দিতে পারলে একজন রক্তদাতা হোন। প্রয়োজন হলে রক্তের অনুরোধ করুন। আর সম্ভব হলে অন্য একজনকে এই উদ্যোগের সঙ্গে যুক্ত করুন।
                </p>
                <p>
                  মানুষের প্রয়োজনে মানুষের পাশে দাঁড়ানোর এই যাত্রায় আপনিও আমাদের সঙ্গে থাকুন।
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>আমাদের উদ্যোগ সম্পর্কে বিস্তারিত জানুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          ১৩. রক্তদান ক্যাম্প (রক্তদান ক্যাম্প ও মানবিক কার্যক্রম)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              রক্তদান ক্যাম্প ও মানবিক কার্যক্রম
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              কমিউনিটি রক্তদান কর্মসূচি ও রক্তদাতা নিবন্ধন ড্রাইভ
            </p>
          </div>

          <Link
            to="/campaigns"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <span>সব ক্যাম্প দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.slice(0, 2).map((camp, idx) => (
            <div 
              key={camp.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {idx === 0 ? 'স্বেচ্ছায় রক্তদান কর্মসূচি' : 'রক্তদাতা নিবন্ধন ক্যাম্প'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {camp.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>স্থান:</strong> {camp.venue}, {camp.districtName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>তারিখ:</strong> {camp.date} · {camp.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>আয়োজক:</strong> {camp.organizerName}</span>
                </div>
              </div>

              <Link
                to="/campaigns"
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors block text-center"
              >
                বিস্তারিত দেখুন
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          ১৪. সংগঠন Section (আমাদের সঙ্গে যুক্ত সংগঠনসমূহ)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              আমাদের সঙ্গে যুক্ত সংগঠনসমূহ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              রক্তদান সংগঠন, সামাজিক সংগঠন, শিক্ষাপ্রতিষ্ঠান ও স্বেচ্ছাসেবী সংগঠন
            </p>
          </div>

          <Link
            to="/organizations"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <span>সব সংগঠন দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.slice(0, 3).map(org => (
            <div 
              key={org.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl border border-rose-100 shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {org.name}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{org.districtName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>সদস্য: {org.activeVolunteersCount}+ জন</span>
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>যাচাইকৃত</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================
          ১৫. স্বেচ্ছাসেবক Section (আপনিও হতে পারেন একজন স্বেচ্ছাসেবক)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>স্বেচ্ছাসেবী সমন্বয় নেটওয়ার্ক</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              আপনিও হতে পারেন একজন স্বেচ্ছাসেবক
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              রক্তদাতা খোঁজা, রক্তের অনুরোধ পৌঁছে দেওয়া, ক্যাম্প পরিচালনা কিংবা জরুরি সময়ে সমন্বয়ে আপনিও ভূমিকা রাখতে পারেন।
            </p>
          </div>

          <Link
            to="/volunteer"
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>স্বেচ্ছাসেবক হিসেবে যুক্ত হোন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          ১৬. সফলতার গল্প (একটি রক্তের অনুরোধ, একটি আশার গল্প)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            একটি রক্তের অনুরোধ, একটি আশার গল্প
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            জরুরি সময়ে মানুষের পাশে মানুষের দাঁড়ানোর বাস্তব মুহূর্ত
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <span>❤️ পাশে দাঁড়িয়েছিলেন কয়েকজন মানুষ</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              জরুরি সময়ে কক্সবাজার সদর হাসপাতালে প্রয়োজন ছিল O+ রক্ত। তথ্যহাব ব্লাডের মাধ্যমে সম্ভাব্য রক্তদাতার সঙ্গে তাৎক্ষণিক যোগাযোগ করা হয় এবং শেষ পর্যন্ত প্রয়োজনীয় রক্তের ব্যবস্থা করা সম্ভব হয়।
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>কক্সবাজার · সফল রক্তদান</span>
              <span className="text-emerald-600 font-semibold">✓ রোগী সুস্থ আছেন</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <span>❤️ মধ্যরাতে দুর্লভ B- রক্তের সন্ধান</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              চট্টগ্রামের একটি প্রাইভেট ক্লিনিকে অপারেশনের জন্য জরুরি B- রক্তের প্রয়োজন পড়ে। প্ল্যাটফর্মের ফিল্টারে খুঁজে পাওয়া রাঙ্গামাটির এক স্বেচ্ছাসেবী রক্তদাতা তাৎক্ষণিক হাসপাতালে উপস্থিত হয়ে রক্তদান করেন।
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>চট্টগ্রাম · জরুরি সাড়াদান</span>
              <span className="text-emerald-600 font-semibold">✓ সফল সংযোগ</span>
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <Link
            to="/about"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5"
          >
            <span>আরও গল্প পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* ========================================================
          ১৭. রক্ত সম্পর্কে জানুন (রক্তদান সম্পর্কে আপনার যা জানা প্রয়োজন)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            রক্তদান সম্পর্কে আপনার যা জানা প্রয়োজন
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            সচেতন থাকুন, নিরাপদ রক্তদানের মাধ্যমে জীবন বাঁচাতে সহায়তা করুন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              🩸 রক্তদানের আগে কী জানা উচিত?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              পর্যাপ্ত বিশ্রাম, পুষ্টিকর খাবার এবং মানসিক প্রস্তুতি সম্পর্কে মৌলিক তথ্য।
            </p>
          </Link>

          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              ❤️ কে রক্ত দিতে পারেন?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              ১৮ থেকে ৬০ বছর বয়সী, ন্যুনতম ৫০ কেজি ওজন এবং সুস্থ ব্যক্তিরা রক্তদানে উপযুক্ত।
            </p>
          </Link>

          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              🕐 কতদিন পর আবার রক্ত দেওয়া যায়?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              পুরুষরা প্রতি ৩ মাস পর এবং নারীরা প্রতি ৪ মাস পর রক্তদান করতে পারেন।
            </p>
          </Link>

          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              🥗 রক্তদানের আগে কী খাবেন?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              পর্যাপ্ত পানি পান করুন, চর্বিমুক্ত সুষম খাদ্য গ্রহণ করুন এবং ধূমপান পরিহার করুন।
            </p>
          </Link>

          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              💧 রক্তদানের পর কী করবেন?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              কিছুক্ষণ বিশ্রাম নিন, জুস বা পানি পান করুন এবং ভারী কাজ থেকে বিরত থাকুন।
            </p>
          </Link>

          <Link 
            to="/about"
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2 block"
          >
            <h4 className="text-sm font-bold text-slate-900">
              ❓ রক্তের গ্রুপ সম্পর্কে জানুন
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              ABO ও Rh ফ্যাক্টর এবং কোন গ্রুপের রক্ত কাকে দেওয়া যায় তার বৈজ্ঞানিক গাইড।
            </p>
          </Link>

        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[11px] text-slate-500">
            * এখানে কোনো চিকিৎসা পরামর্শ দেওয়া হচ্ছে না। রক্তদানের পূর্বে রক্তদাতা ও রোগীর স্বাস্থ্য পরীক্ষা এবং চিকিৎসকের পরামর্শ গ্রহণ আবশ্যক।
          </p>
          <Link
            to="/about"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-block"
          >
            সব তথ্য দেখুন →
          </Link>
        </div>

      </section>

      {/* ========================================================
          ১৮. FAQ (সাধারণ কিছু প্রশ্ন)
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            সাধারণ কিছু প্রশ্ন
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            তথ্যহাব ব্লাড প্ল্যাটফর্ম সম্পর্কে জরুরি প্রশ্নোত্তর
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'তথ্যহাব ব্লাড কী?',
              a: 'তথ্যহাব ব্লাড একটি রক্তদাতা ও রক্তের প্রয়োজন থাকা মানুষের মধ্যে যোগাযোগ ও সমন্বয়ে সহায়তাকারী প্ল্যাটফর্ম।'
            },
            {
              q: 'তথ্যহাব ব্লাড কি হাসপাতাল বা ব্লাড ব্যাংক?',
              a: 'না। এটি কোনো হাসপাতাল, ব্লাড ব্যাংক বা চিকিৎসা প্রতিষ্ঠান নয়। এটি একটি অলাভজনক ও উন্মুক্ত মানবিক নেটওয়ার্ক।'
            },
            {
              q: 'আমি কীভাবে রক্তদাতা হব?',
              a: 'রেজিস্ট্রেশন করে আপনার রক্তের গ্রুপ, অবস্থান ও প্রয়োজনীয় তথ্য দিয়ে রক্তদাতা হিসেবে যুক্ত হতে পারবেন।'
            },
            {
              q: 'রক্তদাতার ফোন নম্বর কি সবার কাছে দেখা যাবে?',
              a: 'না। ব্যক্তিগত তথ্য সুরক্ষার জন্য যোগাযোগ ব্যবস্থা নিয়ন্ত্রিত থাকবে এবং অপ্রয়োজনীয় প্রচার রোধ করা হবে।'
            },
            {
              q: 'জরুরি রক্তের প্রয়োজন হলে কী করব?',
              a: 'জরুরি রক্তের অনুরোধ তৈরি করুন এবং একই সঙ্গে সংশ্লিষ্ট হাসপাতাল বা চিকিৎসা সেবার সঙ্গে সরাসরি যোগাযোগ করুন।'
            }
          ].map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          ১৯. Final CTA (আজ হয়তো আপনার রক্ত কারও প্রয়োজন)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white rounded-3xl p-8 sm:p-14 text-center shadow-xl space-y-5">
          
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto backdrop-blur-sm shadow-xs">
            <Droplet className="w-6 h-6 fill-white" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            আজ হয়তো আপনার রক্ত কারও প্রয়োজন
          </h2>

          <p className="text-xs sm:text-base text-rose-100 max-w-2xl mx-auto leading-relaxed">
            একজন রক্তদাতা হওয়া মানে শুধু একটি তালিকায় নাম যুক্ত করা নয়। প্রয়োজনের সময়ে একজন মানুষের পাশে দাঁড়ানোর সুযোগ তৈরি করা।
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/become-donor"
              className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-rose-600" />
              <span>🩸 রক্তদাতা হোন</span>
            </Link>

            <Link
              to="/donors"
              className="w-full sm:w-auto px-7 py-3 bg-rose-900/60 hover:bg-rose-900/80 text-white font-extrabold text-sm sm:text-base rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>🔎 রক্ত খুঁজুন</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
