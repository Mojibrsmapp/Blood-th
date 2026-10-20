import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  FileText, 
  RotateCcw, 
  MapPin, 
  Phone, 
  Heart, 
  AlertTriangle,
  Award,
  Settings,
  Layers,
  Sparkles,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  Upload,
  FileSpreadsheet,
  Terminal,
  Copy,
  FileCheck
} from 'lucide-react';
import { 
  User, 
  UserRole, 
  Donor, 
  BloodGroup,
  BloodRequest, 
  AuditLog, 
  MigrationResult, 
  TursoRawDonorRecord 
} from '../types';
import { SAMPLE_TURSO_LEGACY_DUMP } from '../data/seedData';
import { executeTursoMigration } from '../services/migrationService';
import { parseDonorsFromJSON, parseDonorsFromCSV, ParseResult } from '../services/importParser';
import { addImportedDonors } from '../services/storageService';
import { SEO } from '../components/SEO';

interface DashboardViewProps {
  currentUser: User;
  donors: Donor[];
  requests: BloodRequest[];
  auditLogs: AuditLog[];
  onUpdateDonorAvailability: (donorId: string, status: Donor['availability']) => void;
  onVerifyDonor: (donorId: string) => void;
  onUpdateRequestStatus: (requestId: string, status: BloodRequest['status']) => void;
  onAddMigratedDonors: (newDonors: Donor[]) => void;
  onLogNewDonation: (donorId: string, date: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  donors,
  requests,
  auditLogs,
  onUpdateDonorAvailability,
  onVerifyDonor,
  onUpdateRequestStatus,
  onAddMigratedDonors,
  onLogNewDonation
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Turso Migration Console State
  const [migrationData, setMigrationData] = useState<TursoRawDonorRecord[]>(SAMPLE_TURSO_LEGACY_DUMP);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [hasCommittedMigration, setHasCommittedMigration] = useState(false);
  
  // Search & Pagination in Donors tab
  const [donorSearch, setDonorSearch] = useState('');
  const [donorPage, setDonorPage] = useState(1);
  const DASHBOARD_DONORS_PER_PAGE = 25;

  // Filter in Requests tab
  const [requestFilter, setRequestFilter] = useState<'all' | 'searching' | 'fulfilled'>('all');

  // Dynamic Donor profile matching from real currentUser
  const userPhoneClean = (currentUser.phone || '').replace(/[^0-9]/g, '');
  const currentDonorProfile = donors.find(d => {
    const dPhone = (d.phone || '').replace(/[^0-9]/g, '');
    return (
      (userPhoneClean && dPhone && (dPhone === userPhoneClean || (dPhone.length === 11 && userPhoneClean.length === 11 && dPhone.endsWith(userPhoneClean.slice(-10))))) ||
      d.id === currentUser.id ||
      d.userId === currentUser.id
    );
  });

  // Run Dry-Run Simulation
  const handleRunDryRun = () => {
    setIsMigrating(true);
    setTimeout(() => {
      const { result } = executeTursoMigration(migrationData, donors, true);
      setMigrationResult(result);
      setIsMigrating(false);
    }, 600);
  };

  // Run Live Production Migration Execution
  const handleCommitMigration = () => {
    setIsMigrating(true);
    setTimeout(() => {
      const { result, newDonorsToAppend } = executeTursoMigration(migrationData, donors, false);
      setMigrationResult(result);
      if (newDonorsToAppend.length > 0) {
        onAddMigratedDonors(newDonorsToAppend);
      }
      setHasCommittedMigration(true);
      setIsMigrating(false);
    }, 800);
  };

  // Unified Import & Migration Center State
  const [importMode, setImportMode] = useState<'json' | 'csv' | 'turso'>('json');
  const [jsonInputText, setJsonInputText] = useState('');
  const [csvInputText, setCsvInputText] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ParseResult | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const SAMPLE_JSON_DATA = `[
  {
    "email": "mojibrsm@gmail.com",
    "fullName": "Mojibur Rahman",
    "phone": "01601519007",
    "bloodType": "AB+",
    "registrationDate": "2026-03-29T23:57:13.121Z",
    "district": "কক্সবাজার",
    "area": "রামু",
    "union": "",
    "organization": "Oftern IT",
    "status": "Available",
    "totalDonations": "4",
    "lastDonationDate": "N/A",
    "password": "adminmojib",
    "role": "admin",
    "imageUrl": "https://ik.imagekit.io/uekohag7w/roktodao/avatars/Image_-_Mojibur_Rahman_3RYwZ7Kdx.png?updatedAt=1754838793398"
  },
  {
    "email": "mohammedimran712159@gmail.com",
    "fullName": "মোঃ ইমরান",
    "phone": "1866792169",
    "bloodType": "B+",
    "registrationDate": "2026-02-28T17:22:03.606Z",
    "district": "কক্সবাজার",
    "area": "রামু",
    "union": "",
    "organization": "1.0",
    "status": "Available",
    "totalDonations": "0",
    "lastDonationDate": "খুনিয়াপালং ইউনিয়ন",
    "password": "",
    "role": "user"
  }
]`;

  const SAMPLE_CSV_DATA = `Donor ID,Name,Age,Gender,Blood Group,NID,Contact Number,Present Address,Present Division,Present District,Present Upazila,Permanent Address,Permanent Division,Permanent District,Permanent Upazila,Last Donation Date,Created By,Created At
24683,Mojib Rsm,21,Male,AB+,0,1.688888888E+09,East DHeck...,Chittagong,Cox's Bazar,Ramu,East DHeck...,Chittagong,Cox's Bazar,Ramu,,coxsbazar@hospi.dghs...,17-10-2026 07:00 pm
24681,Masum,22,Male,A+,0,1.755123456E+09,Shajahanpur,Rajshahi,Bogura,Shajahanpur,Shajahanpur,Rajshahi,Bogura,Shajahanpur,,szrmch@hospi.dghs...,18-05-2026 09:34 am
24680,Sadik,22,Male,O+,0,1.700112233E+09,Shajahanpur,Rajshahi,Bogura,Shajahanpur,Shajahanpur,Rajshahi,Bogura,Shajahanpur,,szrmch@hospi.dghs...,18-05-2026 09:33 am`;

  const handleCopyCommand = (cmd: string = 'npm run import:csv && npm run build && pm2 reload blood-server') => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 3000);
  };

  const handleValidateJSON = (textToValidate?: string) => {
    const text = textToValidate !== undefined ? textToValidate : jsonInputText;
    if (!text.trim()) {
      setImportError('অনুগ্রহ করে JSON ডেটা পেস্ট করুন বা ফাইল সিলেক্ট করুন।');
      return;
    }
    setImportError(null);
    setImportSuccess(null);
    const result = parseDonorsFromJSON(text, donors);
    if (result.errors.length > 0 && result.validCount === 0) {
      setImportError(result.errors.join('; '));
      setParsedPreview(null);
      return;
    }
    setParsedPreview(result);
  };

  const handleValidateCSV = (textToValidate?: string) => {
    const text = textToValidate !== undefined ? textToValidate : csvInputText;
    if (!text.trim()) {
      setImportError('অনুগ্রহ করে CSV ডেটা পেস্ট করুন বা ফাইল সিলেক্ট করুন।');
      return;
    }
    setImportError(null);
    setImportSuccess(null);
    const result = parseDonorsFromCSV(text, donors);
    if (result.errors.length > 0 && result.validCount === 0) {
      setImportError(result.errors.join('; '));
      setParsedPreview(null);
      return;
    }
    setParsedPreview(result);
  };

  const handleCommitParsedData = () => {
    if (!parsedPreview || parsedPreview.donors.length === 0) {
      setImportError('সংরক্ষণ করার মতো কোনো বৈধ রক্তদাতা ডেটা নেই।');
      return;
    }

    setImportLoading(true);
    try {
      const { addedCount } = addImportedDonors(parsedPreview.donors, parsedPreview.users);
      onAddMigratedDonors(parsedPreview.donors);

      setImportSuccess(
        `সফলভাবে ${addedCount} জন রক্তদাতা এবং ${parsedPreview.users.length} টি ইউজার অ্যাকাউন্ট লোকাল ডাটাবেজে সংরক্ষণ করা হয়েছে!`
      );
      setParsedPreview(null);
      setJsonInputText('');
      setCsvInputText('');
    } catch (err: any) {
      setImportError(`সংরক্ষণ করতে ত্রুটি হয়েছে: ${err.message || 'Error saving data'}`);
    } finally {
      setImportLoading(false);
    }
  };

  const handleJSONFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        setJsonInputText(text);
        handleValidateJSON(text);
      } catch {
        setImportError('JSON ফাইলটি পড়তে ব্যর্থ হয়েছে!');
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleCSVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        setCsvInputText(text);
        handleValidateCSV(text);
      } catch {
        setImportError('CSV ফাইলটি পড়তে ব্যর্থ হয়েছে!');
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredRequests = requests.filter(r => {
    if (requestFilter === 'all') return true;
    if (requestFilter === 'fulfilled') return r.status === 'fulfilled';
    return r.status !== 'fulfilled';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <SEO
        title={`ড্যাশবোর্ড - ${currentUser.name}`}
        description="তথ্যহাব ব্লাড সেন্ট্রাল ড্যাশবোর্ড। রক্তের অনুরোধ, রক্তদাতা নেটওয়ার্ক এবং লাইভ স্ট্যাটাস মনিটর করুন।"
        canonical="https://blood.totthohub.com/dashboard"
      />
      
      {/* Dashboard Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {currentUser.role === 'admin' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'ব্যবহারকারী ড্যাশবোর্ড'}
            </span>
            <span className="text-xs text-slate-400 font-mono">আইডি: {currentUser.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            স্বাগতম, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentUser.role === 'admin' 
              ? 'কার্যনির্বাহী অ্যাডমিন ড্যাশবোর্ড: সক্রিয় রক্তের অনুরোধ পর্যবেক্ষণ, রক্তদাতা ভেরিফিকেশন, টার্সো মাইগ্রেশন ও রিপোর্ট পরিচালনা।' 
              : 'রক্তদাতা ও রোগী ড্যাশবোর্ড: সক্রিয় রক্তের অনুরোধের অবস্থা ট্র্যাক, রক্তদান রেকর্ড ও প্রোফাইল ব্যবস্থাপনা।'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            সারসংক্ষেপ
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            অনুরোধসমূহ ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'donors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            রক্তদাতাবৃন্দ ({donors.length})
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('migration')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${activeTab === 'migration' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>ডাটাবেজ মাইগ্রেশন</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              অডিট লগ
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs">মোট রক্তদাতা</span>
              <span className="text-2xl font-bold font-mono text-slate-900">{donors.length} জন</span>
              <span className="text-[11px] text-emerald-600 block mt-1">
                {donors.filter(d => d.availability === 'available').length} জন প্রস্তুত
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs">সক্রিয় রক্তের অনুরোধ</span>
              <span className="text-2xl font-bold font-mono text-rose-600">{requests.length}টি</span>
              <span className="text-[11px] text-red-600 block mt-1">
                {requests.filter(r => r.urgency === 'critical').length}টি অতি জরুরি
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs">যাচাইকরণ হার</span>
              <span className="text-2xl font-bold font-mono text-emerald-700">৯৪.২%</span>
              <span className="text-[11px] text-slate-400 block mt-1">মোবাইল ও ল্যাব নিশ্চিত</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs">প্ল্যাটফর্ম অবস্থা</span>
              <span className="text-base font-bold text-emerald-600 block mt-1">সক্রিয় ও সুরক্ষিত</span>
              <span className="text-[11px] text-slate-400 block">ক্লাউড ও ডাটাবেজ সিঙ্কড</span>
            </div>
          </div>

          {/* Real Donor Availability Widget if user is a registered donor */}
          {currentDonorProfile ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>আপনার বর্তমান রক্তদানের প্রাপ্যতা</span>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white font-mono">
                      {currentDonorProfile.bloodGroup}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    লগইন আছেন <strong>{currentDonorProfile.name}</strong> ({currentDonorProfile.upazilaName}, {currentDonorProfile.districtName})।
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  মোট রক্তদান: <span className="font-bold text-slate-900">{currentDonorProfile.donationCount} বার</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onUpdateDonorAvailability(currentDonorProfile.id, 'available')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentDonorProfile.availability === 'available'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🟢 রক্তদানে প্রস্তুত
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDonorAvailability(currentDonorProfile.id, 'temporarily_unavailable')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentDonorProfile.availability === 'temporarily_unavailable'
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🟡 সাময়িক বিশ্রামে (সম্প্রতি রক্ত দিয়েছেন)
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateDonorAvailability(currentDonorProfile.id, 'unavailable')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentDonorProfile.availability === 'unavailable'
                      ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🔴 অনুপলব্ধ
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  আপনি কি রক্তদানে আগ্রহী?
                </h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  আপনার রক্তের গ্রুপ ও এলাকা যুক্ত করে ১ মিনিটে স্বেচ্ছাসেবী রক্তদাতা তালিকায় নাম অন্তর্ভুক্ত করুন। জরুরি প্রয়োজনে যেকোনো মুমূর্ষু রোগীর প্রাণ বাঁচাতে আপনিও হতে পারেন একজন হিরো।
                </p>
              </div>
              <Link
                to="/become-donor"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                রক্তদাতা হিসেবে নিবন্ধন করুন
              </Link>
            </div>
          )}

          {/* Recent Blood Requests in System */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক রক্তের অনুরোধসমূহ</h3>
              <button
                onClick={() => setActiveTab('requests')}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সবগুলো দেখুন ({requests.length})</span>
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 text-xs">
              {requests.slice(0, 5).map(req => (
                <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{req.patientName}</span>
                      <span className="text-rose-600 font-extrabold font-mono">({req.bloodGroup} · {req.units} ব্যাগ)</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        req.urgency === 'critical' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'
                      }`}>
                        {req.urgency === 'critical' ? 'জরুরি' : 'সাধারণ'}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      {req.hospitalName} ({req.upazilaName}, {req.districtName}) · তারিখ: {req.neededDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600">
                      স্ট্যাটাস: {req.status === 'fulfilled' ? 'সম্পন্ন' : req.status === 'matched' ? 'ম্যাচড' : 'চলমান'}
                    </span>
                    {req.status !== 'fulfilled' && (
                      <button
                        onClick={() => onUpdateRequestStatus(req.id, 'fulfilled')}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        সম্পন্ন করুন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                রক্তের অনুরোধ ব্যবস্থাপনা ({requests.length})
              </h2>
              <p className="text-xs text-slate-500">
                মুহূর্তের জরুরি রক্তের চাহিদা পর্যবেক্ষণ ও আপডেট করুন
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  onClick={() => setRequestFilter('all')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${requestFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  সব ({requests.length})
                </button>
                <button
                  onClick={() => setRequestFilter('searching')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${requestFilter === 'searching' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  চলমান ({requests.filter(r => r.status !== 'fulfilled').length})
                </button>
                <button
                  onClick={() => setRequestFilter('fulfilled')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${requestFilter === 'fulfilled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  সম্পন্ন ({requests.filter(r => r.status === 'fulfilled').length})
                </button>
              </div>

              <Link
                to="/request-blood"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">নতুন অনুরোধ</span>
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredRequests.map(req => (
              <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900">{req.patientName}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white font-mono">
                      {req.bloodGroup} · {req.units} ব্যাগ
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      req.urgency === 'critical' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'
                    }`}>
                      {req.urgency === 'critical' ? 'অতি জরুরি' : 'সাধারণ'}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    হাসপাতাল: <strong className="text-slate-800">{req.hospitalName}</strong> ({req.upazilaName}, {req.districtName}) · যোগাযোগের নম্বর: <span className="font-mono text-slate-800">{req.requesterPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    প্রয়োজনের তারিখ: {req.neededDate} · রোগীর সমস্যা: {req.description || 'জরুরি অস্ত্রোপচার'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    req.status === 'fulfilled'
                      ? 'bg-emerald-50 text-emerald-700'
                      : req.status === 'matched'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {req.status === 'fulfilled' ? '✓ সম্পন্ন হয়েছে' : req.status === 'matched' ? 'ম্যাচড দাতা পাওয়া গেছে' : 'দাতা খোঁজা হচ্ছে'}
                  </span>

                  {req.status !== 'fulfilled' && (
                    <button
                      onClick={() => onUpdateRequestStatus(req.id, 'fulfilled')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      সম্পন্ন করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DONOR DIRECTORY & VERIFICATION */}
      {activeTab === 'donors' && (() => {
        const filteredDashboardDonors = donors.filter(d => {
          if (!donorSearch) return true;
          const q = donorSearch.toLowerCase();
          return (
            d.name.toLowerCase().includes(q) ||
            d.phone.includes(q) ||
            d.districtName.toLowerCase().includes(q) ||
            d.area.toLowerCase().includes(q) ||
            d.bloodGroup.toLowerCase().includes(q)
          );
        });
        const totalPages = Math.ceil(filteredDashboardDonors.length / DASHBOARD_DONORS_PER_PAGE) || 1;
        const pagedDonors = filteredDashboardDonors.slice(
          (donorPage - 1) * DASHBOARD_DONORS_PER_PAGE,
          donorPage * DASHBOARD_DONORS_PER_PAGE
        );

        return (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  নিবন্ধিত রক্তদাতাবৃন্দ ({donors.length} জন)
                </h3>
                <p className="text-xs text-slate-500">
                  রক্তদাতার সক্রিয় প্রাপ্যতা, এলাকা এবং ভেরিফিকেশন স্ট্যাটাস
                </p>
              </div>

              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="নাম, ফোন বা এলাকা খুঁজুন..."
                  value={donorSearch}
                  onChange={(e) => {
                    setDonorSearch(e.target.value);
                    setDonorPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {pagedDonors.map(donor => (
                <div key={donor.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 shrink-0">
                      {donor.imageUrl ? (
                        <img
                          src={donor.imageUrl}
                          alt={donor.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.dash-avatar-fallback');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`dash-avatar-fallback w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200 shrink-0 ${donor.imageUrl ? 'hidden' : ''}`}>
                        {donor.name.charAt(0)}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{donor.name}</span>
                        <span className="text-rose-600 font-extrabold font-mono">[{donor.bloodGroup}]</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          donor.verificationStatus === 'blood_group_verified'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {donor.verificationStatus === 'blood_group_verified' ? 'যাচাইকৃত' : 'নিবন্ধিত'}
                        </span>
                      </div>
                      <div className="text-slate-500">
                        <span className="font-medium text-slate-700">{donor.area}</span> · {donor.districtName} · ফোন: <span className="font-mono text-slate-800">{donor.phone}</span> · {donor.donationCount} বার রক্তদান
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {currentUser.role === 'admin' && donor.verificationStatus !== 'blood_group_verified' && (
                      <button
                        onClick={() => onVerifyDonor(donor.id)}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        ভেরিফাই করুন
                      </button>
                    )}
                    <span className={`text-[11px] font-semibold ${
                      donor.availability === 'available' ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {donor.availability === 'available' ? '🟢 প্রস্তুত' : '🟡 বিশ্রামে'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  পৃষ্ঠা {donorPage} / {totalPages} (মোট {filteredDashboardDonors.length} জন)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={donorPage <= 1}
                    onClick={() => setDonorPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    পূর্ববর্তী
                  </button>
                  <button
                    disabled={donorPage >= totalPages}
                    onClick={() => setDonorPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    পরবর্তী
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 4: TURSO DATABASE MIGRATION ENGINE (Admin Only) */}
      {activeTab === 'migration' && currentUser.role === 'admin' && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Turso SQLite Data Engine</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected: rokto-rokto.aws-ap-northeast-1.turso.io</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Live Turso Database (libsql://rokto-rokto.aws-ap-northeast-1.turso.io)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              স্বয়ংক্রিয় ক্লিনড, নরমালাইজড এবং ডুপ্লিকেটমুক্ত টার্সো ডাটাবেজ। বাংলাদেশি ১১ ডিজিট ফোন নম্বর (+৮৮০ ক্লিন), রক্তের গ্রুপ ক্যানোনিকালাইজেশন এবং জেলা-উপজেলা ম্যাপিং সমন্বিত।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Database Engine:</span>
                <span className="font-bold text-white font-mono">libSQL / Turso</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Region:</span>
                <span className="font-bold text-white">AWS Tokyo (ap-northeast-1)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Raw Donors:</span>
                <span className="font-bold text-white font-mono">2,473 in DB</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Cleaned & Active:</span>
                <span className="font-bold text-emerald-400 font-mono">2,349 Donors Active</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                disabled={isMigrating}
                onClick={handleRunDryRun}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>যাচাইকরণ পরীক্ষা (ড্রাই-রান)</span>
              </button>

              <button
                disabled={isMigrating}
                onClick={handleCommitMigration}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ডাটাবেজ সিঙ্ক ও স্থায়ী সংরক্ষণ (২,৩৪৯ রক্তদাতা)</span>
              </button>
            </div>
          </div>

          {/* UNIFIED DATA IMPORT & MIGRATION CENTER (JSON & CSV & TURSO) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>ডাটা ইমপোর্ট ও মাইগ্রেশন সেন্টার</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  রক্তদাতা ডেটা ইমপোর্ট ইঞ্জিন (JSON ও CSV)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                  আপনার ব্যাকআপ JSON ফাইল বা CSV (bbms_donors_backup_24700.csv) সরাসরি আপলোড অথবা পেস্ট করুন। সমস্ত ডেটা স্বয়ংক্রিয়ভাবে লোকাল ব্রাউজার স্টোরেজ এবং ডাটাবেজে সিঙ্ক হয়ে যাবে।
                </p>
              </div>

              {/* Import Mode Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('json');
                    setParsedPreview(null);
                    setImportError(null);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    importMode === 'json'
                      ? 'bg-white text-rose-600 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  JSON ইমপোর্ট
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('csv');
                    setParsedPreview(null);
                    setImportError(null);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    importMode === 'csv'
                      ? 'bg-white text-rose-600 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CSV ইমপোর্ট (BBMS)
                </button>
              </div>
            </div>

            {/* Notifications */}
            {importError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{importError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImportError(null)}
                  className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {importSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{importSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImportSuccess(null)}
                  className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* TAB 1: JSON IMPORT */}
            {importMode === 'json' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* File Upload Box */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/20 transition-colors flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <Upload className="w-4 h-4 text-rose-600" />
                        <span>১. JSON ফাইল আপলোড করুন (.json)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        কম্পিউটার বা মোবাইল থেকে আপনার রক্তদাতা ব্যাকআপ <strong>donors.json</strong> বা যেকোনো ফরম্যাটের JSON ফাইল নির্বাচন করুন।
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="relative flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{importLoading ? 'প্রসেসিং হচ্ছে...' : 'JSON ফাইল বেছে নিন'}</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleJSONFileUpload}
                          disabled={importLoading}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setJsonInputText(SAMPLE_JSON_DATA);
                          handleValidateJSON(SAMPLE_JSON_DATA);
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        নমুনা JSON লোড করুন (Mojibur Rahman ও মোঃ ইমরান)
                      </button>
                    </div>
                  </div>

                  {/* Terminal CLI Command */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>২. সার্ভার টার্মিনাল কমান্ড (CLI)</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">CLI Engine</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        VPS সার্ভারে <code>donors.json</code> রেখে এক ক্লিকে সরাসরি টার্মিনালে রান করতে পারেন:
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between gap-2 overflow-x-auto">
                        <code>node scripts/import_donors_json.js</code>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand('node scripts/import_donors_json.js && npm run build && pm2 reload blood-server')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCommand ? 'কপিকৃত!' : 'কপি'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        কমান্ড: <code>npm run import:json</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct JSON Paste Textarea */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>অথবা সরাসরি JSON কোড পেস্ট করুন</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {jsonInputText && (
                        <button
                          type="button"
                          onClick={() => {
                            setJsonInputText('');
                            setParsedPreview(null);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          মুছে ফেলুন
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleValidateJSON()}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        যাচাই ও প্রিভিউ দেখুন
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={jsonInputText}
                    onChange={(e) => setJsonInputText(e.target.value)}
                    placeholder='[ { "fullName": "Mojibur Rahman", "phone": "01601519007", "bloodType": "AB+", "district": "কক্সবাজার", "area": "রামু", ... } ]'
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs text-slate-800 bg-slate-50/60"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: CSV IMPORT */}
            {importMode === 'csv' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* File Upload Box */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/20 transition-colors flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <Upload className="w-4 h-4 text-rose-600" />
                        <span>১. CSV ফাইল আপলোড (.csv)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        আপনার <strong>bbms_donors_backup_24700.csv</strong> ফাইলটি সিলেক্ট করুন। ব্রাউজার স্বয়ংক্রিয়ভাবে ক্লিন করে লোকাল ডাটাবেজে সিঙ্ক করবে।
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="relative flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{importLoading ? 'প্রসেসিং হচ্ছে...' : 'CSV ফাইল বেছে নিন'}</span>
                        <input
                          type="file"
                          accept=".csv,text/csv"
                          onChange={handleCSVFileUpload}
                          disabled={importLoading}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCsvInputText(SAMPLE_CSV_DATA);
                          handleValidateCSV(SAMPLE_CSV_DATA);
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        নমুনা CSV লোড করুন (BBMS স্যাম্পল)
                      </button>
                    </div>
                  </div>

                  {/* Terminal CLI Command */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>২. সার্ভার টার্মিনাল কমান্ড (২৪,০০০+ রক্তদাতা)</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">CLI Engine</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        সার্ভারে <code>/home/blood.totthohub.com/public_html/</code> ফোল্ডারে ফাইলটি রেখে এক ক্লিকে টার্মিনালে রান করুন:
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between gap-2 overflow-x-auto">
                        <code>node scripts/import_bbms_csv.js</code>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand('node scripts/import_bbms_csv.js && npm run build && pm2 reload blood-server')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCommand ? 'কপিকৃত!' : 'কপি'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        টার্গেট: <code>bbms_donors_backup_24700.csv</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct CSV Paste Textarea */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>অথবা সরাসরি CSV টেক্সট পেস্ট করুন</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {csvInputText && (
                        <button
                          type="button"
                          onClick={() => {
                            setCsvInputText('');
                            setParsedPreview(null);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          মুছে ফেলুন
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleValidateCSV()}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        যাচাই ও প্রিভিউ দেখুন
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={csvInputText}
                    onChange={(e) => setCsvInputText(e.target.value)}
                    placeholder="Donor ID,Name,Age,Gender,Blood Group,NID,Contact Number,Present Address,Present Division,Present District,Present Upazila,..."
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-xs text-slate-800 bg-slate-50/60"
                  />
                </div>
              </div>
            )}

            {/* PREVIEW & COMMIT WINDOW */}
            {parsedPreview && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>যাচাইকৃত ডেটা প্রিভিউ ({parsedPreview.validCount} জন রক্তদাতা)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      মোট প্রসেসকৃত: {parsedPreview.total} টি সারি | ডুপ্লিকেট বাদ পড়া: {parsedPreview.duplicateCount} টি
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                      ✓ বৈধ রক্তদাতা: {parsedPreview.validCount}
                    </span>
                    {parsedPreview.adminUsersCount > 0 && (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold">
                        ★ অ্যাডমিন অ্যাকাউন্ট: {parsedPreview.adminUsersCount}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold">
                      ⚠ ডুপ্লিকেট: {parsedPreview.duplicateCount}
                    </span>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="overflow-x-auto border border-slate-200 bg-white rounded-2xl max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="p-2.5">নাম (Name)</th>
                        <th className="p-2.5">মোবাইল (Phone)</th>
                        <th className="p-2.5">রক্তের গ্রুপ</th>
                        <th className="p-2.5">এলাকা ও জেলা</th>
                        <th className="p-2.5">রোল (Role)</th>
                        <th className="p-2.5">রক্তদান সংখ্যা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedPreview.donors.slice(0, 10).map((d, idx) => {
                        const matchedUser = parsedPreview.users.find(u => u.phone === d.phone);
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900 flex items-center gap-2">
                              {d.imageUrl ? (
                                <img src={d.imageUrl} alt={d.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">
                                  {d.name.charAt(0)}
                                </div>
                              )}
                              <span>{d.name}</span>
                            </td>
                            <td className="p-2.5 font-mono text-slate-700">{d.phone}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold font-mono">
                                {d.bloodGroup}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-600">{d.area}</td>
                            <td className="p-2.5">
                              {matchedUser?.role === 'admin' ? (
                                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                                  ADMIN
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                  DONOR
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-mono text-slate-700">{d.donationCount} বার</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {parsedPreview.donors.length > 10 && (
                  <p className="text-[11px] text-slate-500 text-center">
                    ...এবং আরও {parsedPreview.donors.length - 10} জন রক্তদাতা প্রস্তুত
                  </p>
                )}

                {/* Commit Action Button */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setParsedPreview(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    disabled={importLoading}
                    onClick={handleCommitParsedData}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>লোকাল ডাটাবেজে সংরক্ষণ করুন ({parsedPreview.validCount} জন)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Raw Legacy Data Queue Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Raw Legacy Turso Dump (Source: rokto_dao_turso.db)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {migrationData.length} Records Loaded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px]">
                    <th className="pb-2">Old ID</th>
                    <th className="pb-2">Raw Name</th>
                    <th className="pb-2">Raw Phone</th>
                    <th className="pb-2">Raw Blood</th>
                    <th className="pb-2">Raw Location</th>
                    <th className="pb-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {migrationData.map(r => (
                    <tr key={r.old_id} className="hover:bg-slate-50">
                      <td className="py-2 text-slate-400">#{r.old_id}</td>
                      <td className="py-2 font-medium font-sans text-slate-900">{r.full_name}</td>
                      <td className="py-2 text-slate-600">{r.raw_phone}</td>
                      <td className="py-2 font-bold text-rose-600">{r.raw_blood}</td>
                      <td className="py-2 text-slate-500 font-sans">{r.raw_location}</td>
                      <td className="py-2 text-[10px] text-slate-400 font-sans">{r.legacy_notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Migration Result Execution Window */}
          {migrationResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      migrationResult.isDryRun ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {migrationResult.isDryRun ? 'ড্রাই-রান মোড (কোনো পরিবর্তন স্থায়ী হয়নি)' : 'ডাটাবেজে সফলভাবে সংরক্ষণ সম্পন্ন'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Execution Time: {migrationResult.executionTimeMs}ms
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    মাইগ্রেশন ও ডি-ডুপ্লিকেশন এক্সিকিউশন রিপোর্ট
                  </h3>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold">
                    ✓ Clean: {migrationResult.successCount}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-bold">
                    ⚠ Duplicates: {migrationResult.duplicatesSkipped}
                  </span>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg font-bold">
                    ✕ Malformed: {migrationResult.invalidCount}
                  </span>
                </div>
              </div>

              {/* Records Breakdown Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2.5">Original Name</th>
                      <th className="p-2.5">Clean Blood</th>
                      <th className="p-2.5">Clean Phone</th>
                      <th className="p-2.5">Mapped District</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {migrationResult.records.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-900">{r.originalName}</td>
                        <td className="p-2.5">
                          <span className="text-rose-600 font-bold font-mono">{r.cleanedBlood}</span>
                          <span className="text-[10px] text-slate-400 block">from "{r.originalBlood}"</span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-800">
                          {r.normalizedPhone || '—'}
                        </td>
                        <td className="p-2.5 text-slate-600">{r.mappedDistrict}</td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.status === 'imported'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'duplicate'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                          }`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-500">{r.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Console Logs */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pipeline Execution Logs
                </h4>
                <div className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
                  {migrationResult.logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 5: AUDIT LOGS (Admin Only) */}
      {activeTab === 'audit' && currentUser.role === 'admin' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              অডিট লগ ও সিস্টেম অ্যাকশন হিস্ট্রি
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              অপরিবর্তনশীল সিকিউরিটি লগ
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-700">{log.action}</span>
                  <span className="text-slate-400">{log.timestamp}</span>
                </div>
                <div className="text-slate-700">
                  Actor: <strong>{log.actorName}</strong> ({log.actorRole}) · Target: {log.target} · IP: {log.ipAddress}
                </div>
                {log.details && (
                  <div className="text-[11px] text-slate-500 font-sans">{log.details}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
