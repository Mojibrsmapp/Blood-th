import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Building,
  Heart
} from 'lucide-react';
import { BloodGroup, BloodRequest, Donor } from '../types';
import { DISTRICTS, INITIAL_HOSPITALS } from '../data/seedData';

interface EmergencyViewProps {
  requests: BloodRequest[];
  donors: Donor[];
  onSubmitEmergencyRequest: (req: Partial<BloodRequest>) => void;
  onContactDonor: (donor: Donor) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  requests,
  donors,
  onSubmitEmergencyRequest,
  onContactDonor
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState("Cox's Bazar");
  const [upazila, setUpazila] = useState("Cox's Bazar Sadar");
  const [units, setUnits] = useState(2);
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const activeEmergencies = requests.filter(r => r.urgency === 'critical' && r.status !== 'fulfilled');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !contactPhone || !hospitalName) return;

    onSubmitEmergencyRequest({
      patientName,
      bloodGroup,
      units,
      hospitalName,
      districtName: district,
      upazilaName: upazila,
      requesterPhone: contactPhone,
      urgency: 'critical',
      description: notes || `🚨 CRITICAL EMERGENCY: Urgent ${units} bag(s) of ${bloodGroup} blood required at ${hospitalName}. Attendant phone: ${contactPhone}.`,
      status: 'searching'
    });

    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setPatientName('');
      setContactPhone('');
      setNotes('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Emergency Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-red-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-200">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>তথ্যহাব জরুরি রেপিড ডেসপ্যাচ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              🚨 জরুরি রক্তের অনুরোধ
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
              অপারেশন থিয়েটার, আইসিইউ, প্রসবকালীন জটিলতা বা গুরুতর দুর্ঘটনার জন্য দ্রুত রক্তের অনুরোধ তৈরি করুন। এই ফর্মটি সাবমিট করলে সংশ্লিষ্ট এলাকার সক্রিয় রক্তদাতা ও স্বেচ্ছাসেবকদের জরুরি অ্যালার্ট পৌঁছাবে।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
            <div className="text-[11px] text-red-200 uppercase font-semibold">জাতীয় জরুরি সেবা</div>
            <div className="text-2xl font-black font-mono mt-0.5">৯৯৯</div>
            <div className="text-[10px] text-red-200 mt-1">পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rapid 1-Click Dispatch Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border-2 border-red-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>তাৎক্ষণিক জরুরি রক্তের ফর্ম</span>
              </h2>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                অগ্রাধিকার: অতি জরুরি
              </span>
            </div>

            {dispatched ? (
              <div className="p-8 text-center space-y-3 bg-red-50/50 rounded-2xl border border-red-200 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-red-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">জরুরি অ্যালার্ট সম্প্রচারিত হয়েছে!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {upazila}, {district}-এর সক্রিয় রক্তদাতা ও স্বেচ্ছাসেবী সমন্বয়কদের কাছে তাৎক্ষণিক বার্তা পাঠানো হয়েছে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleDispatch} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রোগীর নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: জরুরি রোগী"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      প্রয়োজনীয় রক্তের গ্রুপ *
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg} গ্রুপ</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      হাসপাতাল ও বেড নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: কক্সবাজার সদর হাসপাতাল ওটি"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রক্তের পরিমাণ (ব্যাগ)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={units}
                      onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      জেলা ও এলাকা *
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      যোগাযোগের মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 018xxxxxxxx"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    জরুরি পরিস্থিতির বিবরণ
                  </label>
                  <textarea
                    rows={2}
                    placeholder="জরুরি সার্জারি, সড়ক দুর্ঘটনা, সিজারিয়ান জটিলতা ইত্যাদি উল্লেখ করুন..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>জরুরি সম্প্রচার পাঠান</span>
                </button>

              </form>
            )}

          </div>
        </div>

        {/* Right Column: Live Urgent Cases & Hospital Hotlines */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Emergencies */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>চলমান জরুরি অনুরোধসমূহ ({activeEmergencies.length}টি)</span>
              </h3>
            </div>

            <div className="space-y-3">
              {activeEmergencies.map(req => (
                <div key={req.id} className="p-4 bg-red-50/60 rounded-2xl border border-red-100 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{req.patientName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.hospitalName} ({req.upazilaName})</span>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-xs">
                      {req.bloodGroup}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-red-100">
                    <span className="text-[11px] font-semibold text-slate-500">
                      পরিমাণ: <strong>{req.units} ব্যাগ</strong> · সময়: {req.neededDate}
                    </span>
                    <a
                      href={`tel:${req.requesterPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white hover:bg-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল করুন</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Emergency Directory Quick Access */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-600" />
              <span>হাসপাতাল জরুরি হটলাইন নম্বর</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {INITIAL_HOSPITALS.map(h => (
                <div key={h.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{h.banglaName || h.name}</div>
                    <div className="text-[11px] text-slate-500">{h.districtName}</div>
                  </div>
                  <a
                    href={`tel:${h.emergencyHotline}`}
                    className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {h.emergencyHotline}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
