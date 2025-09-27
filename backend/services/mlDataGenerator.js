const crypto = require('crypto');

class MLDataGenerator {
  constructor() {
    this.baseTimestamp = Date.now();
    this.seasonalFactors = {
      monthly: [0.9, 0.85, 0.95, 1.0, 1.1, 1.15, 1.2, 1.18, 1.05, 1.0, 0.95, 0.9],
      weekly: [0.8, 0.9, 1.0, 1.1, 1.15, 1.2, 0.85], // Mon-Sun
      hourly: [0.6, 0.5, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.15, 1.1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6]
    };
    
    // Initialize base metrics
    this.baseMetrics = {
      totalCost: 12500,
      idleResources: 15,
      oversizedResources: 23,
      utilizationRate: 0.75
    };
    
    // Resource types and their characteristics
    this.resourceTypes = ['EC2', 'EBS', 'S3', 'RDS', 'Lambda', 'CloudFront', 'ELB'];
    this.resourceCostRanges = {
      'EC2': { min: 50, max: 500 },
      'EBS': { min: 20, max: 200 },
      'S3': { min: 10, max: 150 },
      'RDS': { min: 100, max: 800 },
      'Lambda': { min: 5, max: 50 },
      'CloudFront': { min: 15, max: 100 },
      'ELB': { min: 25, max: 150 }
    };
  }

  // Generate realistic noise using Box-Muller transform
  generateGaussianNoise(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  // Apply seasonal patterns
  getSeasonalFactor(timestamp = Date.now()) {
    const date = new Date(timestamp);
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    
    const monthlyFactor = this.seasonalFactors.monthly[month];
    const weeklyFactor = this.seasonalFactors.weekly[dayOfWeek];
    const hourlyFactor = this.seasonalFactors.hourly[hour];
    
    return monthlyFactor * weeklyFactor * hourlyFactor * 0.33; // Average the factors
  }

  // Generate time series data with trend and seasonality
  generateTimeSeries(baseValue, periods = 6, volatility = 0.1) {
    const data = [];
    const trend = 0.02; // 2% monthly growth trend
    
    for (let i = 0; i < periods; i++) {
      const timestamp = Date.now() - (periods - i - 1) * 30 * 24 * 60 * 60 * 1000; // Monthly intervals
      const seasonalFactor = this.getSeasonalFactor(timestamp);
      const trendFactor = 1 + (trend * i);
      const noise = this.generateGaussianNoise(0, volatility);
      
      const value = baseValue * trendFactor * seasonalFactor * (1 + noise);
      const date = new Date(timestamp);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        cost: Math.max(0, Math.round(value * 100) / 100),
        timestamp: timestamp
      });
    }
    
    return data;
  }

  // Detect anomalies using statistical methods
  detectAnomalies(data, threshold = 2) {
    const values = data.map(d => d.cost);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return data.map((item, index) => ({
      ...item,
      isAnomaly: Math.abs(item.cost - mean) > threshold * stdDev,
      zScore: (item.cost - mean) / stdDev
    }));
  }

  // Generate real-time cost overview
  generateCostOverview() {
    const currentTime = Date.now();
    const seasonalFactor = this.getSeasonalFactor(currentTime);
    const noise = this.generateGaussianNoise(0, 0.05);
    
    const totalCost = Math.round(this.baseMetrics.totalCost * seasonalFactor * (1 + noise));
    const utilizationVariation = this.generateGaussianNoise(0, 0.1);
    const currentUtilization = Math.max(0.3, Math.min(0.95, this.baseMetrics.utilizationRate + utilizationVariation));
    
    // Calculate dynamic savings based on utilization
    const potentialSavings = Math.round(totalCost * (1 - currentUtilization) * 0.6);
    
    // Dynamic resource counts with realistic fluctuations
    const idleResources = Math.max(0, Math.round(this.baseMetrics.idleResources + this.generateGaussianNoise(0, 3)));
    const oversizedResources = Math.max(0, Math.round(this.baseMetrics.oversizedResources + this.generateGaussianNoise(0, 4)));
    
    return {
      totalCost,
      estimatedSavings: potentialSavings,
      idleResources,
      oversizedResources,
      utilizationRate: Math.round(currentUtilization * 100) / 100,
      lastUpdated: currentTime
    };
  }

  // Generate cost trends with ML patterns
  generateCostTrends() {
    const trends = this.generateTimeSeries(this.baseMetrics.totalCost, 6, 0.08);
    return this.detectAnomalies(trends);
  }

  // Generate intelligent recommendations using ML insights
  generateRecommendations() {
    const overview = this.generateCostOverview();
    const recommendations = [];
    
    // Rule-based ML recommendations
    if (overview.idleResources > 10) {
      recommendations.push({
        id: crypto.randomUUID(),
        title: 'Optimize idle resources',
        description: `${overview.idleResources} resources detected as idle. Consider auto-scaling or termination.`,
        estimatedSavings: Math.round(overview.idleResources * 45.5 + this.generateGaussianNoise(0, 50)),
        difficulty: 'Easy',
        impact: 'High',
        confidence: 0.85 + Math.random() * 0.1,
        category: 'Resource Optimization'
      });
    }
    
    if (overview.oversizedResources > 15) {
      recommendations.push({
        id: crypto.randomUUID(),
        title: 'Rightsize oversized instances',
        description: `${overview.oversizedResources} instances are oversized based on usage patterns.`,
        estimatedSavings: Math.round(overview.oversizedResources * 65.3 + this.generateGaussianNoise(0, 80)),
        difficulty: 'Medium',
        impact: 'High',
        confidence: 0.78 + Math.random() * 0.15,
        category: 'Instance Optimization'
      });
    }
    
    if (overview.utilizationRate < 0.6) {
      recommendations.push({
        id: crypto.randomUUID(),
        title: 'Implement auto-scaling policies',
        description: `Low utilization rate (${Math.round(overview.utilizationRate * 100)}%) detected. Auto-scaling can optimize costs.`,
        estimatedSavings: Math.round(overview.totalCost * 0.15 + this.generateGaussianNoise(0, 100)),
        difficulty: 'Medium',
        impact: 'Medium',
        confidence: 0.72 + Math.random() * 0.18,
        category: 'Automation'
      });
    }
    
    // Always include some storage optimization
    recommendations.push({
      id: crypto.randomUUID(),
      title: 'Optimize storage lifecycle',
      description: 'Implement intelligent tiering for infrequently accessed data.',
      estimatedSavings: Math.round(200 + this.generateGaussianNoise(0, 150)),
      difficulty: 'Easy',
      impact: 'Medium',
      confidence: 0.88 + Math.random() * 0.08,
      category: 'Storage Optimization'
    });
    
    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  // Generate savings by resource type
  generateSavingsByResource() {
    const overview = this.generateCostOverview();
    const totalSavings = overview.estimatedSavings;
    
    return this.resourceTypes.map(resource => {
      const baseWeight = Math.random();
      const seasonalFactor = this.getSeasonalFactor();
      const savings = Math.round((totalSavings * baseWeight * seasonalFactor) / 3);
      
      return {
        resource,
        savings: Math.max(10, savings),
        utilizationRate: Math.round((0.4 + Math.random() * 0.5) * 100) / 100,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
      };
    }).sort((a, b) => b.savings - a.savings).slice(0, 5);
  }

  // Generate projected costs with ML forecasting
  generateProjectedCost() {
    const overview = this.generateCostOverview();
    const currentCost = overview.totalCost;
    const potentialSavings = overview.estimatedSavings;
    
    // ML-based projection considering implementation probability
    const implementationRate = 0.7; // 70% of recommendations typically get implemented
    const actualSavings = Math.round(potentialSavings * implementationRate);
    
    return {
      current: currentCost,
      recommended: Math.max(0, currentCost - actualSavings),
      projectedSavings: actualSavings,
      confidence: 0.82 + Math.random() * 0.15,
      timeframe: '3 months'
    };
  }

  // Generate comprehensive real-time data
  generateRealTimeData() {
    return {
      overview: this.generateCostOverview(),
      trends: this.generateCostTrends(),
      recommendations: this.generateRecommendations(),
      savingsByResource: this.generateSavingsByResource(),
      projectedCost: this.generateProjectedCost(),
      metadata: {
        generatedAt: Date.now(),
        algorithm: 'ML-TimeSeries-v1.0',
        confidence: 0.85 + Math.random() * 0.1
      }
    };
  }

  // Simulate real-time updates
  startRealTimeUpdates(callback, interval = 30000) { // Update every 30 seconds
    const updateData = () => {
      const data = this.generateRealTimeData();
      callback(data);
    };
    
    // Initial data
    updateData();
    
    // Set up interval for continuous updates
    return setInterval(updateData, interval);
  }
}

module.exports = MLDataGenerator;