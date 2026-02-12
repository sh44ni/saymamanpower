/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, Plus, Eye, EyeOff, Search } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MaidsManagementPage() {
    const router = useRouter();
    const { admin, isLoading } = useAdmin({
        redirectTo: "/admin/login",
    });
    const { data: maids, error } = useSWR("/api/maids?includeHidden=true", fetcher);
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
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
        if (!confirm("Are you sure you want to delete this maid?")) return;

        try {
            const response = await fetch(`/api/maids/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Maid deleted successfully",
                });
                mutate("/api/maids?includeHidden=true");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete maid",
                variant: "destructive",
            });
        }
    };

    const handleToggleVisibility = async (id: string) => {
        try {
            const response = await fetch(`/api/maids/${id}/toggle-visibility`, {
                method: "PATCH",
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Visibility updated successfully",
                });
                mutate("/api/maids?includeHidden=true");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update visibility",
                variant: "destructive",
            });
        }
    };

    if (error) return <div>Failed to load maids</div>;
    if (!maids) return <div>Loading...</div>;

    const filteredMaids = maids.filter((maid: any) => {
        const matchesSearch =
            maid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            maid.nationality.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === "all") return matchesSearch;
        if (filter === "visible") return matchesSearch && !maid.hidden;
        if (filter === "hidden") return matchesSearch && maid.hidden;
        return matchesSearch;
    });

    const visibleCount = maids.filter((m: any) => !m.hidden).length;
    const hiddenCount = maids.filter((m: any) => m.hidden).length;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Maid Management</h1>
                        <p className="text-gray-600 mt-1">
                            Manage housemaids, hide/show from website
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/maids/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Maid
                        </Link>
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name or nationality..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filter === "all" ? "default" : "outline"}
                                    onClick={() => setFilter("all")}
                                    size="sm"
                                >
                                    All ({maids.length})
                                </Button>
                                <Button
                                    variant={filter === "visible" ? "default" : "outline"}
                                    onClick={() => setFilter("visible")}
                                    size="sm"
                                >
                                    Visible ({visibleCount})
                                </Button>
                                <Button
                                    variant={filter === "hidden" ? "default" : "outline"}
                                    onClick={() => setFilter("hidden")}
                                    size="sm"
                                >
                                    Hidden ({hiddenCount})
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Maids Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Maids</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Nationality</TableHead>
                                        <TableHead>Experience</TableHead>
                                        <TableHead>Salary</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMaids.map((maid: any) => (
                                        <TableRow key={maid.id}>
                                            <TableCell>
                                                {maid.image ? (
                                                    <Image
                                                        src={maid.image}
                                                        alt={maid.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-500 text-xs">No img</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{maid.name}</TableCell>
                                            <TableCell>{maid.nationality}</TableCell>
                                            <TableCell>{maid.experience} years</TableCell>
                                            <TableCell>{maid.salary} OMR</TableCell>
                                            <TableCell>
                                                <Badge variant={maid.status === "Available" ? "default" : "secondary"}>
                                                    {maid.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={maid.hidden ? "outline" : "default"}>
                                                    {maid.hidden ? "Hidden" : "Visible"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleVisibility(maid.id)}
                                                        title={maid.hidden ? "Show on website" : "Hide from website"}
                                                    >
                                                        {maid.hidden ? (
                                                            <Eye className="h-4 w-4" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/maids/${maid.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(maid.id)}
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
                            {filteredMaids.map((maid: any) => (
                                <Card key={maid.id}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4 mb-3">
                                            {maid.image ? (
                                                <Image
                                                    src={maid.image}
                                                    alt={maid.name}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-15 h-15 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-gray-500 text-xs">No img</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{maid.name}</p>
                                                <p className="text-sm text-gray-600">{maid.nationality}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant={maid.status === "Available" ? "default" : "secondary"} className="text-xs">
                                                        {maid.status}
                                                    </Badge>
                                                    <Badge variant={maid.hidden ? "outline" : "default"} className="text-xs">
                                                        {maid.hidden ? "Hidden" : "Visible"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                            <span>{maid.experience} years exp.</span>
                                            <span className="font-medium">{maid.salary} OMR</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleVisibility(maid.id)}
                                                className="flex-1"
                                            >
                                                {maid.hidden ? (
                                                    <>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Show
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-4 w-4 mr-1" />
                                                        Hide
                                                    </>
                                                )}
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/maids/${maid.id}`}>
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(maid.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredMaids.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No maids found</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
