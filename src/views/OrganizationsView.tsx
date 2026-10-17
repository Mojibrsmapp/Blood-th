import React from 'react';
import { Building, ShieldCheck, Phone, Mail, Globe, Users, HeartHandshake } from 'lucide-react';
import { Organization } from '../types';
import { INITIAL_ORGANIZATIONS } from '../data/seedData';

export const OrganizationsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          সহযোগী রক্তদান সংস্থা ও সংগঠন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          তথ্যহাব ব্লাডের সাথে সংযুক্ত অনুমোদিত অলাভজনক সংস্থা, বিশ্ববিদ্যালয় ক্লাব ও স্বেচ্ছাসেবী মানবিক সংগঠনসমূহ।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_ORGANIZATIONS.map(org => (
          <div key={org.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                {org.isVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    যাচাইকৃত পার্টনার
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{org.name}</h3>
                <p className="text-xs text-rose-600 font-medium mt-0.5">{org.tagline}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {org.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[11px]">সক্রিয় স্বেচ্ছাসেবী:</span>
                  <span className="font-bold text-slate-900">{org.activeVolunteersCount}+ জন</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">সমন্বিত রক্তদান:</span>
                  <span className="font-bold text-emerald-600">{org.totalDonationsCoordinated}+ ব্যাগ</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">অফিসিয়াল হেল্পলাইন:</span>
                <a href={`tel:${org.phone}`} className="font-semibold text-rose-600 font-mono">
                  {org.phone}
                </a>
              </div>
              {org.website && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">ওয়েবসাইট:</span>
                  <a href={org.website} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-rose-600 truncate max-w-[150px]">
                    {org.website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
