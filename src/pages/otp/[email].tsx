"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRequestOtpMutation, useVerifyOtpMutation } from "@services";
import CryptoJS from "crypto-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SECRET_KEY = "your-secret-key";

const decryptEmail = (encryptedEmail: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedEmail), SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return "";
    }
};




const VerifyAccount = () => {
    const router = useRouter();
    const { email } = useParams(); // Get encrypted email from URL
    const decryptedEmail = decryptEmail(email as string);

    const [step, setStep] = useState(1);
    const [method, setMethod] = useState<"email" | "phone">("email");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [requestOtp, { isLoading: requestingOtp }] = useRequestOtpMutation();
    const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

    useEffect(() => {
        if (!email) {
            notFound(); // Show Next.js 404 page
        }
    }, [email]);
    useEffect(() => {
        if (!decryptedEmail) {
            toast.error("Invalid email.");
            setTimeout(() => router.push("/login"), 2000); // Delay before redirect
        }
    }, [decryptedEmail, router]);

    const handleRequestOtp = async () => {
        if (method === "phone" && phone.trim().length < 10) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        try {
            await requestOtp({
                method,
                email: decryptedEmail,
                phone: method === "phone" ? phone.trim() : "",
            }).unwrap();
            toast.success("OTP sent successfully!");
            setStep(2);
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await verifyOtp({ email: decryptedEmail, otp }).unwrap();
            toast.success("Account verified successfully!");
            setTimeout(() => router.push("/login"), 2000); // Delay before redirect
        } catch (error: any) {
            toast.error(error.data?.message || "Invalid OTP");
        }
    };

    return (
        <motion.div
            className="h-full px-4 flex items-center justify-center bg-gray-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                {step === 1 ? (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-4">Verify Your Account</h2>
                        <p className="text-center mb-4">Choose how you want to receive your OTP</p>

                        <div className="flex space-x-4 mb-4">
                            <button
                                className={`w-1/2 py-2 rounded-lg ${method === "email" ? "bg-blue-600" : "bg-gray-700"}`}
                                onClick={() => {
                                    setMethod("email");
                                    setPhone(""); // Reset phone input
                                }}
                            >
                                Email
                            </button>
                            <button
                                className={`w-1/2 py-2 rounded-lg ${method === "phone" ? "bg-blue-600" : "bg-gray-700"}`}
                                onClick={() => setMethod("phone")}
                            >
                                Phone
                            </button>
                        </div>

                        {method === "phone" && (
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 mb-4 rounded-lg text-black"
                            />
                        )}

                        <button
                            onClick={handleRequestOtp}
                            disabled={requestingOtp}
                            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg flex items-center justify-center"
                        >
                            {requestingOtp ? (
                                <>
                                    <span className="loader mr-2"></span> Requesting OTP...
                                </>
                            ) : (
                                "Request OTP"
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 rounded-lg text-black"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={verifyingOtp}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4 flex items-center justify-center"
                        >
                            {verifyingOtp ? (
                                <>
                                    <span className="loader mr-2"></span> Verifying...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default VerifyAccount;
