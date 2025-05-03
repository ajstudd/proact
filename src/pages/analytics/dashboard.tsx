"use client"
import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    FiRefreshCw, FiBarChart2, FiPieChart, FiTrendingUp,
    FiActivity, FiUsers, FiAlertTriangle, FiAward, FiThumbsUp,
    FiThumbsDown, FiFileText, FiAlertOctagon
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
    useToast
} from "@chakra-ui/react";
import { useGetGovernmentDashboardQuery, useRegenerateGovernmentAnalysisMutation } from "../../services/analysisApi";
import { useAuth } from "../../contexts/AuthContext";
import dynamic from 'next/dynamic';

// Import Chart component with SSR disabled to fix window is not defined error
const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <Box height="300px" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>
});

const DashboardPage: NextPage = () => {
    const router = useRouter();
    const { isGovernment, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<string>("overview");
    const toast = useToast();

    // Fetch government dashboard data
    const {
        data: dashboardData,
        isLoading,
        error,
        refetch
    } = useGetGovernmentDashboardQuery(undefined, {
        skip: !isGovernment || authLoading,
    });

    // Mutation to regenerate analysis
    const [regenerateAnalysis, { isLoading: isRegenerating }] = useRegenerateGovernmentAnalysisMutation();

    // Redirect if not a government user
    React.useEffect(() => {
        if (!authLoading && !isGovernment) {
            router.replace("/dashboard");
        }
    }, [authLoading, isGovernment, router]);

    const handleRefresh = async () => {
        try {
            await regenerateAnalysis().unwrap();
            toast({
                title: "Analysis regenerated",
                description: "The dashboard data has been updated with the latest information.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to regenerate analysis",
                description: "There was an error updating the dashboard data. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Display loading state
    if (isLoading || authLoading) {
        return (
            <Flex height="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    // Display error state
    if (error || !dashboardData) {
        return (
            <Flex direction="column" align="center" justify="center" height="90vh" p={4}>
                <FiAlertOctagon size={50} color="#E53E3E" />
                <Text mt={4} fontSize="xl" fontWeight="bold" color="red.500">
                    Failed to load dashboard data
                </Text>
                <Text mt={2} color="gray.600" textAlign="center">
                    There was an error loading the analytics dashboard.
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

    // Format for currency numbers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date strings
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Calculate sentiment totals for the pie chart
    const sentimentTotal =
        dashboardData.overallSatisfaction.commentSentimentDistribution.positive +
        dashboardData.overallSatisfaction.commentSentimentDistribution.neutral +
        dashboardData.overallSatisfaction.commentSentimentDistribution.negative;

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
        dashboardData.overallSatisfaction.commentSentimentDistribution.positive,
        dashboardData.overallSatisfaction.commentSentimentDistribution.neutral,
        dashboardData.overallSatisfaction.commentSentimentDistribution.negative
    ];

    // Prepare data for project status chart
    const projectStatusChartOptions = {
        labels: ['Active', 'Stalled', 'Completed'],
        colors: ['#4299E1', '#F6AD55', '#68D391'],
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

    const projectStatusChartSeries = [
        dashboardData.projectCount.active,
        dashboardData.projectCount.stalled,
        dashboardData.projectCount.completed
    ];

    // Add a modern gradient background and more padding
    return (
        <>
            <Head>
                <title>Government Analytics Dashboard | ProAct</title>
            </Head>

            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: 2, md: 6 }}
                py={{ base: 4, md: 10 }}
                minH="100vh"
                bgGradient="linear(to-br, blue.50, white 60%, teal.50)"
            >
                {/* Header with refresh button */}
                <Flex justify="space-between" align="center" mb={10}>
                    <Heading
                        size="lg"
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        color="blue.800"
                        bgGradient="linear(to-r, blue.700, teal.500)"
                        bgClip="text"
                    >
                        Government Analytics Dashboard
                    </Heading>
                    <Button
                        leftIcon={<FiRefreshCw size={20} />}
                        colorScheme="blue"
                        variant="solid"
                        size="md"
                        borderRadius="xl"
                        shadow="md"
                        onClick={handleRefresh}
                        isLoading={isRegenerating}
                        _hover={{ bg: "blue.600", transform: "scale(1.04)" }}
                        transition="all 0.2s"
                    >
                        Refresh Analysis
                    </Button>
                </Flex>

                <Text fontSize="sm" color="gray.500" mb={6}>
                    Last updated: {formatDate(dashboardData.lastUpdated)}
                </Text>

                {/* Dashboard Tabs */}
                <Flex
                    mb={8}
                    overflowX="auto"
                    className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    gap={2}
                >
                    {/* Tab Buttons - add more visual feedback */}
                    {[
                        {
                            key: "overview",
                            label: "Overview",
                            icon: <FiBarChart2 />
                        },
                        {
                            key: "contractors",
                            label: "Contractor Performance",
                            icon: <FiUsers />
                        },
                        {
                            key: "public",
                            label: "Public Sentiment",
                            icon: <FiPieChart />
                        },
                        {
                            key: "reports",
                            label: "Corruption Reports",
                            icon: <FiAlertTriangle />
                        },
                    ].map(tab => (
                        <Box
                            key={tab.key}
                            px={6}
                            py={2}
                            cursor="pointer"
                            borderBottom={activeTab === tab.key ? "3px solid" : "3px solid transparent"}
                            borderColor={activeTab === tab.key ? "teal.400" : "transparent"}
                            color={activeTab === tab.key ? "teal.600" : "gray.500"}
                            fontWeight={activeTab === tab.key ? "bold" : "medium"}
                            bg={activeTab === tab.key ? "teal.50" : "transparent"}
                            borderRadius="xl"
                            boxShadow={activeTab === tab.key ? "md" : "none"}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            transition="all 0.2s"
                            _hover={{ bg: "teal.100", color: "teal.700" }}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon}
                            {tab.label}
                        </Box>
                    ))}
                </Flex>

                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={8} mb={10}>
                            {/* Project Count Stats */}
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
                                    <Box as={FiFileText} size="28px" color="blue.500" mr={3} />
                                    <Stat>
                                        <StatLabel color="gray.500">Total Projects</StatLabel>
                                        <StatNumber fontSize="2xl">{dashboardData.projectCount.total}</StatNumber>
                                    </Stat>
                                </Flex>
                                <Flex justify="space-between" fontSize="sm">
                                    <Text color="gray.500">Active: {dashboardData.projectCount.active}</Text>
                                    <Text color="gray.500">Stalled: {dashboardData.projectCount.stalled}</Text>
                                </Flex>
                            </Box>
                            {/* Financial Summary */}
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
                                    <Box as={FiTrendingUp} size="28px" color="green.500" mr={3} />
                                    <Stat>
                                        <StatLabel color="gray.500">Total Budget</StatLabel>
                                        <StatNumber fontSize="2xl">{formatCurrency(dashboardData.financialSummary.totalBudget)}</StatNumber>
                                    </Stat>
                                </Flex>
                                <Flex justify="space-between" fontSize="sm">
                                    <Text color="gray.500">Spent: {formatCurrency(dashboardData.financialSummary.totalExpenditure)}</Text>
                                    <Text color="gray.500">
                                        {Math.round(dashboardData.financialSummary.averageExpenditureRatio)}% of budget
                                    </Text>
                                </Flex>
                            </Box>
                            {/* Public Support */}
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
                                    <Box as={FiThumbsUp} size="28px" color="purple.500" mr={3} />
                                    <Stat>
                                        <StatLabel color="gray.500">Public Support</StatLabel>
                                        <StatNumber fontSize="2xl">{Math.round(dashboardData.overallSatisfaction.supportRatio)}%</StatNumber>
                                    </Stat>
                                </Flex>
                                <Flex justify="space-between" fontSize="sm">
                                    <Text color="gray.500">
                                        <Box as={FiThumbsUp} display="inline" mr={1} /> {dashboardData.overallSatisfaction.likesTotal}
                                    </Text>
                                    <Text color="gray.500">
                                        <Box as={FiThumbsDown} display="inline" mr={1} /> {dashboardData.overallSatisfaction.dislikesTotal}
                                    </Text>
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
                                    <Box as={FiAlertTriangle} size="28px" color="red.500" mr={3} />
                                    <Stat>
                                        <StatLabel color="gray.500">Corruption Reports</StatLabel>
                                        <StatNumber fontSize="2xl">{dashboardData.corruptionReports.totalReports}</StatNumber>
                                    </Stat>
                                </Flex>
                                <Flex justify="space-between" fontSize="sm">
                                    <Text color="gray.500">Resolved: {dashboardData.corruptionReports.resolvedReports}</Text>
                                    <Text color="gray.500">Investigating: {dashboardData.corruptionReports.investigatingReports}</Text>
                                </Flex>
                            </Box>
                        </Grid>

                        {/* Charts Row */}
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8} mb={10}>
                            {/* Project Status Chart */}
                            <Box
                                bg="white"
                                p={6}
                                shadow="lg"
                                borderRadius="2xl"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Heading size="md" mb={4} color="blue.700" fontWeight="bold">Project Status</Heading>
                                <Chart
                                    options={projectStatusChartOptions}
                                    series={projectStatusChartSeries}
                                    type="donut"
                                    height={300}
                                />
                            </Box>
                            {/* Comment Sentiment Chart */}
                            <Box
                                bg="white"
                                p={6}
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
                                    height={300}
                                />
                            </Box>
                        </Grid>

                        {/* Financial Status */}
                        <Box
                            bg="white"
                            p={8}
                            shadow="lg"
                            borderRadius="2xl"
                            mb={10}
                        >
                            <Heading size="md" mb={6} color="green.700" fontWeight="bold">Financial Status</Heading>
                            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} mb={6}>
                                <Stat>
                                    <StatLabel>Total Budget</StatLabel>
                                    <StatNumber>{formatCurrency(dashboardData.financialSummary.totalBudget)}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Total Expenditure</StatLabel>
                                    <StatNumber>{formatCurrency(dashboardData.financialSummary.totalExpenditure)}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Projects Over Budget</StatLabel>
                                    <StatNumber>{dashboardData.financialSummary.projectsOverBudget}</StatNumber>
                                </Stat>
                            </Grid>
                            <Box>
                                <Flex justify="space-between" mb={2}>
                                    <Text>Average Expenditure Ratio</Text>
                                    <Text fontWeight="bold">{Math.round(dashboardData.financialSummary.averageExpenditureRatio)}%</Text>
                                </Flex>
                                <Progress
                                    value={dashboardData.financialSummary.averageExpenditureRatio}
                                    colorScheme={
                                        dashboardData.financialSummary.averageExpenditureRatio > 90 ? "red" :
                                            dashboardData.financialSummary.averageExpenditureRatio > 75 ? "yellow" : "green"
                                    }
                                    borderRadius="xl"
                                    size="lg"
                                />
                            </Box>
                        </Box>
                    </motion.div>
                )}

                {/* Contractor Performance Tab Content */}
                {activeTab === "contractors" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={8}>
                            {/* Most Active Contractors */}
                            <Box bg="white" p={6} shadow="sm" borderRadius="md">
                                <Heading size="md" mb={4}>Most Active Contractors</Heading>

                                {dashboardData.contractorPerformance.mostActive.length > 0 ? (
                                    dashboardData.contractorPerformance.mostActive.map((contractor, index) => (
                                        <Box key={contractor.contractor._id} mb={index < dashboardData.contractorPerformance.mostActive.length - 1 ? 4 : 0}>
                                            <Flex justify="space-between" align="center" mb={2}>
                                                <Flex align="center">
                                                    <Box
                                                        width="36px"
                                                        height="36px"
                                                        borderRadius="full"
                                                        bg="blue.100"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        mr={3}
                                                    >
                                                        {contractor.contractor.photo ? (
                                                            <img
                                                                src={contractor.contractor.photo}
                                                                alt={contractor.contractor.name}
                                                                style={{ borderRadius: '50%', width: '36px', height: '36px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <FiUsers color="#4299E1" />
                                                        )}
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="medium">{contractor.contractor.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">{contractor.projectCount} projects</Text>
                                                    </Box>
                                                </Flex>
                                                <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                                                    Score: {contractor.activityScore}
                                                </Badge>
                                            </Flex>
                                            <Progress
                                                value={(contractor.activityScore / 10) * 100}
                                                colorScheme="blue"
                                                size="sm"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Text color="gray.500">No contractor data available</Text>
                                )}
                            </Box>

                            {/* Least Active Contractors */}
                            <Box bg="white" p={6} shadow="sm" borderRadius="md">
                                <Heading size="md" mb={4}>Least Active Contractors</Heading>

                                {dashboardData.contractorPerformance.leastActive.length > 0 ? (
                                    dashboardData.contractorPerformance.leastActive.map((contractor, index) => (
                                        <Box key={contractor.contractor._id} mb={index < dashboardData.contractorPerformance.leastActive.length - 1 ? 4 : 0}>
                                            <Flex justify="space-between" align="center" mb={2}>
                                                <Flex align="center">
                                                    <Box
                                                        width="36px"
                                                        height="36px"
                                                        borderRadius="full"
                                                        bg="red.100"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        mr={3}
                                                    >
                                                        {contractor.contractor.photo ? (
                                                            <img
                                                                src={contractor.contractor.photo}
                                                                alt={contractor.contractor.name}
                                                                style={{ borderRadius: '50%', width: '36px', height: '36px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <FiUsers color="#F56565" />
                                                        )}
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="medium">{contractor.contractor.name}</Text>
                                                        <Text fontSize="sm" color="gray.500">{contractor.projectCount} projects</Text>
                                                    </Box>
                                                </Flex>
                                                <Badge colorScheme="red" px={2} py={1} borderRadius="full">
                                                    Score: {contractor.activityScore}
                                                </Badge>
                                            </Flex>
                                            <Progress
                                                value={(contractor.activityScore / 10) * 100}
                                                colorScheme="red"
                                                size="sm"
                                                borderRadius="full"
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Text color="gray.500">No contractor data available</Text>
                                )}
                            </Box>
                        </Grid>
                    </motion.div>
                )}

                {/* Public Sentiment Tab Content */}
                {activeTab === "public" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={8}>
                            {/* Positive Sentiment */}
                            <Box bg="white" p={6} shadow="sm" borderRadius="md">
                                <Heading size="md" mb={4} color="green.600">
                                    <Box as={FiThumbsUp} display="inline" mr={2} />
                                    Positive Feedback
                                </Heading>

                                {dashboardData.publicSentiment.topPositiveTags.length > 0 ? (
                                    <Box>
                                        <Text fontWeight="medium" mb={3}>Top Positive Tags:</Text>
                                        {dashboardData.publicSentiment.topPositiveTags.map((item, index) => (
                                            <Flex key={item.tag} justify="space-between" align="center" mb={2}>
                                                <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                                                    {item.tag}
                                                </Badge>
                                                <Text fontSize="sm" fontWeight="bold">{item.count} mentions</Text>
                                            </Flex>
                                        ))}

                                        {/* Replace with proper data from government dashboard structure */}
                                        {dashboardData.publicSentiment.topConcerns && dashboardData.publicSentiment.topConcerns.length > 0 && (
                                            <Box mt={5}>
                                                <Text fontWeight="medium" mb={3}>Top Positive Feedback:</Text>
                                                {dashboardData.publicSentiment.topConcerns.filter((_, i) => i < 3).map((praise, index) => (
                                                    <Flex key={index} align="center" mb={2}>
                                                        <Box as={FiAward} color="green.500" mr={2} />
                                                        <Text>{praise}</Text>
                                                    </Flex>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Text color="gray.500">No positive sentiment data available</Text>
                                )}
                            </Box>

                            {/* Negative Sentiment */}
                            <Box bg="white" p={6} shadow="sm" borderRadius="md">
                                <Heading size="md" mb={4} color="red.600">
                                    <Box as={FiThumbsDown} display="inline" mr={2} />
                                    Negative Feedback
                                </Heading>

                                {dashboardData.publicSentiment.topNegativeTags.length > 0 ? (
                                    <Box>
                                        <Text fontWeight="medium" mb={3}>Top Negative Tags:</Text>
                                        {dashboardData.publicSentiment.topNegativeTags.map((item, index) => (
                                            <Flex key={item.tag} justify="space-between" align="center" mb={2}>
                                                <Badge colorScheme="red" px={2} py={1} borderRadius="full">
                                                    {item.tag}
                                                </Badge>
                                                <Text fontSize="sm" fontWeight="bold">{item.count} mentions</Text>
                                            </Flex>
                                        ))}

                                        {dashboardData.publicSentiment.topConcerns.length > 0 && (
                                            <Box mt={5}>
                                                <Text fontWeight="medium" mb={3}>Top Concerns:</Text>
                                                {dashboardData.publicSentiment.topConcerns.map((concern, index) => (
                                                    <Flex key={index} align="center" mb={2}>
                                                        <Box as={FiAlertTriangle} color="red.500" mr={2} />
                                                        <Text>{concern}</Text>
                                                    </Flex>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Text color="gray.500">No negative sentiment data available</Text>
                                )}
                            </Box>
                        </Grid>

                        {/* Overall Sentiment Chart */}
                        <Box bg="white" p={6} shadow="sm" borderRadius="md">
                            <Heading size="md" mb={4}>Public Sentiment Overview</Heading>

                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                                <Box>
                                    <Chart
                                        options={sentimentChartOptions}
                                        series={sentimentChartSeries}
                                        type="pie"
                                        height={300}
                                    />
                                </Box>
                                <Box>
                                    <Stat mb={4}>
                                        <StatLabel>Support Ratio</StatLabel>
                                        <StatNumber>{Math.round(dashboardData.overallSatisfaction.supportRatio)}%</StatNumber>
                                        <StatHelpText>
                                            <StatArrow
                                                type={dashboardData.overallSatisfaction.supportRatio > 50 ? "increase" : "decrease"}
                                            />
                                            {dashboardData.overallSatisfaction.supportRatio > 50 ?
                                                "Majority support" : "Needs improvement"
                                            }
                                        </StatHelpText>
                                    </Stat>

                                    <Box>
                                        <Text fontWeight="medium" mb={2}>Sentiment Distribution</Text>

                                        <Box mb={3}>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm">Positive</Text>
                                                <Text fontSize="sm" fontWeight="bold">
                                                    {sentimentTotal > 0 ?
                                                        Math.round(dashboardData.overallSatisfaction.commentSentimentDistribution.positive / sentimentTotal * 100) : 0}%
                                                </Text>
                                            </Flex>
                                            <Progress value={dashboardData.overallSatisfaction.commentSentimentDistribution.positive / sentimentTotal * 100}
                                                colorScheme="green" size="sm" borderRadius="full" />
                                        </Box>

                                        <Box mb={3}>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm">Neutral</Text>
                                                <Text fontSize="sm" fontWeight="bold">
                                                    {sentimentTotal > 0 ?
                                                        Math.round(dashboardData.overallSatisfaction.commentSentimentDistribution.neutral / sentimentTotal * 100) : 0}%
                                                </Text>
                                            </Flex>
                                            <Progress value={dashboardData.overallSatisfaction.commentSentimentDistribution.neutral / sentimentTotal * 100}
                                                colorScheme="gray" size="sm" borderRadius="full" />
                                        </Box>

                                        <Box>
                                            <Flex justify="space-between" mb={1}>
                                                <Text fontSize="sm">Negative</Text>
                                                <Text fontSize="sm" fontWeight="bold">
                                                    {sentimentTotal > 0 ?
                                                        Math.round(dashboardData.overallSatisfaction.commentSentimentDistribution.negative / sentimentTotal * 100) : 0}%
                                                </Text>
                                            </Flex>
                                            <Progress value={dashboardData.overallSatisfaction.commentSentimentDistribution.negative / sentimentTotal * 100}
                                                colorScheme="red" size="sm" borderRadius="full" />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Box>
                    </motion.div>
                )}

                {/* Corruption Reports Tab Content */}
                {activeTab === "reports" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
                            <Stat bg="white" p={5} shadow="sm" borderRadius="md" borderLeft="4px" borderLeftColor="yellow.400">
                                <StatLabel>Total Reports</StatLabel>
                                <StatNumber>{dashboardData.corruptionReports.totalReports}</StatNumber>
                            </Stat>
                            <Stat bg="white" p={5} shadow="sm" borderRadius="md" borderLeft="4px" borderLeftColor="blue.400">
                                <StatLabel>Under Investigation</StatLabel>
                                <StatNumber>{dashboardData.corruptionReports.investigatingReports}</StatNumber>
                            </Stat>
                            <Stat bg="white" p={5} shadow="sm" borderRadius="md" borderLeft="4px" borderLeftColor="green.400">
                                <StatLabel>Resolved</StatLabel>
                                <StatNumber>{dashboardData.corruptionReports.resolvedReports}</StatNumber>
                            </Stat>
                        </Grid>

                        {/* Projects with Most Reports */}
                        <Box bg="white" p={6} shadow="sm" borderRadius="md" mb={8}>
                            <Heading size="md" mb={4}>
                                <Box as={FiAlertTriangle} display="inline" mr={2} color="red.500" />
                                Projects with Most Reports
                            </Heading>

                            {dashboardData.corruptionReports.projectsWithMostReports.length > 0 ? (
                                <Box>
                                    {dashboardData.corruptionReports.projectsWithMostReports.map((item, index) => (
                                        <Box
                                            key={item.project._id}
                                            p={4}
                                            mb={3}
                                            borderRadius="md"
                                            bg="gray.50"
                                            borderLeft="4px solid"
                                            borderLeftColor="red.500"
                                        >
                                            <Flex justify="space-between" align="center">
                                                <Box>
                                                    <Text fontWeight="medium">{item.project.title}</Text>
                                                    <Text fontSize="sm" color="gray.500">Project ID: {item.project._id.substring(0, 8)}...</Text>
                                                </Box>
                                                <Badge colorScheme="red" px={2} py={1}>
                                                    {item.reportCount} Reports
                                                </Badge>
                                            </Flex>
                                            <Button
                                                mt={2}
                                                size="sm"
                                                colorScheme="blue"
                                                variant="outline"
                                                onClick={() => router.push(`/project/${item.project._id}`)}
                                            >
                                                View Project
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Text color="gray.500">No report data available</Text>
                            )}
                        </Box>

                        {/* Average Severity */}
                        <Box bg="white" p={6} shadow="sm" borderRadius="md">
                            <Heading size="md" mb={4}>Average Severity of Reports</Heading>

                            <Box mb={4}>
                                <Flex justify="space-between" mb={2}>
                                    <Text>Severity Level</Text>
                                    <Text fontWeight="bold">{dashboardData.corruptionReports.averageSeverity.toFixed(1)} / 10</Text>
                                </Flex>
                                <Progress
                                    value={(dashboardData.corruptionReports.averageSeverity / 10) * 100}
                                    colorScheme={
                                        dashboardData.corruptionReports.averageSeverity > 7 ? "red" :
                                            dashboardData.corruptionReports.averageSeverity > 5 ? "yellow" : "green"
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
                    </motion.div>
                )}
            </Box>
        </>
    );
};

export default DashboardPage;
