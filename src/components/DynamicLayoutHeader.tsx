"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Input, IconButton, VStack, Image, Text, Button, Spinner, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { FiSearch, FiX, FiMapPin, FiLogOut, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import useProjectSearch from "hooks/useProjectSearch";
import { useRouter } from "next/router";
import useScreenSize from "hooks/useScreenSize";
import { ProjectSearchResult } from "../types";
import { useAuth } from "../contexts/AuthContext";
import useUserState from "../hooks/useUserState";

interface HeaderProps {
    hideSearch?: boolean;
}

const buttonConfig: Record<string, { text: string; link: string } | null> = {
    "/signup": { text: "Login", link: "/login" },
    "/login": { text: "Sign Up", link: "/signup" },
};

const Header = ({ hideSearch = false }: HeaderProps) => {
    const { searchTerm, setSearchTerm, results, isLoading, error } = useProjectSearch({ limit: 5 });
    const { screenSize } = useScreenSize();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { user } = useUserState();

    // Only show button config if user is not authenticated
    const button = !isAuthenticated ? buttonConfig[router.pathname] || null : null;

    const handleResultClick = (project: ProjectSearchResult) => {
        router.push(`/project/${project._id}`);
        setSearchTerm('');
    };

    const getImageUrl = (project: ProjectSearchResult) => {
        return project.bannerUrl || 'https://via.placeholder.com/150?text=No+Image';
    };

    const navigateToProfile = () => {
        router.push('/profile');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Box as="header" className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-6 shadow-2xl fixed w-full top-0 z-20 h-16 flex items-center border-b border-blue-800/30 backdrop-blur-sm">
            <Text
                fontSize="4xl"
                fontWeight="bold"
                className="w-[33%] bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-teal-300 transition-all duration-300 cursor-pointer"
                onClick={() => router.push('/')}
            >
                Proactive India
            </Text>
            <Flex className="w-[67%] mx-auto px-1 lg:px-4 justify-between sm:justify-end items-center">
                {/* Conditionally Render Search Bar & Button */}
                {!hideSearch && (
                    <>
                        {/* Desktop/Tablet Search Bar (Visible on md+) */}
                        <div className={`relative ${screenSize === "small" ? "hidden" : "flex"} w-[450px]`}>
                            <IconButton
                                aria-label="Search"
                                icon={<FiSearch />}
                                className="absolute left-6 text-gray-500 bg-transparent"
                            />
                            <Input
                                className="pl-12 pr-12 py-[4px] text-gray-900 w-full rounded-lg shadow-lg border border-blue-200/30 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
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
                    </>
                )}

                {/* User Profile and Authentication Section - Fixed alignment */}
                <Flex ml="auto" alignItems="center" gap={2}>
                    {/* Mobile Search Icon - Moved here to be next to the profile picture */}
                    {!hideSearch && screenSize === "small" && (
                        <IconButton
                            aria-label="Search"
                            icon={<FiSearch />}
                            className="text-white"
                            w={32}
                            h={32}
                            marginRight={8}
                            onClick={() => setIsSearchOpen(true)}
                        />
                    )}

                    {isAuthenticated ? (
                        <Menu placement="bottom-end" offset={[0, 5]} gutter={0}>
                            <MenuButton
                                as={Button}
                                variant="unstyled"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                p={1}
                                minW="auto"
                                h="auto"
                            >
                                <Image
                                    src={user?.photo || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
                                    alt={user?.name || "User"}
                                    className="rounded-full cursor-pointer border-2 border-blue-400/50 hover:border-teal-400/70 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                                    width={32}
                                    height={32}
                                    objectFit="cover"
                                />
                            </MenuButton>
                            <MenuList
                                className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl shadow-2xl border border-blue-200/30 py-2 min-w-[180px] z-[50] mt-1 absolute right-0"
                                sx={{
                                    zIndex: 50,
                                    position: "relative"
                                }}
                            >
                                <div
                                    onClick={navigateToProfile}
                                    className="px-3 py-3 flex items-center text-sm text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:text-blue-700 cursor-pointer transition-all duration-200 rounded-lg mx-1"
                                >
                                    <FiUser className="mr-2.5" /> Profile
                                </div>
                                <div className="border-t border-gray-200/50 my-1 mx-2"></div>
                                <div
                                    onClick={handleLogout}
                                    className="px-3 py-3 flex items-center text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all duration-200 rounded-lg mx-1"
                                >
                                    <FiLogOut className="mr-2.5" /> Logout
                                </div>
                            </MenuList>
                        </Menu>
                    ) : button ? (
                        <Button
                            variant="outline"
                            size="sm"
                            fontWeight="medium"
                            className="border-2 border-blue-400/50 text-blue-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-lg shadow-lg hover:shadow-blue-500/25"
                            onClick={() => router.push(button.link)}
                        >
                            {button.text}
                        </Button>
                    ) : null}
                </Flex>
            </Flex>

            {isSearchOpen && !hideSearch && screenSize === "small" && (
                <motion.div
                    initial={{ width: "0px", opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: "0px", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-16 left-0 w-full p-4 bg-gray-900 flex items-center gap-2"
                >
                    <Input
                        className="text-black flex-1 rounded-md px-6 py-[4px] shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </Box>
    );
};

export default Header;



