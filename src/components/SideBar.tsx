import { Box, HStack, Icon, Spacer, Text, VStack } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const list = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Profile",
      link: "/profile",
    },
    {
      name: "Leaderboard",
      link: "/leaderboard",
    },
    {
      name: "Settings",
      link: "/settings",
    },
  ];

  return (
    <VStack w={"full"} minW={"100%"} height={"full"} alignItems={'flex-start'} className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-blue-800/30 shadow-2xl" p={5}>
      {list.map((item, index) => (
        <Box key={index}
          padding={5}
          className={`hover:bg-blue-800/30 cursor-pointer flex-col w-[100%] min-w-[100%] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border border-transparent hover:border-blue-600/30 ${router.pathname === item.link ? 'bg-gradient-to-r from-blue-600 to-teal-600 shadow-blue-500/25' : ''
            }`}
        >
          <Text
            onClick={() => {
              router.push(item.link);
            }}
            className={`transition-colors duration-300 ${router.pathname === item.link ? 'text-white font-medium' : 'text-blue-100'
              }`}
          >
            {item.name}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
