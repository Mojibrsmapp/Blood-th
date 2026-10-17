import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LogOut, 
  LayoutDashboard, 
  Crown, 
  AlertTriangle, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Layers,
  Sparkles
} from 'lucide-react';
import { User, Donor, BloodRequest, AuditLog } from '../types';

interface AdminProfileViewProps {
  currentUser: User;
  donors: Donor[];
  requests: BloodRequest[];
  auditLogs: AuditLog[];
  onVerifyDonor: (donorId: string) => void;
  onUpdateRequestStatus: (requestId: string, status: BloodRequest['status']) => void;
  onLogout: () => void;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  currentUser,
  donors,
  requests,
  auditLogs,
  onVerifyDonor,
  onUpdateRequestStatus,
  onLogout
}) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isFounder = currentUser.role === 'founder';
  const pendingDonors = donors.filter(d => d.verificationStatus === 'pending');
  const activeRequests = requests.filter(r => r.status === 'searching');
  const availableDonors = donors.filter(d => d.availability === 'available');

  const handleVerify = (donorId: string, name: string) => {
    onVerifyDonor(donorId);
    showToast(`${name}-এর রক্তদাতা ভেরিফিকেশন সম্পন্ন হয়েছে!`);
  };

  const handleFulfillRequest = (reqId: string, patient: string) => {
    onUpdateRequestStatus(reqId, 'fulfilled');
    showToast(`${patient}-এর রক্তের অনুরোধ সম্পন্ন মার্ক করা হয়েছে!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Admin Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner */}
        <div className="h-28 relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700" />

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            
            {/* Avatar & Name */}
            <div className="flex items-end gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md flex items-center justify-center font-black text-2xl text-white bg-blue-600">
                  <ShieldCheck className="w-10 h-10" />
                </div>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {currentUser.name}
                  </h1>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    সিস্টেম অ্যাডমিন
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentUser.email || 'admin@totthohub.com'}</span>
                  <span>·</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentUser.upazilaName || 'কক্সবাজার সদর'}, {currentUser.districtName || 'কক্সবাজার'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4 text-rose-400" />
                <span>সম্পূর্ণ ড্যাশবোর্ড প্যানেল</span>
              </Link>

              <button
                onClick={onLogout}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
                title="লগআউট"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics (Zero-Pill discipline) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">মোট নিবন্ধিত রক্তদাতা</span>
              <span className="font-extrabold text-slate-900 text-base font-mono tabular-nums">
                {donors.length} জন
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">সক্রিয় ও প্রস্তুত দাতা</span>
              <span className="font-extrabold text-emerald-600 text-base font-mono tabular-nums">
                {availableDonors.length} জন
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">সক্রিয় রক্তের অনুরোধ</span>
              <span className="font-extrabold text-rose-600 text-base font-mono tabular-nums">
                {activeRequests.length}টি
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">অপেক্ষমাণ ভেরিফিকেশন</span>
              <span className="font-extrabold text-amber-600 text-base font-mono tabular-nums">
                {pendingDonors.length} জন
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Pending Donors Verification */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>রক্তদাতা দ্রুত ভেরিফিকেশন</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {pendingDonors.length} জন অপেক্ষমাণ
            </span>
          </div>

          {pendingDonors.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>সকল রক্তদাতার প্রোফাইল যাচাইকৃত রয়েছে!</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {pendingDonors.slice(0, 5).map(donor => (
                <div 
                  key={donor.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{donor.name}</span>
                      <span className="px-1.5 py-0.2 bg-rose-600 text-white font-bold rounded text-[10px]">
                        {donor.bloodGroup}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {donor.upazilaName}, {donor.districtName} · ফোন: {donor.phone}
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerify(donor.id, donor.name)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    যাচাই করুন
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Active Blood Requests Management */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>সক্রিয় রক্তের অনুরোধসমূহ</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {activeRequests.length}টি সক্রিয়
            </span>
          </div>

          {activeRequests.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>কোনো অমীমাংসিত রক্তের অনুরোধ নেই।</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activeRequests.slice(0, 5).map(req => (
                <div 
                  key={req.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.patientName}</span>
                      <span className="px-1.5 py-0.2 bg-rose-600 text-white font-bold rounded text-[10px]">
                        {req.bloodGroup}
                      </span>
                      <span className="text-[10px] text-slate-500">({req.units} ব্যাগ)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {req.hospitalName} · {req.upazilaName}
                    </div>
                  </div>

                  <button
                    onClick={() => handleFulfillRequest(req.id, req.patientName)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    সম্পন্ন করুন
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent System Audit Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <span>সাম্প্রতিক সিস্টেম অডিট লগ (Audit Trails)</span>
          </h2>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            সম্পূর্ণ লগ দেখুন →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {auditLogs.slice(0, 6).map(log => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{log.actorName}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                    {log.action}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5">{log.details}</div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
