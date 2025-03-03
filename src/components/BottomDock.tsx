"use client";

import { Box, Icon, Flex, Text } from "@chakra-ui/react";
import { FiHome, FiUser, FiMessageCircle, FiBell, FiSettings } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
    { label: "Home", icon: FiHome, path: "/home" },
    { label: "Profile", icon: FiUser, path: "/profile" },
    { label: "Messages", icon: FiMessageCircle, path: "/messages" },
    { label: "Notifications", icon: FiBell, path: "/notifications" },
    { label: "Settings", icon: FiSettings, path: "/settings" }
];

const BottomDock = ({ showLabels = false }: { showLabels?: boolean }) => {
    const router = useRouter();
    const pathname = usePathname(); // Get current route

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
