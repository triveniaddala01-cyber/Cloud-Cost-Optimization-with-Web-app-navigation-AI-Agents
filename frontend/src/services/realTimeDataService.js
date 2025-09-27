const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class RealTimeDataService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/realtime`;
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds cache timeout
    this.subscribers = new Map();
    this.isPolling = false;
    this.pollingInterval = null;
  }

  // Generic fetch method with error handling and caching
  async fetchData(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Add query parameters
      if (options.params) {
        Object.keys(options.params).forEach(key => {
          url.searchParams.append(key, options.params[key]);
        });
      }

      const response = await fetch(url.toString(), {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.warn(`Using expired cache for ${endpoint}`);
        return cached.data;
      }
      
      throw error;
    }
  }

  // Get real-time cost overview
  async getCostOverview() {
    return this.fetchData('/overview');
  }

  // Get real-time cost trends
  async getCostTrends() {
    return this.fetchData('/trends');
  }

  // Get ML-generated recommendations
  async getRecommendations() {
    return this.fetchData('/recommendations');
  }

  // Get savings by resource
  async getSavingsByResource() {
    return this.fetchData('/savings');
  }

  // Get projected costs
  async getProjectedCost() {
    return this.fetchData('/projected');
  }

  // Get cost predictions
  async getPredictions(periods = 6) {
    return this.fetchData('/predictions', {
      params: { periods }
    });
  }

  // Get cost driver analysis
  async getCostDrivers() {
    return this.fetchData('/cost-drivers');
  }

  // Get cost anomalies
  async getAnomalies() {
    return this.fetchData('/anomalies');
  }

  // Get resource usage statistics
  async getResourceUsage() {
    return this.fetchData('/resource-usage');
  }

  // Get instance details with filtering and pagination
  async getInstances(options = {}) {
    const params = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      ...(options.type && { type: options.type }),
      ...(options.status && { status: options.status })
    };

    return this.fetchData('/instances', { params });
  }

  // Get scaling events
  async getScalingEvents(limit = 10) {
    return this.fetchData('/scaling-events', {
      params: { limit }
    });
  }

  // Get complete dashboard data
  async getDashboardData() {
    return this.fetchData('/dashboard');
  }

  // Force refresh of real-time data
  async refreshData() {
    try {
      const response = await this.fetchData('/refresh', { method: 'POST' });
      
      // Clear cache to force fresh data on next request
      this.cache.clear();
      
      return response;
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }

  // Get system status
  async getStatus() {
    return this.fetchData('/status');
  }

  // Subscribe to real-time updates
  subscribe(callback, interval = 30000) {
    const subscriptionId = Date.now().toString();
    
    this.subscribers.set(subscriptionId, {
      callback,
      interval,
      lastUpdate: 0
    });

    // Start polling if not already running
    if (!this.isPolling) {
      this.startPolling();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(subscriptionId);
      
      // Stop polling if no subscribers
      if (this.subscribers.size === 0) {
        this.stopPolling();
      }
    };
  }

  // Start polling for real-time updates
  startPolling() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      const now = Date.now();
      
      for (const [id, subscriber] of this.subscribers.entries()) {
        if (now - subscriber.lastUpdate >= subscriber.interval) {
          try {
            const data = await this.getDashboardData();
            subscriber.callback(data);
            subscriber.lastUpdate = now;
          } catch (error) {
            console.error(`Error updating subscriber ${id}:`, error);
          }
        }
      }
    }, 5000); // Check every 5 seconds
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }

  // Batch fetch multiple endpoints
  async batchFetch(endpoints) {
    const promises = endpoints.map(endpoint => {
      if (typeof endpoint === 'string') {
        return this.fetchData(endpoint);
      } else {
        return this.fetchData(endpoint.path, endpoint.options);
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => ({
        endpoint: typeof endpoints[index] === 'string' ? endpoints[index] : endpoints[index].path,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('Error in batch fetch:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const status = await this.getStatus();
      return {
        healthy: status.success && status.data.isRunning,
        status: status.data,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  // Get historical data for charts
  async getHistoricalData(type, period = '7d') {
    // This would typically fetch historical data
    // For now, we'll use the trends data as historical reference
    const trends = await this.getCostTrends();
    return trends;
  }

  // Export data
  async exportData(format = 'json') {
    try {
      const data = await this.getDashboardData();
      
      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      } else if (format === 'csv') {
        // Simple CSV export for overview data
        const overview = data.data.overview;
        const csv = [
          'Metric,Value',
          `Total Cost,${overview.totalCost}`,
          `Estimated Savings,${overview.estimatedSavings}`,
          `Idle Resources,${overview.idleResources}`,
          `Oversized Resources,${overview.oversizedResources}`,
          `Utilization Rate,${overview.utilizationRate}`
        ].join('\n');
        
        return csv;
      }
      
      throw new Error(`Unsupported export format: ${format}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const realTimeDataService = new RealTimeDataService();

export default realTimeDataService;