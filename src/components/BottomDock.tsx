import { Box, Icon, Flex, Text } from "@chakra-ui/react";
import { FiHome, FiUser, FiMessageCircle, FiBell, FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";

const menuItems = [
    { label: "Home", icon: FiHome, path: "/" },
    { label: "Profile", icon: FiUser, path: "/profile" },
    { label: "Messages", icon: FiMessageCircle, path: "/messages" },
    { label: "Notifications", icon: FiBell, path: "/notifications" },
    { label: "Settings", icon: FiSettings, path: "/settings" }
];

const BottomDock = ({ showLabels = false }: { showLabels?: boolean }) => {
    const router = useRouter();

    return (
        <Box className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-2 shadow-lg">
            <Flex justify="space-around" align="center">
                {menuItems.map((item, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        align="center"
                        className="p-2 cursor-pointer hover:bg-gray-700 rounded-lg"
                        onClick={() => router.push(item.path)}
                    >
                        <Icon as={item.icon} boxSize={14} />
                        {showLabels && <Text fontSize="xs" mt={1}>{item.label}</Text>}
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};

export default BottomDock;
