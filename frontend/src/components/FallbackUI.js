import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  Chip,
  Skeleton
} from '@mui/material';


// Fallback component for missing recommendation cards
export const RecommendationCardFallback = ({ error = null }) => (
  <Card sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <span style={{ color: '#ff9800', marginRight: '8px', fontSize: '1.2em' }}>⚠️</span>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Data Unavailable
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
        {error ? `Error: ${typeof error === 'string' ? error : 'Unknown error'}` : 'This recommendation could not be loaded due to missing or invalid data.'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          label="Priority: Unknown" 
          color="default"
          size="small"
        />
        <Chip 
          label="Savings: N/A" 
          color="default"
          size="small"
        />
      </Box>
    </CardContent>
  </Card>
);

// Fallback component for accordion items
export const AccordionFallback = ({ error = null, id = 'unknown' }) => (
  <Alert severity="warning" sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '8px', fontSize: '20px' }}>ℹ️</span>
      <Box>
        <Typography variant="subtitle2">
          Recommendation Unavailable (ID: {id})
        </Typography>
        <Typography variant="body2">
          {error ? `Error: ${typeof error === 'string' ? error : 'Unknown error'}` : 'This recommendation contains invalid data and cannot be displayed properly.'}
        </Typography>
      </Box>
    </Box>
  </Alert>
);

// Loading skeleton for recommendations
export const RecommendationSkeleton = () => (
  <Card sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
    <CardContent>
      <Skeleton variant="text" width="80%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.2)', mt: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="rounded" width={100} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Box>
    </CardContent>
  </Card>
);

// Empty state component
export const EmptyRecommendations = ({ message = "No recommendations available" }) => (
  <Alert severity="info" sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h6" gutterBottom>
      {message}
    </Typography>
    <Typography variant="body2">
      AI analysis may still be in progress. Please check back later or refresh the page.
    </Typography>
  </Alert>
);

export default {
  RecommendationCardFallback,
  AccordionFallback,
  RecommendationSkeleton,
  EmptyRecommendations
};