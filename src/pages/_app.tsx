import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ZeniaChat from "@/components/ZeniaChat";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  // If we are on an admin route (page), use the admin auth endpoint.
  // Note: /api/admin/auth/* routes themselves are API routes, not pages, but the frontend calling them
  // (like signin page) is under /admin.
  const isAdmin = router.pathname.startsWith("/admin");
  const sessionBasePath = isAdmin ? "/api/admin/auth" : "/api/auth";

  return (
    <SessionProvider session={session} basePath={sessionBasePath}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Component {...pageProps} />
            <Toaster />
            <ZeniaChat />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}