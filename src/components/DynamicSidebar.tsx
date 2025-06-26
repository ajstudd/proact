"use client";

import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiHome, FiSettings, FiUser, FiBell, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const menuItems = [
    { label: "Home", icon: FiHome, path: "/home" },
    { label: "Profile", icon: FiUser, path: "/profile" },
    { label: "Messages", icon: FiMessageCircle, path: "/messages" },
    { label: "Notifications", icon: FiBell, path: "/notifications" },
    { label: "Settings", icon: FiSettings, path: "/settings" }
];

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
    const router = useRouter();
    const pathname = usePathname(); // Get current path

    return (
        <Box
            as="aside"
            className={`h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white transition-all duration-300 shadow-2xl border-r border-blue-800/30 ${isOpen ? "w-64" : "w-[64px]"}`}
        >
            <Flex align="center" className="p-4 border-b border-blue-700/30 bg-black/20 backdrop-blur-sm">
                <Button
                    onClick={toggleSidebar}
                    className="text-white bg-transparent hover:bg-blue-800/30 p-2 rounded-lg transition-all duration-300"
                >
                    <Icon as={isOpen ? FiChevronLeft : FiMenu} />
                </Button>
                {isOpen && (
                    <Text
                        ml={4}
                        fontSize="lg"
                        fontWeight="bold"
                        className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"
                    >
                        Dashboard
                    </Text>
                )}
            </Flex>

            <Box p={4} className="overflow-hidden hover:overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent">
                <div className="w-full flex justify-center items-center flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`flex items-center rounded-xl w-full transition-all duration-300 shadow-sm hover:shadow-lg
                                    ${isOpen ? "pl-[20px] h-[44px]" : "justify-center h-[44px]"} 
                                    ${isActive
                                        ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-blue-500/25"
                                        : "bg-transparent text-blue-100 hover:bg-blue-800/30 hover:text-white border border-transparent hover:border-blue-600/30"
                                    }
                                `}
                            >
                                <Icon
                                    as={item.icon}
                                    className={`${isOpen ? "mr-3" : ""} ${isActive ? "text-white" : "text-blue-300"} transition-colors duration-300`}
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isOpen ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isOpen && <Text className={isActive ? "text-white font-medium" : "text-blue-100"}>{item.label}</Text>}
                                </motion.div>
                            </button>
                        );
                    })}
                </div>
            </Box>
        </Box>
    );
};

export default Sidebar;
