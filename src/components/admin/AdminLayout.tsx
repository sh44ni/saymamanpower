import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    UserCog,
    LogOut,
    Menu,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Maids", href: "/admin/maids", icon: Users },
    { name: "Customers", href: "/admin/customers", icon: UserCog },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
    { name: "Admins", href: "/admin/users", icon: Users },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const { admin, isLoading } = useAdmin({
        redirectTo: "/admin/login",
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    // Protect Admin Routes
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!admin) {
        return null; // useAdmin handles redirect
    }

    const NavLinks = () => (
        <>
            {navigation.map((item) => {
                const isActive = router.pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Sayma Manpower
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
                            </div>
                            <nav className="flex-1 p-4 space-y-2">
                                <NavLinks />
                            </nav>
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={admin.picture || ""} />
                                        <AvatarFallback>
                                            {admin.name?.[0] || admin.email?.[0] || "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {admin.name || "Admin"}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            {admin.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="lg:flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Sayma Manpower</h2>
                        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <NavLinks />
                    </nav>
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={admin.picture || ""} />
                                <AvatarFallback>
                                    {admin.name?.[0] || admin.email?.[0] || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {admin.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                    {admin.email}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:pl-64 flex-1">
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
