import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Home, Search, AlertCircle } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs border border-rose-100">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black tracking-widest text-rose-600 uppercase font-mono">
          ত্রুটি ৪০৪ · PAGE NOT FOUND
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          আপনি যে পেজটিতে প্রবেশের চেষ্টা করছেন সেটি স্থানান্তরিত হয়েছে বা এর লিংকটি সঠিক নয়। অনুগ্রহ করে হোমপেজ অথবা রক্তদাতা তালিকায় ফিরে যান।
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>
        <Link
          to="/donors"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>রক্তদাতা খুঁজুন</span>
        </Link>
      </div>
    </div>
  );
};
