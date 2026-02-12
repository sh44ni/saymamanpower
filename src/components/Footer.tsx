import Link from "next/link";
import { Phone, MapPin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";

export function Footer() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/Saymalogo.bcb280ec7a2e3fbd5000e13555ca1240_1_.svg"
              alt="Sayma Manpower"
              width={150}
              height={50}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm leading-relaxed">
              {language === "en"
                ? "Trusted recruitment agency providing verified housemaids in Oman."
                : "وكالة توظيف موثوقة توفر خادمات منزل معتمدات في عمان"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "en" ? "Quick Links" : "روابط سريعة"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/maids" className="hover:text-white transition-colors">
                  {t.nav.availableMaids}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t.legal?.privacy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t.legal?.terms || "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {language === "en" ? "Contact Us" : "اتصل بنا"}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t.contact.officeAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm" dir="ltr">{t.contact.phoneNumber}</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-5 w-5 flex-shrink-0" />
                <a
                  href="https://instagram.com/sayma.manpower"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t.contact.instagram || "sayma.manpower"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Sayma Manpower.{" "}
            {language === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}
          </p>
        </div>
      </div>
    </footer>
  );
}