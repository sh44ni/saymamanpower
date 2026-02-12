/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { admin, isLoading } = useAdmin({ redirectIfFound: true, redirectTo: "/admin/dashboard" });
    const { error } = router.query;

    useEffect(() => {
        // Show error message if redirected with error parameter
        if (error) {
            toast({
                title: "Access Denied",
                description: error === "AccessDenied"
                    ? "Your email is not authorized to access this admin panel. Please contact an administrator to request access."
                    : "Authentication failed. Please try again.",
                variant: "destructive",
            });
        }
    }, [error]);



    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                toast({ title: "OTP Sent", description: "Check your email for the code." });
                setStep(2);
            } else {
                toast({ title: "Error", description: "Failed to send OTP.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting OTP verification for:", email, "OTP:", otp);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/admin/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            console.log("Verify response status:", res.status);

            if (res.ok) {
                console.log("Verify success, redirecting...");
                toast({ title: "Success", description: "Logged in successfully. Redirecting..." });
                // Force hard navigation to ensure we leave this page
                window.location.href = "/admin/dashboard";
            } else {
                const data = await res.json();
                console.log("Verify failed:", data);
                toast({ title: "Error", description: data.message || "Invalid OTP.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Verify catch error:", error);
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            // Don't disable loading if we are redirecting
            if (!window.location.href.includes("/admin/dashboard")) {
                setLoading(false);
            }
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 ? "Sign in to access the admin panel" : "Enter the OTP sent to your email."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <div className="space-y-4">
                            {/* Email OTP Form */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500">Sign in with your authorized email</p>
                            </div>

                            {/* Email OTP Form */}
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                    className="text-center text-2xl tracking-widest"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep(1)}
                            >
                                Back to Email
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
