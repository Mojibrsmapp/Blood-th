import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Users,
  Award
} from 'lucide-react';
import { DISTRICTS } from '../data/seedData';

export const VolunteerPortalView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState("Cox's Bazar");
  const [upazila, setUpazila] = useState('Ramu');
  const [preferredRole, setPreferredRole] = useState('Emergency Responder');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>তথ্যহাব ভলান্টিয়ার কোর</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          স্বেচ্ছাসেবী জীবনরক্ষক সমন্বয়ক হিসেবে যুক্ত হোন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          জরুরি রোগীর জন্য রক্তদাতা খুঁজে পেতে, রামু ও কক্সবাজারের হাসপাতালের কল ভেরিফাই করতে এবং রক্তদান ক্যাম্পেইনে নেতৃত্ব দিতে অংশ নিন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Registration form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">আবেদন সফলভাবে গৃহীত হয়েছে!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                ধন্যবাদ {name}! আমাদের জেলা সমন্বয়ক দ্রুত আপনার সাথে হোয়াটসঅ্যাপ বা মোবাইলে যোগাযোগ করবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-2">স্বেচ্ছাসেবী নিবন্ধন ফর্ম</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানজিম হাসান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নম্বর (বাংলাদেশি) *</label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 018xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জেলা</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">উপজেলা</label>
                  <input
                    type="text"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পছন্দের স্বেচ্ছাসেবী দায়িত্ব</label>
                <select
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="Emergency Responder">জরুরি রোগীর কেস ভেরিফিকেশন ও হাসপাতালে যোগাযোগ</option>
                  <option value="Camp Organizer">এলাকা ও ক্যাম্পাসে রক্তদান ক্যাম্পেইন সমন্বয়</option>
                  <option value="Donor Helpline">রক্তদাতা আউটরিচ ও হোয়াটসঅ্যাপ হেল্পলাইন সমন্বয়</option>
                  <option value="Social Awareness">সামাজিক সচেতনতা ও রক্তদানে উদ্বুদ্ধকরণ</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>স্বেচ্ছাসেবী আবেদন জমা দিন</span>
              </button>
            </form>
          )}
        </div>

        {/* Roles information */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-600" />
              <span>স্বেচ্ছাসেবী জীবনরক্ষকদের দায়িত্ব ও সুবিধা</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">১.</span>
                <span>ভুয়া বা অনৈতিক কল রোধে হাসপাতালের রোগীর প্রকৃত অবস্থা যাচাই করা।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">২.</span>
                <span>নতুন রক্তদাতাদের হাসপাতালে যাতায়াত ও মনোবল বৃদ্ধির পথনির্দেশ দেওয়া।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">৩.</span>
                <span>তথ্যহাব ব্লাডের অফিসিয়াল ভলান্টিয়ার ভেরিফাইড ব্যাজ ও সামাজিক স্বীকৃতিপত্র অর্জন।</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
