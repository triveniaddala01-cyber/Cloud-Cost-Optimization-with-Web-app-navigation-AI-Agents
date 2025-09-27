import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';

const MVPBlueprintGenerator = ({ onSelectBlueprint }) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const blueprints = [
    {
      id: 'web-app-db',
      name: 'Web App + Database Stack',
      description: 'Perfect for SaaS applications, e-commerce sites, and web platforms',
      icon: '☁️',
      estimatedCost: '$50-200/month',
      deploymentTime: '15-30 minutes',
      services: [
        'Load Balancer',
        'Web Server (2x instances)',
        'Managed Database',
        'Object Storage',
        'CDN',
        'SSL Certificate'
      ],
      providers: {
        aws: {
          services: ['ALB', 'EC2 t3.micro (2x)', 'RDS MySQL t3.micro', 'S3', 'CloudFront', 'ACM'],
          estimatedCost: '$85-150/month'
        },
        digitalocean: {
          services: ['Load Balancer', 'Droplets 1GB (2x)', 'Managed MySQL', 'Spaces', 'CDN', 'SSL'],
          estimatedCost: '$50-90/month'
        },
        gcp: {
          services: ['Load Balancer', 'Compute Engine e2-micro (2x)', 'Cloud SQL MySQL', 'Cloud Storage', 'Cloud CDN', 'SSL'],
          estimatedCost: '$70-120/month'
        }
      },
      benefits: [
        'Scalable architecture from day one',
        'Built-in high availability',
        'Automatic SSL and CDN',
        'Database backups included'
      ]
    },
    {
      id: 'serverless-api',
      name: 'Serverless API Stack',
      description: 'Ideal for API-first applications, microservices, and mobile backends',
      icon: '⚡',
      estimatedCost: '$10-100/month',
      deploymentTime: '5-15 minutes',
      services: [
        'API Gateway',
        'Serverless Functions',
        'NoSQL Database',
        'Authentication Service',
        'File Storage',
        'Monitoring'
      ],
      providers: {
        aws: {
          services: ['API Gateway', 'Lambda', 'DynamoDB', 'Cognito', 'S3', 'CloudWatch'],
          estimatedCost: '$20-80/month'
        },
        gcp: {
          services: ['API Gateway', 'Cloud Functions', 'Firestore', 'Firebase Auth', 'Cloud Storage', 'Cloud Monitoring'],
          estimatedCost: '$15-70/month'
        },
        azure: {
          services: ['API Management', 'Azure Functions', 'Cosmos DB', 'Azure AD B2C', 'Blob Storage', 'Application Insights'],
          estimatedCost: '$25-90/month'
        }
      },
      benefits: [
        'Pay only for what you use',
        'Automatic scaling',
        'Zero server management',
        'Built-in authentication'
      ]
    },
    {
      id: 'ml-inference',
      name: 'ML Inference Stack',
      description: 'Optimized for AI/ML applications, model serving, and data processing',
      icon: '🤖',
      estimatedCost: '$100-500/month',
      deploymentTime: '20-45 minutes',
      services: [
        'Container Registry',
        'Kubernetes Cluster',
        'ML Model Serving',
        'Data Storage',
        'Batch Processing',
        'Monitoring & Logging'
      ],
      providers: {
        aws: {
          services: ['ECR', 'EKS', 'SageMaker', 'S3', 'Batch', 'CloudWatch'],
          estimatedCost: '$200-400/month'
        },
        gcp: {
          services: ['Container Registry', 'GKE', 'AI Platform', 'Cloud Storage', 'Dataflow', 'Cloud Monitoring'],
          estimatedCost: '$150-350/month'
        },
        azure: {
          services: ['Container Registry', 'AKS', 'Azure ML', 'Blob Storage', 'Batch', 'Application Insights'],
          estimatedCost: '$180-380/month'
        }
      },
      benefits: [
        'GPU-optimized instances',
        'Auto-scaling ML endpoints',
        'Integrated data pipeline',
        'Model versioning included'
      ]
    }
  ];

  const handleBlueprintSelect = (blueprint) => {
    setSelectedBlueprint(blueprint);
    setDialogOpen(true);
  };

  const handleProviderSelect = () => {
    if (selectedBlueprint && selectedProvider) {
      const blueprintWithProvider = {
        ...selectedBlueprint,
        selectedProvider,
        selectedServices: selectedBlueprint.providers[selectedProvider]
      };
      onSelectBlueprint(blueprintWithProvider);
      setDialogOpen(false);
      setSelectedProvider('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        🚀 MVP Stack Blueprint Generator
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Focus: Time-to-Market</strong> - Choose a pre-defined, one-click template for rapid deployment. 
          These blueprints use minimum-cost services optimized for startups.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {blueprints.map((blueprint) => (
          <Grid item xs={12} md={4} key={blueprint.id}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleBlueprintSelect(blueprint)}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                p: 3
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  minHeight: '48px'
                }}>
                  <Typography variant="h4" sx={{ mr: 2, minWidth: '40px', textAlign: 'center' }}>
                    {blueprint.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                    flex: 1
                  }}>
                    {blueprint.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  minHeight: '40px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {blueprint.description}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 2, 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <Chip 
                    label={`💰 ${blueprint.estimatedCost}`} 
                    size="small" 
                    color="success" 
                    sx={{ minWidth: '120px' }}
                  />
                  <Chip 
                    label={`⏱️ ${blueprint.deploymentTime}`} 
                    size="small" 
                    color="primary" 
                    sx={{ minWidth: '120px' }}
                  />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    Included Services:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5, 
                    mb: 2,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    minHeight: '60px'
                  }}>
                    {blueprint.services.slice(0, 4).map((service) => (
                      <Chip 
                        key={service} 
                        label={service} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {blueprint.services.length > 4 && (
                      <Chip 
                        label={`+${blueprint.services.length - 4} more`} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    mt: 'auto',
                    py: 1.5,
                    fontWeight: 'bold'
                  }}
                >
                  Select Blueprint
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Blueprint Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        {selectedBlueprint && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ fontSize: '1.5rem' }}>
                  {selectedBlueprint.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedBlueprint.name}
                </Typography>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {selectedBlueprint.description}
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Choose Cloud Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  label="Choose Cloud Provider"
                >
                  {Object.keys(selectedBlueprint.providers).map((provider) => (
                    <MenuItem key={provider} value={provider}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {provider.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {selectedBlueprint.providers[provider].estimatedCost}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedProvider && (
                <Paper sx={{ 
                  p: 3, 
                  mb: 3, 
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <Box sx={{ fontSize: '1.2rem' }}>🗄️</Box>
                    {selectedProvider.toUpperCase()} Implementation
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {selectedBlueprint.providers[selectedProvider].services.map((service, index) => (
                      <ListItem key={index} sx={{ 
                        py: 0.5,
                        px: 0,
                        alignItems: 'flex-start'
                      }}>
                        <ListItemIcon sx={{ minWidth: '32px', mt: 0.5 }}>
                          <Box sx={{ fontSize: '1rem' }}>⚙️</Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary={service}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { fontWeight: 'medium' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: 'success.50',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'success.200'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      Estimated Monthly Cost:
                    </Typography>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {selectedBlueprint.providers[selectedProvider].estimatedCost}
                    </Typography>
                  </Box>
                </Paper>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}>
                  <Box sx={{ fontSize: '1.2rem' }}>✨</Box>
                  Key Benefits:
                </Typography>
                <List dense>
                  {selectedBlueprint.benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5,
                      px: 0,
                      alignItems: 'flex-start'
                    }}>
                      <ListItemIcon sx={{ minWidth: '32px', mt: 0.5 }}>
                        <Box sx={{ fontSize: '1rem', color: 'success.main' }}>✅</Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { lineHeight: 1.5 }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              pt: 1,
              gap: 1,
              justifyContent: 'flex-end'
            }}>
              <Button 
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{ minWidth: '100px' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProviderSelect}
                variant="contained"
                disabled={!selectedProvider}
                sx={{ 
                  minWidth: '150px',
                  fontWeight: 'bold'
                }}
              >
                Generate Blueprint
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MVPBlueprintGenerator;