import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Stethoscope, GraduationCap, Clock, RefreshCw, CheckCircle, UserCheck, FileCheck, Home, Star, MapPin, Briefcase, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { GeneralReviewModal } from "@/components/reviews/GeneralReviewModal";
import { motion } from "framer-motion";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { MaidCard } from "@/components/maid/MaidCard";

interface HomePageProps {
  featuredMaids: any[];
  reviews: any[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export const getServerSideProps: GetServerSideProps = async () => {
  const featuredMaids = await prisma.maid.findMany({
    take: 3,
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
  });

  // Fetch latest reviews
  const reviews = await prisma.review.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, image: true },
      },
      maid: {
        select: { name: true, nameAr: true },
      },
    },
  });

  // Get review statistics
  const stats = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    props: {
      featuredMaids: JSON.parse(JSON.stringify(featuredMaids)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      reviewStats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.id || 0,
      },
    },
  };
};

export default function HomePage({ featuredMaids, reviews, reviewStats }: HomePageProps) {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const features = [
    {
      icon: Shield,
      title: t.whyChoose.verified.title,
      description: t.whyChoose.verified.desc,
    },
    {
      icon: Stethoscope,
      title: t.whyChoose.medical.title,
      description: t.whyChoose.medical.desc,
    },
    {
      icon: GraduationCap,
      title: t.whyChoose.experienced.title,
      description: t.whyChoose.experienced.desc,
    },
    {
      icon: Clock,
      title: t.whyChoose.fast.title,
      description: t.whyChoose.fast.desc,
    },
    {
      icon: RefreshCw,
      title: t.whyChoose.replacement.title,
      description: t.whyChoose.replacement.desc,
    },
  ];

  const steps = [
    {
      icon: UserCheck,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.desc,
    },
    {
      icon: Clock,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.desc,
    },
    {
      icon: FileCheck,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.desc,
    },
  ];

  return (
    <>
      <SEO
        title="Sayma Manpower - Trusted Housemaids in Oman"
        description="Verified, experienced housemaids and nannies in Oman. Background checked, medically tested, and ready to work."
        image="/og-image.png"
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Animated Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block"
                >
                  <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                    {language === "en" ? "✨ Trusted by 5,000+ Families in Oman" : "✨ موثوق به من قبل أكثر من 5000 عائلة في عمان"}
                  </Badge>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  {language === "en" ? (
                    <>
                      Find Your Perfect <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        Housemaid
                      </span> Today
                    </>
                  ) : (
                    <>
                      جدي خادمتك <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        المثالية
                      </span> اليوم
                    </>
                  )}
                </h1>

                <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed rtl:text-right ltr:text-left">
                  {t.hero.subtitle}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg transition-all hover:scale-105" asChild>
                    <Link href="/maids">{t.hero.viewMaids}</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all" asChild>
                    <Link href="/login">{language === "en" ? "Login" : "تسجيل الدخول"}</Link>
                  </Button>
                </motion.div>

                <div className="flex items-center gap-4 text-sm text-gray-500 pt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <p>
                    {reviewStats.totalReviews > 0
                      ? `${reviewStats.averageRating.toFixed(1)}/5 Rating from ${reviewStats.totalReviews}+ Reviews`
                      : "Be the first to leave a review!"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative h-[500px] md:h-[600px] w-full"
              >
                <div className="relative w-full h-full">
                  <div className="relative h-full w-full rounded-2xl overflow-hidden">
                    <Image
                      src="/hero.png"
                      alt="Professional housemaid"
                      fill
                      className="object-cover"
                      priority
                    />


                    {/* Floating Cards */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="absolute bottom-8 right-8 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-[200px]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-bold text-gray-900">Verified</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.whyChoose.title}
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 bg-primary/10 group-hover:bg-primary rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
                        <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Maids Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Featured Housemaids" : "خادمات مميزات"}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {language === "en"
                  ? "Meet some of our verified and experienced housemaids"
                  : "تعرف على بعض خادماتنا المعتمدات وذوات الخبرة"}
              </p>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            {featuredMaids.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {language === "en" ? "No housemaids available at the moment." : "لا يوجد خادمات متاحين في الوقت الحالي."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredMaids.map((maid) => (
                  <MaidCard key={maid.id} maid={maid} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <Link href="/maids">
                  {language === "en" ? "View All Maids →" : "عرض جميع الخادمات ←"}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.howItWorks.title}
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center justify-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-primary/10">
                        <Icon className="h-10 w-10 text-primary" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {/* Simplified connector line logic for 3 steps */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 start-full w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform translate-y-0.5 opacity-30" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === "en" ? "What Our Customers Say" : "ماذا يقول عملاؤنا"}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {language === "en"
                  ? "Real reviews from families we've helped"
                  : "تقييمات حقيقية من العائلات التي ساعدناها"}
              </p>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  {language === "en" ? "No reviews yet. Be the first to leave a review!" : "لا توجد تقييمات بعد. كن أول من يترك تقييمًا!"}
                </p>
                {session ? (
                  <GeneralReviewModal>
                    <Button>
                      {language === "en" ? "Write a Review" : "اكتب تقييم"}
                    </Button>
                  </GeneralReviewModal>
                ) : (
                  <Button asChild>
                    <Link href="/login">
                      {language === "en" ? "Login to Review" : "تسجيل الدخول للتقييم"}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} language={language} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <Link href="/reviews">
                  {language === "en" ? "View All Reviews →" : "عرض جميع التقييمات ←"}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === "en" ? "Ready to Find Your Perfect Housemaid?" : "هل أنت مستعد للعثور على خادمتك المثالية؟"}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {language === "en"
                ? "Browse our verified workers and get started today"
                : "تصفح عاملاتنا المعتمدات وابدأ اليوم"}
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg" asChild>
              <Link href="/maids">{t.hero.viewMaids}</Link>
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}