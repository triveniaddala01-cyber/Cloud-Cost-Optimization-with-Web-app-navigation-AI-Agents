import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  AlertTitle,
  Chip,
  LinearProgress,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material';
// Removed Material-UI icons and will use emojis instead

const AutomationPanel = () => {
  const [providers, setProviders] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('cost-optimization');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [headlessMode, setHeadlessMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [commandInput, setCommandInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load providers and analysis types on component mount
  useEffect(() => {
    loadProviders();
    loadAnalysisTypes();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/automation/providers');
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
        if (data.providers.length > 0) {
          setSelectedProvider(data.providers[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const loadAnalysisTypes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/automation/analysis-types');
      const data = await response.json();
      if (data.success) {
        setAnalysisTypes(data.analysisTypes);
      }
    } catch (error) {
      console.error('Failed to load analysis types:', error);
    }
  };

  const testConnection = async () => {
    if (!selectedProvider || !credentials.email || !credentials.password) {
      setError('Please select a provider and enter credentials');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/automation/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          credentials,
          headless: headlessMode
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus({ success: true, message: data.message });
      } else {
        setConnectionStatus({ success: false, message: data.message || 'Connection failed' });
      }
    } catch (error) {
      setConnectionStatus({ success: false, message: 'Connection test failed: ' + error.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const executeAnalysis = async () => {
    if (!selectedProvider || !credentials.email || !credentials.password) {
      setError('Please select a provider and enter credentials');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/automation/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          credentials,
          analysisType: selectedAnalysisType,
          includeUnusedResources: true,
          headless: headlessMode
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (error) {
      setError('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async () => {
    if (!commandInput.trim() || !selectedProvider || !credentials.email || !credentials.password) {
      setError('Please enter a command, select a provider, and enter credentials');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/automation/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: commandInput,
          provider: selectedProvider,
          credentials,
          headless: headlessMode
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || 'Command execution failed');
      }
    } catch (error) {
      setError('Command execution failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? amount : `$${num.toFixed(2)}`;
    }
    return `$${(amount || 0).toFixed(2)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🤖 AI Agent Automation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Automate cloud dashboard login, data extraction, and cost analysis using AI-powered browser automation.
      </Typography>

      {/* Configuration Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Cloud Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  label="Cloud Provider"
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Analysis Type</InputLabel>
                <Select
                  value={selectedAnalysisType}
                  onChange={(e) => setSelectedAnalysisType(e.target.value)}
                  label="Analysis Type"
                >
                  {analysisTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>🔒</span>,
              }}
              helperText="Use demo@example.com for demo mode"
            />
          </Grid>

            <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>🔒</span>,
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </IconButton>
                ),
              }}
              helperText="Use demo123 for demo mode"
            />
          </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={headlessMode}
                    onChange={(e) => setHeadlessMode(e.target.checked)}
                  />
                }
                label="Headless Mode (Run browser in background)"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<span>☁️</span>}
              onClick={testConnection}
              disabled={testingConnection || loading}
            >
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </Button>

            <Button
              variant="contained"
              startIcon={<span>▶️</span>}
              onClick={executeAnalysis}
              disabled={loading || testingConnection}
            >
              {loading ? 'Analyzing...' : 'Start Analysis'}
            </Button>

            <Button
              variant="text"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </Box>

          {/* Advanced Options */}
          {showAdvanced && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Advanced: Custom Command
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Custom Command"
                  placeholder="e.g., Find unused Azure VMs and estimate monthly savings"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={executeCommand}
                  disabled={loading || testingConnection}
                >
                  Execute
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Loading Progress */}
      {loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analysis in Progress...
            </Typography>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              The AI agent is logging into {selectedProvider} and extracting data. This may take 1-3 minutes.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      {connectionStatus && (
        <Alert severity={connectionStatus.success ? 'success' : 'error'} sx={{ mb: 3 }}>
          <AlertTitle>Connection Test</AlertTitle>
          {connectionStatus.message}
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Results Display */}
      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>

            {/* Metadata */}
            {results.metadata && (
              <Box sx={{ mb: 3 }}>
                <Chip label={`Provider: ${results.metadata.provider}`} sx={{ mr: 1 }} />
                <Chip label={`Type: ${results.metadata.analysisType}`} sx={{ mr: 1 }} />
                <Chip label={`Executed: ${new Date(results.metadata.executedAt).toLocaleString()}`} />
              </Box>
            )}

            {/* Potential Savings */}
            {results.potentialSavings > 0 && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Potential Monthly Savings</AlertTitle>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(results.potentialSavings)}
                </Typography>
              </Alert>
            )}

            {/* Unused Resources */}
            {results.unusedResources && results.unusedResources.length > 0 && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon="🔽">
                  <Typography variant="h6">
                    Unused Resources ({results.unusedResources.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Resource Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Monthly Cost</TableCell>
                          <TableCell>Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.unusedResources.map((resource, index) => (
                          <TableRow key={index}>
                            <TableCell>{resource.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={resource.status} 
                                color="warning" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>{resource.size}</TableCell>
                            <TableCell>{formatCurrency(resource.estimatedMonthlyCost)}</TableCell>
                            <TableCell>{resource.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon="🔽">
                  <Typography variant="h6">
                    AI Recommendations ({results.recommendations.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {results.recommendations.map((rec, index) => (
                      <Grid item xs={12} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6">{rec.title}</Typography>
                              <Chip 
                                label={rec.priority} 
                                color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'default'}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {rec.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                              <Chip label={`Savings: ${rec.estimatedSavings}`} color="success" size="small" />
                              <Chip label={`Effort: ${rec.effort}`} size="small" />
                              <Chip label={`Timeline: ${rec.timeline}`} size="small" />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Implementation:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {rec.implementation}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Risks:
                            </Typography>
                            <Typography variant="body2" color="warning.main">
                              {rec.risks}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AutomationPanel;