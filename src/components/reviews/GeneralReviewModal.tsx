import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface GeneralReviewModalProps {
    children: React.ReactNode;
    onReviewSubmitted?: () => void;
}

export function GeneralReviewModal({ children, onReviewSubmitted }: GeneralReviewModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
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
                    rating,
                    comment: comment.trim() || null,
                    // maidId is undefined for general reviews
                }),
            });

            if (res.ok) {
                toast({
                    title: "Success!",
                    description: "Your review has been submitted",
                });
                setRating(0);
                setComment("");
                setOpen(false);
                onReviewSubmitted?.();
                // Reload page to show new review if needed, or rely on parent update
                router.reload();
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.message || "Failed to submit review",
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!session && newOpen) {
            router.push("/login");
            return;
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with Sayma Manpower.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
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
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                            ? "fill-primary text-primary"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="comment"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Your Review (Optional)
                        </label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience..."
                            className="min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {comment.length}/500
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
