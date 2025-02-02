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
                    classOverride="lg:relative lg:w-64 lg:block absolute lg:h-auto w-full h-full top-0 left-0 z-50"
                />
                <Box
                    as="main"
                    className={`transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full ${isOpen ? "lg:ml-64" : ""}`}
                >
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default Layout;
