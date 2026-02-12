import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        // Use environment variable for preset, fallback to hardcoded if needed (will be updated)
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "unsigned_preset";
        formData.append("upload_preset", preset);

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) throw new Error("Cloudinary cloud name not configured");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    onChange(response.secure_url);
                    toast({ title: "Success", description: "Image uploaded successfully" });
                } else {
                    console.error("Upload failed:", xhr.responseText);
                    toast({ title: "Error", description: `Upload failed: ${xhr.statusText}`, variant: "destructive" });
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                toast({ title: "Error", description: "Network error during upload", variant: "destructive" });
                setUploading(false);
            };

            xhr.send(formData);

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {/* DEBUG: Unhidden input for direct testing */}
            <input
                type="file"
                ref={fileInputRef}
                className="block mb-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                accept="image/*"
                onChange={handleUpload}
                aria-label="Upload image"
            />


            {!value ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition min-h-[150px] w-full"
                >
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <ImagePlus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden border w-full max-w-[200px] aspect-square group">
                    <div className="relative w-full h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src={value}
                                alt="Uploaded image"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Uploading... {Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}
        </div>
    );
};
