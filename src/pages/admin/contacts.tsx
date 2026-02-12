/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Check, Archive } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactsPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdmin({
        redirectTo: "/admin/login",
    });
    const { data: contacts, error } = useSWR("/api/admin/contacts", fetcher);
    const { toast } = useToast();
    const [filter, setFilter] = useState<string>("all");


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!admin) return null;

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;

        try {
            const response = await fetch(`/api/admin/contacts?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Contact deleted successfully",
                });
                mutate("/api/admin/contacts");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete contact",
                variant: "destructive",
            });
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/contacts?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Status updated successfully",
                });
                mutate("/api/admin/contacts");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    if (error) return <div>Failed to load contacts</div>;
    if (!contacts) return <div>Loading...</div>;

    const filteredContacts = contacts.filter((contact: any) => {
        if (filter === "all") return true;
        return contact.status === filter;
    });

    const getStatusBadge = (status: string) => {
        const variants: any = {
            new: "default",
            read: "secondary",
            archived: "outline",
        };
        return (
            <Badge variant={variants[status] || "default"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
                        <p className="text-gray-600 mt-1">
                            Manage contact form submissions from your website
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            onClick={() => setFilter("all")}
                            size="sm"
                        >
                            All ({contacts.length})
                        </Button>
                        <Button
                            variant={filter === "new" ? "default" : "outline"}
                            onClick={() => setFilter("new")}
                            size="sm"
                        >
                            New ({contacts.filter((c: any) => c.status === "new").length})
                        </Button>
                        <Button
                            variant={filter === "read" ? "default" : "outline"}
                            onClick={() => setFilter("read")}
                            size="sm"
                        >
                            Read ({contacts.filter((c: any) => c.status === "read").length})
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredContacts.map((contact: any) => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.phone}</TableCell>
                                            <TableCell>{contact.email || "—"}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {contact.message}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(contact.status)}</TableCell>
                                            <TableCell>
                                                {format(new Date(contact.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {contact.status === "new" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(contact.id, "read")}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {contact.status !== "archived" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleUpdateStatus(contact.id, "archived")
                                                            }
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(contact.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {filteredContacts.map((contact: any) => (
                                <Card key={contact.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{contact.name}</p>
                                                <p className="text-sm text-gray-600">{contact.phone}</p>
                                                {contact.email && (
                                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                                )}
                                            </div>
                                            {getStatusBadge(contact.status)}
                                        </div>
                                        <p className="text-sm text-gray-700 mb-3">{contact.message}</p>
                                        <p className="text-xs text-gray-500 mb-3">
                                            {format(new Date(contact.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                        <div className="flex gap-2">
                                            {contact.status === "new" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(contact.id, "read")}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Mark Read
                                                </Button>
                                            )}
                                            {contact.status !== "archived" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(contact.id, "archived")}
                                                >
                                                    <Archive className="h-4 w-4 mr-1" />
                                                    Archive
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(contact.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredContacts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No contacts found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
