import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  AlertTitle,
  Snackbar,
  Fab,
  Tooltip
} from '@mui/material';
import { 
  Refresh as RefreshIcon 
} from '@mui/icons-material';
import UserResourceInputForm from '../components/UserResourceInputForm';
import PersonalizedResults from '../components/PersonalizedResults';

const PersonalizedAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisId, setAnalysisId] = useState(null);

  const handleAnalyzeResources = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/personalized/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resources');
      }

      setAnalysis(data.analysis);
      setAnalysisId(data.analysisId);
      setSuccess(true);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze your resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    if (!analysisId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/personalized/analysis/${analysisId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAnalysis(data.analysis.analysis || data.analysis);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <span style={{ fontSize: 'inherit', color: '#667eea' }}>📊</span>
          Personalized Cloud Cost Analysis
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Get AI-powered insights tailored to your specific cloud infrastructure. 
          Our machine learning algorithms analyze your resources to provide personalized 
          cost optimization recommendations and savings opportunities.
        </Typography>
      </Box>

      {/* Introduction Alert */}
      {!analysis && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>How It Works</AlertTitle>
          <Typography variant="body2">
            1. <strong>Input Your Resources:</strong> Provide details about your cloud infrastructure including EC2 instances, RDS databases, S3 buckets, and Lambda functions.
          </Typography>
          <Typography variant="body2">
            2. <strong>ML Analysis:</strong> Our algorithms analyze your usage patterns, costs, and industry benchmarks.
          </Typography>
          <Typography variant="body2">
            3. <strong>Get Recommendations:</strong> Receive personalized optimization strategies with potential savings calculations.
          </Typography>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseError}>
          <AlertTitle>Analysis Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* User Input Form */}
      <UserResourceInputForm 
        onSubmit={handleAnalyzeResources}
        loading={loading}
      />

      {/* Analysis Results */}
      {analysis && (
        <Box id="analysis-results">
          <PersonalizedResults 
            analysis={analysis}
            loading={loading}
          />
        </Box>
      )}

      {/* Floating Action Button for Refresh */}
      {analysis && (
        <Tooltip title="Refresh Analysis">
          <Fab
            color="primary"
            sx={{ 
              position: 'fixed', 
              bottom: 16, 
              right: 16,
              zIndex: 1000
            }}
            onClick={handleRefreshAnalysis}
            disabled={loading}
          >
            <RefreshIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Analysis completed successfully! Check your personalized recommendations below.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PersonalizedAnalysis;