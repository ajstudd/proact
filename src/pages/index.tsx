import { ChakraProvider, Box, Heading, Text, Button, Stack, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";

import HeroCarousel from "components/Hero";

const roboto = Roboto({
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
});


// Features Section with SVG
export function FeaturesSection() {
  return (
    <Box bg="gray.50" py={20} px={8} textAlign="center">
      <Heading as="h2" size="xl" mb={6} fontWeight="semibold" color="gray.800">
        Our Features
      </Heading>
      <Text fontSize="md" maxW="600px" mx="auto" mb={12} color="gray.600">
        Explore the features that make us stand out and help create a more
        transparent world.
      </Text>
      <Flex wrap="wrap" justify="center" gap={8}>
        <FeatureCard
          title="Real-Time Updates"
          description="Stay informed with live updates on government projects."
          svgPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
        />
        <FeatureCard
          title="Citizen Engagement"
          description="Empower citizens to contribute their feedback anonymously."
          svgPath="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5h-2v-2h2v2zm0-4h-2v-6h2v6z"
        />
      </Flex>
    </Box>
  );
}

function FeatureCard({ title, description, svgPath }: {
  title: string;
  description: string;
  svgPath: string;
}) {
  return (
    <Flex
      direction="column"
      align="center"
      bg="white"
      color="gray.800"
      rounded="lg"
      shadow="lg"
      p={6}
      textAlign="center"
      className="transition transform hover:-translate-y-2 hover:shadow-2xl"
    >
      <Box mb={4}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-teal-500">
          <path d={svgPath} />
        </svg>
      </Box>
      <Heading as="h3" size="md" mb={3} fontWeight="semibold">
        {title}
      </Heading>
      <Text fontSize="sm">{description}</Text>
    </Flex>
  );
}

export default function Home() {
  return (
    <ChakraProvider>
      <HeroCarousel />
      <FeaturesSection />
    </ChakraProvider>
  );
}
