import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompleteProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any).hasPhone) {
            router.push("/");
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            if (res.ok) {
                toast({
                    title: "Profile Updated",
                    description: "Your phone number has been saved.",
                });

                // Force session update to reflect changes
                await update();
                router.push("/");
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.message || "Failed to update profile",
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
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
                        <p className="text-gray-600">
                            Please provide your phone number to continue. This helps us contact you regarding your maid requests.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+968 1234 5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save & Continue"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
