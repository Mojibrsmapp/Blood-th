import React, { useState } from 'react';
import { X, Phone, ShieldCheck, Heart, Send, CheckCircle2 } from 'lucide-react';
import { Donor } from '../types';

interface ContactDonorModalProps {
  donor: Donor | null;
  onClose: () => void;
  onSubmitContact: (donor: Donor, message: string, requesterPhone: string, hospital: string) => void;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({
  donor,
  onClose,
  onSubmitContact
}) => {
  if (!donor) return null;

  const [message, setMessage] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [hospital, setHospital] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterPhone) return;
    onSubmitContact(donor, message, requesterPhone, hospital);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Contact Voluntary Donor</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Request {donor.bloodGroup} blood from {donor.name} in {donor.upazilaName}, {donor.districtName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Contact Request Sent!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {donor.name} has been notified via SMS & system alert. Direct contact details will unlock upon acceptance.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {donor.bloodGroup}
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-rose-950">{donor.name}</div>
                  <div className="text-rose-800">
                    Location: {donor.area}, {donor.upazilaName}, {donor.districtName}
                  </div>
                  <div className="text-rose-600 font-medium">
                    {donor.donationCount} successful donations · Phone verified
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Contact Phone (Bangladeshi Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 018xxxxxxxx or 017xxxxxxxx"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name & Ward *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cox's Bazar Sadar Hospital, 3rd Floor Bed 12"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Condition & Urgent Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe patient emergency, required time, or required units..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Donor privacy is protected under TotthoHub Blood policy. Fake or commercial requests are strictly blocked.
                </span>
              </div>

              {/* Direct Call Quick Option for Emergency */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <a
                  href={`tel:${donor.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Directly: {donor.phone.substring(0, 4)}•••••••</span>
                </a>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
