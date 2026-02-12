import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface ReviewFormProps {
    maidId: string;
    onReviewSubmitted?: () => void;
}

export function ReviewForm({ maidId, onReviewSubmitted }: ReviewFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            toast({
                title: "Login Required",
                description: "Please login to submit a review",
                variant: "destructive",
            });
            router.push("/login");
            return;
        }

        if (rating === 0) {
            toast({
                title: "Rating Required",
                description: "Please select a star rating",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maidId,
                    rating,
                    comment: comment.trim() || null,
                }),
            });

            if (res.ok) {
                toast({
                    title: "Success!",
                    description: "Your review has been submitted",
                });
                setRating(0);
                setComment("");
                onReviewSubmitted?.();
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.message || "Failed to submit review",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Please login to leave a review</p>
                <Button onClick={() => router.push("/login")}>Login</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Rating
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                        ? "fill-accent text-accent"
                                        : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Review (Optional)
                </label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this housemaid..."
                    className="min-h-[100px]"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-primary hover:bg-primary/90"
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
