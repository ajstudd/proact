import { Box, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiHome, FiSettings, FiUser, FiBell, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const menuItems = [
    { label: "Home", icon: FiHome },
    { label: "Profile", icon: FiUser },
    { label: "Messages", icon: FiMessageCircle },
    { label: "Notifications", icon: FiBell },
    { label: "Settings", icon: FiSettings }
];

const Sidebar = ({ isOpen, toggleSidebar, classOverride }: {
    isOpen: boolean;
    toggleSidebar: () => void;
    classOverride?: string;
}) => {
    return (
        <Box
            as="aside"
            className={classOverride ? classOverride : `h-screen bg-gray-900 text-white transition-all duration-300 shadow-lg ${isOpen ? "w-64" : "w-[64px]"}`}
        >
            <Flex align="center" className="p-4 border-b border-gray-700">
                <Button onClick={toggleSidebar} className="text-white bg-transparent p-2">
                    <Icon as={isOpen ? FiChevronLeft : FiMenu} />
                </Button>
                {isOpen && <Text ml={4} fontSize="lg" fontWeight="bold">Dashboard</Text>}
            </Flex>
            <Box p={4} className="overflow-hidden hover:overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <Stack spacing={4} className="w-full flex justify-start items-start">
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            className={`flex justify-start bg-transparent text-white p-2 hover:bg-gray-700 rounded-lg ${isOpen ? "pl-4 items-center" : " w-full items-start"}`}
                        >
                            <Icon as={item.icon} className={isOpen ? "mr-2" : ""} />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isOpen ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOpen && <Text>{item.label}</Text>}
                            </motion.div>
                        </Button>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default Sidebar;
