import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLoginMutation } from "@services";
import { RootState } from "@store";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function Login() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [login, { data: loginData, isLoading: isLoginLoading }] =
  useLoginMutation();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  useEffect
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleLogin =async () => {
    const loginres = await login({ email: loginForm.email, password: loginForm.password }).unwrap();
    if (loginres?.token) {
      localStorage.setItem("token", JSON.stringify(loginres.token));
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <VStack
        gap={"15px"}
        minW={"40%"}
        border={"1px solid #DEDEDE"}
        borderRadius={"5px"}
        padding={"40px"}
      >
        <Text fontWeight={"700"} fontSize={"24px"}>
          Login
        </Text>
        <VStack gap={"15px"} justifyContent={"center"} w={"100%"}>
          <Input
            placeholder="Email"
            border={"1px solid #DEDEDE"}
            p={6}
            w={"100%"}
            name="email"
            onChange={(e)=>changeHandler(e)}
            value={loginForm.email}
            borderRadius={"5px"}
          />
          <InputGroup>
            <Input
              placeholder="Password"
              w={"100%"}
              p={6}
              name="password"
              onChange={(e)=>changeHandler(e)}
              value={loginForm.password}
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
        </VStack>
        <VStack gap={"15px"}>
          <Text fontSize={"12px"}>Forgot password?</Text>
          <Text fontSize={"12px"}>
            {`Don't have an account?`} <Link href={"/signup"}>Sign up</Link>
          </Text>{" "}
        </VStack>
        <div
          onClick={handleLogin}
          className="bg-blue-500 h-[40px] flex w-full justify-center hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {isLoginLoading ? (
            <Box
              display={"flex"}
              w={"100%"}
              h={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
             <Spinner size="xl" sx={{ width: '25px', height: '25px' }} />
            </Box>
          ) : (
            <Text fontWeight={'700'}>Login</Text>
          )}
        </div>
      </VStack>
    </div>
  );
}
