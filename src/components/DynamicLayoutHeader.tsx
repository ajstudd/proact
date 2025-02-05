
import { Box, Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";

const Header = () => {
    return (
        <Box as="header" className="bg-gray-800 text-white p-4 shadow-md flex items-center fixed w-full top-0 z-10 h-16">
            <Text fontSize="xl" fontWeight="bold">Proactive India</Text>
        </Box>
    );
};

export default Header;