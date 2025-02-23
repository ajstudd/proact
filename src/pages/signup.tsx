// LABEL: Old SignUp Page taken from Intelligram
// import {
//   Badge,
//   Box,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
//   RangeSlider,
//   RangeSliderFilledTrack,
//   RangeSliderThumb,
//   RangeSliderTrack,
//   Stack,
//   Switch,
//   Text,
//   VStack,
// } from "@chakra-ui/react";
// import { RootState } from "@store";
// import Link from "next/link";
// import { useState } from "react";
// import { useEffect } from "react";
// import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import { useSelector } from "react-redux";

// export default function SignUp() {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };
//   const handleLogin = () => {
//     // This is a dummy function to simulate a login request
//     // In a real application, you would make an HTTP request to your server
//     // to authenticate the user
//   };

//   return (
//     <div className="flex justify-center items-center h-screen flex-col">
//       <VStack
//         gap={"15px"}
//         minW={"50%"}
//         border={"1px solid #DEDEDE"}
//         borderRadius={"5px"}
//         padding={"40px"}
//       >
//         <Text fontWeight={"700"} fontSize={"24px"}>
//           Sign Up
//         </Text>
//         <VStack gap={"15px"} minW={"100%"} justifyContent={"center"} w={"100%"}>
//           <Input
//             placeholder="Name"
//             border={"1px solid #DEDEDE"}
//             w={"100%"}
//             p={6}
//             borderRadius={"5px"}
//           />
//           <Input
//             placeholder="Email"
//             w={"100%"}
//             border={"1px solid #DEDEDE"}
//             p={6}
//             borderRadius={"5px"}
//           />
//           <Input
//             placeholder="Phone"
//             w={"100%"}
//             border={"1px solid #DEDEDE"}
//             p={6}
//             type="number"
//             borderRadius={"5px"}
//           />
//           <InputGroup>
//             <Input
//               placeholder="Password"
//               w={"100%"}
//               p={6}
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
//           <Input
//             placeholder="Confirm Password"
//             w={"100%"}
//             border={"1px solid #DEDEDE"}
//             type={isPasswordVisible ? "text" : "password"}
//             p={6}
//             borderRadius={"5px"}
//           />
//         </VStack>
//         <VStack gap={"15px"}>
//           <Text fontSize={"12px"}>
//             {`Already have an account?`} <Link href={"/login"}>Log In</Link>
//           </Text>{" "}
//         </VStack>
//         <button
//           onClick={handleLogin}
//           className="bg-blue-500 flex w-full text-center justify-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Sign Up
//         </button>
//       </VStack>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiLock, FiBriefcase } from "react-icons/fi";
import Link from "next/link";
import { useRegisterMutation } from "@services";

const Register = () => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation(); // RTK Mutation Hook

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER", // Default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser(formData).unwrap(); // Call API
      toast.success("Registration successful! Redirecting...");
      router.push("/login"); // Redirect to login page
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed! Please try again.");
    }
  };

  return (
    <motion.div
      className="h-full px-4 flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiUser className="mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-transparent outline-none flex-1"
            />
          </div>
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
            <FiMail className="mr-2" />
            <input
              type="phone"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
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
              minLength={6}
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <div className="flex items-center border-b border-gray-600 py-2">
            <FiBriefcase className="mr-2" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-transparent outline-none flex-1"
            >
              <option value="USER" className="text-black">User</option>
              <option value="CONTRACTOR" className="text-black">Contractor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-all"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
        <p className="mt-2 text-sm text-center text-gray-400">
          Are you a government authority? <Link href="/onboarding" className="text-yellow-400 hover:underline">Contact us here</Link>.
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
