"use client";

import { useState } from "react";
import { Box, Flex, useMediaQuery, ChakraProvider } from "@chakra-ui/react";
import Header from "./DynamicLayoutHeader";
import UnifiedSidebar from "./UnifiedSidebar";
import BottomDock from "./BottomDock";

const UnifiedLayout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Flex direction="column" className="h-screen w-full fixed">
            <Header />
            <Flex className={`flex-1 pt-16 h-[calc(100vh-64px)]`}>
                {!isMobile && <UnifiedSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />}
                <Box
                    as="main"
                    className="transition-all duration-300 flex-1 bg-gray-100 overflow-y-auto h-full p-4"
                    pb={isMobile ? "80px" : "0"}
                >
                    <ChakraProvider>
                        {children}
                    </ChakraProvider>
                </Box>
            </Flex>
            {isMobile && <BottomDock />}
        </Flex>
    );
};

export default UnifiedLayout;
