import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Savings as SavingsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  CompareArrows as CompareArrowsIcon,
  Star as StarIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PersonalizedResults = ({ analysis, loading }) => {
  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SpeedIcon color="primary" />
            <Typography variant="h5">Analyzing Your Cloud Resources...</Typography>
          </Box>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Our ML algorithms are processing your data to generate personalized recommendations.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const {
    totalCost,
    estimatedSavings,
    idleResources,
    oversizedResources,
    optimizationScore,
    quickInsights,
    costTrends,
    savingsByResource,
    projectedCost,
    resourceStatusOverview,
    recommendations,
    benchmarkComparison
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return <WarningIcon color="warning" />;
      case 'success': return <CheckCircleIcon color="success" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon />;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ mt: 3 }}>
      {/* Header Summary */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon />
            Your Personalized Cloud Cost Analysis
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  ${totalCost?.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Current Monthly Cost
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="lightgreen">
                  ${estimatedSavings?.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Potential Savings
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {optimizationScore}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Optimization Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {Math.round((estimatedSavings / totalCost) * 100)}%
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Savings Potential
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      {quickInsights && quickInsights.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon color="primary" />
              Quick Insights
            </Typography>
            <Grid container spacing={2}>
              {quickInsights.map((insight, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Alert severity={insight.type} sx={{ height: '100%' }}>
                    <AlertTitle>{insight.title}</AlertTitle>
                    {insight.message}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Resource Status Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resource Status Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                  {resourceStatusOverview?.total || 0}
                </Avatar>
                <Typography variant="body2">Total Resources</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                  {resourceStatusOverview?.optimized || 0}
                </Avatar>
                <Typography variant="body2">Optimized</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                  {resourceStatusOverview?.needsAttention || 0}
                </Avatar>
                <Typography variant="body2">Needs Attention</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
                  {resourceStatusOverview?.idle || 0}
                </Avatar>
                <Typography variant="body2">Idle Resources</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Optimization Score */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon color="primary" />
            Optimization Score: {optimizationScore}/100
          </Typography>
          <LinearProgress
            variant="determinate"
            value={optimizationScore}
            color={getScoreColor(optimizationScore)}
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            {optimizationScore >= 80 && "Excellent! Your resources are well-optimized."}
            {optimizationScore >= 60 && optimizationScore < 80 && "Good optimization with room for improvement."}
            {optimizationScore < 60 && "Significant optimization opportunities available."}
          </Typography>
        </CardContent>
      </Card>

      {/* Cost Trends Chart */}
      {costTrends && costTrends.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" />
              Cost Trends Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Current Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="optimizedCost" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Optimized Cost"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Savings by Resource Type */}
      {savingsByResource && savingsByResource.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SavingsIcon color="primary" />
              Savings Opportunities by Resource Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={savingsByResource}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="resourceType" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="currentCost" fill="#8884d8" name="Current Cost" />
                <Bar dataKey="potentialSavings" fill="#82ca9d" name="Potential Savings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personalized Recommendations
            </Typography>
            {recommendations.map((rec, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<span>🔽</span>}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Chip 
                      label={rec.priority} 
                      color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}
                      size="small"
                    />
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      Save ${rec.potentialSavings?.toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    {rec.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Category</Typography>
                      <Typography variant="body2">{rec.category}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Effort</Typography>
                      <Typography variant="body2">{rec.effort}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Timeframe</Typography>
                      <Typography variant="body2">{rec.timeframe}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Benchmark Comparison */}
      {benchmarkComparison && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CompareArrowsIcon color="primary" />
              Industry Benchmark Comparison
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {benchmarkComparison.yourUtilization}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Average Utilization
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary">
                    {benchmarkComparison.industryAvgUtilization}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benchmarkComparison.industry} Industry Average
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Alert 
                severity={benchmarkComparison.utilizationComparison === 'above' ? 'success' : 'info'}
              >
                You are performing {benchmarkComparison.utilizationComparison} industry average for resource utilization.
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Projected Costs */}
      {projectedCost && projectedCost.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              12-Month Cost Projection
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Projected Cost</TableCell>
                    <TableCell align="right">Optimized Cost</TableCell>
                    <TableCell align="right">Savings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectedCost.slice(0, 6).map((projection) => (
                    <TableRow key={projection.month}>
                      <TableCell>Month {projection.month}</TableCell>
                      <TableCell align="right">${projection.projectedCost?.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>
                        ${projection.optimizedCost?.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        ${projection.savings?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PersonalizedResults;