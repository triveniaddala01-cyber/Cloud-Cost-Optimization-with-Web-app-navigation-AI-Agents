// AI Service for cost predictions and recommendations
const API_URL = '/api';

// Get cost predictions based on current usage patterns
export const getCostPredictions = async (timeframe = 'monthly') => {
  try {
    // Mock data for now - would be replaced with actual API call
    return {
      predictions: [
        { month: 'Jan', predicted: 1200, actual: 1250 },
        { month: 'Feb', predicted: 1300, actual: 1320 },
        { month: 'Mar', predicted: 1250, actual: 1200 },
        { month: 'Apr', predicted: 1400, actual: 1380 },
        { month: 'May', predicted: 1500, actual: 1520 },
        { month: 'Jun', predicted: 1600, predicted_only: true }
      ]
    };
  } catch (error) {
    console.error('Error fetching cost predictions:', error);
    throw error;
  }
};

// Get AI-powered cost-saving recommendations
export const getRecommendations = async () => {
  try {
    // Mock data for now - would be replaced with actual API call
    return {
      recommendations: [
        {
          id: 1,
          title: 'Rightsize underutilized EC2 instances',
          description: 'We detected 5 EC2 instances with average CPU utilization below 10%. Consider downsizing these instances to save up to $120/month.',
          potentialSavings: 120,
          difficulty: 'easy'
        },
        {
          id: 2,
          title: 'Use Reserved Instances for stable workloads',
          description: 'Convert 8 on-demand instances to reserved instances for workloads that have been stable for 3+ months to save up to $450/month.',
          potentialSavings: 450,
          difficulty: 'medium'
        },
        {
          id: 3,
          title: 'Implement lifecycle policies for S3',
          description: 'Configure lifecycle policies to move infrequently accessed data to cheaper storage tiers. Potential savings of $85/month.',
          potentialSavings: 85,
          difficulty: 'easy'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Get AI recommendations - alias for getRecommendations for AIRecommendations component
export const getAIRecommendations = async (limit = 5) => {
  try {
    const data = await getRecommendations();
    return {
      ...data,
      recommendations: data.recommendations.slice(0, limit),
      modelInfo: {
        name: 'CloudCostOptimizer v1.2',
        accuracy: 0.92,
        lastUpdated: new Date().toISOString(),
        trainingDataPoints: 15000
      }
    };
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    throw error;
  }
};

// Get ML model information for CostPrediction component
export const getMLModelInfo = async () => {
  try {
    return {
      name: 'CostPredictor v2.0',
      accuracy: 0.89,
      lastUpdated: new Date().toISOString(),
      trainingDataPoints: 12500,
      features: ['historical usage', 'seasonal patterns', 'resource types', 'pricing tiers']
    };
  } catch (error) {
    console.error('Error fetching ML model info:', error);
    throw error;
  }
};

// Apply a specific recommendation
export const applyRecommendation = async (recommendationId) => {
  try {
    // Mock implementation - would be replaced with actual API call
    console.log(`Applying recommendation ${recommendationId}`);
    return { success: true, message: 'Recommendation applied successfully' };
  } catch (error) {
    console.error('Error applying recommendation:', error);
    throw error;
  }
};

export default {
  getCostPredictions,
  getRecommendations,
  getAIRecommendations,
  getMLModelInfo,
  applyRecommendation
};