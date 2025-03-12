"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Input, IconButton, VStack, Image, Text, Button, Spinner } from "@chakra-ui/react";
import { FiSearch, FiX, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import useProjectSearch from "hooks/useProjectSearch";
import { useRouter } from "next/router";
import useScreenSize from "hooks/useScreenSize";
import { ProjectSearchResult } from "../types";

interface HeaderProps {
    hideSearch?: boolean;
}

const buttonConfig: Record<string, { text: string; link: string } | null> = {
    "/signup": { text: "Login", link: "/login" },
    "/login": { text: "Sign Up", link: "/signup" },
    "/home": { text: "Dashboard", link: "/dashboard" }, // Example: Button on home page
    "/projects": { text: "My Projects", link: "/dashboard/projects" }, // Example: Button for projects
};

const Header = ({ hideSearch = false }: HeaderProps) => {
    const { searchTerm, setSearchTerm, results, isLoading, error } = useProjectSearch({ limit: 5 });
    const { screenSize } = useScreenSize();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();

    const button = buttonConfig[router.pathname] || null;

    const handleResultClick = (project: ProjectSearchResult) => {
        router.push(`/project/${project._id}`);
        setSearchTerm('');
    };

    const getImageUrl = (project: ProjectSearchResult) => {
        return project.bannerUrl || 'https://via.placeholder.com/150?text=No+Image';
    };

    return (
        <Box as="header" className="bg-gray-800 text-white px-6 shadow-md fixed w-full top-0 z-10 h-16 flex items-center">
            <Text fontSize="xl" fontWeight="bold" className="w-[33%]">Proactive India</Text>

            <Flex className="w-[67%] mx-auto px-1 lg:px-4 justify-end lg:justify-start">
                {/* Conditionally Render Search Bar & Button */}
                {!hideSearch && (
                    <>
                        {/* Desktop Search Bar (Visible on md+) */}
                        <div className="flex relative w-[450px] hidden lg:flex">
                            <IconButton
                                aria-label="Search"
                                icon={<FiSearch />}
                                className="absolute left-6 text-gray-500 bg-transparent"
                            />
                            <Input
                                className="pl-12 pr-12 py-1 text-black w-full rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <IconButton
                                    aria-label="Clear search"
                                    icon={<FiX />}
                                    size="sm"
                                    className="absolute right-6 text-gray-500 bg-transparent"
                                    onClick={() => setSearchTerm('')}
                                />
                            )}
                        </div>

                        {/* Mobile Search Icon (Hidden on md+) */}
                        {screenSize !== "large" && (
                            <IconButton
                                aria-label="Search"
                                icon={<FiSearch />}
                                className="text-white"
                                onClick={() => setIsSearchOpen(true)}
                            />
                        )}
                    </>
                )}
            </Flex>

            {/* Mobile Expanding Search Bar (Visible only when active) */}
            {isSearchOpen && !hideSearch && (
                <motion.div
                    initial={{ width: "0px", opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: "0px", opacity: 0 }}
                    className="absolute top-16 left-0 w-full p-4 bg-gray-900 flex items-center gap-2 md:hidden"
                >
                    <Input
                        className="text-black flex-1 rounded-lg px-4 shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton
                        aria-label="Close search"
                        icon={<FiX />}
                        size="md"
                        className="text-gray-400 bg-transparent"
                        onClick={() => {
                            setIsSearchOpen(false);
                            setSearchTerm("");
                        }}
                    />
                </motion.div>
            )}

            {/* Search Results Dropdown */}
            {!hideSearch && searchTerm && (
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 
                        top-[122px] w-full 
                        sm:top-[12px] sm:max-w-[80%] sm:w-full 
                        lg:top-[64px] lg:max-w-[50%] lg:w-full 
                        bg-white shadow-lg rounded-lg z-20 border border-gray-200 overflow-hidden"
                >
                    <div className="divide-y divide-gray-100">
                        {isLoading && (
                            <Flex justify="center" align="center" p={4} className="bg-gray-50">
                                <Spinner size="md" color="teal.500" mr={3} />
                                <Text color="gray.700">Searching projects...</Text>
                            </Flex>
                        )}

                        {error && (
                            <Box p={4} bg="red.50" color="red.700" borderRadius="md" className="border-l-4 border-red-500">
                                <Flex align="center">
                                    <Box as="span" mr={2}>⚠️</Box>
                                    <Text>{error}</Text>
                                </Flex>
                            </Box>
                        )}

                        {!isLoading && results.length === 0 && searchTerm && (
                            <Box p={4} textAlign="center" className="bg-gray-50">
                                <Text className="text-gray-600" fontSize="sm">No projects found matching</Text>
                                <Text className="text-gray-800" fontWeight="medium">&quot;{searchTerm}&quot;</Text>
                            </Box>
                        )}

                        {results.map((project) => (
                            <div
                                key={project._id}
                                className="flex items-center w-full p-3 hover:bg-teal-50 cursor-pointer transition-all duration-200"
                                onClick={() => handleResultClick(project)}
                            >
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                                    <Image
                                        src={getImageUrl(project)}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        fallbackSrc="https://via.placeholder.com/150?text=No+Image"
                                    />
                                </div>
                                <div className="flex-1 ml-4">
                                    <Text
                                        className="text-gray-900 font-semibold text-sm line-clamp-1"
                                        style={{
                                            WebkitLineClamp: 1,
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {project.title}
                                    </Text>
                                    {project.location?.place && (
                                        <Flex align="center" mt={1} className="text-gray-600" fontSize="xs">
                                            <FiMapPin size={12} className="mr-1 text-teal-600" />
                                            <Text noOfLines={1}>{project.location.place}</Text>
                                        </Flex>
                                    )}
                                    {project.government?.name && (
                                        <Flex align="center" mt={1} className="text-gray-500" fontSize="xs">
                                            <Box as="span" mr={1} className="text-blue-500">👨‍💼</Box>
                                            <Text>{project.government.name}</Text>
                                        </Flex>
                                    )}
                                </div>
                                <div className="ml-2 p-2 rounded-full hover:bg-teal-100">
                                    <FiSearch
                                        className="text-teal-600"
                                        size={18}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {button && (
                <Button
                    variant="outline"
                    colorScheme="teal"
                    className="ml-auto hover:bg-teal-500 hover:text-white transition-all"
                    onClick={() => router.push(button.link)}
                >
                    {button.text}
                </Button>
            )}
        </Box>
    );
};

export default Header;



