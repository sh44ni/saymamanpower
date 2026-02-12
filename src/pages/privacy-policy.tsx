import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicyPage() {
    const { language } = useLanguage();
    const t = useTranslation(language);

    return (
        <>
            <SEO
                title={`${t.legal?.privacy || "Privacy Policy"} - Sayma Manpower`}
                description="Privacy Policy for Sayma Manpower"
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 bg-gray-50 pt-20">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                            <h1 className="text-3xl font-bold mb-8">
                                {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
                            </h1>

                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                {language === "en" ? (
                                    <>
                                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                                            <p>Welcome to Sayma Manpower. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
                                            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Personal Data</h2>
                                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contact By Phone</h2>
                                            <p>By providing your phone number, you agree that we may contact you via phone or WhatsApp regarding your inquiries and our services.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
                                            <p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p>
                                        </section>
                                    </>
                                ) : (
                                    <>
                                        <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. مقدمة</h2>
                                            <p>مرحبًا بكم في سايما مان باور. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. ستخبرك سياسة الخصوصية هذه بكيفية تعاملنا مع بياناتك الشخصية عند زيارتك لموقعنا الإلكتروني وتخبرك بحقوق الخصوصية الخاصة بك وكيف يحميك القانون.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. البيانات التي نجمعها</h2>
                                            <p>قد نقوم بجمع واستخدام وتخزين ونقل أنواع مختلفة من البيانات الشخصية عنك والتي قمنا بتجميعها على النحو التالي:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 pr-5">
                                                <li><strong>بيانات الهوية:</strong> تشمل الاسم الأول واسم العائلة واسم المستخدم أو معرف مشابه.</li>
                                                <li><strong>بيانات الاتصال:</strong> تشمل عنوان البريد الإلكتروني وأرقام الهواتف.</li>
                                                <li><strong>البيانات الفنية:</strong> تشمل عنوان بروتوكول الإنترنت (IP)، ونوع المتصفح وإصداره، وإعداد المنطقة الزمنية والموقع، وأنواع وإصدارات المكونات الإضافية للمتصفح، ونظام التشغيل والنظام الأساسي.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. كيف نستخدم بياناتك الشخصية</h2>
                                            <p>سنستخدم بياناتك الشخصية فقط عندما يسمح لنا القانون بذلك. في الغالب، سنستخدم بياناتك الشخصية في الحالات التالية:</p>
                                            <ul className="list-disc pl-5 mt-2 space-y-1 pr-5">
                                                <li>عندما نحتاج إلى تنفيذ العقد الذي نحن بصدد إبرامه أو أبرمناه معك.</li>
                                                <li>عندما يكون ذلك ضروريًا لمصالحنا المشروعة (أو مصالح طرف ثالث) ولا تتجاوز مصالحك وحقوقك الأساسية تلك المصالح.</li>
                                                <li>عندما نحتاج إلى الامتثال لالتزام قانوني أو تنظيمي.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. الاتصال عبر الهاتف</h2>
                                            <p>من خلال تقديم رقم هاتفك، فإنك توافق على أنه يجوز لنا الاتصال بك عبر الهاتف أو الواتساب بخصوص استفساراتك وخدماتنا.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. اتصل بنا</h2>
                                            <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات الخصوصية لدينا، يرجى الاتصال بنا.</p>
                                        </section>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
