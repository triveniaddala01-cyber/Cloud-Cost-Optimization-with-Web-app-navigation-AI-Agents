import React from 'react';
import { Alert, Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Alert 
          severity="error" 
          sx={{ 
            my: 2, 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
          icon={<span style={{ fontSize: '1.2em' }}>⚠️</span>}
        >
          <Typography variant="h6" gutterBottom>
            {this.props.fallbackTitle || 'Something went wrong'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {this.props.fallbackMessage || 'An error occurred while rendering this component. Please try refreshing the page.'}
          </Typography>
          
          {this.props.showRetry !== false && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={this.handleRetry}
              sx={{ mt: 1 }}
            >
              Try Again
            </Button>
          )}
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;