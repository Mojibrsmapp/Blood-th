import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Filter, 
  X, 
  Heart, 
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Donor, BloodGroup } from '../types';
import { DISTRICTS } from '../data/seedData';
import { SEO } from '../components/SEO';

interface FindDonorsViewProps {
  donors: Donor[];
  initialBloodGroup?: BloodGroup;
  initialDistrict?: string;
  initialUpazila?: string;
  onSelectDonor: (donor: Donor) => void;
  onContactDonor: (donor: Donor) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const SLUG_TO_GROUP: Record<string, BloodGroup> = {
  'a-positive': 'A+',
  'a-plus': 'A+',
  'a-negative': 'A-',
  'a-minus': 'A-',
  'b-positive': 'B+',
  'b-plus': 'B+',
  'b-negative': 'B-',
  'b-minus': 'B-',
  'o-positive': 'O+',
  'o-plus': 'O+',
  'o-negative': 'O-',
  'o-minus': 'O-',
  'ab-positive': 'AB+',
  'ab-plus': 'AB+',
  'ab-negative': 'AB-',
  'ab-minus': 'AB-'
};

export const FindDonorsView: React.FC<FindDonorsViewProps> = ({
  donors,
  initialBloodGroup,
  initialDistrict,
  initialUpazila,
  onSelectDonor,
  onContactDonor
}) => {
  const { groupSlug } = useParams<{ groupSlug?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resolvedGroupFromSlug = groupSlug ? SLUG_TO_GROUP[groupSlug.toLowerCase()] : undefined;
  const resolvedGroupFromQuery = searchParams.get('group') as BloodGroup || undefined;
  const resolvedDistrictFromQuery = searchParams.get('district') || undefined;

  const [selectedGroup, setSelectedGroup] = useState<string>(
    resolvedGroupFromSlug || resolvedGroupFromQuery || initialBloodGroup || ''
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    resolvedDistrictFromQuery || initialDistrict || ''
  );
  const [selectedUpazila, setSelectedUpazila] = useState<string>(initialUpazila || '');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [withPhotoOnly, setWithPhotoOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync if URL param changes
  useEffect(() => {
    if (groupSlug && SLUG_TO_GROUP[groupSlug.toLowerCase()]) {
      setSelectedGroup(SLUG_TO_GROUP[groupSlug.toLowerCase()]);
    }
  }, [groupSlug]);

  const ITEMS_PER_PAGE = 24;

  const currentDistrictObj = DISTRICTS.find(d => d.id === selectedDistrict);

  // Filtered Donors
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      if (selectedGroup && d.bloodGroup !== selectedGroup) return false;
      if (selectedDistrict && d.districtId !== selectedDistrict) return false;
      if (selectedUpazila && d.upazilaName.toLowerCase() !== selectedUpazila.toLowerCase()) return false;
      if (availabilityFilter === 'available' && d.availability !== 'available') return false;
      if (verifiedOnly && d.verificationStatus === 'pending') return false;
      if (withPhotoOnly && (!d.imageUrl || d.imageUrl.length < 5)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesArea = d.area.toLowerCase().includes(q);
        const matchesUpazila = d.upazilaName.toLowerCase().includes(q);
        const matchesPhone = d.phone.includes(q);
        if (!matchesName && !matchesArea && !matchesUpazila && !matchesPhone) return false;
      }
      return true;
    });
  }, [donors, selectedGroup, selectedDistrict, selectedUpazila, availabilityFilter, verifiedOnly, withPhotoOnly, searchQuery]);

  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE) || 1;
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDonors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDonors, currentPage]);

  const handleFilterChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedGroup('');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setAvailabilityFilter('all');
    setVerifiedOnly(false);
    setWithPhotoOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const seoTitle = selectedGroup 
    ? `${selectedGroup} রক্তের রক্তদাতা খুঁজুন - জরুরি ডোনার তালিকা` 
    : currentDistrictObj 
    ? `${currentDistrictObj.bangla} জেলায় রক্তদাতা খুঁজুন` 
    : 'রক্তদাতা খুঁজুন - সমগ্র বাংলাদেশের রক্তদাতা তালিকা';

  const seoDescription = selectedGroup 
    ? `${selectedGroup} গ্রুপের সক্রিয় রক্তদাতাদের তালিকা। জরুরি প্রয়োজনে সরাসরি ফোন কলে যোগাযোগ করে রক্ত সংগ্রহ করুন।` 
    : 'রামু, কক্সবাজার, চট্টগ্রাম, ঢাকাসহ সমগ্র বাংলাদেশের স্বেচ্ছাসেবী রক্তদাতাদের তালিকা থেকে সহজে খুঁজুন এবং যোগাযোগ করুন।';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonical={`https://blood.totthohub.com/donors${groupSlug ? `/${groupSlug}` : ''}`}
        keywords={`রক্তদাতা, ${selectedGroup || 'রক্তের গ্রুপ'}, ডোনার খুঁজুন, ব্লাড ডোনেশন, ${currentDistrictObj ? currentDistrictObj.bangla : 'বাংলাদেশ'}`}
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            রক্তদাতা খুঁজুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            রামু, কক্সবাজার, চট্টগ্রাম, ঢাকাসহ সমগ্র বাংলাদেশের বিশ্বস্ত ও স্বেচ্ছাসেবী রক্তদাতাদের তালিকা থেকে সহজে খুঁজুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            মোট <strong>{donors.length}</strong> জনের মধ্যে <strong>{filteredDonors.length}</strong> জন প্রদর্শিত
          </span>
          {(selectedGroup || selectedDistrict || selectedUpazila || searchQuery || verifiedOnly || withPhotoOnly || availabilityFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>ফিল্টার মুছুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Top search & Blood group selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              রক্তদাতা বা এলাকার নাম
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="যেমন: রহিম, রামু, কলাতলী..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              রক্তের গ্রুপ
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">সকল রক্তের গ্রুপ</option>
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg} গ্রুপ</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              জেলা
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedUpazila('');
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">সকল জেলা (বাংলাদেশ)</option>
              {DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.bangla})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              উপজেলা / এলাকা
            </label>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              disabled={!currentDistrictObj}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">সকল উপজেলা</option>
              {currentDistrictObj?.upazilas.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Secondary toggles (interactive buttons/checkboxes) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">প্রাপ্যতা:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  availabilityFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সকল অবস্থা
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  availabilityFilter === 'available' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🟢 রক্তদানে প্রস্তুত
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 border-slate-300"
            />
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ✓ শুধু যাচাইকৃত দাতা
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={withPhotoOnly}
              onChange={(e) => handleFilterChange(setWithPhotoOnly, e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 border-slate-300"
            />
            <span className="flex items-center gap-1 font-medium">
              <span className="text-xs">📸</span>
              শুধু ছবিসহ দাতা
            </span>
          </label>

        </div>

      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">কোনো রক্তদাতা পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              আপনার নির্বাচিত ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি। জেলা পরিবর্তন করুন অথবা সকল রক্তের গ্রুপ নির্বাচন করে আবার চেষ্টা করুন।
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            সকল ফিল্টার মুছে ফেলুন
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedDonors.map(donor => {
              const isAvailable = donor.availability === 'available';
              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
                >
                  {/* Top Row: Avatar, Name, Blood Group */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 shrink-0">
                          {donor.imageUrl ? (
                            <img 
                              src={donor.imageUrl} 
                              alt={donor.name} 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.donor-avatar-fallback');
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`donor-avatar-fallback w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base border border-slate-200 shrink-0 ${donor.imageUrl ? 'hidden' : ''}`}>
                            {donor.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {donor.name}
                          </h3>
                          {/* Location */}
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5" title={donor.area}>
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[170px] sm:max-w-[200px]">{donor.area || `${donor.upazilaName}, ${donor.districtName}`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className={isAvailable ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-medium'}>
                        {isAvailable ? '🟢 রক্তদানে প্রস্তুত' : '🟡 বিশ্রামে আছেন'}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{donor.donationCount} বার রক্তদান</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{donor.verificationStatus === 'blood_group_verified' ? 'গ্রুপ যাচাইকৃত' : 'মোবাইল যাচাইকৃত'}</span>
                      </span>
                    </div>

                    {/* Bio or area note */}
                    {donor.bio && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {donor.bio}
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      to={`/donor/${donor.id}`}
                      onClick={() => onSelectDonor(donor)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors text-center block"
                    >
                      প্রোফাইল দেখুন
                    </Link>

                    <button
                      onClick={() => onContactDonor(donor)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>যোগাযোগ করুন</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              >
                পূর্ববর্তী পৃষ্ঠা
              </button>

              <div className="text-xs font-medium text-slate-600">
                পৃষ্ঠা <span className="font-bold text-slate-900">{currentPage}</span> / <span className="font-bold text-slate-900">{totalPages}</span> (মোট {filteredDonors.length} জন রক্তদাতা)
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              >
                পরবর্তী পৃষ্ঠা
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
