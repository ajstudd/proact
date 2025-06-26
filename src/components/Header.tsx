import { Box, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [closeTimeoutId, setCloseTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showDropdown = () => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      setCloseTimeoutId(null);
    }
    setDropdown(true);
  };

  const scheduleHideDropdown = () => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
    }
    const id = setTimeout(() => {
      setDropdown(false);
    }, 500); // Adjust the timeout as needed
    setCloseTimeoutId(id);
  };

  return (
    <HStack w={"full"} height={"60px"} className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-800/30 shadow-2xl backdrop-blur-sm" p={5}>
      <Image alt="logo" height={"30"} width={"30"} src="/IGMSvg.svg" />
      <Text
        fontWeight={"600"}
        className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-teal-300 transition-all duration-300 cursor-pointer"
        onClick={() => {
          window.location.href = '/';
        }}
      >
        Proactive India
      </Text>
      <Spacer />
      <HStack spacing={10} paddingRight={10}>
        <MdOutlineNotificationsNone
          size={20}
          className="hover:text-blue-400 cursor-pointer text-blue-200 transition-colors duration-300"
        />
        <MdOutlinePerson
          size={20}
          onMouseEnter={showDropdown}
          onMouseLeave={scheduleHideDropdown}
          className="relative hover:text-blue-400 cursor-pointer text-blue-200 transition-colors duration-300"
        />
        {dropdown && (
          <Box
            className="absolute bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl p-4 top-12 right-5 border border-blue-200/30"
            onMouseEnter={showDropdown}
            onMouseLeave={scheduleHideDropdown}
          >
            <Text cursor={'pointer'} className="hover:text-blue-600 transition-colors duration-200 rounded-lg px-2 py-1" >Profile</Text>
            <Text cursor={'pointer'} className="hover:text-red-600 transition-colors duration-200 rounded-lg px-2 py-1" onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            >Logout</Text>
          </Box>
        )}
      </HStack>
    </HStack>
  );
}