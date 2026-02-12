/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { SEO } from "@/components/SEO";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
  maid?: {
    name: string;
    nameAr: string | null;
  } | null;
}

interface ReviewsPageProps {
  initialReviews: Review[];
  stats: {
    averageRating: number | null;
    totalReviews: number;
  };
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Cast where to any to avoid TS errors until Prisma Client is regenerated with 'hidden' field
  const where: any = { hidden: false };

  const reviews = await prisma.review.findMany({
    where,
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

  const stats = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    props: {
      initialReviews: JSON.parse(JSON.stringify(reviews)),
      stats: {
        averageRating: stats._avg.rating,
        totalReviews: (stats._count as any).id || 0,
      },
    },
  };
};


export default function ReviewsPage({ initialReviews, stats }: ReviewsPageProps) {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const t = useTranslation(language);
  const { toast } = useToast();
  const isRTL = language === "ar";

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!session) {
      signIn(); // Redirect to login
      return;
    }

    if (!reviewText.trim()) {
      alert(isRTL ? "الرجاء كتابة تقييمك" : "Please write your review");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: reviewText,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit review");
      }

      const newReviewData = await res.json();

      // Optimistically update or just reload. 
      // Ideally we would prepend the new review, but the return from API matches proper format.
      // The API returns the review object. We need to conform it to the props interface (including user/maid).
      // For simplicity, let's just refresh the page or manually structure strictly what we need.
      // Actually the API returns the created review with included user data if implemented correctly.
      // Lets check api/reviews/index.ts implementation... it does include user!

      setReviews([newReviewData, ...reviews]);

      toast({
        title: isRTL ? "تم إرسال التقييم" : "Review Submitted",
        description: isRTL ? "شكراً لمشاركتك رأيك" : "Thank you for sharing your feedback",
      });

      setReviewText("");
      setRating(5);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAverage = stats.averageRating
    ? stats.averageRating.toFixed(1)
    : "0.0";

  return (
    <>
      <SEO
        title={t.reviews.title}
        description={t.reviews.subtitle}
      />
      <div className={`min-h-screen flex flex-col ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />

        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.reviews.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{t.reviews.subtitle}</p>
            </div>

            {/* Reviews Overview */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-8 h-8 fill-accent text-accent" />
                  <span className="text-3xl font-bold">{formattedAverage}</span>
                </div>
                <span className="text-gray-600 text-lg">
                  {isRTL
                    ? `(${stats.totalReviews} تقييم)`
                    : `(${stats.totalReviews} reviews)`
                  }
                </span>
              </div>
            </div>

            {/* Submit Review Form */}
            {session ? (
              <Card className="mb-12 max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.reviews.leaveReview}</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">{t.reviews.yourRating}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${star <= rating
                              ? "fill-accent text-accent"
                              : "text-gray-300 hover:text-accent/50"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">{t.reviews.reviewText}</label>
                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={isRTL ? "شارك تجربتك معنا..." : "Share your experience..."}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                    {isSubmitting ? (isRTL ? "جاري الإرسال..." : "Submitting...") : t.reviews.submitReview}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-12 max-w-2xl mx-auto bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-700 mb-4">{t.reviews.loginRequired}</p>
                  <Button onClick={() => signIn()} className="bg-primary hover:bg-primary/90">
                    {isRTL ? "تسجيل الدخول" : "Login"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {review.user.image ? (
                              <img src={review.user.image} alt={review.user.name || "User"} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                                {(review.user.name?.[0] || "U").toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{review.user.name || "Anonymous"}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating
                                    ? "fill-accent text-accent"
                                    : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 italic flex-grow">"{review.comment}"</p>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.maid && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                            {review.maid.name}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">{t.reviews.noReviews}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}