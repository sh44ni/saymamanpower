import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <SEO
        title={`${t.nav.about} - Sayma Manpower`}
        description={t.about.content}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t.about.title}
                </h1>
                <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
              </div>

              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {t.about.content}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">
                        {t.about.mission}
                      </h3>
                      <p className="text-blue-800">
                        {t.about.missionText}
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-900 mb-3">
                        {language === "en" ? "Our Values" : "قيمنا"}
                      </h3>
                      <ul className="space-y-2">
                        {[
                          language === "en" ? "Trust & Transparency" : "الثقة والشفافية",
                          language === "en" ? "Quality Service" : "جودة الخدمة",
                          language === "en" ? "Customer Satisfaction" : "رضا العملاء",
                          language === "en" ? "Professional Training" : "تدريب مهني"
                        ].map((value, i) => (
                          <li key={i} className="flex items-center gap-2 text-green-800">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}