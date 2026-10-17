import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Clock, 
  Heart, 
  Phone, 
  Mail, 
  AlertCircle,
  Share2,
  Lock
} from 'lucide-react';
import { Donor } from '../types';
import { SEO } from '../components/SEO';

interface DonorProfileViewProps {
  donor?: Donor;
  donors?: Donor[];
  onBack?: () => void;
  onContact: (donor: Donor) => void;
}

export const DonorProfileView: React.FC<DonorProfileViewProps> = ({
  donor: propDonor,
  donors = [],
  onBack,
  onContact
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const donor = propDonor || (id ? donors.find(d => d.id === id) : undefined);

  if (!donor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <SEO title="রক্তদাতার তথ্য পাওয়া যায়নি" />
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">রক্তদাতার তথ্য পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-500">অনুরোধকৃত রক্তদাতার প্রোফাইলটি সক্রিয় নয় বা সঠিক আইডি দেওয়া হয়নি।</p>
        <Link
          to="/donors"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>রক্তদাতা তালিকায় ফিরে যান</span>
        </Link>
      </div>
    );
  }

  const isAvailable = donor.availability === 'available';

  const donorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: donor.name,
    jobTitle: `Voluntary Blood Donor (${donor.bloodGroup})`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: donor.upazilaName || donor.area,
      addressRegion: donor.districtName,
      addressCountry: 'BD',
    },
    description: `${donor.name} - রক্তের গ্রুপ ${donor.bloodGroup}, জেলা: ${donor.districtName}। TotthoHub Blood প্ল্যাটফর্মে নিবন্ধিত রক্তদাতা।`,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEO
        title={`${donor.name} (${donor.bloodGroup}) - রক্তদাতা`}
        description={`${donor.name} - রক্তের গ্রুপ: ${donor.bloodGroup}, অবস্থান: ${donor.upazilaName || donor.area}, ${donor.districtName}। স্ট্যাটাস: ${donor.availability === 'available' ? 'রক্তদানে প্রস্তুত' : 'সাময়িক বিশ্রামে'}। জরুরি প্রয়োজনে যোগাযোগ করুন।`}
        canonical={`https://blood.totthohub.com/donor/${donor.id}`}
        jsonLd={donorJsonLd}
      />
      
      {/* Back button */}
      <button
        onClick={() => onBack ? onBack() : navigate('/donors')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>রক্তদাতা তালিকায় ফিরে যান</span>
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 relative" />

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          
          {/* Avatar & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
            <div className="flex items-end gap-4">
              <div className="relative w-24 h-24 shrink-0">
                {donor.imageUrl ? (
                  <img
                    src={donor.imageUrl}
                    alt={donor.name}
                    className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.profile-avatar-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`profile-avatar-fallback w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center font-extrabold text-3xl text-slate-800 bg-slate-100 ${donor.imageUrl ? 'hidden' : ''}`}>
                  {donor.name.charAt(0)}
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{donor.name}</h1>
                  <span title="যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতা">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{donor.area ? (donor.area.includes(donor.districtName) ? donor.area : `${donor.area}, ${donor.districtName}`) : `${donor.upazilaName}, ${donor.districtName}`}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center font-extrabold shadow-sm">
                <span className="text-lg leading-none">{donor.bloodGroup}</span>
                <span className="text-[10px] font-normal opacity-90">গ্রুপ</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics (Zero-Pill discipline) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">রক্তদানের প্রাপ্যতা</span>
              <span className={`font-semibold ${isAvailable ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isAvailable ? '🟢 রক্তদানে প্রস্তুত' : '🟡 বর্তমানে বিশ্রামে আছেন'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">মোট রক্তদান</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {donor.donationCount} বার রক্ত দিয়েছেন
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">সর্বশেষ রক্তদান</span>
              <span className="font-medium text-slate-800 font-mono tabular-nums">
                {donor.lastDonationDate || 'তথ্য নেই'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">যাচাইকরণ অবস্থা</span>
              <span className="font-semibold text-emerald-700">
                ✓ {donor.verificationStatus === 'blood_group_verified' ? 'ল্যাব গ্রুপ কনফার্মড' : 'মোবাইল যাচাইকৃত'}
              </span>
            </div>
          </div>

          {/* About / Bio */}
          <div className="py-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">রক্তদাতা সম্পর্কে</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {donor.bio || 'তথ্যহাব ব্লাডের একজন নিবন্ধিত স্বেচ্ছাসেবী রক্তদাতা। জরুরি প্রয়োজনে রোগীদের জীবন রক্ষায় সবসময় প্রস্তুত।' }
            </p>
          </div>

          {/* Privacy Protocol Notice (Section 15 of blueprint) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5 mb-6">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>তথ্যহাব ব্লাড গোপনীয়তা ও সুরক্ষা নীতি</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              রক্তদাতাদের অপ্রয়োজনীয় স্প্যাম বা বাণিজ্যিক অপব্যবহার থেকে সুরক্ষায় রক্তদাতার এনআইডি ও ব্যক্তিগত গোপনীয় তথ্য সুরক্ষিত রাখা হয়। রক্তের প্রয়োজনে সরাসরি যোগাযোগ ও বার্তা প্রেরণ সুরক্ষিতভাবে পরিচালিত হয়।
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onContact(donor)}
              className="w-full sm:flex-1 py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{donor.name}-এর কাছে রক্তের অনুরোধ পাঠান</span>
            </button>

            <a
              href={`tel:${donor.phone}`}
              className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>সরাসরি কল করুন</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
