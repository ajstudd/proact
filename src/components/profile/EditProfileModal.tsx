import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    Avatar,
    Flex,
    Box,
    Tooltip,
    Icon,
    Text,
    useToast
} from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { useProfile } from "../../hooks/useProfile";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const toast = useToast();
    const {
        profileData,
        editProfile,
        isEditProfileLoading,
        imagePreview,
        handleImageChange,
        setImagePreview
    } = useProfile();

    const formik = useFormik({
        enableReinitialize: true, // Add this line to enable reinitialization
        initialValues: {
            name: profileData?.name || "",
            email: profileData?.email || "",
            phone: profileData?.phone || "",
            photo: null as File | null
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
            photo: Yup.mixed()
        }),
        onSubmit: async (values: any) => {
            const formData = new FormData();
            formData.append("name", values.name);

            if (values.email !== profileData?.email) {
                formData.append("email", values.email);
            }

            if (values.phone !== profileData?.phone) {
                formData.append("phone", values.phone);
            }

            if (values.photo) {
                formData.append("photo", values.photo);
            }

            try {
                await editProfile(formData);
                toast({
                    title: "Profile updated",
                    description: values.email !== profileData?.email ?
                        "Please check your email to verify your new email address" :
                        "Your profile has been successfully updated",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
            } catch (error: any) {
                toast({
                    title: "Update failed",
                    description: error.data?.message || "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            formik.setFieldValue("photo", file);
            handleImageChange(e);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4}>
                            <Flex direction="column" alignItems="center" w="full">
                                <Avatar
                                    size="2xl"
                                    src={imagePreview || profileData?.photo || undefined}
                                    name={profileData?.name}
                                    mb={4}
                                />
                                <FormControl>
                                    <FormLabel htmlFor="photo" cursor="pointer">
                                        <Button size="sm" as="span">
                                            Change Photo
                                        </Button>
                                        <Input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            hidden
                                        />
                                    </FormLabel>
                                </FormControl>
                            </Flex>

                            <FormControl isInvalid={!!formik.touched.name && !!formik.errors.name}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <FormErrorMessage>{typeof formik.errors.email === 'string' ? formik.errors.email : ''}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!formik.touched.email && !!formik.errors.email}>
                                <FormLabel htmlFor="email">
                                    Email
                                    <Tooltip
                                        label="Email changes require verification via a link sent to your new email"
                                        placement="top"
                                    >
                                        <Box as="span" ml={1} display="inline-block">
                                            <Icon as={FaInfoCircle} color="gray.500" />
                                        </Box>
                                    </Tooltip>
                                </FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <FormErrorMessage>{typeof formik.errors.email === 'string' ? formik.errors.email : ''}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!formik.touched.phone && !!formik.errors.phone}>
                                <FormLabel htmlFor="phone">
                                    Phone
                                    <Tooltip
                                        label="Phone number changes require verification"
                                        placement="top"
                                    >
                                        <Box as="span" ml={1} display="inline-block">
                                            <Icon as={FaInfoCircle} color="gray.500" />
                                        </Box>
                                    </Tooltip>
                                </FormLabel>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <FormErrorMessage>{typeof formik.errors.email === 'string' ? formik.errors.email : ''}</FormErrorMessage>
                            </FormControl>
                        </VStack>

                        <ModalFooter px={0}>
                            <Button variant="outline" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                type="submit"
                                isLoading={isEditProfileLoading}
                            >
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;
