import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Slider,
  Alert,
  AlertTitle,
  Divider,
  Paper,
  InputAdornment,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const UserResourceInputForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    // Company Information
    companySize: '',
    industry: '',
    monthlyBudget: '',
    
    // AWS Resources
    ec2Instances: [],
    rdsInstances: [],
    s3Buckets: [],
    lambdaFunctions: [],
    
    // Usage Patterns
    businessHours: { start: 9, end: 17 },
    weekendUsage: false,
    seasonalVariation: false,
    
    // Current Costs
    currentMonthlyCost: '',
    expectedGrowth: 10,
    
    // Optimization Goals
    costReductionTarget: 20,
    performanceRequirements: 'balanced',
    complianceRequirements: []
  });

  const [newResource, setNewResource] = useState({
    type: 'ec2',
    name: '',
    instanceType: '',
    region: 'us-east-1',
    utilizationRate: 50,
    monthlyCost: '',
    tags: []
  });

  const resourceTypes = {
    ec2: { label: 'EC2 Instances', emoji: '☁️' },
    rds: { label: 'RDS Databases', emoji: '🗄️' },
    s3: { label: 'S3 Buckets', emoji: '📦' },
    lambda: { label: 'Lambda Functions', emoji: '⚡' }
  };

  const instanceTypes = {
    ec2: ['t3.micro', 't3.small', 't3.medium', 't3.large', 'm5.large', 'm5.xlarge', 'c5.large', 'r5.large'],
    rds: ['db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.m5.large', 'db.r5.large']
  };

  const regions = [
    'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 
    'Manufacturing', 'Media', 'Government', 'Startup', 'Other'
  ];

  const complianceOptions = [
    'HIPAA', 'SOC 2', 'PCI DSS', 'GDPR', 'ISO 27001', 'FedRAMP'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResourceChange = (field, value) => {
    setNewResource(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addResource = () => {
    if (newResource.name && newResource.instanceType) {
      const resourceKey = `${newResource.type}Instances`;
      setFormData(prev => ({
        ...prev,
        [resourceKey]: [...prev[resourceKey], { ...newResource, id: Date.now() }]
      }));
      setNewResource({
        type: 'ec2',
        name: '',
        instanceType: '',
        region: 'us-east-1',
        utilizationRate: 50,
        monthlyCost: '',
        tags: []
      });
    }
  };

  const removeResource = (resourceType, id) => {
    const resourceKey = `${resourceType}Instances`;
    setFormData(prev => ({
      ...prev,
      [resourceKey]: prev[resourceKey].filter(resource => resource.id !== id)
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.companySize || !formData.currentMonthlyCost) {
      alert('Please fill in required fields: Company Size and Current Monthly Cost');
      return;
    }

    // Calculate total resources
    const totalResources = 
      formData.ec2Instances.length + 
      formData.rdsInstances.length + 
      formData.s3Buckets.length + 
      formData.lambdaFunctions.length;

    if (totalResources === 0) {
      alert('Please add at least one resource to analyze');
      return;
    }

    onSubmit(formData);
  };

  const getTotalResources = () => {
    return (formData.ec2Instances?.length || 0) +
           (formData.rdsInstances?.length || 0) +
           (formData.s3Buckets?.length || 0) +
           (formData.lambdaFunctions?.length || 0);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.2em' }}>☁️</span>
          Cloud Resource Analysis Input
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Provide your cloud resource details to get personalized cost optimization recommendations powered by ML analysis.
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          {/* Company Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<span>🔽</span>}>
              <Typography variant="h6">Company Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Company Size</InputLabel>
                    <Select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                    >
                      <MenuItem value="startup">Startup (1-10 employees)</MenuItem>
                      <MenuItem value="small">Small (11-50 employees)</MenuItem>
                      <MenuItem value="medium">Medium (51-200 employees)</MenuItem>
                      <MenuItem value="large">Large (201-1000 employees)</MenuItem>
                      <MenuItem value="enterprise">Enterprise (1000+ employees)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    >
                      {industries.map(industry => (
                        <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Current Monthly Cost"
                    type="number"
                    value={formData.currentMonthlyCost}
                    onChange={(e) => handleInputChange('currentMonthlyCost', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Resource Configuration */}
          <Accordion>
            <AccordionSummary expandIcon={<span>🔽</span>}>
              <Typography variant="h6">
                Cloud Resources ({getTotalResources()} configured)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Add New Resource */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom>Add New Resource</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={newResource.type}
                        onChange={(e) => handleResourceChange('type', e.target.value)}
                      >
                        {Object.entries(resourceTypes).map(([key, { label }]) => (
                          <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Name"
                      value={newResource.name}
                      onChange={(e) => handleResourceChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Instance Type</InputLabel>
                      <Select
                        value={newResource.instanceType}
                        onChange={(e) => handleResourceChange('instanceType', e.target.value)}
                      >
                        {(instanceTypes[newResource.type] || []).map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Region</InputLabel>
                      <Select
                        value={newResource.region}
                        onChange={(e) => handleResourceChange('region', e.target.value)}
                      >
                        {regions.map(region => (
                          <MenuItem key={region} value={region}>{region}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monthly Cost"
                      type="number"
                      value={newResource.monthlyCost}
                      onChange={(e) => handleResourceChange('monthlyCost', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<span>➕</span>}
                      onClick={addResource}
                      size="small"
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Utilization Rate: {newResource.utilizationRate}%
                  </Typography>
                  <Slider
                    value={newResource.utilizationRate}
                    onChange={(e, value) => handleResourceChange('utilizationRate', value)}
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>
              </Paper>

              {/* Configured Resources */}
              {Object.entries(resourceTypes).map(([type, { label, emoji }]) => {
                const resources = formData[`${type}Instances`] || [];
                if (resources.length === 0) return null;

                return (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <span style={{ fontSize: '1.2em' }}>{emoji}</span> {label} ({resources.length})
                    </Typography>
                    <Grid container spacing={1}>
                      {resources.map((resource) => (
                        <Grid item xs={12} md={6} key={resource.id}>
                          <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">{resource.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {resource.instanceType} • {resource.region} • ${resource.monthlyCost}/mo • {resource.utilizationRate}% util
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeResource(type, resource.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>

          {/* Usage Patterns */}
          <Accordion>
            <AccordionSummary expandIcon={<span>🔽</span>}>
              <Typography variant="h6">Usage Patterns & Optimization Goals</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Business Hours</Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      label="Start Hour"
                      type="number"
                      size="small"
                      value={formData.businessHours.start}
                      onChange={(e) => handleInputChange('businessHours', {
                        ...formData.businessHours,
                        start: parseInt(e.target.value)
                      })}
                      inputProps={{ min: 0, max: 23 }}
                    />
                    <TextField
                      label="End Hour"
                      type="number"
                      size="small"
                      value={formData.businessHours.end}
                      onChange={(e) => handleInputChange('businessHours', {
                        ...formData.businessHours,
                        end: parseInt(e.target.value)
                      })}
                      inputProps={{ min: 0, max: 23 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.weekendUsage}
                        onChange={(e) => handleInputChange('weekendUsage', e.target.checked)}
                      />
                    }
                    label="Significant Weekend Usage"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.seasonalVariation}
                        onChange={(e) => handleInputChange('seasonalVariation', e.target.checked)}
                      />
                    }
                    label="Seasonal Usage Variation"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" gutterBottom>
                    Cost Reduction Target: {formData.costReductionTarget}%
                  </Typography>
                  <Slider
                    value={formData.costReductionTarget}
                    onChange={(e, value) => handleInputChange('costReductionTarget', value)}
                    min={5}
                    max={50}
                    marks={[
                      { value: 5, label: '5%' },
                      { value: 20, label: '20%' },
                      { value: 50, label: '50%' }
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Performance Requirements</InputLabel>
                    <Select
                      value={formData.performanceRequirements}
                      onChange={(e) => handleInputChange('performanceRequirements', e.target.value)}
                    >
                      <MenuItem value="cost-optimized">Cost Optimized</MenuItem>
                      <MenuItem value="balanced">Balanced</MenuItem>
                      <MenuItem value="performance-optimized">Performance Optimized</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Submit Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Analyzing...' : 'Analyze My Cloud Costs'}
            </Button>
          </Box>

          {getTotalResources() > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Ready for Analysis</AlertTitle>
              You have configured {getTotalResources()} resources. Our ML algorithms will analyze your setup to provide personalized cost optimization recommendations.
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserResourceInputForm;