export interface Maid {
  id: string;
  name: string;
  nameAr: string;
  nationality: string;
  nationalityAr: string;
  role: string;
  roleAr: string;
  experience: number;
  salary: number;
  age: number;
  skills: string[];
  skillsAr: string[];
  languages: string[];
  languagesAr: string[];
  previousCountries: string[];
  previousCountriesAr: string[];
  images: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const demoMaids: Maid[] = [
  {
    id: "1",
    name: "Maria Santos",
    nameAr: "ماريا سانتوس",
    nationality: "Philippines",
    nationalityAr: "الفلبين",
    role: "Housemaid",
    roleAr: "خادمة منزلية",
    experience: 5,
    salary: 150,
    age: 32,
    skills: ["Cooking", "Cleaning", "Child Care", "Laundry"],
    skillsAr: ["الطبخ", "التنظيف", "رعاية الأطفال", "الغسيل"],
    languages: ["English", "Tagalog", "Basic Arabic"],
    languagesAr: ["الإنجليزية", "التاغالوغية", "عربي أساسي"],
    previousCountries: ["UAE", "Saudi Arabia"],
    previousCountriesAr: ["الإمارات", "السعودية"],
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
    ],
  },
  {
    id: "2",
    name: "Lakshmi Devi",
    nameAr: "لاكشمي ديفي",
    nationality: "India",
    nationalityAr: "الهند",
    role: "Nanny",
    roleAr: "مربية أطفال",
    experience: 8,
    salary: 170,
    age: 35,
    skills: ["Child Care", "Baby Care", "Cooking", "Teaching"],
    skillsAr: ["رعاية الأطفال", "رعاية الرضع", "الطبخ", "التدريس"],
    languages: ["English", "Hindi", "Arabic"],
    languagesAr: ["الإنجليزية", "الهندية", "العربية"],
    previousCountries: ["Oman", "Qatar"],
    previousCountriesAr: ["عمان", "قطر"],
    images: [
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
    ],
  },
  {
    id: "3",
    name: "Fatima Hassan",
    nameAr: "فاطمة حسن",
    nationality: "Indonesia",
    nationalityAr: "إندونيسيا",
    role: "Housemaid",
    roleAr: "خادمة منزلية",
    experience: 4,
    salary: 140,
    age: 28,
    skills: ["Cleaning", "Cooking", "Ironing", "Organization"],
    skillsAr: ["التنظيف", "الطبخ", "الكوي", "التنظيم"],
    languages: ["Indonesian", "English", "Basic Arabic"],
    languagesAr: ["الإندونيسية", "الإنجليزية", "عربي أساسي"],
    previousCountries: ["Malaysia", "Kuwait"],
    previousCountriesAr: ["ماليزيا", "الكويت"],
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop",
    ],
  },
  {
    id: "4",
    name: "Grace Achieng",
    nameAr: "جريس أتشينج",
    nationality: "Kenya",
    nationalityAr: "كينيا",
    role: "Caregiver",
    roleAr: "مقدمة رعاية",
    experience: 6,
    salary: 160,
    age: 40,
    skills: ["Elder Care", "Patient Care", "Cooking", "Companionship"],
    skillsAr: ["رعاية المسنين", "رعاية المرضى", "الطبخ", "المرافقة"],
    languages: ["English", "Swahili", "Basic Arabic"],
    languagesAr: ["الإنجليزية", "السواحلية", "عربي أساسي"],
    previousCountries: ["UAE", "Oman"],
    previousCountriesAr: ["الإمارات", "عمان"],
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=500&fit=crop",
    ],
  },
  {
    id: "5",
    name: "Aisha Mohamed",
    nameAr: "عائشة محمد",
    nationality: "Ethiopia",
    nationalityAr: "إثيوبيا",
    role: "Housemaid",
    roleAr: "خادمة منزلية",
    experience: 3,
    salary: 135,
    age: 26,
    skills: ["Cleaning", "Laundry", "Basic Cooking", "Child Care"],
    skillsAr: ["التنظيف", "الغسيل", "الطبخ الأساسي", "رعاية الأطفال"],
    languages: ["Amharic", "English", "Arabic"],
    languagesAr: ["الأمهرية", "الإنجليزية", "العربية"],
    previousCountries: ["Saudi Arabia"],
    previousCountriesAr: ["السعودية"],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    ],
  },
  {
    id: "6",
    name: "Nisha Kumari",
    nameAr: "نيشا كوماري",
    nationality: "Sri Lanka",
    nationalityAr: "سريلانكا",
    role: "Nanny",
    roleAr: "مربية أطفال",
    experience: 7,
    salary: 165,
    age: 33,
    skills: ["Child Care", "Tutoring", "Cooking", "First Aid"],
    skillsAr: ["رعاية الأطفال", "التدريس", "الطبخ", "الإسعافات الأولية"],
    languages: ["Sinhala", "English", "Tamil", "Basic Arabic"],
    languagesAr: ["السنهالية", "الإنجليزية", "التاميلية", "عربي أساسي"],
    previousCountries: ["Kuwait", "Bahrain", "Oman"],
    previousCountriesAr: ["الكويت", "البحرين", "عمان"],
    images: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    ],
  },
];

// Demo reviews for the website (not per maid)
export const demoReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Ahmed Al-Balushi",
    rating: 5,
    comment: "Excellent service! The maid arrived on time and is very professional.",
    date: "2024-02-10",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Al-Harthi",
    rating: 4,
    comment: "Process was smooth, but took a bit longer than expected. Staff is very helpful.",
    date: "2024-02-08",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Fatima Al-Said",
    rating: 5,
    comment: "Highly recommended! Professional team and verified workers. Very happy with our housemaid!",
    date: "2024-02-05",
  },
];

export const maids = [
  {
    id: "1",
    name: "Siti Nurhaliza",
    nameAr: "سيتي نورحليفة",
    nationality: "Indonesia",
    role: "Housemaid",
    experience: 5,
    salary: 140,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&fit=crop",
    cv: {
      age: 28,
      religion: "Muslim",
      maritalStatus: "Married",
      languages: ["Indonesian", "Basic Arabic", "Basic English"],
      skills: ["Cleaning", "Cooking", "Ironing"],
      experienceDetails: "3 years in Saudi Arabia, 2 years in UAE",
    },
  },
  {
    id: "2",
    name: "Mary Grace",
    nameAr: "ماري جريس",
    nationality: "Philippines",
    role: "Nanny",
    experience: 7,
    salary: 160,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop",
    cv: {
      age: 32,
      religion: "Christian",
      maritalStatus: "Single",
      languages: ["English", "Tagalog"],
      skills: ["Child Care", "First Aid", "Tutoring"],
      experienceDetails: "4 years in Dubai, 3 years in Qatar",
    },
  },
  {
    id: "3",
    name: "Lakshmi Sharma",
    nameAr: "لاكشمي شارما",
    nationality: "India",
    role: "Housemaid",
    experience: 4,
    salary: 130,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&fit=crop",
    cv: {
      age: 30,
      religion: "Hindu",
      maritalStatus: "Married",
      languages: ["Hindi", "Basic English"],
      skills: ["Cleaning", "Indian Cooking"],
      experienceDetails: "4 years in Oman",
    },
  },
  {
    id: "4",
    name: "Aisha Mohammed",
    nameAr: "عائشة محمد",
    nationality: "Ethiopia",
    role: "Housemaid",
    experience: 3,
    salary: 120,
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&fit=crop",
    cv: {
      age: 25,
      religion: "Muslim",
      maritalStatus: "Single",
      languages: ["Amharic", "Basic Arabic"],
      skills: ["Cleaning", "Laundry"],
      experienceDetails: "3 years in Kuwait",
    },
  },
  {
    id: "5",
    name: "Kamala Perera",
    nameAr: "كامالا بيريرا",
    nationality: "Sri Lanka",
    role: "Cook",
    experience: 10,
    salary: 170,
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=800&fit=crop",
    cv: {
      age: 40,
      religion: "Buddhist",
      maritalStatus: "Widowed",
      languages: ["Sinhala", "Basic English", "Basic Arabic"],
      skills: ["Cooking", "Cleaning", "Elderly Care"],
      experienceDetails: "10 years in various Gulf countries",
    },
  },
  {
    id: "6",
    name: "Chanthira Suk",
    nameAr: "تشانثيرا سوك",
    nationality: "Thailand",
    role: "Housemaid",
    experience: 6,
    salary: 150,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop",
    cv: {
      age: 29,
      religion: "Buddhist",
      maritalStatus: "Divorced",
      languages: ["Thai", "English"],
      skills: ["Cleaning", "Massage", "Cooking"],
      experienceDetails: "6 years in Bahrain",
    },
  },
];

export const websiteReviews = demoReviews;