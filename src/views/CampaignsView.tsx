import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Target, 
  CheckCircle2, 
  Heart,
  Plus
} from 'lucide-react';
import { Campaign } from '../types';
import { INITIAL_CAMPAIGNS } from '../data/seedData';
import { SEO } from '../components/SEO';

export const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>({});

  const handleRegister = (campaignId: string) => {
    setRegisteredIds(prev => ({ ...prev, [campaignId]: true }));
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return { ...c, registeredDonorsCount: c.registeredDonorsCount + 1 };
      }
      return c;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="রক্তদান ক্যাম্পেইন ও ইভেন্ট ক্যালেন্ডার"
        description="নিকটবর্তী রক্তদান ক্যাম্পেইনে অংশ নিন। বিভিন্ন স্বেচ্ছাসেবী সংগঠনের আয়োজিত সক্রিয় রক্তদান শিবিরের স্থান ও তারিখ।"
        canonical="https://blood.totthohub.com/campaigns"
        keywords="রক্তদান ক্যাম্পেইন, blood donation camp bangladesh, রক্তদান শিবির, তথ্যহাব ব্লাড"
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            রক্তদান ক্যাম্পেইন ও কর্মসূচি
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            রামু, কক্সবাজার, চট্টগ্রাম এবং বিভিন্ন শিক্ষা প্রতিষ্ঠানে আয়োজিত স্বেচ্ছাসেবী রক্তদান কার্যক্রমে অংশ নিন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {campaigns.map(camp => {
          const isRegistered = registeredIds[camp.id];
          const progressPercent = Math.min(100, Math.round((camp.registeredDonorsCount / camp.targetUnits) * 100));

          return (
            <div key={camp.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                    {camp.organizerName}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {camp.status === 'upcoming' ? 'আসন্ন ক্যাম্পেইন' : camp.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {camp.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {camp.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">স্থান / ভেন্যু:</span>
                      <span className="font-semibold text-slate-900">{camp.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">তারিখ ও সময়:</span>
                      <span className="font-semibold text-slate-900">{camp.date}</span>
                      <span className="text-slate-500 block text-[11px]">{camp.time}</span>
                    </div>
                  </div>
                </div>

                {/* Target Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>ক্যাম্পেইন লক্ষ্যমাত্রা: <strong>{camp.targetUnits} ব্যাগ</strong></span>
                    <span className="font-bold text-rose-600">{camp.registeredDonorsCount} জন নিবন্ধিত</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100">
                {isRegistered ? (
                  <div className="py-2.5 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সফলভাবে নিবন্ধিত হয়েছে! ক্যাম্পে আপনার উপস্থিতি কাম্য।</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(camp.id)}
                    className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    <span>এই ক্যাম্পে রক্তদানে নিবন্ধন করুন</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
