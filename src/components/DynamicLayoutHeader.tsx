"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Input, IconButton, VStack, Image, Text } from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import useDebounce from "hooks/useDebounce"; // Import debounce hook
import { useRouter } from "next/navigation";
import useScreenSize from "hooks/useScreenSize";

interface HeaderProps {
    hideSearch?: boolean; // New prop to hide search feature
}

// Dummy search data
const dummyResults = [
    { id: 1, title: "Taj Mahal", image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", link: "https://en.wikipedia.org/wiki/Taj_Mahal" },
    { id: 2, title: "India Gate", image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", link: "https://en.wikipedia.org/wiki/India_Gate" },
    { id: 3, title: "Hawa Mahal", image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", link: "" }, // No link case
];

const Header = ({ hideSearch = false }: HeaderProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { screenSize } = useScreenSize();
    const [results, setResults] = useState<typeof dummyResults>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const router = useRouter();

    // Simulated API call (Replace with actual API)
    const fetchResults = async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setResults(dummyResults.filter(item => item.title.toLowerCase().includes(query.toLowerCase())));
    };

    // Fetch data when search term changes (debounced)
    useEffect(() => {
        fetchResults(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

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
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <IconButton
                                    aria-label="Clear search"
                                    icon={<FiX />}
                                    size="sm"
                                    className="absolute right-6 text-gray-500 bg-transparent"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setResults([]);
                                    }}
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
                        placeholder="Search..."
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
                            setResults([]);
                        }}
                    />
                </motion.div>
            )}

            {/* Search Results Dropdown */}
            {!hideSearch && results.length > 0 && (
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 
                        top-[122px] w-full 
                        sm:top-[12px] sm:max-w-[80%] sm:w-full 
                        lg:top-[64px] lg:max-w-[50%] lg:w-full 
                        bg-white shadow-lg p-3 rounded-lg z-20"
                >
                    <div className="space-y-3">
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="flex items-center w-full p-3 hover:bg-gray-200 cursor-pointer rounded-lg transition-all duration-300 ease-in-out transform"
                                onClick={() => result.link ? router.push(result.link) : null}
                            >
                                <Image
                                    src={result.image}
                                    alt={result.title}
                                    className="rounded-lg mr-3 w-16 h-16 object-cover"
                                />
                                <div className="flex-1">
                                    <span
                                        className="block text-black font-semibold text-sm line-clamp-2"
                                        style={{
                                            WebkitLineClamp: 2,
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {result.title}
                                    </span>
                                </div>
                                <FiSearch
                                    className="text-gray-500 ml-3 cursor-pointer hover:text-gray-700"
                                    size={20}
                                    onClick={() => alert(`Search for ${result.title}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Box>
    );
};

export default Header;
