import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewCardProps {
    review: {
        id: string;
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
        };
    };
    language?: "en" | "ar";
}

export function ReviewCard({ review, language = "en" }: ReviewCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === "en" ? "en-US" : "ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user.image || ""} alt={review.user.name || ""} />
                        <AvatarFallback className="bg-primary text-white">
                            {getInitials(review.user.name || "U")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="font-semibold text-gray-900">{review.user.name}</p>
                                {review.maid && (
                                    <p className="text-sm text-gray-500">
                                        {language === "en" ? "Reviewed " : "قيّم "}
                                        {language === "en" ? review.maid.name : (review.maid.nameAr || review.maid.name)}
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating
                                        ? "fill-accent text-accent"
                                        : "text-gray-300"
                                        } `}
                                />
                            ))}
                        </div>

                        {review.comment && (
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
