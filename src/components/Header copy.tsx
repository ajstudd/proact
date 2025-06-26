import { Box, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function UnAuthHeader() {
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
    </HStack>
  );
}