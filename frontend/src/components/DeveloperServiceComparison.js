import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Tooltip
} from '@mui/material';

const DeveloperServiceComparison = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [serverlessInputs, setServerlessInputs] = useState({
    monthlyRequests: 1000000,
    avgExecutionTime: 200, // milliseconds
    memorySize: 512, // MB
    region: 'us-east'
  });
  const [breakeven, setBreakeven] = useState(null);

  const databaseComparison = {
    aws_rds: {
      name: 'AWS RDS MySQL',
      provider: 'AWS',
      startingPrice: 13.14,
      maxReadReplicas: 15,
      maxIOPS: 80000,
      autoScaling: 5,
      backupRetention: 35,
      multiAZ: true,
      encryption: true,
      monitoring: 4,
      easeOfUse: 4,
      features: {
        pointInTimeRecovery: true,
        automaticFailover: true,
        performanceInsights: true,
        queryOptimizer: true,
        connectionPooling: false
      }
    },
    digitalocean_db: {
      name: 'DigitalOcean Managed MySQL',
      provider: 'DigitalOcean',
      startingPrice: 15.00,
      maxReadReplicas: 2,
      maxIOPS: 3000,
      autoScaling: 3,
      backupRetention: 7,
      multiAZ: true,
      encryption: true,
      monitoring: 3,
      easeOfUse: 5,
      features: {
        pointInTimeRecovery: true,
        automaticFailover: true,
        performanceInsights: false,
        queryOptimizer: false,
        connectionPooling: true
      }
    },
    gcp_sql: {
      name: 'Google Cloud SQL MySQL',
      provider: 'GCP',
      startingPrice: 9.37,
      maxReadReplicas: 10,
      maxIOPS: 40000,
      autoScaling: 4,
      backupRetention: 365,
      multiAZ: true,
      encryption: true,
      monitoring: 4,
      easeOfUse: 4,
      features: {
        pointInTimeRecovery: true,
        automaticFailover: true,
        performanceInsights: true,
        queryOptimizer: true,
        connectionPooling: false
      }
    },
    azure_sql: {
      name: 'Azure Database for MySQL',
      provider: 'Azure',
      startingPrice: 12.41,
      maxReadReplicas: 5,
      maxIOPS: 20000,
      autoScaling: 4,
      backupRetention: 35,
      multiAZ: true,
      encryption: true,
      monitoring: 3,
      easeOfUse: 3,
      features: {
        pointInTimeRecovery: true,
        automaticFailover: true,
        performanceInsights: false,
        queryOptimizer: true,
        connectionPooling: false
      }
    },
    planetscale: {
      name: 'PlanetScale MySQL',
      provider: 'PlanetScale',
      startingPrice: 29.00,
      maxReadReplicas: 'Unlimited',
      maxIOPS: 'Unlimited',
      autoScaling: 5,
      backupRetention: 30,
      multiAZ: true,
      encryption: true,
      monitoring: 5,
      easeOfUse: 5,
      features: {
        pointInTimeRecovery: true,
        automaticFailover: true,
        performanceInsights: true,
        queryOptimizer: true,
        connectionPooling: true
      }
    }
  };

  const calculateBreakeven = () => {
    const { monthlyRequests, avgExecutionTime, memorySize } = serverlessInputs;
    
    // Serverless pricing (AWS Lambda example)
    const requestCost = monthlyRequests * 0.0000002; // $0.20 per 1M requests
    const computeCost = (monthlyRequests * avgExecutionTime / 1000) * (memorySize / 1024) * 0.0000166667; // GB-seconds
    const serverlessCost = requestCost + computeCost;
    
    // VM pricing (t3.micro equivalent)
    const vmCost = 8.76; // $8.76/month for t3.micro
    
    // Calculate breakeven point
    const breakevenRequests = (vmCost - requestCost) / (computeCost / monthlyRequests);
    
    // Different VM sizes for comparison
    const vmOptions = [
      { name: 't3.micro', cost: 8.76, vcpu: 2, memory: 1 },
      { name: 't3.small', cost: 17.52, vcpu: 2, memory: 2 },
      { name: 't3.medium', cost: 35.04, vcpu: 2, memory: 4 },
      { name: 't3.large', cost: 70.08, vcpu: 2, memory: 8 }
    ];
    
    const results = vmOptions.map(vm => {
      const vmBreakeven = (vm.cost) / (computeCost / monthlyRequests);
      const currentCostRatio = serverlessCost / vm.cost;
      
      return {
        ...vm,
        breakevenRequests: vmBreakeven,
        currentCostRatio,
        recommendation: vmBreakeven < monthlyRequests ? 'VM' : 'Serverless'
      };
    });
    
    setBreakeven({
      serverlessCost,
      currentRequests: monthlyRequests,
      vmOptions: results
    });
  };

  const exportDatabaseComparison = () => {
    const csvData = [
      ['Provider', 'Service', 'Starting Price', 'Max Read Replicas', 'Max IOPS', 'Auto Scaling', 'Backup Retention', 'Monitoring', 'Ease of Use'],
      ...Object.values(databaseComparison).map(db => [
        db.provider,
        db.name,
        `$${db.startingPrice}`,
        db.maxReadReplicas,
        db.maxIOPS,
        db.autoScaling,
        `${db.backupRetention} days`,
        db.monitoring,
        db.easeOfUse
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportBreakevenAnalysis = () => {
    if (!breakeven) return;
    
    const csvData = [
      ['VM Type', 'Monthly Cost', 'vCPU', 'Memory (GB)', 'Breakeven Requests', 'Current Cost Ratio', 'Recommendation'],
      ...breakeven.vmOptions.map(vm => [
        vm.name,
        `$${vm.cost}`,
        vm.vcpu,
        vm.memory,
        Math.round(vm.breakevenRequests).toLocaleString(),
        vm.currentCostRatio.toFixed(2),
        vm.recommendation
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'serverless-vm-breakeven.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        🔧 Developer Service Comparison
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Focus: Modern Architecture & Cost Control</strong> - Make informed architectural decisions 
          based on quantifiable cost thresholds and feature comparisons.
        </Typography>
      </Alert>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="📊 Serverless vs VM Breakeven" />
        <Tab label="🗄️ Managed Database Comparison" />
      </Tabs>

      {/* Serverless vs VM Tab */}
      {activeTab === 0 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculate Serverless vs VM Breakeven Point
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Monthly Requests"
                    type="number"
                    value={serverlessInputs.monthlyRequests}
                    onChange={(e) => setServerlessInputs(prev => ({
                      ...prev,
                      monthlyRequests: parseInt(e.target.value) || 0
                    }))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">requests</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Average Execution Time"
                    type="number"
                    value={serverlessInputs.avgExecutionTime}
                    onChange={(e) => setServerlessInputs(prev => ({
                      ...prev,
                      avgExecutionTime: parseInt(e.target.value) || 0
                    }))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">ms</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Memory Allocation"
                    type="number"
                    value={serverlessInputs.memorySize}
                    onChange={(e) => setServerlessInputs(prev => ({
                      ...prev,
                      memorySize: parseInt(e.target.value) || 0
                    }))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">MB</InputAdornment>
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Primary Region</InputLabel>
                    <Select
                      value={serverlessInputs.region}
                      onChange={(e) => setServerlessInputs(prev => ({
                        ...prev,
                        region: e.target.value
                      }))}
                      label="Primary Region"
                    >
                      <MenuItem value="us-east">US East (N. Virginia)</MenuItem>
                      <MenuItem value="us-west">US West (Oregon)</MenuItem>
                      <MenuItem value="eu-west">EU West (Ireland)</MenuItem>
                      <MenuItem value="asia-pacific">Asia Pacific (Singapore)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ 
                mt: 3, 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Button 
                  variant="contained" 
                  onClick={calculateBreakeven}
                  sx={{ minWidth: '160px' }}
                >
                  📊 Calculate Breakeven
                </Button>
              </Box>
            </CardContent>
          </Card>

          {breakeven && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Serverless vs VM Cost Analysis
                </Typography>
                
                <Alert 
                  severity={breakeven.serverlessCost < 35 ? 'success' : 'warning'} 
                  sx={{ mb: 3 }}
                >
                  <Typography variant="body2">
                    <strong>Current Serverless Cost: ${breakeven.serverlessCost.toFixed(2)}/month</strong>
                    <br />
                    Based on {breakeven.currentRequests.toLocaleString()} monthly requests
                  </Typography>
                </Alert>
                
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>VM Type</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Monthly Cost</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>vCPU</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Memory</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Breakeven Point</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Recommendation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {breakeven.vmOptions.map((vm) => (
                        <TableRow 
                          key={vm.name}
                          sx={{ 
                            '&:hover': { bgcolor: 'action.hover' },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {vm.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              ${vm.cost.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Typography variant="body2">
                              {vm.vcpu}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Typography variant="body2">
                              {vm.memory} GB
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Typography variant="body2">
                              {Math.round(vm.breakevenRequests).toLocaleString()} req/month
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Chip 
                              label={vm.recommendation}
                              color={vm.recommendation === 'Serverless' ? 'success' : 'primary'}
                              size="small"
                              sx={{ minWidth: '80px' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Insights:
                  </Typography>
                  <List>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        ⚡
                      </ListItemIcon>
                      <ListItemText 
                        primary="Serverless is ideal for variable workloads"
                        secondary="Pay only for actual usage, perfect for startups with unpredictable traffic"
                      />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        🗄️
                      </ListItemIcon>
                      <ListItemText 
                        primary="VMs become cost-effective at high, consistent usage"
                        secondary="Better for applications with steady traffic patterns above breakeven point"
                      />
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Database Comparison Tab */}
      {activeTab === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="h6">
                  Managed Database Feature/Price Matrix
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={exportDatabaseComparison}
                  size="small"
                  sx={{ minWidth: '140px' }}
                >
                  📥 Export to CSV
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Compare managed databases focusing on critical non-cost features like scaling limits, 
                  IOPS throughput, and operational complexity for future growth planning.
                </Typography>
              </Alert>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Service</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Starting Price</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Max Read Replicas</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Max IOPS</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Auto Scaling</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Backup Retention</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Monitoring</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Ease of Use</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(databaseComparison).map((db) => (
                      <TableRow 
                        key={db.name} 
                        sx={{ 
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {db.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {db.provider}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            ${db.startingPrice}/month
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip 
                            label={db.maxReadReplicas} 
                            size="small" 
                            color={db.maxReadReplicas === 'Unlimited' ? 'success' : 'default'}
                            sx={{ minWidth: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip 
                            label={db.maxIOPS === 'Unlimited' ? 'Unlimited' : db.maxIOPS.toLocaleString()} 
                            size="small"
                            color={db.maxIOPS === 'Unlimited' || db.maxIOPS > 50000 ? 'success' : 'default'}
                            sx={{ minWidth: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Rating value={db.autoScaling} max={5} size="small" readOnly />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            {db.backupRetention} days
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Rating value={db.monitoring} max={5} size="small" readOnly />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Rating value={db.easeOfUse} max={5} size="small" readOnly />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Feature Comparison Matrix */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Advanced Features Comparison
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Service</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>
                        <Tooltip title="Restore database to any point in time within backup retention period">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 0.5
                          }}>
                            Point-in-Time Recovery
                            <span style={{ fontSize: '14px' }}>❓</span>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>
                        <Tooltip title="Automatic failover to standby instance in case of primary failure">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 0.5
                          }}>
                            Auto Failover
                            <span style={{ fontSize: '14px' }}>❓</span>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>
                        <Tooltip title="Detailed performance metrics and query analysis">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 0.5
                          }}>
                            Performance Insights
                            <span style={{ fontSize: '14px' }}>❓</span>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>
                        <Tooltip title="Built-in query optimization and performance tuning">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 0.5
                          }}>
                            Query Optimizer
                            <span style={{ fontSize: '14px' }}>❓</span>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>
                        <Tooltip title="Built-in connection pooling to manage database connections efficiently">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 0.5
                          }}>
                            Connection Pooling
                            <span style={{ fontSize: '14px' }}>❓</span>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(databaseComparison).map((db) => (
                      <TableRow key={db.name}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {db.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ fontSize: '18px' }}>
                            {db.features.pointInTimeRecovery ? '✅' : '❌'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ fontSize: '18px' }}>
                            {db.features.automaticFailover ? '✅' : '❌'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ fontSize: '18px' }}>
                            {db.features.performanceInsights ? '✅' : '❌'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ fontSize: '18px' }}>
                            {db.features.queryOptimizer ? '✅' : '❌'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ fontSize: '18px' }}>
                            {db.features.connectionPooling ? '✅' : '❌'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recommendations for Startups:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      🔒
                    </ListItemIcon>
                    <ListItemText 
                      primary="For MVP/Early Stage: DigitalOcean or GCP Cloud SQL"
                      secondary="Best balance of cost, features, and ease of use for getting started quickly"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      ⚡
                    </ListItemIcon>
                    <ListItemText 
                      primary="For High Growth: PlanetScale or AWS RDS"
                      secondary="Unlimited scaling capabilities and advanced performance features for rapid growth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      🗄️
                    </ListItemIcon>
                    <ListItemText 
                      primary="For Budget-Conscious: GCP Cloud SQL"
                      secondary="Lowest starting price with excellent feature set and long backup retention"
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default DeveloperServiceComparison;