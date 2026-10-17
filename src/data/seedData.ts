import { Donor, BloodRequest, Hospital, BloodBank, Campaign, Organization, AuditLog, NotificationItem, TursoRawDonorRecord } from '../types';
import importedTursoDonors from './tursoImportedDonors.json';
import importedTursoRequests from './tursoImportedRequests.json';

export const DISTRICTS = [
  { id: 'cox-bazar', name: "Cox's Bazar", bangla: 'কক্সবাজার', upazilas: ['Ramu', "Cox's Bazar Sadar", 'Maheshkhali', 'Kutubdia', 'Ukhia', 'Chakaria', 'Pekua', 'Teknaf'] },
  { id: 'chattogram', name: 'Chattogram', bangla: 'চট্টগ্রাম', upazilas: ['Panchlaish', 'Baluchara', 'Kotwali', 'Hathazari', 'Sitakunda', 'Patiya', 'Raozan', 'Mirsharai', 'Boalkhali', 'Chandanaish'] },
  { id: 'cumilla', name: 'Cumilla', bangla: 'কুমিল্লা', upazilas: ['Cumilla Adarsha Sadar', 'Laksam', 'Debidwar', 'Chandina', 'Cantonment', 'Barura'] },
  { id: 'lakshmipur', name: 'Lakshmipur', bangla: 'লক্ষ্মীপুর', upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'] },
  { id: 'noakhali', name: 'Noakhali', bangla: 'নোয়াখালী', upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companyganj', 'Hatiya', 'Senbagh'] },
  { id: 'feni', name: 'Feni', bangla: 'ফেনী', upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi'] },
  { id: 'brahmanbaria', name: 'Brahmanbaria', bangla: 'ব্রাহ্মণবাড়িয়া', upazilas: ['Brahmanbaria Sadar', 'Ashuganj', 'Kasba', 'Nabinagar', 'Sarail'] },
  { id: 'chandpur', name: 'Chandpur', bangla: 'চাঁদপুর', upazilas: ['Chandpur Sadar', 'Faridganj', 'Hajiganj', 'Matlab', 'Shahrasti'] },
  { id: 'khagrachhari', name: 'Khagrachhari', bangla: 'খাগড়াছড়ি', upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Ramgarh', 'Manikchhari', 'Matiranga'] },
  { id: 'bandarban', name: 'Bandarban', bangla: 'বান্দরবান', upazilas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Lama', 'Alikadam'] },
  { id: 'rangamati', name: 'Rangamati', bangla: 'রাঙ্গামাটি', upazilas: ['Rangamati Sadar', 'Kaptai', 'Baghaichhari', 'Barkal'] },
  { id: 'dhaka', name: 'Dhaka', bangla: 'ঢাকা', upazilas: ['Mirpur', 'Uttara', 'Mohammadpur', 'Dhanmondi', 'Badda', 'Savar', 'Mirpur DOHS', 'Gulshan', 'Tejgaon', 'Motijheel'] },
  { id: 'mymensingh', name: 'Mymensingh', bangla: 'ময়মনসিংহ', upazilas: ['Phulpur', 'Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka'] },
  { id: 'sherpur', name: 'Sherpur', bangla: 'শেরপুর', upazilas: ['Sherpur Sadar', 'Nakla', 'Jhenaigati', 'Nalitabari', 'Sreebardi'] },
  { id: 'gazipur', name: 'Gazipur', bangla: 'গাজীপুর', upazilas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Sreepur', 'Kapasia'] },
  { id: 'narayanganj', name: 'Narayanganj', bangla: 'নারায়ণগঞ্জ', upazilas: ['Narayanganj Sadar', 'Sonargaon', 'Rupganj', 'Araihazar', 'Bandar'] },
  { id: 'tangail', name: 'Tangail', bangla: 'টাঙ্গাইল', upazilas: ['Tangail Sadar', 'Mirzapur', 'Kalihati', 'Madhupur'] },
  { id: 'sylhet', name: 'Sylhet', bangla: 'সিলেট', upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Biswanath'] },
  { id: 'bogura', name: 'Bogura', bangla: 'বগুড়া', upazilas: ['Shajahanpur', 'Shibganj', 'Bogra Sadar', 'Sherpur', 'Gabtali', 'Kahaloo', 'Dhunat', 'Nandigram', 'Sariakandi', 'Sonatola', 'Adamdighi', 'Dupchanchia'] },
  { id: 'rajshahi', name: 'Rajshahi', bangla: 'রাজশাহী', upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Paba', 'Godagari', 'Bagmara', 'Charghat', 'Durgapur', 'Puthia', 'Tanore'] },
  { id: 'sirajganj', name: 'Sirajganj', bangla: 'সিরাজগঞ্জ', upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullapara'] },
  { id: 'naogaon', name: 'Naogaon', bangla: 'নওগাঁ', upazilas: ['Naogaon Sadar', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'] },
  { id: 'natore', name: 'Natore', bangla: 'নাটোর', upazilas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra'] },
  { id: 'joypurhat', name: 'Joypurhat', bangla: 'জয়পুরহাট', upazilas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'] },
  { id: 'chapainawabganj', name: 'Chapainawabganj', bangla: 'চাঁপাইনবাবগঞ্জ', upazilas: ['Chapainawabganj Sadar', 'Gomastapur', 'Nachole', 'Bholahat', 'Shibganj'] },
  { id: 'pabna', name: 'Pabna', bangla: 'পাবনা', upazilas: ['Pabna Sadar', 'Ishwardi', 'Santhia', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Sujanagar'] },
  { id: 'khulna', name: 'Khulna', bangla: 'খুলনা', upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Rupsha', 'Dighalia', 'Batiaghata', 'Dumuria', 'Paikgachha', 'Koyra'] },
  { id: 'jashore', name: 'Jashore', bangla: 'যশোর', upazilas: ['Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Manirampur', 'Sharsha'] },
  { id: 'kushtia', name: 'Kushtia', bangla: 'কুষ্টিয়া', upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Daulatpur', 'Mirpur', 'Bheramara', 'Khoksa'] },
  { id: 'barishal', name: 'Barishal', bangla: 'বরিশাল', upazilas: ['Barishal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'] },
  { id: 'patuakhali', name: 'Patuakhali', bangla: 'পটুয়াখালী', upazilas: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Dumki'] },
  { id: 'rangpur', name: 'Rangpur', bangla: 'রংপুর', upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Pirgachha', 'Kaunia', 'Mithapukur', 'Pirganj', 'Taraganj'] },
  { id: 'dinajpur', name: 'Dinajpur', bangla: 'দিনাজপুর', upazilas: ['Dinajpur Sadar', 'Birganj', 'Parbatipur', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Birampur', 'Biral'] },
  { id: 'kurigram', name: 'Kurigram', bangla: 'কুড়িগ্রাম', upazilas: ['Kurigram Sadar', 'Ulipur', 'Nageshwari', 'Bhurungamari', 'Chilmari', 'Phulbari', 'Rajarhat', 'Rajibpur', 'Rowmari'] },
  { id: 'gaibandha', name: 'Gaibandha', bangla: 'গাইবান্ধা', upazilas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj', 'Phulchhari'] },
  { id: 'sylhet', name: 'Sylhet', bangla: 'সিলেট', upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Biswanath', 'Companiganj', 'Fenchuganj', 'Balaganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'South Surma'] },
  { id: 'moulvibazar', name: 'Moulvibazar', bangla: 'মৌলভীবাজার', upazilas: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'] },
  { id: 'habiganj', name: 'Habiganj', bangla: 'হবিগঞ্জ', upazilas: ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniachang', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj'] },
  { id: 'sunamganj', name: 'Sunamganj', bangla: 'সুনামগঞ্জ', upazilas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Dharampasha', 'Dowarabazar', 'Tahirpur'] },
  { id: 'jamalpur', name: 'Jamalpur', bangla: 'জামালপুর', upazilas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Bakshiganj', 'Madarganj'] }
];

export const INITIAL_DONORS: Donor[] = importedTursoDonors as Donor[];

export const INITIAL_REQUESTS: BloodRequest[] = [
  ...(importedTursoRequests as BloodRequest[]),
  {
    id: 'req-101',
    uuid: 'uuid-req-101',
    userId: 'user-req-1',
    requesterName: 'Alamgir Hossain',
    requesterPhone: '01822334455',
    patientName: 'Morium Begum (Mother)',
    bloodGroup: 'O+',
    units: 2,
    hospitalName: "Cox's Bazar District Sadar Hospital",
    hospitalId: 'hosp-1',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaId: 'cox-bazar-sadar',
    upazilaName: "Cox's Bazar Sadar",
    locationDetails: 'Gynecology Ward, Bed 14, 2nd Floor',
    neededDate: 'Today (Within 3 Hours)',
    neededTime: 'Urgent Evening',
    urgency: 'critical',
    description: 'Post-cesarean delivery complications, heavy bleeding. 2 bags of O+ blood needed urgently. Cross-matching sample ready at hospital pathology.',
    status: 'searching',
    approvedBy: 'Moderator Kamal',
    matchedDonorIds: ['donor-1', 'donor-2'],
    contactCount: 2,
    createdAt: '2026-10-03T03:15:00Z',
    updatedAt: '2026-10-03T04:20:00Z'
  },
  {
    id: 'req-102',
    uuid: 'uuid-req-102',
    userId: 'user-req-2',
    requesterName: 'Dr. Shahabuddin',
    requesterPhone: '01733445566',
    patientName: 'Farhan Kabir (Child, 8 yrs)',
    bloodGroup: 'B+',
    units: 1,
    hospitalName: 'Chittagong Medical College Hospital (CMCH)',
    hospitalId: 'hosp-2',
    districtId: 'chattogram',
    districtName: 'Chattogram',
    upazilaId: 'panchlaish',
    upazilaName: 'Panchlaish',
    locationDetails: 'Pediatric Hematology Unit, Ward 8',
    neededDate: 'Tomorrow Morning',
    neededTime: '10:00 AM',
    urgency: 'urgent',
    description: 'Thalassemia patient routine transfusion required. Hemoglobin level dropped to 6.2 gm/dl. Fresh whole blood requested.',
    status: 'matched',
    approvedBy: 'Admin Farhana',
    matchedDonorIds: ['donor-3'],
    contactCount: 1,
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-02T18:00:00Z'
  },
  {
    id: 'req-103',
    uuid: 'uuid-req-103',
    userId: 'user-req-3',
    requesterName: 'Mehedi Hasan',
    requesterPhone: '01955667788',
    patientName: 'Kamal Pasha',
    bloodGroup: 'O-',
    units: 3,
    hospitalName: 'Dhaka Medical College Hospital (DMCH)',
    hospitalId: 'hosp-3',
    districtId: 'dhaka',
    districtName: 'Dhaka',
    upazilaId: 'dhanmondi',
    upazilaName: 'Dhanmondi',
    locationDetails: 'Neurosurgery ICU, DMCH New Building',
    neededDate: 'Today Immediate',
    neededTime: 'Emergency',
    urgency: 'critical',
    description: 'Road traffic accident trauma surgery. Urgent O-negative donors requested. Patient in critical care operation theater.',
    status: 'searching',
    approvedBy: 'Founder Mojibur',
    matchedDonorIds: ['donor-4'],
    contactCount: 3,
    createdAt: '2026-10-03T01:45:00Z',
    updatedAt: '2026-10-03T04:45:00Z'
  },
  {
    id: 'req-104',
    uuid: 'uuid-req-104',
    userId: 'user-req-4',
    requesterName: 'Abdul Mannan',
    requesterPhone: '01811998877',
    patientName: 'Anowar Hossain',
    bloodGroup: 'A+',
    units: 1,
    hospitalName: 'Ramu Upazila Health Complex',
    hospitalId: 'hosp-4',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaId: 'ramu',
    upazilaName: 'Ramu',
    locationDetails: 'Male Surgical Ward, Ramu',
    neededDate: '2026-09-30',
    neededTime: '2:00 PM',
    urgency: 'normal',
    description: 'Minor abdominal surgery. 1 unit A+ successfully arranged and transfused.',
    status: 'fulfilled',
    approvedBy: 'Admin Farhana',
    fulfilledAt: '2026-09-30T16:30:00Z',
    matchedDonorIds: ['donor-2'],
    contactCount: 1,
    createdAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-09-30T16:30:00Z'
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: "Cox's Bazar 250-Bed District Sadar Hospital",
    banglaName: 'কক্সবাজার ২৫০ শয্যা বিশিষ্ট জেলা সদর হাসপাতাল',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaName: "Cox's Bazar Sadar",
    address: 'Hospital Road, Cox\'s Bazar',
    phone: '01712-456789',
    emergencyHotline: '0341-63456',
    services: ['24/7 Emergency', 'Blood Transfusion Unit', 'ICU', 'Pathology Lab', 'Maternity Ward'],
    hasBloodBank: true,
    isVerified: true
  },
  {
    id: 'hosp-2',
    name: 'Chittagong Medical College Hospital (CMCH)',
    banglaName: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল',
    districtId: 'chattogram',
    districtName: 'Chattogram',
    upazilaName: 'Panchlaish',
    address: '57 K.B. Fazlul Kader Road, Panchlaish, Chattogram',
    phone: '01819-334455',
    emergencyHotline: '031-619400',
    services: ['Tertiary Care', 'Central Blood Bank', 'Thalassemia Center', 'Major Trauma ICU', 'Burn & Plastic Unit'],
    hasBloodBank: true,
    isVerified: true
  },
  {
    id: 'hosp-3',
    name: 'Dhaka Medical College Hospital (DMCH)',
    banglaName: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    districtId: 'dhaka',
    districtName: 'Dhaka',
    upazilaName: 'Dhanmondi',
    address: 'Secretariat Road, Ramna, Dhaka',
    phone: '01711-889900',
    emergencyHotline: '02-55165088',
    services: ['National Referral Hospital', 'Transfusion Medicine Department', 'Trauma Center', '24/7 Blood Screening'],
    hasBloodBank: true,
    isVerified: true
  },
  {
    id: 'hosp-4',
    name: 'Ramu 50-Bed Upazila Health Complex',
    banglaName: 'রামু উপজেলা স্বাস্থ্য কমপ্লেক্স',
    districtId: 'cox-bazar',
    districtName: "Cox's Bazar",
    upazilaName: 'Ramu',
    address: 'Chowmuhani - Ukhia Road, Ramu, Cox\'s Bazar',
    phone: '01730-324680',
    emergencyHotline: '01730-324680',
    services: ['24/7 Emergency', 'Normal Delivery Clinic', 'Diagnostic Pathology', 'Observation Ward'],
    hasBloodBank: false,
    isVerified: true
  },
  {
    id: 'hosp-5',
    name: 'Sylhet MAG Osmani Medical College Hospital',
    banglaName: 'সিলেট এম এ জি ওসমানী মেডিকেল কলেজ হাসপাতাল',
    districtId: 'sylhet',
    districtName: 'Sylhet',
    upazilaName: 'Sylhet Sadar',
    address: 'Kajalshah, Sylhet 3100',
    phone: '01713-198765',
    emergencyHotline: '0821-713487',
    services: ['Tertiary Care', 'Blood Transfusion Medicine', 'Pediatric ICU', 'Hemodialysis'],
    hasBloodBank: true,
    isVerified: true
  }
];

export const INITIAL_BLOOD_BANKS: BloodBank[] = [
  {
    id: 'bb-1',
    name: "Red Crescent Blood Center, Cox's Bazar",
    districtName: "Cox's Bazar",
    upazilaName: "Cox's Bazar Sadar",
    address: 'Red Crescent Bhaban, Jhawtala, Cox\'s Bazar',
    phone: '01815-667788',
    openingHours: '24 Hours (7 Days)',
    isVerified: true,
    notes: 'Official Red Crescent testing and component separation facility.'
  },
  {
    id: 'bb-2',
    name: 'Sandhani CMCH Blood Bank',
    districtName: 'Chattogram',
    upazilaName: 'Panchlaish',
    address: 'CMCH Campus, Gate 1, Chattogram',
    phone: '01712-112233',
    openingHours: '8:00 AM - 10:00 PM (Emergency 24/7 on call)',
    isVerified: true,
    notes: 'Student-run non-profit blood bank with rigorous viral marker screening.'
  },
  {
    id: 'bb-3',
    name: 'Quantum Blood Bank, Dhaka',
    districtName: 'Dhaka',
    upazilaName: 'Dhanmondi',
    address: 'Shantinagar / Dhanmondi, Dhaka',
    phone: '01714-010869',
    openingHours: '24 Hours (7 Days)',
    isVerified: true,
    notes: 'Equipped with nucleic acid testing (NAT) and cell separators.'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Ramu Community Blood Donation Drive 2026',
    slug: 'ramu-blood-drive-2026',
    organizerName: 'TotthoHub Blood Volunteers & Ramu Blood Association',
    organizerType: 'volunteer_group',
    districtName: "Cox's Bazar",
    venue: 'Ramu Khizaree High School Ground, Ramu',
    date: '18 October 2026',
    time: '9:00 AM - 4:00 PM',
    description: 'Special seasonal blood collection camp focused on building reserve stock for local road accidents and thalassemia children in Ramu and Cox\'s Bazar.',
    targetUnits: 150,
    registeredDonorsCount: 94,
    status: 'upcoming'
  },
  {
    id: 'camp-2',
    title: 'World Blood Donor Day Youth Camp - CMCH',
    slug: 'cmch-youth-blood-camp',
    organizerName: 'Sandhani Chittagong Medical College Unit',
    organizerType: 'college',
    districtName: 'Chattogram',
    venue: 'CMCH Auditorium Complex, Panchlaish',
    date: '25 October 2026',
    time: '8:30 AM - 5:00 PM',
    description: 'Awareness seminar on voluntary blood donation, free blood grouping for 500 visitors, and donor felicitation program.',
    targetUnits: 250,
    registeredDonorsCount: 182,
    status: 'upcoming'
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Bangladesh Red Crescent Society (Cox\'s Bazar Unit)',
    slug: 'red-crescent-coxsbazar',
    tagline: 'Always by the side of humanity in disasters and medical emergencies.',
    description: 'Providing voluntary blood donation services, disaster relief, and youth volunteer mobilization across Cox\'s Bazar district and camps.',
    districtName: "Cox's Bazar",
    phone: '01819-001122',
    email: 'coxsbazar@redcrescent.org.bd',
    website: 'https://redcrescent.org.bd',
    isVerified: true,
    activeVolunteersCount: 42,
    totalDonationsCoordinated: 1840
  },
  {
    id: 'org-2',
    name: 'Sandhani (Chittagong Medical College Unit)',
    slug: 'sandhani-cmch',
    tagline: 'Serving humanity with tears and joy through voluntary blood and eye donation.',
    description: 'Pioneer medical student organization dedicated to regular voluntary blood donation, component therapy, and post-donation care.',
    districtName: 'Chattogram',
    phone: '01712-112233',
    email: 'sandhani.cmch@gmail.com',
    website: 'https://sandhani.org',
    isVerified: true,
    activeVolunteersCount: 65,
    totalDonationsCoordinated: 3420
  },
  {
    id: 'org-3',
    name: 'Badhan (Voluntary Blood Donors Organization)',
    slug: 'badhan-central',
    tagline: 'One unit of blood can save up to three lives.',
    description: 'Operating in colleges and universities across Bangladesh to instill a culture of altruistic regular blood donation among university students.',
    districtName: 'Dhaka',
    phone: '01534-778899',
    email: 'contact@badhan.org',
    website: 'https://badhan.org',
    isVerified: true,
    activeVolunteersCount: 120,
    totalDonationsCoordinated: 6890
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorName: 'Mojibur Rahman',
    actorRole: 'founder',
    action: 'SYSTEM_BOOTSTRAP',
    target: 'TotthoHub Blood Core Platform',
    ipAddress: '103.114.98.12',
    timestamp: '2026-10-03T04:10:00Z',
    details: 'Initialized TotthoHub Blood production services, role definitions, and canonical location mapping.'
  },
  {
    id: 'log-2',
    actorName: 'Farhana Sultana',
    actorRole: 'admin',
    action: 'DONOR_VERIFIED',
    target: 'Donor #donor-1 (Md. Rahim Ullah)',
    ipAddress: '103.114.98.45',
    timestamp: '2026-10-03T04:15:00Z',
    details: 'Verified phone OTP and confirmed donor physical eligibility record.'
  },
  {
    id: 'log-3',
    actorName: 'Kamal Uddin',
    actorRole: 'moderator',
    action: 'REQUEST_APPROVED',
    target: 'Blood Request #req-101 (Morium Begum - O+)',
    ipAddress: '119.30.38.19',
    timestamp: '2026-10-03T04:22:00Z',
    details: 'Cross-checked emergency hospital contact at Cox\'s Bazar Sadar Hospital.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: '🚨 Emergency O+ Blood Request in Cox\'s Bazar Sadar',
    message: 'Morium Begum needs 2 bags of O+ blood urgently at Cox\'s Bazar District Sadar Hospital.',
    type: 'emergency',
    read: false,
    timestamp: '15 mins ago',
    link: '/request/req-101'
  },
  {
    id: 'notif-2',
    userId: 'user-donor-1',
    title: '🩸 Direct Matching Match Found',
    message: 'Your profile is matched for an urgent O+ blood request in Ramu / Cox\'s Bazar Sadar.',
    type: 'match',
    read: false,
    timestamp: '30 mins ago',
    link: '/request/req-101'
  },
  {
    id: 'notif-3',
    userId: 'all',
    title: 'Upcoming Campaign: Ramu Blood Drive 2026',
    message: 'Registration is now open for the community blood drive on 18 October 2026.',
    type: 'campaign',
    read: true,
    timestamp: '2 hours ago',
    link: '/campaigns'
  }
];

// Sample raw legacy data dump representing old RoktoDao / Turso database with common real-world formatting anomalies:
// - Different blood group spelling ("A positive", "o+", "B POSITIVE", "AB Neg")
// - Phone number variants ("+8801812345678", "8801755123456", "01688112233")
// - Location casing and Bangla variants ("Cox Bazar", "Coxsbazar", "কক্সবাজার", "Ramu")
// - Duplicate phone numbers to demonstrate the deduplication pipeline
export const SAMPLE_TURSO_LEGACY_DUMP: TursoRawDonorRecord[] = [
  {
    old_id: 1001,
    full_name: 'Anisur Rahman',
    raw_phone: '+8801819900112',
    raw_blood: 'A positive',
    raw_location: 'Coxsbazar, Ramu',
    last_donated_str: '2026-03-10',
    legacy_notes: 'Migrated from RoktoDao v1 SQLite table donors'
  },
  {
    old_id: 1002,
    full_name: 'Mizanur Rahman',
    raw_phone: '8801722334455',
    raw_blood: 'O POSITIVE',
    raw_location: 'Cox Bazar Sadar',
    last_donated_str: '2026-04-12',
    legacy_notes: 'Phone verified in Turso'
  },
  {
    old_id: 1003,
    full_name: 'Jannatul Ferdous',
    raw_phone: '01855667788',
    raw_blood: 'b+',
    raw_location: 'কক্সবাজার, রামু',
    last_donated_str: '2026-02-18',
    legacy_notes: 'Student donor'
  },
  {
    old_id: 1004,
    full_name: 'মো. রহিম উল্লাহ (কক্সবাজার)',
    raw_phone: '+8801812345678',
    raw_blood: 'O+',
    raw_location: 'Ramu Chowmuhani',
    last_donated_str: '2026-05-15',
    legacy_notes: 'পূর্বে নিবন্ধিত সদৃশ এন্ট্রি'
  },
  {
    old_id: 1005,
    full_name: 'Mahbub Alam',
    raw_phone: '01912003344',
    raw_blood: 'AB Negative',
    raw_location: 'Chattogram, Panchlaish',
    last_donated_str: '2026-01-20',
    legacy_notes: 'Regular donor CMCH'
  },
  {
    old_id: 1006,
    full_name: 'Sultana Razia',
    raw_phone: '+8801688776655',
    raw_blood: 'A-',
    raw_location: 'Dhaka, Dhanmondi',
    last_donated_str: '2026-05-02',
    legacy_notes: 'Rare donor volunteer'
  },
  {
    old_id: 1007,
    full_name: 'অসম্পূর্ণ এন্ট্রি (যাচাইহীন)',
    raw_phone: '12345',
    raw_blood: 'অনির্ধারিত',
    raw_location: 'অনুপলব্ধ',
    last_donated_str: 'N/A',
    legacy_notes: 'পুরোনো ডাটাবেজ থেকে ত্রুটিপূর্ণ রেকর্ড'
  }
];
