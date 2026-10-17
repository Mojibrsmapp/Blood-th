import React from 'react';
import { 
  Quote, 
  Heart, 
  ShieldCheck, 
  Target, 
  Eye, 
  Mail, 
  MapPin, 
  Globe, 
  Sparkles,
  Award
} from 'lucide-react';

export const FounderView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Founder Portrait Styled Fallback (Zero Broken Image compliant) */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-slate-900 via-rose-900 to-rose-700 flex flex-col items-center justify-center text-white shadow-xl border-4 border-white">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold text-white">
                MR
              </div>
              <div className="text-[11px] font-semibold text-rose-200 mt-2 tracking-wide uppercase">
                Founder
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-md" title="Verified Founder">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
              Leadership & Vision
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mojibur Rahman
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Founder & Architect, <span className="text-rose-600">TotthoHub</span> & <span className="text-rose-600">TotthoHub Blood</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Ramu, Cox's Bazar, Bangladesh</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>mojibrsm@gmail.com</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>blood.totthohub.com</span>
              </span>
            </div>
          </div>

        </div>

        {/* Vision Statement */}
        <div className="pt-6 border-t border-slate-100 relative">
          <Quote className="w-8 h-8 text-rose-400/50 absolute -top-3 left-0" />
          <blockquote className="pl-8 text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic">
            "রক্তের প্রয়োজনে প্রতিটি সেকেন্ড অমূল্য। একজন রোগীর স্বজন যেন অসহায় হয়ে হাসপাতাল করিডোরে ছোটাছুটি না করে, বরং কয়েক ক্লিকেই তার এলাকায় থাকা স্বেচ্ছাসেবী রক্তদাতার সন্ধান পান—এই মানবিক অঙ্গীকার থেকেই তথ্যহাব ব্লাডের পথচলা।"
          </blockquote>
        </div>

      </div>

      {/* Core Principles (Zero-Pill discipline) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">আমাদের লক্ষ্য ও উদ্দেশ্য (Mission)</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            কক্সবাজারের প্রত্যন্ত রামু থেকে শুরু করে সারাদেশের প্রতিটি ইউনিয়ন ও ওয়ার্ডে রক্তদানের একটি সমন্বিত, বিশ্বস্ত ও সম্পূর্ণ অলাভজনক প্ল্যাটফর্ম গড়ে তোলা। রক্তদাতা ও গ্রহীতার মধ্যে দ্রুত ও নিরাপদ সেতুবন্ধন রচনা করা।
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">আমাদের ভবিষ্যৎ রূপকল্প (Vision)</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            বাংলাদেশে এমন একটি মানবিক সমাজ নিশ্চিত করা, যেখানে রক্তের অভাবে কোনো মুমূর্ষু রোগীর জীবন সংকটে পড়বে না। ডিজিটাল প্রযুক্তির সর্বোচ্চ ব্যবহারে স্বচ্ছ ও নির্ভরযোগ্য রক্তসেবা সবার নাগালে পৌঁছে দেওয়া।
          </p>
        </div>

      </div>

      {/* Founder's Governance Pledge */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>প্ল্যাটফর্ম পরিচালনা ও নৈতিক অঙ্গীকার</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">১. শতভাগ অলাভজনক ও নিঃস্বার্থ</div>
            <p className="leading-relaxed">
              তথ্যহাব ব্লাড রক্তের কোনো ক্রয়-বিক্রয় বা ফি সমর্থন করে না। স্বেচ্ছায় রক্তদান একটি নিঃস্বার্থ মানবিক উপহার।
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-sm">২. তথ্য ও গোপনীয়তার পূর্ণ সুরক্ষা</div>
            <p className="leading-relaxed">
              রক্তদাতাদের ব্যক্তিগত ফোন নম্বর ও তথ্য সুরক্ষিত রাখতে স্ক্র্যাপার ও বাণিজ্যিক স্প্যাম কল সম্পূর্ণ নিষিদ্ধ।
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-sm">৩. উন্মুক্ত সামাজিক অংশীদারিত্ব</div>
            <p className="leading-relaxed">
              রেড ক্রিসেন্ট, সন্ধানী, বাঁধনসহ দেশের ৬৪ জেলার সকল রক্তদাতা সংগঠন ও তরুণ স্বেচ্ছাসেবীদের সাথে আমাদের যৌথ পথচলা।
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
