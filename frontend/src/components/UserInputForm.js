import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  Paper
} from '@mui/material';

const UserInputForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    // Architecture Information
    currentServices: [],
    primaryCloudProvider: '',
    regions: [],
    monthlyBudget: '',
    currentSpend: '',
    databaseIOProfile: '',
    primaryTargetRegion: '',
    
    // Business Requirements
    businessType: '',
    complianceRequirements: [],
    performanceRequirements: 'standard',
    availabilityRequirements: '99.9',
    futureDataGrowth: '',
    
    // Optimization Priorities
    priorities: {
      cost: 8,
      performance: 6,
      security: 7,
      scalability: 5
    },
    
    // Special Priorities (boolean flags)
    specialPriorities: {
      lowestTCO: false,
      fastestDeployment: false
    },
    
    // Timeline and Constraints
    implementationTimeline: 'flexible',
    riskTolerance: 'medium',
    teamSize: '',
    technicalExpertise: 'intermediate',
    iacToolPreference: ''
  });

  const [errors, setErrors] = useState({});

  const cloudServices = [
    'Compute (EC2, VMs)',
    'Storage (S3, Blob)',
    'Database (RDS, SQL)',
    'Networking (VPC, Load Balancers)',
    'CDN (CloudFront, CDN)',
    'Analytics (BigQuery, Redshift)',
    'Machine Learning',
    'Containers (EKS, AKS)',
    'Serverless (Lambda, Functions)',
    'Monitoring & Logging'
  ];

  const cloudProviders = [
    { value: 'aws', label: 'Amazon Web Services (AWS)' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'gcp', label: 'Google Cloud Platform (GCP)' },
    { value: 'multi', label: 'Multi-Cloud' },
    { value: 'other', label: 'Other/Alternative Providers' }
  ];

  const regions = [
    'us-east-1 (N. Virginia)', 'us-west-2 (Oregon)', 'eu-west-1 (Ireland)', 
    'eu-central-1 (Frankfurt)', 'ap-southeast-1 (Singapore)', 'ap-northeast-1 (Tokyo)', 
    'ca-central-1 (Canada)', 'sa-east-1 (São Paulo)', 'ap-south-1 (Mumbai)',
    'eu-north-1 (Stockholm)', 'us-west-1 (N. California)', 'ap-southeast-2 (Sydney)'
  ];

  const databaseIOProfiles = [
    { value: 'low', label: 'Low (Reporting, Analytics)' },
    { value: 'medium', label: 'Medium (CRUD Operations)' },
    { value: 'high', label: 'High (Transactions, Gaming)' }
  ];

  const iacTools = [
    { value: 'terraform', label: 'Terraform' },
    { value: 'cloudformation', label: 'AWS CloudFormation' },
    { value: 'bicep', label: 'Azure Bicep/ARM' },
    { value: 'pulumi', label: 'Pulumi' },
    { value: 'none', label: 'None / Manual Setup' }
  ];

  const businessTypes = [
    'Startup', 'Small Business', 'Enterprise', 'E-commerce',
    'SaaS', 'Financial Services', 'Healthcare', 'Education',
    'Government', 'Non-profit', 'Other'
  ];

  const complianceOptions = [
    'GDPR', 'HIPAA', 'SOC 2', 'PCI DSS', 'ISO 27001',
    'FedRAMP', 'CCPA', 'None Required'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSpecialPriorityChange = (priority, value) => {
    setFormData(prev => ({
      ...prev,
      specialPriorities: {
        ...prev.specialPriorities,
        [priority]: value
      }
    }));
  };

  const handlePriorityChange = (priority, value) => {
    setFormData(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: Number(value)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.primaryCloudProvider) {
      newErrors.primaryCloudProvider = 'Please select your primary cloud provider';
    }
    
    if (!formData.currentSpend || isNaN(formData.currentSpend)) {
      newErrors.currentSpend = 'Please enter a valid current monthly spend';
    }
    
    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }
    
    if (formData.currentServices.length === 0) {
      newErrors.currentServices = 'Please select at least one service you currently use';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      currentServices: [],
      primaryCloudProvider: '',
      regions: [],
      monthlyBudget: '',
      currentSpend: '',
      businessType: '',
      complianceRequirements: [],
      performanceRequirements: 'standard',
      availabilityRequirements: '99.9',
      priorities: {
        cost: 8,
        performance: 6,
        security: 7,
        scalability: 5
      },
      implementationTimeline: 'flexible',
      riskTolerance: 'medium',
      teamSize: '',
      technicalExpertise: 'intermediate'
    });
    setErrors({});
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        🎯 Get Personalized Cloud Cost Recommendations
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Provide your current cloud setup details to receive tailored cost optimization recommendations, 
          including alternative cloud providers and services that could reduce your costs.
        </Typography>
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Current Architecture Section */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<span>🔽</span>}>
            <Typography variant="h6">☁️ Current Cloud Architecture</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.primaryCloudProvider}>
                  <InputLabel>Primary Cloud Provider</InputLabel>
                  <Select
                    value={formData.primaryCloudProvider}
                    onChange={(e) => handleInputChange('primaryCloudProvider', e.target.value)}
                    label="Primary Cloud Provider"
                  >
                    {cloudProviders.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.primaryCloudProvider && (
                    <Typography variant="caption" color="error">
                      {errors.primaryCloudProvider}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Primary Regions</InputLabel>
                  <Select
                    multiple
                    value={formData.regions}
                    onChange={(e) => handleArrayChange('regions', e.target.value)}
                    label="Primary Regions"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Services (Select all that apply)
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  maxHeight: '200px',
                  overflow: 'auto',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  {cloudServices.map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      clickable
                      color={formData.currentServices.includes(service) ? 'primary' : 'default'}
                      onClick={() => {
                        const newServices = formData.currentServices.includes(service)
                          ? formData.currentServices.filter(s => s !== service)
                          : [...formData.currentServices, service];
                        handleInputChange('currentServices', newServices);
                      }}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px'
                      }}
                    />
                  ))}
                </Box>
                {errors.currentServices && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {errors.currentServices}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Monthly Spend ($)"
                  type="number"
                  value={formData.currentSpend}
                  onChange={(e) => handleInputChange('currentSpend', e.target.value)}
                  error={!!errors.currentSpend}
                  helperText={errors.currentSpend || 'Enter your exact monthly cloud costs (e.g., $1,250.75)'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target Monthly Budget ($)"
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                  helperText="Optional: Your desired monthly budget"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Database I/O Profile</InputLabel>
                  <Select
                    value={formData.databaseIOProfile}
                    onChange={(e) => handleInputChange('databaseIOProfile', e.target.value)}
                    label="Database I/O Profile"
                  >
                    {databaseIOProfiles.map((profile) => (
                      <MenuItem key={profile.value} value={profile.value}>
                        {profile.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Primary Target Region</InputLabel>
                  <Select
                    value={formData.primaryTargetRegion}
                    onChange={(e) => handleInputChange('primaryTargetRegion', e.target.value)}
                    label="Primary Target Region"
                  >
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Business Requirements Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<span>🔽</span>}>
            <Typography variant="h6">🏢 Business Requirements</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.businessType}>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    label="Business Type"
                  >
                    {businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.businessType && (
                    <Typography variant="caption" color="error">
                      {errors.businessType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Team Size"
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  helperText="Number of people managing cloud infrastructure"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Future Data Growth (% per month)"
                  type="number"
                  value={formData.futureDataGrowth}
                  onChange={(e) => handleInputChange('futureDataGrowth', e.target.value)}
                  helperText="Expected monthly data growth rate (e.g., 10 for 10%)"
                  InputProps={{
                    endAdornment: '%'
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Compliance Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {complianceOptions.map((compliance) => (
                    <Chip
                      key={compliance}
                      label={compliance}
                      clickable
                      color={formData.complianceRequirements.includes(compliance) ? 'primary' : 'default'}
                      onClick={() => {
                        const newCompliance = formData.complianceRequirements.includes(compliance)
                          ? formData.complianceRequirements.filter(c => c !== compliance)
                          : [...formData.complianceRequirements, compliance];
                        handleInputChange('complianceRequirements', newCompliance);
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Optimization Priorities Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<span>🔽</span>}>
            <Typography variant="h6">⚖️ Optimization Priorities</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rate the importance of each factor (1 = Low Priority, 10 = High Priority)
            </Typography>
            
            <Grid container spacing={3}>
              {Object.entries(formData.priorities).map(([priority, value]) => (
                <Grid item xs={12} md={6} key={priority}>
                  <Typography variant="subtitle2" gutterBottom>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}: {value}/10
                  </Typography>
                  <Slider
                    value={Number(value)}
                    onChange={(e, newValue) => handlePriorityChange(priority, newValue)}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Implementation Preferences Section */}
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<span>🔽</span>}>
            <Typography variant="h6">🚀 Implementation Preferences</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Implementation Timeline</InputLabel>
                  <Select
                    value={formData.implementationTimeline}
                    onChange={(e) => handleInputChange('implementationTimeline', e.target.value)}
                    label="Implementation Timeline"
                  >
                    <MenuItem value="immediate">Immediate (within 1 week)</MenuItem>
                    <MenuItem value="short">Short-term (1-4 weeks)</MenuItem>
                    <MenuItem value="medium">Medium-term (1-3 months)</MenuItem>
                    <MenuItem value="flexible">Flexible timeline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Risk Tolerance</InputLabel>
                  <Select
                    value={formData.riskTolerance}
                    onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                    label="Risk Tolerance"
                  >
                    <MenuItem value="low">Low - Minimal disruption</MenuItem>
                    <MenuItem value="medium">Medium - Some acceptable risk</MenuItem>
                    <MenuItem value="high">High - Aggressive optimization</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Technical Expertise</InputLabel>
                  <Select
                    value={formData.technicalExpertise}
                    onChange={(e) => handleInputChange('technicalExpertise', e.target.value)}
                    label="Technical Expertise"
                  >
                    <MenuItem value="beginner">Beginner - Need detailed guidance</MenuItem>
                    <MenuItem value="intermediate">Intermediate - Some cloud experience</MenuItem>
                    <MenuItem value="advanced">Advanced - Experienced team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Infrastructure as Code Tool</InputLabel>
                  <Select
                    value={formData.iacToolPreference}
                    onChange={(e) => handleInputChange('iacToolPreference', e.target.value)}
                    label="Infrastructure as Code Tool"
                  >
                    {iacTools.map((tool) => (
                      <MenuItem key={tool.value} value={tool.value}>
                        {tool.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Startup-Specific Priorities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.specialPriorities.lowestTCO}
                        onChange={(e) => handleSpecialPriorityChange('lowestTCO', e.target.checked)}
                      />
                    }
                    label="Priority 1: Lowest Total Cost of Ownership (TCO)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.specialPriorities.fastestDeployment}
                        onChange={(e) => handleSpecialPriorityChange('fastestDeployment', e.target.checked)}
                      />
                    }
                    label="Priority 2: Fastest Deployment & Time-to-Market"
                  />
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={resetForm}
            disabled={loading}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            size="large"
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Generating Recommendations...' : '🎯 Get Recommendations'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserInputForm;