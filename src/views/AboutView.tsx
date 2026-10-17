import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Heart, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  AlertTriangle,
  Droplet
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'কত দিন পর পর রক্ত দেওয়া যায়? (How often can I donate blood?)',
      a: 'একজন সুস্থ প্রাপ্তবয়স্ক পুরুষ প্রতি ৩ মাস পর পর এবং নারী প্রতি ৪ মাস পর পর নিরাপদে রক্ত দিতে পারেন। এতে শরীরের কোনো ক্ষতি হয় না, বরং নতুন রক্তকণিকা তৈরিতে সহায়তা করে।'
    },
    {
      q: 'রক্ত দেওয়ার ন্যূনতম যোগ্যতা কী কী? (What are donor eligibility criteria?)',
      a: 'বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে, ওজন ন্যূনতম ৪৫ কেজি (পুরুষদের জন্য ৫০ কেজি অগ্রাধিকার), রক্তচাপ ও হিমোগ্লোবিন স্বাভাবিক মাত্রায় (১২.৫ গ্রাম/ডেসিলিটার বা তার বেশি) থাকতে হবে এবং সাম্প্রতিক সময়ে কোনো বড় সার্জারি বা রক্তবাহিত রোগের ইতিহাস থাকা যাবে না।'
    },
    {
      q: 'TotthoHub Blood কি রক্তের কোনো ফি বা চার্জ নেয়? (Does TotthoHub Blood charge fees?)',
      a: 'না, কখনোই না। তথ্যহাব ব্লাড সম্পূর্ণ অলাভজনক ও স্বেচ্ছাসেবী মানবিক উদ্যোগ। রক্তদান ও রক্ত অনুসন্ধান শতভাগ বিনামূল্যে উন্মুক্ত।'
    },
    {
      q: 'রক্তদাতার ফোন নম্বর কি সরাসরি উন্মুক্ত থাকে? (Is donor phone publicly displayed?)',
      a: 'রক্তদাতাদের নিরাপত্তা ও স্প্যাম কল প্রতিরোধে তথ্যহাব ব্লাডে স্মার্ট কন্টাক্ট রিকোয়েস্ট সিস্টেম রয়েছে। আগ্রহী গ্রহীতা রিকোয়েস্ট পাঠালে রক্তদাতা এসএমএস/নোটিফিকেশন পেয়ে সরাসরি যোগাযোগ করতে পারেন।'
    },
    {
      q: 'পুরোনো RoktoDao বা Turso ডাটাবেজ থেকে ডাটা কীভাবে স্থানান্তরিত হচ্ছে?',
      a: 'তথ্যহাব ব্লাডে একটি ডেডিকেটেড মাইগ্রেশন ইঞ্জিন রয়েছে যা পুরোনো ডাটাবেজের রক্তের গ্রুপ, ফোন নম্বর ও জেলা-উপজেলা ভ্যালিডেট ও ডুপ্লিকেট দূর করে স্বয়ংক্রিয়ভাবে ক্লিন ফরম্যাটে ইমপোর্ট করে।'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          তথ্যহাব ব্লাড সম্পর্কে
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          তথ্যহাব ব্লাড – প্রতিটি রক্তের ফোঁটায় জীবনের স্পন্দন ফিরিয়ে দেওয়ার উন্মুক্ত ও অলাভজনক মানবিক প্ল্যাটফর্ম।
        </p>
      </div>

      {/* Donor Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-rose-600" />
          <span>রক্তদানের সাধারণ নির্দেশিকা ও যোগ্যতা (Donor Eligibility)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">বয়স ও ওজন:</strong>
              <div className="text-slate-500">১৮ থেকে ৬০ বছর বয়স এবং ন্যূনতম ওজন ৪৫ কেজি।</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">বিরতি:</strong>
              <div className="text-slate-500">সর্বশেষ রক্তদানের পর অন্তত ৯০ দিন অতিবাহিত হতে হবে।</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">শারীরিক সুস্থতা:</strong>
              <div className="text-slate-500">স্বাভাবিক রক্তচাপ ও জ্বর বা ইনফেকশনমুক্ত থাকা আবশ্যক।</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">পর্যাপ্ত পানি ও বিশ্রাম:</strong>
              <div className="text-slate-500">রক্তদানের পূর্বে অন্তত ৫০০ মিলি পানি পান ও সুষম খাবার গ্রহণ।</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-600" />
          <span>সচরাচর জিজ্ঞাসা (Frequently Asked Questions)</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-rose-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
