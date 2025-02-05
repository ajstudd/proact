"use client";

import { useState } from "react";
import { Box, Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import Header from "./DynamicLayoutHeader";
import Sidebar from "./DynamicSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Flex direction="column" className="h-screen w-full fixed">
            <Header />
            <Flex className="flex-1 pt-16 h-[calc(100vh-64px)]">
                <Sidebar
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                />
                <Box
                    as="main"
                    className={`transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full `}
                >
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default Layout;
