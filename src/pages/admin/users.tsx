/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Mail } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdmin({
        redirectTo: "/admin/login",
    });
    const { data: users, error } = useSWR("/api/admin/authorized-emails", fetcher);
    const { toast } = useToast();
    const [newEmail, setNewEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!admin) return null;

    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        try {
            const response = await fetch("/api/admin/authorized-emails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Email authorized successfully",
                });
                setNewEmail("");
                mutate("/api/admin/authorized-emails");
            } else {
                const data = await response.json();
                toast({
                    title: "Error",
                    description: data.error || "Failed to authorize email",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to authorize email",
                variant: "destructive",
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} from authorized users?`))
            return;

        try {
            const response = await fetch(`/api/admin/authorized-emails?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Email removed successfully",
                });
                mutate("/api/admin/authorized-emails");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove email",
                variant: "destructive",
            });
        }
    };

    if (error) return <div>Failed to load users</div>;
    if (!users) return <div>Loading...</div>;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage authorized emails that can access the admin panel
                    </p>
                </div>

                {/* Add New Email */}
                <Card>
                    <CardHeader>
                        <CardTitle>Authorize New Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="email" className="sr-only">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isAdding}>
                                <Plus className="h-4 w-4 mr-2" />
                                {isAdding ? "Adding..." : "Add Email"}
                            </Button>
                        </form>
                        <p className="text-sm text-gray-600 mt-3">
                            Only users with authorized emails can sign in with Google to access the
                            admin panel.
                        </p>
                    </CardContent>
                </Card>

                {/* Authorized Emails List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Authorized Emails ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Added By</TableHead>
                                        <TableHead>Date Added</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: any) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.addedBy || "—"}</TableCell>
                                            <TableCell>
                                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(user.id, user.email)}
                                                    disabled={user.email === admin.email}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {users.map((user: any) => (
                                <Card key={user.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <p className="font-medium text-gray-900">{user.email}</p>
                                                </div>
                                                {user.addedBy && (
                                                    <p className="text-sm text-gray-600">Added by: {user.addedBy}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(user.id, user.email)}
                                                disabled={user.email === admin.email}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {users.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No authorized emails yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
