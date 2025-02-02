import {
  Badge,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RootState } from "@store";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleLogin = () => {
    // This is a dummy function to simulate a login request
    // In a real application, you would make an HTTP request to your server
    // to authenticate the user
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <VStack
        gap={"15px"}
        minW={"50%"}
        border={"1px solid #DEDEDE"}
        borderRadius={"5px"}
        padding={"40px"}
      >
        <Text fontWeight={"700"} fontSize={"24px"}>
          Sign Up
        </Text>
        <VStack gap={"15px"} minW={"100%"} justifyContent={"center"} w={"100%"}>
          <Input
            placeholder="Name"
            border={"1px solid #DEDEDE"}
            w={"100%"}
            p={6}
            borderRadius={"5px"}
          />
          <Input
            placeholder="Email"
            w={"100%"}
            border={"1px solid #DEDEDE"}
            p={6}
            borderRadius={"5px"}
          />
          <Input
            placeholder="Phone"
            w={"100%"}
            border={"1px solid #DEDEDE"}
            p={6}
            type="number"
            borderRadius={"5px"}
          />
          <InputGroup>
            <Input
              placeholder="Password"
              w={"100%"}
              p={6}
              border={"1px solid #DEDEDE"}
              borderRadius={"5px"}
              type={isPasswordVisible ? "text" : "password"}
            />
            <InputRightElement
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
              pr={"10px"}
              cursor={"pointer"}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                height={"100%"}
              >
                {isPasswordVisible ? (
                  <IoEyeOutline onClick={togglePasswordVisibility} />
                ) : (
                  <IoEyeOffOutline onClick={togglePasswordVisibility} />
                )}
              </Box>
            </InputRightElement>
          </InputGroup>
          <Input
            placeholder="Confirm Password"
            w={"100%"}
            border={"1px solid #DEDEDE"}
            type={isPasswordVisible ? "text" : "password"}
            p={6}
            borderRadius={"5px"}
          />
        </VStack>
        <VStack gap={"15px"}>
          <Text fontSize={"12px"}>
            {`Already have an account?`} <Link href={"/login"}>Log In</Link>
          </Text>{" "}
        </VStack>
        <button
          onClick={handleLogin}
          className="bg-blue-500 flex w-full text-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </VStack>
    </div>
  );
}
