import React, { useState, useMemo } from 'react';
import { 
  Droplet, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Users, 
  Building, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { BloodGroup, BloodRequest, Donor, UrgencyLevel } from '../types';
import { DISTRICTS, INITIAL_HOSPITALS } from '../data/seedData';
import { findMatchingDonors } from '../services/matchingService';

interface RequestBloodViewProps {
  donors: Donor[];
  onSubmitRequest: (requestData: Omit<BloodRequest, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'matchedDonorIds' | 'contactCount'>) => void;
  onNavigateEmergency: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const RequestBloodView: React.FC<RequestBloodViewProps> = ({
  donors,
  onSubmitRequest,
  onNavigateEmergency
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [customHospital, setCustomHospital] = useState('');
  const [districtId, setDistrictId] = useState('cox-bazar');
  const [upazilaName, setUpazilaName] = useState('Ramu');
  const [locationDetails, setLocationDetails] = useState('');
  const [neededDate, setNeededDate] = useState('Today (Emergency)');
  const [neededTime, setNeededTime] = useState('Immediate / Next 2 Hours');
  const [urgency, setUrgency] = useState<UrgencyLevel>('urgent');
  const [requesterName, setRequesterName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentDistrict = DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0];

  // Live Automatic Candidate Matching Calculation (Section 20 of blueprint)
  const candidateMatches = useMemo(() => {
    return findMatchingDonors(
      {
        bloodGroup,
        districtName: currentDistrict.name,
        upazilaName
      },
      donors
    );
  }, [bloodGroup, currentDistrict.name, upazilaName, donors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !requesterPhone) return;

    const hospitalName = selectedHospital === 'custom' || !selectedHospital
      ? customHospital || 'District Hospital'
      : selectedHospital;

    onSubmitRequest({
      userId: 'guest-or-user',
      requesterName: requesterName || 'Family Member',
      requesterPhone,
      patientName,
      bloodGroup,
      units,
      hospitalName,
      districtId,
      districtName: currentDistrict.name,
      upazilaId: upazilaName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      upazilaName,
      locationDetails: locationDetails || `${hospitalName}, General Ward`,
      neededDate,
      neededTime,
      urgency,
      description: description || `Urgent blood request for ${patientName} needing ${units} units of ${bloodGroup} at ${hospitalName}.`,
      status: 'searching'
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">রক্তের অনুরোধ সফলভাবে তৈরি ও সম্প্রচারিত হয়েছে!</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            রোগী {patientName}-এর জন্য <strong>{units} ব্যাগ {bloodGroup}</strong> রক্তের অনুরোধ এখন সক্রিয়।
            আমরা {upazilaName}, {currentDistrict.name}-এর <strong>{candidateMatches.length} জন সম্ভাব্য উপযুক্ত রক্তদাতাকে</strong> অবহিত করেছি।
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
          <div className="font-semibold text-slate-800">পরবর্তী পদক্ষেপ:</div>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            <li>নিকটবর্তী উপযুক্ত রক্তদাতারা নোটিফিকেশন ও বার্তা পাবেন।</li>
            <li>স্বেচ্ছাসেবী সমন্বয়ক ও মডারেটররা পরিস্থিতি পর্যবেক্ষণ করবেন।</li>
            <li>সরাসরি প্রোফাইল ও ড্যাশবোর্ড থেকে অনুরোধের অগ্রগতি ট্র্যাক করতে পারবেন।</li>
          </ul>
        </div>

        <button
          onClick={() => setIsSubmitted(false)}
          className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
        >
          আরেকটি রক্তের অনুরোধ তৈরি করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            রক্তের অনুরোধ করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            রোগীর চিকিৎসার বিস্তারিত তথ্য দিন। আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে নিকটবর্তী উপযুক্ত রক্তদাতাদের অ্যালার্ট পৌঁছে দেবে।
          </p>
        </div>

        <button
          onClick={onNavigateEmergency}
          className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>জরুরি রক্ত প্রয়োজন?</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Section 1: Patient & Blood Group */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                ০১. রোগী ও জরুরি প্রয়োজনের বিবরণ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রোগীর নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মরিয়ম বেগম"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রয়োজনীয় রক্তের গ্রুপ *
                  </label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রয়োজনীয় পরিমাণ (ব্যাগ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    জরুরিতার মাত্রা
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 ${
                      urgency === 'critical' ? 'text-red-600 bg-red-50' : 'text-slate-800'
                    }`}
                  >
                    <option value="normal">স্বাভাবিক (২-৩ দিনের মধ্যে প্রয়োজন)</option>
                    <option value="urgent">জরুরি (আজকের মধ্যেই প্রয়োজন)</option>
                    <option value="critical">🚨 অতি জরুরি (অপারেশন / অবিলম্বে প্রয়োজন)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Hospital & Location */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                ০২. হাসপাতাল ও অবস্থান
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    জেলা *
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                      const d = DISTRICTS.find(dist => dist.id === e.target.value);
                      if (d && d.upazilas.length > 0) {
                        setUpazilaName(d.upazilas[0]);
                      }
                    }}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.bangla})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    উপজেলা / এলাকা *
                  </label>
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

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  হাসপাতালের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: কক্সবাজার জেলা সদর হাসপাতাল, চমেক, রামু উপজেলা স্বাস্থ্য কমপ্লেক্স..."
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ওয়ার্ড, বেড নম্বর ও বিস্তারিত ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২য় তলা, গাইনী ওয়ার্ড, বেড নং ১৪, মূল ভবন"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Section 3: Contact Person */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                ০৩. যোগাযোগকারীর তথ্য ও সময়
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    যোগাযোগকারীর নাম
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: আলমগীর হোসেন (রোগীর ভাই)"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 018xxxxxxxx বা 017xxxxxxxx"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রক্তের প্রয়োজনীয় তারিখ
                  </label>
                  <input
                    type="text"
                    value={neededDate}
                    onChange={(e) => setNeededDate(e.target.value)}
                    placeholder="যেমন: আজ, আগামীকাল সকালে"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রয়োজনীয় সময়
                  </label>
                  <input
                    type="text"
                    value={neededTime}
                    onChange={(e) => setNeededTime(e.target.value)}
                    placeholder="যেমন: আগামী ২ ঘণ্টার মধ্যে, সকাল ১০:০০ টা"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  রোগীর সমস্যা বা বিশেষ নির্দেশনা
                </label>
                <textarea
                  rows={2}
                  placeholder="হাসপাতাল প্যাথলজিতে ক্রস-ম্যাচিং স্যাম্পল প্রস্তুত আছে কিনা অথবা কোনো জরুরি নির্দেশনা লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>রক্তের অনুরোধ সম্প্রচার করুন</span>
            </button>

          </form>
        </div>

        {/* Sidebar: Real-Time Automatic Donor Matching Preview (Section 20 of blueprint) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-600" />
                <span>স্বয়ংক্রিয় রক্তদাতা ম্যাচিং</span>
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {candidateMatches.length} জন ম্যাচ
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              <strong>{upazilaName}, {currentDistrict.name}</strong>-এর নিকটবর্তী ও <strong>{bloodGroup}</strong> রক্তের গ্রুপের সাথে সামঞ্জস্যপূর্ণ সম্ভাব্য রক্তদাতাবৃন্দ:
            </p>

            {candidateMatches.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                এই উপজেলায় তাৎক্ষণিক কোনো রক্তদাতা পাওয়া যায়নি। অনুরোধটি পোস্ট করলে পার্শ্ববর্তী এলাকার রক্তদাতাদের অবহিত করা হবে।
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {candidateMatches.slice(0, 5).map(({ donor, matchReasons, distanceLabel }) => (
                  <div key={donor.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{donor.name}</span>
                      <span className="text-rose-600 font-extrabold">{donor.bloodGroup}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{donor.upazilaName}, {donor.districtName} ({distanceLabel})</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium flex flex-wrap gap-1">
                      {matchReasons.slice(0, 2).map((r, i) => (
                        <span key={i}>✓ {r}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              * রক্তদানের পূর্বে হাসপাতালে ল্যাবরেটরি ক্রস-ম্যাচিং ও স্ক্রিনিং করা বাধ্যতামূলক।
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
