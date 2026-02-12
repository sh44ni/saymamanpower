import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { SEO } from "@/components/SEO";

export default function TermsPage() {
    const { language } = useLanguage();
    const t = useTranslation(language);

    return (
        <>
            <SEO
                title={`${t.legal?.terms || "Terms of Service"} - Sayma Manpower`}
                description="Terms of Service for Sayma Manpower"
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 bg-gray-50 pt-20">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                            <h1 className="text-3xl font-bold mb-8">
                                {language === "en" ? "Terms of Service" : "شروط الخدمة"}
                            </h1>

                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                {language === "en" ? (
                                    <>
                                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
                                            <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Sayma Manpower ("we," "us" or "our"), concerning your access to and use of our website and services.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
                                            <p>Sayma Manpower is a recruitment agency connecting families with domestic workers. We facilitate the recruitment process but are not the direct employer of the domestic workers once the contract is signed between the employer and the worker.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Representations</h2>
                                            <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Fees and Payment</h2>
                                            <p>Service fees for recruitment are outlined in our service agreements. All fees are subject to the applicable laws and regulations of the Sultanate of Oman.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
                                            <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the site or our services.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Governing Law</h2>
                                            <p>These Terms shall be governed by and defined following the laws of the Sultanate of Oman. Sayma Manpower and yourself irrevocably consent that the courts of Oman shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>
                                        </section>
                                    </>
                                ) : (
                                    <>
                                        <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. الموافقة على الشروط</h2>
                                            <p>تشكل شروط الخدمة هذه اتفاقية ملزمة قانونًا مبرمة بينك، سواء شخصيًا أو نيابة عن كيان ("أنت") وسايما مان باور ("نحن" أو "نا" أو "الخاص بنا")، فيما يتعلق بوصولك إلى واستخدام موقعنا وخدماتنا.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. وصف الخدمة</h2>
                                            <p>سايما مان باور هي وكالة توظيف تربط العائلات بالعمالة المنزلية. نقوم بتسهيل عملية التوظيف ولكننا لسنا صاحب العمل المباشر للعمالة المنزلية بمجرد توقيع العقد بين صاحب العمل والعامل.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. إقرارات المستخدم</h2>
                                            <p>باستخدام الموقع، فإنك تقر وتتعهد بما يلي: (1) أن جميع معلومات التسجيل التي ترسلها ستكون صحيحة ودقيقة وحديثة وكاملة؛ (2) ستحافظ على دقة هذه المعلومات وتقوم بتحديث معلومات التسجيل هذه على الفور عند الضرورة.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. الرسوم والدفع</h2>
                                            <p>رسوم الخدمة للتوظيف موضحة في اتفاقيات الخدمة الخاصة بنا. تخضع جميع الرسوم للقوانين واللوائح المعمول بها في سلطنة عمان.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. حدود المسؤولية</h2>
                                            <p>لن نكون نحن أو مديرونا أو موظفونا أو وكلاؤنا مسؤولين بأي حال من الأحوال تجاهك أو تجاه أي طرف ثالث عن أي أضرار مباشرة أو غير مباشرة أو تابعة أو نموذجية أو عرضية أو خاصة أو عقابية تنشأ عن استخدامك للموقع أو خدماتنا.</p>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. القانون الحاكم</h2>
                                            <p>تخضع هذه الشروط وتفسر وفقًا لقوانين سلطنة عمان. توافق سايما مان باور وأنت بشكل لا رجعة فيه على أن لمحاكم عمان الولاية القضائية الحصرية لحل أي نزاع قد ينشأ فيما يتعلق بهذه الشروط.</p>
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
