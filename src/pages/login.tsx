// LABEL: Old Login Page taken from Intelligram
// import {
//   Box,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Spinner,
//   Text,
//   VStack,
// } from "@chakra-ui/react";
// import { useLoginMutation } from "@services";
// import { RootState } from "@store";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import { useSelector } from "react-redux";

// export default function Login() {
//   const router = useRouter();
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [login, { data: loginData, isLoading: isLoginLoading }] =
//   useLoginMutation();

//   const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };

//   useEffect
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };
//   const handleLogin =async () => {
//     const loginres = await login({ email: loginForm.email, password: loginForm.password }).unwrap();
//     if (loginres?.token) {
//       localStorage.setItem("token", JSON.stringify(loginres.token));
//       router.push("/");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen flex-col">
//       <VStack
//         gap={"15px"}
//         minW={"40%"}
//         border={"1px solid #DEDEDE"}
//         borderRadius={"5px"}
//         padding={"40px"}
//       >
//         <Text fontWeight={"700"} fontSize={"24px"}>
//           Login
//         </Text>
//         <VStack gap={"15px"} justifyContent={"center"} w={"100%"}>
//           <Input
//             placeholder="Email"
//             border={"1px solid #DEDEDE"}
//             p={6}
//             w={"100%"}
//             name="email"
//             onChange={(e)=>changeHandler(e)}
//             value={loginForm.email}
//             borderRadius={"5px"}
//           />
//           <InputGroup>
//             <Input
//               placeholder="Password"
//               w={"100%"}
//               p={6}
//               name="password"
//               onChange={(e)=>changeHandler(e)}
//               value={loginForm.password}
//               border={"1px solid #DEDEDE"}
//               borderRadius={"5px"}
//               type={isPasswordVisible ? "text" : "password"}
//             />
//             <InputRightElement
//               display={"flex"}
//               justifyContent={"center"}
//               alignItems={"center"}
//               height={"100%"}
//               pr={"10px"}
//               cursor={"pointer"}
//             >
//               <Box
//                 display={"flex"}
//                 justifyContent={"center"}
//                 alignItems={"center"}
//                 height={"100%"}
//               >
//                 {isPasswordVisible ? (
//                   <IoEyeOutline onClick={togglePasswordVisibility} />
//                 ) : (
//                   <IoEyeOffOutline onClick={togglePasswordVisibility} />
//                 )}
//               </Box>
//             </InputRightElement>
//           </InputGroup>
//         </VStack>
//         <VStack gap={"15px"}>
//           <Text fontSize={"12px"}>Forgot password?</Text>
//           <Text fontSize={"12px"}>
//             {`Don't have an account?`} <Link href={"/signup"}>Sign up</Link>
//           </Text>{" "}
//         </VStack>
//         <div
//           onClick={handleLogin}
//           className="bg-blue-500 h-[40px] flex w-full justify-center hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           {isLoginLoading ? (
//             <Box
//               display={"flex"}
//               w={"100%"}
//               h={"100%"}
//               justifyContent={"center"}
//               alignItems={"center"}
//             >
//              <Spinner size="xl" sx={{ width: '25px', height: '25px' }} />
//             </Box>
//           ) : (
//             <Text fontWeight={'700'}>Login</Text>
//           )}
//         </div>
//       </VStack>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Dummy API Call
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful! Redirecting...");
      router.push("/"); // Redirect to dashboard
    }, 2000);
  };

  return (
    <motion.div
      className="h-full px-4 flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiMail className="mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiLock className="mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-all">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
