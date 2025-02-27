"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useCreateProjectMutation, useUploadFileMutation } from "@services"; // RTK API hooks for project and file upload

// Dynamic import for react-leaflet map (if needed)
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function CreateProjectForm() {
    const router = useRouter();
    const [createProject] = useCreateProjectMutation();
    const [uploadFile] = useUploadFileMutation();

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [associatedProfiles, setAssociatedProfiles] = useState<Array<{ name: string; role: string }>>([]);
    const [descriptionText, setDescriptionText] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
            // Optional: Preview the image immediately
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
            // Upload banner if needed
            let uploadedBannerUrl = bannerUrl;
            if (bannerFile) {
                const bannerResponse = await uploadFile({ file: bannerFile, type: "image" }).unwrap();
                uploadedBannerUrl = bannerResponse.url;
            }

            // Upload PDF if provided
            let uploadedPdfUrl = "";
            if (pdfFile) {
                const pdfResponse = await uploadFile({ file: pdfFile, type: "pdf" }).unwrap();
                uploadedPdfUrl = pdfResponse.url;
            }

            // Construct project payload
            const projectPayload = {
                bannerUrl: uploadedBannerUrl,
                associatedProfiles,
                description: pdfFile ? "" : descriptionText, // Use text if no PDF
                pdfUrl: uploadedPdfUrl,
                location,
            };

            await createProject(projectPayload).unwrap();
            toast.success("Project created successfully!");
            router.push("/projects"); // Redirect to project list page
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to create project");
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
            <form className="w-full max-w-2xl space-y-6" onSubmit={handleProjectSubmit}>
                {/* Banner Image Upload */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">Banner Image</label>
                    <input type="file" accept="image/*" onChange={handleBannerChange} className="text-black" />
                    {bannerUrl && <img src={bannerUrl} alt="Banner Preview" className="mt-4 rounded-md shadow-md" />}
                </div>

                {/* Associated Profiles */}
                <div>
                    <label className="block mb-2 font-semibold">Associated Profiles</label>
                    {/* Dynamic fields for profiles - can be expanded with add/remove functionality */}
                    <input
                        type="text"
                        placeholder="Enter profile name and role (e.g., John Doe, Engineer)"
                        className="w-full p-2 text-black rounded-md"
                        onBlur={(e) => {
                            if (e.target.value) {
                                const [name, role] = e.target.value.split(",");
                                if (name && role) {
                                    setAssociatedProfiles((prev) => [...prev, { name: name.trim(), role: role.trim() }]);
                                    e.target.value = "";
                                }
                            }
                        }}
                    />
                    {associatedProfiles.length > 0 && (
                        <ul className="mt-2">
                            {associatedProfiles.map((profile, index) => (
                                <li key={index} className="text-gray-300">
                                    {profile.name} - {profile.role}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Project Description or PDF */}
                <div>
                    <label className="block mb-2 font-semibold">Project Description</label>
                    <textarea
                        placeholder="Enter project description (if not uploading a PDF)"
                        className="w-full p-2 text-black rounded-md"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                    />
                    <div className="mt-4">
                        <label className="block mb-2 font-semibold">Or Upload a PDF</label>
                        <input type="file" accept="application/pdf" onChange={handlePdfChange} className="text-black" />
                    </div>
                </div>

                {/* Location Picker using React Leaflet */}
                <div>
                    <label className="block mb-2 font-semibold">Project Location</label>
                    {/* Replace this with your actual MapPicker component */}
                    <div className="w-full h-64 bg-gray-700 rounded-md flex items-center justify-center">
                        <p className="text-gray-300">Map Picker (React Leaflet)</p>
                    </div>
                    {/* Example: When user clicks on map, update location */}
                    {/* setLocation({ lat: selectedLat, lng: selectedLng }); */}
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition-all">
                    Create Project
                </button>
            </form>
        </motion.div>
    );
}
