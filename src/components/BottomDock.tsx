"use client";

import { Box, Icon, Flex, Text } from "@chakra-ui/react";
import { FiHome, FiUser, FiMessageCircle, FiBell, FiSettings, FiClipboard, FiUsers, FiBriefcase } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

const BottomDock = ({ showLabels = false }: { showLabels?: boolean }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { userRole } = useAuth();

    // Base menu items for all users
    let menuItems = [
        { label: "Home", icon: FiHome, path: "/home" },
        { label: "Profile", icon: FiUser, path: "/profile" },
        { label: "Notifications", icon: FiBell, path: "/notifications" },
        { label: "Settings", icon: FiSettings, path: "/settings" }
    ];

    // Add role-specific items (limited to 5 total for mobile)
    if (userRole === "GOVERNMENT") {
        // Replace some items to ensure we have 5 total
        menuItems = [
            { label: "Home", icon: FiHome, path: "/home" },
            { label: "Profile", icon: FiUser, path: "/profile" },
            { label: "Projects", icon: FiClipboard, path: "/projects" },
            { label: "Contractors", icon: FiUsers, path: "/contractors" },
            { label: "Notifications", icon: FiBell, path: "/notifications" },
            { label: "Corruption Reports", icon: FiBriefcase, path: "/reports" },
            { label: "Settings", icon: FiSettings, path: "/settings" }
        ];
    } else if (userRole === "CONTRACTOR") {
        // Replace some items to ensure we have 5 total
        menuItems = [
            { label: "Home", icon: FiHome, path: "/home" },
            { label: "Projects", icon: FiClipboard, path: "/contractor-projects" },
            { label: "Progress", icon: FiMessageCircle, path: "/contractor-progress" },
            { label: "Notifications", icon: FiBell, path: "/notifications" },
            { label: "Profile", icon: FiUser, path: "/profile" },
            { label: "Settings", icon: FiSettings, path: "/settings" }
        ];
    }

    return (
        <Box className="z-[1000] fixed bottom-0 left-0 w-full bg-gray-900 text-white p-2 shadow-lg">
            <Flex justify="space-around" align="center">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Flex
                            key={item.path}
                            direction="column"
                            align="center"
                            className={`p-2 cursor-pointer rounded-lg transition-all duration-200 
                                ${isActive ? "text-blue-400 bg-gray-700" : "hover:bg-gray-700"}
                            `}
                            onClick={() => router.push(item.path)}
                        >
                            <Icon as={item.icon} boxSize={14} />
                            {showLabels && <Text fontSize="xs" mt={1}>{item.label}</Text>}
                        </Flex>
                    );
                })}
            </Flex>
        </Box>
    );
};

export default BottomDock;
