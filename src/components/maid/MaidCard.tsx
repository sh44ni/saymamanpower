import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, DollarSign, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCountryCode, getCountryNameAr } from "@/lib/countries";
// @ts-expect-error - no types available
import Flags from "country-flag-icons/react/3x2";

interface MaidCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    maid: any;
}

export function MaidCard({ maid }: MaidCardProps) {
    const { language } = useLanguage();
    const countryCode = getCountryCode(maid.nationality);
    const FlagComponent = Flags[countryCode] || Flags["OM"];

    // Get country name based on language
    const countryName = language === "en"
        ? maid.nationality
        : getCountryNameAr(maid.nationality);

    return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 group flex flex-col h-full bg-white">
            <div className="relative h-64 overflow-hidden bg-gray-50">
                <Image
                    src={maid.image || "/placeholder.svg"}
                    alt={language === "en" ? maid.name : (maid.nameAr || maid.name)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Country Pill - Top Right */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-100">
                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                            <FlagComponent className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-gray-800 tracking-wide">
                            {countryName}
                        </span>
                    </div>
                </div>

                {/* Role Badge - Top Left (Optional, keeping as per previous iteration) */}
                <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 hover:bg-primary text-white shadow-md border-0">
                        {maid.role}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                        {language === "en" ? maid.name : (maid.nameAr || maid.name)}
                    </h3>

                    <div className="space-y-2">
                        {/* Religion Row */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4 text-primary shrink-0" />
                            <span className="font-medium text-gray-700">
                                {maid.religion || (language === "en" ? "Not Specified" : "غير محدد")}
                            </span>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 text-primary shrink-0" />
                            <span>
                                <span className="font-bold text-gray-900">{maid.experience}</span> {language === "en" ? "years experience" : "سنوات خبرة"}
                            </span>
                        </div>

                        {/* Salary */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <DollarSign className="h-4 w-4 shrink-0" />
                            <span>{maid.salary} {language === "en" ? "OMR/month" : "ر.ع/شهرياً"}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-2">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all font-semibold"
                        asChild
                    >
                        <Link href={`/maids/${maid.id}`}>
                            {language === "en" ? "View Profile" : "عرض الملف الشخصي"}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
