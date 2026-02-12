export interface CountryDetails {
    code: string;
    nameAr: string;
}

export const countryData: Record<string, CountryDetails> = {
    "Philippines": { code: "PH", nameAr: "الفلبين" },
    "India": { code: "IN", nameAr: "الهند" },
    "Sri Lanka": { code: "LK", nameAr: "سريلانكا" },
    "Indonesia": { code: "ID", nameAr: "إندونيسيا" },
    "Nepal": { code: "NP", nameAr: "نيبال" },
    "Bangladesh": { code: "BD", nameAr: "بنغلاديش" },
    "Kenya": { code: "KE", nameAr: "كينيا" },
    "Uganda": { code: "UG", nameAr: "أوغندا" },
    "Ethiopia": { code: "ET", nameAr: "إثيوبيا" },
    "Myanmar": { code: "MM", nameAr: "ميانمار" },
    "Vietnam": { code: "VN", nameAr: "فيتنام" },
    "Thailand": { code: "TH", nameAr: "تايلاند" },
    "Pakistan": { code: "PK", nameAr: "باكستان" },
    "Egypt": { code: "EG", nameAr: "مصر" },
    "Nigeria": { code: "NG", nameAr: "نيجيريا" },
    "Ghana": { code: "GH", nameAr: "غانا" },
    "Comoros": { code: "KM", nameAr: "جزر القمر" },
    "Tanzania": { code: "TZ", nameAr: "تنزانيا" },
    "Sierra Leone": { code: "SL", nameAr: "سيراليون" },
    "Madagascar": { code: "MG", nameAr: "مدغشقر" },
};

export function getCountryCode(countryName: string): string {
    const normalized = countryName?.trim();
    return countryData[normalized]?.code || "OM";
}

export function getCountryNameAr(countryName: string): string {
    const normalized = countryName?.trim();
    return countryData[normalized]?.nameAr || countryName;
}
