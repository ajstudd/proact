"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useCreateProjectMutation, useUploadFileMutation } from "@services"; // RTK API hooks for project and file upload
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function CreateProjectForm() {
    const router = useRouter();
    const [createProject] = useCreateProjectMutation();
    const [uploadFile] = useUploadFileMutation();

    const [title, setTitle] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [associatedProfiles, setAssociatedProfiles] = useState<Array<{ name: string; role: string }>>([]);
    const [descriptionText, setDescriptionText] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number; place: string } | null>(null);
    const [budget, setBudget] = useState<number>(0);
    const [contractor, setContractor] = useState("");
    const [government, setGovernment] = useState("");
    console.log('location', location);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
            const previewUrl = URL.createObjectURL(e.target.files[0]);
            setBannerUrl(previewUrl);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", pdfFile ? "" : descriptionText);
            formData.append("budget", budget.toString());
            formData.append("contractor", contractor);
            formData.append("government", government);

            if (location) {
                formData.append("location[lat]", location.lat.toString());
                formData.append("location[lng]", location.lng.toString());
                formData.append("location[place]", location.place);
            }

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            if (pdfFile) {
                formData.append("pdf", pdfFile);
            }

            await createProject(formData).unwrap();
            toast.success("Project created successfully!");
            router.push("/home");
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to create project");
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-900 rounded-lg text-white p-6 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
            <form className="w-full max-w-2xl space-y-6" onSubmit={handleProjectSubmit}>
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Project Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Banner Image</label>
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="text-white" />
                    {bannerUrl && <img src={bannerUrl} alt="Banner Preview" className="mt-4 rounded-md shadow-md" />}
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Project Description</label>
                    <textarea
                        placeholder="Enter project description"
                        className="w-full p-2 text-black rounded-md"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Upload PDF</label>
                    <input type="file" accept="application/pdf" onChange={handlePdfChange} className="text-white" />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Budget</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        placeholder="Enter project budget"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Contractor ID</label>
                    <input
                        type="text"
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        placeholder="Enter contractor ID"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Government ID</label>
                    <input
                        type="text"
                        value={government}
                        onChange={(e) => setGovernment(e.target.value)}
                        placeholder="Enter government ID"
                        className="w-full p-2 text-black rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Project Location</label>
                    <div className="w-full rounded-md flex flex-col items-center justify-center">
                        <MapPicker onLocationSelect={(lat, lng, place) => setLocation({ lat, lng, place })} />
                        {location?.place && (
                            <div className="text-sm text-gray-400 mt-2 animate-fade-in">
                                Selected Location: {location.place}
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition-all">
                    Create Project
                </button>
            </form>
        </motion.div>
    );
}
