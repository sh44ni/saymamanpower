/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Search, Eye, EyeOff, User, Star } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomersPage() {
    const { data: users, error } = useSWR("/api/admin/customers", fetcher);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (userId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const toggleReviewVisibility = async (reviewId: string, currentHidden: boolean) => {
        try {
            const res = await fetch("/api/admin/reviews/toggle", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: reviewId, hidden: !currentHidden }),
            });

            if (res.ok) {
                toast({
                    title: "Success",
                    description: `Review ${!currentHidden ? "hidden" : "visible"} successfully`,
                });
                mutate("/api/admin/customers");
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update review status",
                variant: "destructive",
            });
        }
    };

    if (error) return <div>Failed to load users</div>;
    if (!users) return <div>Loading...</div>;

    // Handle case where API returns error object instead of array
    if (!Array.isArray(users)) {
        console.error("API returned non-array:", users);
        return <div className="p-4 text-red-500">Error loading customers: {users.error || "Unknown error"}</div>;
    }

    const filteredUsers = users.filter(
        (user: any) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">
                        View customer details and manage their reviews
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <Search className="text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Customers ({filteredUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact Info</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-center">Reviews</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user: any) => (
                                        <>
                                            <TableRow key={user.id} className="group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {user.image ? (
                                                                <img
                                                                    src={user.image}
                                                                    alt={user.name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                (user.name?.[0] || "U").toUpperCase()
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {user.name || "No Name"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <span className="font-medium">Email:</span> {user.email}
                                                        </p>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <span className="font-medium">Phone:</span>{" "}
                                                            {user.phone || "N/A"}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {user._count.reviews}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleRow(user.id)}
                                                        disabled={user.reviews.length === 0}
                                                    >
                                                        {expandedRows[user.id] ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                        <span className="sr-only">Toggle Reviews</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                            {/* Expanded Reviews Section */}
                                            {expandedRows[user.id] && (
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableCell colSpan={5} className="p-0">
                                                        <div className="p-4 pl-16 space-y-4">
                                                            <h4 className="font-semibold text-gray-900 border-b pb-2">
                                                                User Reviews ({user.reviews.length})
                                                            </h4>
                                                            {user.reviews.map((review: any) => (
                                                                <div
                                                                    key={review.id}
                                                                    className="bg-white p-4 rounded-lg border flex justify-between gap-4"
                                                                >
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="flex">
                                                                                {[...Array(5)].map((_, i) => (
                                                                                    <Star
                                                                                        key={i}
                                                                                        className={`h-4 w-4 ${i < review.rating
                                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                                            : "text-gray-300"
                                                                                            }`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                            <span className="text-sm text-gray-500">
                                                                                • {format(new Date(review.createdAt), "MMM d, yyyy")}
                                                                            </span>
                                                                            {review.hidden && (
                                                                                <Badge variant="destructive" className="ml-2 text-xs">Hidden</Badge>
                                                                            )}
                                                                            {review.maid && (
                                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                                    Maid: {review.maid.name}
                                                                                </Badge>
                                                                            )}
                                                                            {!review.maid && (
                                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                                    General Review
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-gray-700 text-sm">
                                                                            {review.comment || "No comment provided."}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant={review.hidden ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            toggleReviewVisibility(review.id, review.hidden)
                                                                        }
                                                                        className={review.hidden ? "bg-green-600 hover:bg-green-700" : "text-gray-500"}
                                                                    >
                                                                        {review.hidden ? (
                                                                            <>
                                                                                <Eye className="h-4 w-4 mr-2" />
                                                                                Show
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <EyeOff className="h-4 w-4 mr-2" />
                                                                                Hide
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
