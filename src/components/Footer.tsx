import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Shield, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Notice Banner */}
      <div className="bg-rose-950/40 border-b border-rose-900/40 py-3.5 px-4 text-center">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-rose-200 text-xs sm:text-sm">
          <Shield className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            <strong>জরুরি চিকিৎসা সতর্কতা:</strong> গুরুতর বা জীবন-ঝুঁকিপূর্ণ পরিস্থিতিতে অনুগ্রহ করে সরাসরি হাসপাতাল বা জরুরি চিকিৎসা সেবার সঙ্গে যোগাযোগ করুন। তথ্যহাব ব্লাড একটি স্বেচ্ছাসেবী সংযোগ প্ল্যাটফর্ম।
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg inline-flex">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center">
                <Droplet className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="tracking-tight text-xl font-bold">তথ্যহাব ব্লাড</span>
            </Link>
            <div className="text-xs text-rose-400 font-semibold tracking-wider">
              Find Blood. Save Lives.
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              রক্তদাতা ও রক্তের প্রয়োজন থাকা মানুষদের মধ্যে মানবিক যোগাযোগ তৈরিতে প্রযুক্তির ব্যবহার।
            </p>
            <div className="text-xs text-slate-500 pt-1">
              একটি <span className="text-slate-200 font-semibold">TotthoHub</span> মানবিক উদ্যোগ
            </div>
          </div>

          {/* প্ল্যাটফর্ম */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              প্ল্যাটফর্ম
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/donors" className="hover:text-rose-400 transition-colors">
                  রক্তদাতা খুঁজুন
                </Link>
              </li>
              <li>
                <Link to="/request-blood" className="hover:text-rose-400 transition-colors">
                  রক্তের অনুরোধ
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                  জরুরি রক্ত
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-rose-400 transition-colors">
                  রক্তদান ক্যাম্প
                </Link>
              </li>
              <li>
                <Link to="/organizations" className="hover:text-rose-400 transition-colors">
                  সংগঠন
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-rose-400 transition-colors">
                  স্বেচ্ছাসেবক
                </Link>
              </li>
            </ul>
          </div>

          {/* তথ্য */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              তথ্য ও সহায়তা
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  রক্তদানের নির্দেশিকা ও তথ্য
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  FAQ (সাধারণ প্রশ্নাবলি)
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-rose-400 transition-colors">
                  হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি
                </Link>
              </li>
            </ul>
          </div>

          {/* আইনি */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              আইনি ও নীতি
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  ব্যবহারের শর্তাবলি
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  চিকিৎসা ডিসক্লেইমার
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  কমিউনিটি নীতিমালা
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 TotthoHub Blood. সর্বস্বত্ব সংরক্ষিত। A TotthoHub Initiative.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>কক্সবাজার · চট্টগ্রাম · ঢাকা · বাংলাদেশ</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
