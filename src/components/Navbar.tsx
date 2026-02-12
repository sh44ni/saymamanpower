import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, User, LogOut, Globe } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { data: session } = useSession();
  const t = useTranslation(language);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/maids", label: t.nav.availableMaids },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Image
              src="/Saymalogo.bcb280ec7a2e3fbd5000e13555ca1240_1_.svg"
              alt="Sayma Manpower"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${router.pathname === "/"
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
                }`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/maids"
              className={`transition-colors ${router.pathname === "/maids" || router.pathname.startsWith("/maids/")
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
                }`}
            >
              {t.nav.maids}
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${router.pathname === "/about"
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
                }`}
            >
              {t.nav.about}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "EN" : "AR"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Actions */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-10 px-2">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-110">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {getInitials(session.user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="h-4 w-4 me-2" />
                    {t.nav.profile || "Profile"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 me-2" />
                    {t.nav.logout || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">{t.nav.login}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${router.pathname === link.href ? "text-blue-600" : "text-gray-700"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                >
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "العربية" : "English"}
                </Button>

                {session ? (
                  <>
                    <div className="px-2 py-2 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(session.user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(false);
                      }}
                    >
                      <User className="h-4 w-4" />
                      {t.nav.profile || "Profile"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t.nav.logout || "Logout"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      {t.nav.login}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}