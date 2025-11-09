"use client";
import React from "react";

import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    FiRefreshCw, FiBarChart2, FiPieChart, FiTrendingUp,
    FiActivity, FiUsers, FiAlertTriangle, FiAward, FiThumbsUp,
    FiThumbsDown, FiFileText, FiAlertOctagon, FiArrowLeft
} from "react-icons/fi";
import {
    Box,
    Flex,
    Heading,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Grid,
    Progress,
    Badge,
    Spinner,
    Button,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import { useGetProjectAnalysisQuery, useRegenerateProjectAnalysisMutation } from "../../../services/analysisApi";
import { useAuth } from "../../../contexts/AuthContext";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProjectAnalysisPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isGovernment, isLoading: authLoading } = useAuth();
    const toast = useToast();

    const {
        data: analysisData,
        isLoading,
        error,
        refetch
    } = useGetProjectAnalysisQuery(id as string, {
        skip: !id || authLoading || !isGovernment,
    });

    const [regenerateAnalysis, { isLoading: isRegenerating }] = useRegenerateProjectAnalysisMutation();

    React.useEffect(() => {
        if (!authLoading && !isGovernment) {
            router.replace("/dashboard");
        }
    }, [authLoading, isGovernment, router]);

    const handleRefresh = async () => {
        if (!id) return;

        try {
            await regenerateAnalysis(id as string).unwrap();
            toast({
                title: "Analysis regenerated",
                description: "The project analysis has been updated with the latest information.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to regenerate analysis",
                description: "There was an error updating the project analysis. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (isLoading || authLoading) {
        return (
            <Flex height="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    if (error || !analysisData) {
        return (
            <Flex direction="column" align="center" justify="center" height="90vh" p={4}>
                <FiAlertOctagon size={50} color="#E53E3E" />
                <Text mt={4} fontSize="xl" fontWeight="bold" color="red.500">
                    Failed to load project analysis
                </Text>
                <Text mt={2} color="gray.600" textAlign="center">
                    There was an error loading the project analysis data.
                </Text>
                <Button
                    mt={4}
                    leftIcon={<FiRefreshCw />}
                    colorScheme="blue"
                    onClick={() => refetch()}
                >
                    Retry
                </Button>
            </Flex>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not available";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const sentimentTotal =
        analysisData.supportMetrics.commentSentiment.positive +
        analysisData.supportMetrics.commentSentiment.neutral +
        analysisData.supportMetrics.commentSentiment.negative;

    const sentimentChartOptions = {
        labels: ['Positive', 'Neutral', 'Negative'],
        colors: ['#48BB78', '#CBD5E0', '#F56565'],
        legend: {
            position: 'bottom' as const,
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom' as const
                }
            }
        }]
    };

    const sentimentChartSeries = [
        analysisData.supportMetrics.commentSentiment.positive,
        analysisData.supportMetrics.commentSentiment.neutral,
        analysisData.supportMetrics.commentSentiment.negative
    ];

    return (
        <>
            <Head>
                <title>Project Analysis | ProAct</title>
            </Head>

            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: 1, sm: 2, md: 6 }}
                py={{ base: 2, sm: 4, md: 10 }}
                minH="100vh"
                bgGradient="linear(to-br, purple.50, white 60%, blue.50)"
            >
                {/* Navigation and header */}
                <Breadcrumb mb={{ base: 2, md: 4 }}>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => router.push("/analytics/dashboard")}>
                            <Flex align="center">
                                <Box as={FiArrowLeft} mr={2} fontSize="lg" color="blue.500" />
                                <Text fontWeight="medium" color="blue.700" fontSize={{ base: "sm", md: "md" }}>Back to Dashboard</Text>
                            </Flex>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                {/* Header with refresh button */}
                <Flex
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", sm: "center" }}
                    mb={{ base: 6, md: 10 }}
                    gap={{ base: 4, sm: 0 }}
                >
                    <Box>
                        <Heading
                            size={{ base: "md", md: "lg" }}
                            fontWeight="extrabold"
                            letterSpacing="tight"
                            color="purple.800"
                            bgGradient="linear(to-r, purple.700, blue.500)"
                            bgClip="text"
                        >
                            Project Analysis
                        </Heading>
                        <Text color="gray.500" mt={1} fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                            Project ID: <Badge colorScheme="purple" fontSize="1em">{id}</Badge>
                        </Text>
                    </Box>
                    <Button
                        leftIcon={<FiRefreshCw size={20} />}
                        colorScheme="purple"
                        variant="solid"
                        size={{ base: "sm", md: "md" }}
                        borderRadius="xl"
                        shadow="md"
                        onClick={handleRefresh}
                        isLoading={isRegenerating}
                        _hover={{ bg: "purple.600", transform: "scale(1.04)" }}
                        transition="all 0.2s"
                        alignSelf={{ base: "flex-start", sm: "auto" }}
                    >
                        Refresh Analysis
                    </Button>
                </Flex>

                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={{ base: 4, md: 6 }}>
                    Last updated: {formatDate(analysisData.lastUpdated)}
                </Text>

                {/* Overview Section */}
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={{ base: 4, md: 8 }} mb={{ base: 6, md: 10 }}>
                    {/* Support Stats */}
                    <Box
                        bg="white"
                        p={6}
                        shadow="lg"
                        borderRadius="2xl"
                        borderTop="6px solid"
                        borderColor="purple.400"
                        transition="box-shadow 0.2s"
                        _hover={{ shadow: "xl" }}
                    >
                        <Flex alignItems="center" mb={4}>
                            <Box as={FiThumbsUp} fontSize="2xl" color="purple.500" mr={3} />
                            <Stat>
                                <StatLabel color="gray.500">Public Support</StatLabel>
                                <StatNumber fontSize="2xl">{Math.round(analysisData.supportMetrics.supportRatio)}%</StatNumber>
                            </Stat>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm">
                            <Text color="gray.500">
                                <Box as={FiThumbsUp} display="inline" mr={1} /> {analysisData.supportMetrics.likeCount}
                            </Text>
                            <Text color="gray.500">
                                <Box as={FiThumbsDown} display="inline" mr={1} /> {analysisData.supportMetrics.dislikeCount}
                            </Text>
                        </Flex>
                    </Box>

                    {/* Financial Stats */}
                    <Box
                        bg="white"
                        p={6}
                        shadow="lg"
                        borderRadius="2xl"
                        borderTop="6px solid"
                        borderColor="green.400"
                        transition="box-shadow 0.2s"
                        _hover={{ shadow: "xl" }}
                    >
                        <Flex alignItems="center" mb={4}>
                            <Box as={FiTrendingUp} fontSize="2xl" color="green.500" mr={3} />
                            <Stat>
                                <StatLabel color="gray.500">Budget Status</StatLabel>
                                <StatNumber fontSize="2xl">{Math.round(analysisData.financialMetrics.expenditureRatio)}%</StatNumber>
                            </Stat>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm">
                            <Text color="gray.500">Budget: {formatCurrency(analysisData.financialMetrics.budgetTotal)}</Text>
                            <Text color="gray.500">Spent: {formatCurrency(analysisData.financialMetrics.expenditureTotal)}</Text>
                        </Flex>
                    </Box>

                    {/* Corruption Reports */}
                    <Box
                        bg="white"
                        p={6}
                        shadow="lg"
                        borderRadius="2xl"
                        borderTop="6px solid"
                        borderColor="red.400"
                        transition="box-shadow 0.2s"
                        _hover={{ shadow: "xl" }}
                    >
                        <Flex alignItems="center" mb={4}>
                            <Box as={FiAlertTriangle} fontSize="2xl" color="red.500" mr={3} />
                            <Stat>
                                <StatLabel color="gray.500">Corruption Reports</StatLabel>
                                <StatNumber fontSize="2xl">{analysisData.corruptionReportMetrics.reportCount}</StatNumber>
                            </Stat>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm">
                            <Text color="gray.500">Resolved: {analysisData.corruptionReportMetrics.resolvedCount}</Text>
                            <Text color="gray.500">Investigating: {analysisData.corruptionReportMetrics.investigatingCount}</Text>
                        </Flex>
                    </Box>

                    {/* Progress Stats */}
                    <Box
                        bg="white"
                        p={6}
                        shadow="lg"
                        borderRadius="2xl"
                        borderTop="6px solid"
                        borderColor="blue.400"
                        transition="box-shadow 0.2s"
                        _hover={{ shadow: "xl" }}
                    >
                        <Flex alignItems="center" mb={4}>
                            <Box as={FiActivity} fontSize="2xl" color="blue.500" mr={3} />
                            <Stat>
                                <StatLabel color="gray.500">Total Updates</StatLabel>
                                <StatNumber fontSize="2xl">{analysisData.progressMetrics.totalUpdates}</StatNumber>
                            </Stat>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm">
                            <Text color="gray.500">Days Since Last Update: {analysisData.progressMetrics.daysSinceLastUpdate}</Text>
                        </Flex>
                    </Box>
                </Grid>

                {/* Charts Row */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 4, md: 8 }} mb={{ base: 6, md: 10 }}>
                    {/* Sentiment Chart */}
                    <Box
                        bg="white"
                        p={8}
                        shadow="lg"
                        borderRadius="2xl"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Heading size="md" mb={4} color="purple.700" fontWeight="bold">Comment Sentiment</Heading>
                        <Chart
                            options={sentimentChartOptions}
                            series={sentimentChartSeries}
                            type="donut"
                            height={320}
                        />
                    </Box>

                    {/* Sentiment Distribution */}
                    <Box
                        bg="white"
                        p={8}
                        shadow="lg"
                        borderRadius="2xl"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Heading size="md" mb={4} color="purple.700" fontWeight="bold">Sentiment Distribution</Heading>
                        <Box>
                            <Box mb={5}>
                                <Flex justify="space-between" mb={1}>
                                    <Text fontSize="sm">Positive</Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {sentimentTotal > 0 ?
                                            Math.round(analysisData.supportMetrics.commentSentiment.positive / sentimentTotal * 100) : 0}%
                                    </Text>
                                </Flex>
                                <Progress value={(analysisData.supportMetrics.commentSentiment.positive / sentimentTotal * 100) || 0}
                                    colorScheme="green" size="sm" borderRadius="full" />
                            </Box>
                            <Box mb={5}>
                                <Flex justify="space-between" mb={1}>
                                    <Text fontSize="sm">Neutral</Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {sentimentTotal > 0 ?
                                            Math.round(analysisData.supportMetrics.commentSentiment.neutral / sentimentTotal * 100) : 0}%
                                    </Text>
                                </Flex>
                                <Progress value={(analysisData.supportMetrics.commentSentiment.neutral / sentimentTotal * 100) || 0}
                                    colorScheme="gray" size="sm" borderRadius="full" />
                            </Box>
                            <Box>
                                <Flex justify="space-between" mb={1}>
                                    <Text fontSize="sm">Negative</Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {sentimentTotal > 0 ?
                                            Math.round(analysisData.supportMetrics.commentSentiment.negative / sentimentTotal * 100) : 0}%
                                    </Text>
                                </Flex>
                                <Progress value={(analysisData.supportMetrics.commentSentiment.negative / sentimentTotal * 100) || 0}
                                    colorScheme="red" size="sm" borderRadius="full" />
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Detailed Comment Analysis */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 4, md: 8 }} mb={{ base: 6, md: 10 }}>
                    {/* Positive Sentiment */}
                    <Box bg="white" p={8} shadow="lg" borderRadius="2xl">
                        <Heading size="md" mb={4} color="green.600">
                            <Box as={FiThumbsUp} display="inline" mr={2} fontSize="xl" />
                            Positive Feedback
                        </Heading>
                        {analysisData.commentAnalysis?.topPraises && analysisData.commentAnalysis.topPraises.length > 0 ? (
                            <Box>
                                <Text fontWeight="medium" mb={3}>Top Praises:</Text>
                                {analysisData.commentAnalysis.topPraises.map((praise, index) => (
                                    <Flex key={index} align="center" mb={2}>
                                        <Box as={FiAward} color="green.500" mr={2} fontSize="lg" />
                                        <Text>{praise}</Text>
                                    </Flex>
                                ))}
                            </Box>
                        ) : (
                            <Text color="gray.500">No positive feedback data available</Text>
                        )}

                        {/* Positive Tags */}
                        {analysisData.commentAnalysis?.tags && analysisData.commentAnalysis.tags.filter(tag => tag.sentiment === "positive").length > 0 && (
                            <Box mt={5}>
                                <Text fontWeight="medium" mb={3}>Positive Tags:</Text>
                                {analysisData.commentAnalysis.tags
                                    .filter(tag => tag.sentiment === "positive")
                                    .map((item, index) => (
                                        <Flex key={index} justify="space-between" align="center" mb={2}>
                                            <Badge colorScheme="green" px={2} py={1} borderRadius="full" fontSize="md">
                                                {item.tag}
                                            </Badge>
                                            <Text fontSize="sm" fontWeight="bold">{item.count} mentions</Text>
                                        </Flex>
                                    ))
                                }
                            </Box>
                        )}
                    </Box>

                    {/* Negative Sentiment */}
                    <Box bg="white" p={8} shadow="lg" borderRadius="2xl">
                        <Heading size="md" mb={4} color="red.600">
                            <Box as={FiThumbsDown} display="inline" mr={2} fontSize="xl" />
                            Negative Feedback
                        </Heading>
                        {analysisData.commentAnalysis?.topConcerns && analysisData.commentAnalysis.topConcerns.length > 0 ? (
                            <Box>
                                <Text fontWeight="medium" mb={3}>Top Concerns:</Text>
                                {analysisData.commentAnalysis.topConcerns.map((concern, index) => (
                                    <Flex key={index} align="center" mb={2}>
                                        <Box as={FiAlertTriangle} color="red.500" mr={2} fontSize="lg" />
                                        <Text>{concern}</Text>
                                    </Flex>
                                ))}
                            </Box>
                        ) : (
                            <Text color="gray.500">No negative feedback data available</Text>
                        )}

                        {/* Negative Tags */}
                        {analysisData.commentAnalysis?.tags && analysisData.commentAnalysis.tags.filter(tag => tag.sentiment === "negative").length > 0 && (
                            <Box mt={5}>
                                <Text fontWeight="medium" mb={3}>Negative Tags:</Text>
                                {analysisData.commentAnalysis.tags
                                    .filter(tag => tag.sentiment === "negative")
                                    .map((item, index) => (
                                        <Flex key={index} justify="space-between" align="center" mb={2}>
                                            <Badge colorScheme="red" px={2} py={1} borderRadius="full" fontSize="md">
                                                {item.tag}
                                            </Badge>
                                            <Text fontSize="sm" fontWeight="bold">{item.count} mentions</Text>
                                        </Flex>
                                    ))
                                }
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Financial and Progress Analysis */}
                <Box
                    bg="white"
                    p={{ base: 4, md: 8 }}
                    shadow="lg"
                    borderRadius="2xl"
                    mb={{ base: 6, md: 10 }}
                >
                    <Heading size={{ base: "sm", md: "md" }} mb={6} color="green.700" fontWeight="bold">Financial & Progress Analysis</Heading>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={{ base: 4, md: 8 }} mb={6}>
                        <Stat>
                            <StatLabel>Burn Rate</StatLabel>
                            <StatNumber>{formatCurrency(analysisData.financialMetrics.burnRate)}/month</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Total Updates</StatLabel>
                            <StatNumber>{analysisData.progressMetrics.totalUpdates}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Days Since Last Update</StatLabel>
                            <StatNumber>{analysisData.progressMetrics.daysSinceLastUpdate}</StatNumber>
                        </Stat>
                    </Grid>
                    <Box>
                        <Flex justify="space-between" mb={2}>
                            <Text>Expenditure Ratio</Text>
                            <Text fontWeight="bold">{Math.round(analysisData.financialMetrics.expenditureRatio)}%</Text>
                        </Flex>
                        <Progress
                            value={analysisData.financialMetrics.expenditureRatio}
                            colorScheme={
                                analysisData.financialMetrics.expenditureRatio > 90 ? "red" :
                                    analysisData.financialMetrics.expenditureRatio > 75 ? "yellow" : "green"
                            }
                            borderRadius="xl"
                            size="lg"
                        />
                    </Box>
                    {analysisData.financialMetrics.projectedCompletion && (
                        <Text mt={4} color="gray.600">
                            Projected completion date: {formatDate(analysisData.financialMetrics.projectedCompletion)}
                        </Text>
                    )}
                </Box>

                {/* Corruption Reports Analysis */}
                <Box
                    bg="white"
                    p={{ base: 4, md: 8 }}
                    shadow="lg"
                    borderRadius="2xl"
                >
                    <Heading size={{ base: "sm", md: "md" }} mb={6} color="red.700" fontWeight="bold">Corruption Report Analysis</Heading>
                    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }} gap={{ base: 4, md: 8 }} mb={6}>
                        <Stat>
                            <StatLabel>Total Reports</StatLabel>
                            <StatNumber>{analysisData.corruptionReportMetrics.reportCount}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Investigating</StatLabel>
                            <StatNumber>{analysisData.corruptionReportMetrics.investigatingCount}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Resolved</StatLabel>
                            <StatNumber>{analysisData.corruptionReportMetrics.resolvedCount}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel>Rejected</StatLabel>
                            <StatNumber>{analysisData.corruptionReportMetrics.rejectedCount}</StatNumber>
                        </Stat>
                    </Grid>
                    <Box mb={4}>
                        <Flex justify="space-between" mb={2}>
                            <Text>Average Severity</Text>
                            <Text fontWeight="bold">{analysisData.corruptionReportMetrics.averageSeverity.toFixed(1)} / 10</Text>
                        </Flex>
                        <Progress
                            value={(analysisData.corruptionReportMetrics.averageSeverity / 10) * 100}
                            colorScheme={
                                analysisData.corruptionReportMetrics.averageSeverity > 7 ? "red" :
                                    analysisData.corruptionReportMetrics.averageSeverity > 5 ? "yellow" : "green"
                            }
                            size="lg"
                            borderRadius="md"
                        />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                        This represents the average severity of corruption reports as analyzed by AI.
                        Higher values indicate more serious allegations.
                    </Text>
                </Box>
            </Box>
        </>
    );
};

export default ProjectAnalysisPage;
