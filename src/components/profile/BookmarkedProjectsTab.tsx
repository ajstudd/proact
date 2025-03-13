import React from "react";
import { Box, SimpleGrid, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useGetBookmarkedProjectsQuery } from "../../services/userApi";
import ProjectCard, { ProjectCardProps } from "../ProjectCard"; // Assuming you have a ProjectCard component

const BookmarkedProjectsTab: React.FC = () => {
    const { data, isLoading, error } = useGetBookmarkedProjectsQuery();

    if (isLoading) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text mt={2} color="gray.500">Loading your bookmarked projects...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="md" mt={4}>
                <AlertIcon />
                There was an error loading your bookmarks.
            </Alert>
        );
    }

    if (!data?.bookmarks?.length) {
        return (
            <Box textAlign="center" py={8}>
                <Text color="gray.500">You haven&apos;t bookmarked any projects yet.</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
            {data.bookmarks.map((project: any) => (
                <ProjectCard key={project._id} project={project} />
            ))}
        </SimpleGrid>
    );
};

export default BookmarkedProjectsTab;
