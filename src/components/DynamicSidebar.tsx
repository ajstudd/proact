import { Box, Button, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { FiMenu, FiChevronLeft, FiHome, FiSettings, FiUser, FiBell, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const menuItems = [
    { label: "Home", icon: FiHome },
    { label: "Profile", icon: FiUser },
    { label: "Messages", icon: FiMessageCircle },
    { label: "Notifications", icon: FiBell },
    { label: "Settings", icon: FiSettings }
];

const Sidebar = ({ isOpen, toggleSidebar }: {
    isOpen: boolean;
    toggleSidebar: () => void;
}) => {
    return (
        <Box
            as="aside"
            className={`h-screen bg-gray-900 text-white transition-all duration-300 shadow-lg ${isOpen ? "w-64" : "w-[64px]"}`}
        >
            <Flex align="center" className="p-4 border-b border-gray-700">
                <Button onClick={toggleSidebar} className="text-white bg-transparent p-2">
                    <Icon as={isOpen ? FiChevronLeft : FiMenu} />
                </Button>
                {isOpen && <Text ml={4} fontSize="lg" fontWeight="bold">Dashboard</Text>}
            </Flex>
            <Box p={4} className="overflow-hidden hover:overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <div className="w-full flex justify-center items-center align-middle content-center flex-col">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}

                            className={`flex items-center bg-transparent 
                            text-white hover:bg-gray-700 rounded-lg w-full
                            ${isOpen ? "pl-[20px] h-[40px]" : "justify-center content-center h-[40px]"}
                           `}
                        >
                            <Icon as={item.icon} className={isOpen ? "mr-2" : ""} />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isOpen ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOpen && <Text>{item.label}</Text>}
                            </motion.div>
                        </button>
                    ))}
                </div>
            </Box>
        </Box >
    );
};

export default Sidebar;
