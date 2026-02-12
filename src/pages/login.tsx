import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, ArrowRight, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { error: authError } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "password" | "register">("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (authError) {
      toast({
        title: "Sign-in Error",
        description: "An authentication error occurred. Please try again.",
        variant: "destructive",
      });
      router.replace("/login", undefined, { shallow: true });
    }
  }, [authError, toast, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (data.exists) {
        setStep("password");
      } else {
        setStep("register");
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Welcome back!",
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Oman Phone Validation: 8 digits
    const phoneRegex = /^(9|7)\d{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Oman phone number (8 digits, starting with 9 or 7).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register-and-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (res.ok) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.message || "Failed to create account",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-2 border-primary/10 backdrop-blur-sm bg-white/95">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-extrabold mb-2"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {step === "register" ? "Create Account" : "Welcome"}
                </span>
              </motion.h1>
              <p className="text-gray-600">
                {step === "email" && "Sign in or create an account"}
                {step === "password" && "Enter your password"}
                {step === "register" && "Complete your registration"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "password" && (
                <motion.form
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-5"
                >
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Signing in as <span className="font-semibold text-gray-900">{formData.email}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Change email
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg transition-all hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "register" && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-5"
                >
                  <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">{formData.email}</span> is not registered yet. Let's create your account!
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Change email
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number (Oman)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="91234567"
                        value={formData.phone}
                        onChange={(e) => {
                          // Only allow numbers
                          const val = e.target.value.replace(/\D/g, "");
                          setFormData({ ...formData, phone: val });
                        }}
                        maxLength={8}
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Enter your 8-digit registered mobile number (starts with 9 or 7)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-semibold text-gray-700">
                      Create Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg transition-all hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Create Account & Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-xs text-center text-gray-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}