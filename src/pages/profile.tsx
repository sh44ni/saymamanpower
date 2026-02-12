import { useEffect } from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const t = useTranslation(language);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <SEO
        title={`${t.nav.profile} - Sayma Manpower`}
        description="Your Sayma Manpower profile"
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {t.nav.profile}
                </h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Account Information" : "معلومات الحساب"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {language === "en" ? "Name" : "الاسم"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {language === "en" ? "Email" : "البريد الإلكتروني"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {language === "en" ? "Member Since" : "عضو منذ"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date().toLocaleDateString(language === "en" ? "en-US" : "ar-SA")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      {t.nav.logout}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Your Activity" : "نشاطك"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">
                    {language === "en"
                      ? "Your reviews and saved maids will appear here"
                      : "ستظهر تقييماتك والخادمات المحفوظة هنا"}
                  </p>
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