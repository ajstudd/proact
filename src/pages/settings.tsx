import { Box, Button, HStack, Switch, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import React , {useState} from "react";

export default function Leaderboard() {

  const [minimumScoreToFollow, setMinimumScoreToFollow] = useState('0');
  const [lockAllPosts, setLockAllPosts] = useState(false);
  const [optOutOfDailyChallenges, setOptOutOfDailyChallenges] = useState(false);
    return (
      <div className="flex flex-col py-2 gap-4 h-max w-full">
        <Box>
          <h1 className="font-bold text-2xl">Settings</h1>
        </Box>
        <HStack w={'100%'}>
          <VStack justifyContent={'start'} alignItems={'start'} w={'50%'}>
        <Box display={'flex'} flexDirection={'column'} w={'100%'}>
          <h2>Minimum Score to Follow</h2>
          <input
          className="w-full bg-gray-100 rounded-sm p-2 overflow-hidden focus:outline-none"
          placeholder="Enter Password"
          value={minimumScoreToFollow} onChange={(e) => setMinimumScoreToFollow(e.target.value)}
        />
        </Box>
        <Box display={'flex'} flexDirection={'row'} w={'100%'} gap={'5'} justifyContent={'space-between'} alignItems={'center'}>
          <h2>Lock All Posts</h2>
          <Switch size='md' />
        </Box>
        <Box display={'flex'} flexDirection={'row'} w={'100%'} gap={'5'} justifyContent={'space-between'} alignItems={'center'}>
          <h2>Opt Out of Daily Challenges</h2>
          <Switch size='md' />
        </Box>
        </VStack>
        <VStack justifyContent={'start'} alignItems={'start'} w={'50%'}>
        </VStack>
        </HStack>
        <Button
        style={{
          backgroundColor: '#4A90E2',
          color: 'white',
          width: '20%',
        }}
        >Save</Button>
      </div>
    );
  }