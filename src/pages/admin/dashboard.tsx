/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, UserCog, Eye, Plus } from "lucide-react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const router = useRouter();
    const { admin, isLoading } = useAdmin({
        redirectTo: "/admin/login",
    });
    const { data: maids } = useSWR("/api/maids?includeHidden=true", fetcher);
    const { data: contacts } = useSWR("/api/admin/contacts", fetcher);
    const { data: users } = useSWR("/api/admin/authorized-emails", fetcher);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!admin) {
        return null; // useAdmin handles redirect
    }

    const visibleMaids = maids?.filter((m: any) => !m.hidden) || [];
    const hiddenMaids = maids?.filter((m: any) => m.hidden) || [];
    const newContacts = contacts?.filter((c: any) => c.status === "new") || [];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back, {admin.name || admin.email}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Maids"
                        value={maids?.length || 0}
                        icon={Users}
                        description={`${visibleMaids.length} visible, ${hiddenMaids.length} hidden`}
                    />
                    <StatsCard
                        title="Visible Maids"
                        value={visibleMaids.length}
                        icon={Eye}
                        description="Shown on website"
                    />
                    <StatsCard
                        title="New Contacts"
                        value={newContacts.length}
                        icon={MessageSquare}
                        description={`${contacts?.length || 0} total submissions`}
                    />
                    <StatsCard
                        title="Authorized Users"
                        value={users?.length || 0}
                        icon={UserCog}
                        description="Can access admin panel"
                    />
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button asChild className="h-auto py-4 flex-col gap-2">
                                <Link href="/admin/maids/new">
                                    <Plus className="h-6 w-6" />
                                    <span>Add New Maid</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/admin/maids">
                                    <Users className="h-6 w-6" />
                                    <span>Manage Maids</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/admin/contacts">
                                    <MessageSquare className="h-6 w-6" />
                                    <span>View Contacts</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                                <Link href="/admin/users">
                                    <UserCog className="h-6 w-6" />
                                    <span>Manage Users</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Contacts */}
                {contacts && contacts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Contact Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {contacts.slice(0, 5).map((contact: any) => (
                                    <div
                                        key={contact.id}
                                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{contact.name}</p>
                                                {contact.status === "new" && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{contact.phone}</p>
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                                {contact.message}
                                            </p>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href="/admin/contacts">View</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {contacts.length > 5 && (
                                <Button asChild variant="link" className="w-full mt-4">
                                    <Link href="/admin/contacts">View all contacts →</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
