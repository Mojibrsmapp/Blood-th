import React, { useState } from 'react';
import { 
  Building, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Droplet, 
  Search, 
  Clock, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { Hospital, BloodBank } from '../types';
import { INITIAL_HOSPITALS, INITIAL_BLOOD_BANKS, DISTRICTS } from '../data/seedData';

export const HospitalsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'blood_banks'>('hospitals');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHospitals = INITIAL_HOSPITALS.filter(h => {
    if (selectedDistrict && h.districtId !== selectedDistrict) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.banglaName.includes(q) || h.districtName.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredBloodBanks = INITIAL_BLOOD_BANKS.filter(b => {
    if (selectedDistrict) {
      const dObj = DISTRICTS.find(d => d.id === selectedDistrict);
      if (dObj && b.districtName !== dObj.name) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.districtName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            রামু, কক্সবাজার, চট্টগ্রাম ও ঢাকাসহ বাংলাদেশের যাচাইকৃত স্বাস্থ্যসেবা কেন্দ্র এবং অনুমোদিত ব্লাড ট্রান্সফিউশন সুবিধা।
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'hospitals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            হাসপাতালসমূহ ({INITIAL_HOSPITALS.length}টি)
          </button>
          <button
            onClick={() => setActiveTab('blood_banks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'blood_banks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ব্লাড ব্যাংক ({INITIAL_BLOOD_BANKS.length}টি)
          </button>
        </div>
      </div>

      {/* Notice on blood stocks */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">ডিরেক্টরি ভেরিফিকেশন নীতিমালা:</strong> তথ্যহাব ব্লাড নিয়মিতভাবে হাসপাতালগুলোর জরুরি ডেস্ক ও ব্লাড ব্যাংকের হটলাইন যাচাই করে। রক্তের উপাদান ও মজুত প্রতি মুহূর্তে পরিবর্তনশীল; তাই তাৎক্ষণিক ক্রস-ম্যাচিংয়ের জন্য নিচের যাচাইকৃত হটলাইনে সরাসরি ফোন করার অনুরোধ করা হচ্ছে।
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="হাসপাতাল বা ব্লাড ব্যাংকের নাম, জেলা লিখুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <option value="">সকল জেলা</option>
          {DISTRICTS.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.bangla})</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      {activeTab === 'hospitals' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHospitals.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">{h.banglaName || h.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-500">{h.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{h.address}</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
              </div>

              {/* Services tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {h.services.map(s => (
                  <span key={s} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  সাধারণ ফোন: <span className="font-mono text-slate-700">{h.phone}</span>
                </div>
                <a
                  href={`tel:${h.emergencyHotline}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors font-mono cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>জরুরি হটলাইন: {h.emergencyHotline}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBloodBanks.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900">{b.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.address}, {b.districtName}</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 fill-rose-600" />
                </div>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>খোলা থাকার সময়: <strong>{b.openingHours}</strong></span>
              </div>

              {b.notes && (
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                  {b.notes}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">সরাসরি ব্লাড ডেস্ক:</span>
                <a
                  href={`tel:${b.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors font-mono cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>{b.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
