import React from "react";
import { Box, HStack, Text, VStack, Badge, Flex, Icon, Link } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import { Comment } from "../types/user";
import { formatDistance } from "date-fns";
import NextLink from "next/link";

interface UserCommentCardProps {
    comment: Comment;
}

export const UserCommentCard: React.FC<UserCommentCardProps> = ({ comment }) => {
    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            shadow="sm"
            mb={4}
        >
            {/* Project Info */}
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <NextLink href={`/projects/${comment.project._id}`} passHref>
                    <Link fontWeight="bold" fontSize="md" color="blue.600">
                        {comment.project.name}
                    </Link>
                </NextLink>
                <Badge colorScheme="blue" variant="subtle">
                    {comment.project.location.place}
                </Badge>
            </Flex>

            {/* Comment Content */}
            <Text my={3} fontSize="md">
                {comment.content}
            </Text>

            {/* Interaction Stats */}
            <HStack spacing={4} mt={2}>
                <Flex alignItems="center">
                    <Icon as={FaThumbsUp} color="green.500" mr={1} />
                    <Text fontSize="sm">{comment.likes.length}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Icon as={FaThumbsDown} color="red.500" mr={1} />
                    <Text fontSize="sm">{comment.dislikes.length}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Icon as={FaComment} color="blue.500" mr={1} />
                    <Text fontSize="sm">{comment.replies.length}</Text>
                </Flex>
            </HStack>

            {/* Timestamp */}
            <Text fontSize="xs" color="gray.500" mt={2}>
                {formatDistance(new Date(comment.createdAt), new Date(), {
                    addSuffix: true
                })}
            </Text>
        </Box>
    );
};

export default UserCommentCard;
