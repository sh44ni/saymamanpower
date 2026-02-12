/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ImageUpload";

export default function MaidForm() {
    const router = useRouter();
    const { id } = router.query;
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        nameAr: "",
        nationality: "",
        age: "",
        religion: "",
        maritalStatus: "",
        children: "",
        experience: "",
        salary: "",
        image: "",
        status: "Available",
    });

    useEffect(() => {
        if (isEdit) {
            // Fetch existing data
            fetch(`/api/maids/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    // Ensure numeric values are converted to strings for inputs
                    setFormData({
                        ...data,
                        age: data.age.toString(),
                        children: data.children.toString(),
                        experience: data.experience.toString(),
                        salary: data.salary.toString(),
                    });
                });
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        console.log(`Updating ${name} to:`, value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            age: parseInt(formData.age) || 0,
            children: parseInt(formData.children) || 0,
            experience: parseInt(formData.experience) || 0,
            salary: parseInt(formData.salary) || 0,
        };

        try {
            const url = isEdit ? `/api/maids/${id}` : "/api/maids";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast({ title: "Success", description: `Maid ${isEdit ? "updated" : "created"} successfully.` });
                router.push("/admin/dashboard");
            } else {
                toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-8 flex justify-center">
            <Card className="w-full max-w-3xl shadow-lg my-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{isEdit ? "Edit Housemaid" : "Add New Housemaid"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Profile Photo</Label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => handleSelectChange("image", url)}
                                onRemove={() => handleSelectChange("image", "")}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name (English) <span className="text-red-500">*</span></Label>
                                <Input name="name" value={formData.name} onChange={handleChange} required className="h-11" placeholder="e.g. Maria Santos" />
                            </div>
                            <div className="space-y-2">
                                <Label>Full Name (Arabic)</Label>
                                <Input name="nameAr" value={formData.nameAr} onChange={handleChange} className="h-11" placeholder="e.g. ماريا سانتوس" dir="rtl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nationality <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(val) => handleSelectChange("nationality", val)} value={formData.nationality}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Nationality" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Philippines">Philippines</SelectItem>
                                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                                        <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="Nepal">Nepal</SelectItem>
                                        <SelectItem value="Kenya">Kenya</SelectItem>
                                        <SelectItem value="Uganda">Uganda</SelectItem>
                                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                        <SelectItem value="Myanmar">Myanmar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Age <span className="text-red-500">*</span></Label>
                                <Input type="number" name="age" value={formData.age} onChange={handleChange} required className="h-11" placeholder="e.g. 30" />
                            </div>
                            <div className="space-y-2">
                                <Label>Religion</Label>
                                <Select onValueChange={(val) => handleSelectChange("religion", val)} value={formData.religion}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Religion" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Muslim">Muslim</SelectItem>
                                        <SelectItem value="Christian">Christian</SelectItem>
                                        <SelectItem value="Hindu">Hindu</SelectItem>
                                        <SelectItem value="Buddhist">Buddhist</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Marital Status</Label>
                                <Select onValueChange={(val) => handleSelectChange("maritalStatus", val)} value={formData.maritalStatus}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Married">Married</SelectItem>
                                        <SelectItem value="Divorced">Divorced</SelectItem>
                                        <SelectItem value="Widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Children <span className="text-red-500">*</span></Label>
                                <Input type="number" name="children" value={formData.children} onChange={handleChange} required className="h-11" placeholder="e.g. 2" />
                            </div>
                            <div className="space-y-2">
                                <Label>Experience (Years) <span className="text-red-500">*</span></Label>
                                <Input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="h-11" placeholder="e.g. 5" />
                            </div>
                            <div className="space-y-2">
                                <Label>Salary (OMR) <span className="text-red-500">*</span></Label>
                                <Input type="number" name="salary" value={formData.salary} onChange={handleChange} required className="h-11" placeholder="e.g. 150" />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select onValueChange={(val) => handleSelectChange("status", val)} value={formData.status}>
                                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Hired">Hired</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t mt-6">
                            <Button type="submit" disabled={loading} size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-12">
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {isEdit ? "Update Housemaid" : "Create Housemaid"}
                            </Button>
                            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="flex-1 h-12">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
