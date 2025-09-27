class PersonalizedMLAnalyzer {
  constructor() {
    this.industryBenchmarks = {
      'Technology': { avgUtilization: 65, costPerEmployee: 450 },
      'Healthcare': { avgUtilization: 55, costPerEmployee: 320 },
      'Finance': { avgUtilization: 70, costPerEmployee: 520 },
      'E-commerce': { avgUtilization: 80, costPerEmployee: 380 },
      'Education': { avgUtilization: 45, costPerEmployee: 180 },
      'Manufacturing': { avgUtilization: 60, costPerEmployee: 290 },
      'Media': { avgUtilization: 75, costPerEmployee: 410 },
      'Government': { avgUtilization: 40, costPerEmployee: 250 },
      'Startup': { avgUtilization: 85, costPerEmployee: 200 },
      'Other': { avgUtilization: 60, costPerEmployee: 350 }
    };

    this.companySizeMultipliers = {
      'startup': { efficiency: 0.7, overhead: 1.3 },
      'small': { efficiency: 0.8, overhead: 1.2 },
      'medium': { efficiency: 0.9, overhead: 1.1 },
      'large': { efficiency: 1.0, overhead: 1.0 },
      'enterprise': { efficiency: 1.1, overhead: 0.9 }
    };

    this.regionCostMultipliers = {
      'us-east-1': 1.0,
      'us-west-2': 1.05,
      'eu-west-1': 1.15,
      'ap-southeast-1': 1.08,
      'ap-northeast-1': 1.12
    };

    this.instanceCosts = {
      // EC2 hourly costs (approximate)
      't3.micro': 0.0104,
      't3.small': 0.0208,
      't3.medium': 0.0416,
      't3.large': 0.0832,
      'm5.large': 0.096,
      'm5.xlarge': 0.192,
      'c5.large': 0.085,
      'r5.large': 0.126,
      // RDS hourly costs (approximate)
      'db.t3.micro': 0.017,
      'db.t3.small': 0.034,
      'db.t3.medium': 0.068,
      'db.m5.large': 0.192,
      'db.r5.large': 0.24
    };
  }

  analyzeUserInput(userData) {
    try {
      console.log('Starting analyzeUserInput with data:', JSON.stringify(userData, null, 2));
      
      const totalCost = this.calculateTotalCost(userData);
      console.log('Total cost calculated:', totalCost);
      
      const estimatedSavings = this.calculateEstimatedSavings(userData);
      console.log('Estimated savings calculated:', estimatedSavings);
      
      const optimizationScore = this.calculateOptimizationScore(userData);
      console.log('Optimization score calculated:', optimizationScore);
      
      const insights = this.generateQuickInsights(userData);
      console.log('Insights generated:', insights);
      
      const costTrends = this.generateCostTrends(userData);
      console.log('Cost trends generated:', costTrends);
      
      const resourceStatus = this.generateResourceStatusOverview(userData);
      console.log('Resource status generated:', resourceStatus);
      
      const recommendations = this.generatePersonalizedRecommendations(userData);
      console.log('Recommendations generated:', recommendations);
      
      const savingsByResource = this.calculateSavingsByResource(userData);
      console.log('Savings by resource calculated:', savingsByResource);
      
      const projectedCost = this.calculateProjectedCost(userData);
      console.log('Projected cost calculated:', projectedCost);

      return {
        totalCost,
        estimatedSavings,
        optimizationScore,
        insights,
        costTrends,
        resourceStatus,
        recommendations,
        savingsByResource,
        projectedCost
      };
    } catch (error) {
      console.error('Error in analyzeUserInput:', error);
      throw error;
    }
  }

  calculateTotalCost(userData) {
    let totalCost = 0;
    const allResources = [
      ...(userData.ec2Instances || []),
      ...(userData.rdsInstances || []),
      ...(userData.s3Buckets || []),
      ...(userData.lambdaFunctions || [])
    ];

    allResources.forEach(resource => {
      const baseCost = parseFloat(resource.monthlyCost) || 0;
      const regionMultiplier = this.regionCostMultipliers[resource.region] || 1.0;
      totalCost += baseCost * regionMultiplier;
    });

    // Add overhead based on company size
    const sizeMultiplier = this.companySizeMultipliers[userData.companySize]?.overhead || 1.0;
    totalCost *= sizeMultiplier;

    return Math.round(totalCost * 100) / 100;
  }

  calculateEstimatedSavings(userData) {
    const totalCost = this.calculateTotalCost(userData);
    const idleResources = this.identifyIdleResources(userData);
    const oversizedResources = this.identifyOversizedResources(userData);
    
    let potentialSavings = 0;
    
    // Savings from idle resources (can save 80-90%)
    potentialSavings += idleResources.reduce((sum, resource) => {
      return sum + (parseFloat(resource.monthlyCost) * 0.85);
    }, 0);
    
    // Savings from oversized resources (can save 30-50%)
    potentialSavings += oversizedResources.reduce((sum, resource) => {
      return sum + (parseFloat(resource.monthlyCost) * 0.4);
    }, 0);
    
    // Additional optimization based on usage patterns
    if (!userData.weekendUsage) {
      potentialSavings += totalCost * 0.15; // 15% savings from weekend shutdown
    }
    
    if (userData.businessHours && userData.businessHours.end && userData.businessHours.start && userData.businessHours.end - userData.businessHours.start < 12) {
      potentialSavings += totalCost * 0.1; // 10% savings from off-hours optimization
    }

    return Math.min(potentialSavings, totalCost * 0.6); // Cap at 60% savings
  }

  identifyIdleResources(userData) {
    const allResources = [
      ...(userData.ec2Instances || []),
      ...(userData.rdsInstances || []),
      ...(userData.s3Buckets || []),
      ...(userData.lambdaFunctions || [])
    ];

    return allResources.filter(resource => {
      const utilization = resource.utilizationRate || 50;
      return utilization < 20; // Consider resources with <20% utilization as idle
    });
  }

  identifyOversizedResources(userData) {
    const allResources = [
      ...(userData.ec2Instances || []),
      ...(userData.rdsInstances || [])
    ];

    return allResources.filter(resource => {
      try {
        const utilization = resource.utilizationRate || 50;
        const instanceType = resource.instanceType || resource.type || '';
        
        // Convert to string and check for large instance types
        const typeStr = String(instanceType).toLowerCase();
        const isLargeInstance = typeStr.indexOf('large') !== -1 || 
                               typeStr.indexOf('xlarge') !== -1 || 
                               typeStr.indexOf('2xlarge') !== -1;
        
        return utilization < 60 && isLargeInstance;
      } catch (error) {
        console.error('Error in identifyOversizedResources filter:', error, resource);
        return false;
      }
    });
  }

  calculateOptimizationScore(userData) {
    const totalResources = (userData.ec2Instances || []).length + (userData.rdsInstances || []).length + 
                          (userData.s3Buckets || []).length + (userData.lambdaFunctions || []).length;
    
    if (totalResources === 0) return 0;

    const idleCount = this.identifyIdleResources(userData).length;
    const oversizedCount = this.identifyOversizedResources(userData).length;
    
    // Calculate average utilization
    const allResources = [
      ...(userData.ec2Instances || []),
      ...(userData.rdsInstances || []),
      ...(userData.s3Buckets || []),
      ...(userData.lambdaFunctions || [])
    ];
    
    const avgUtilization = allResources.reduce((sum, resource) => {
      return sum + (resource.utilizationRate || 50);
    }, 0) / totalResources;

    // Score based on utilization efficiency and resource optimization
    let score = avgUtilization;
    score -= (idleCount / totalResources) * 30; // Penalty for idle resources
    score -= (oversizedCount / totalResources) * 20; // Penalty for oversized resources
    
    // Bonus for good practices
    if (userData.weekendUsage === false) score += 5;
    if (userData.businessHours && userData.businessHours.end && userData.businessHours.start) {
      if (userData.businessHours.end - userData.businessHours.start < 12) score += 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  generateQuickInsights(userData) {
    const insights = [];
    const idleResources = this.identifyIdleResources(userData);
    const oversizedResources = this.identifyOversizedResources(userData);
    const totalCost = this.calculateTotalCost(userData);
    const estimatedSavings = this.calculateEstimatedSavings(userData);

    if (idleResources.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Idle Resources Detected',
        message: `${idleResources.length} resources are underutilized (<20% usage)`
      });
    }

    if (oversizedResources.length > 0) {
      insights.push({
        type: 'info',
        title: 'Right-sizing Opportunity',
        message: `${oversizedResources.length} resources could be downsized`
      });
    }

    if (estimatedSavings > totalCost * 0.3) {
      insights.push({
        type: 'success',
        title: 'High Savings Potential',
        message: `Up to ${Math.round((estimatedSavings/totalCost)*100)}% cost reduction possible`
      });
    }

    if (!userData.weekendUsage) {
      insights.push({
        type: 'info',
        title: 'Weekend Optimization',
        message: 'Consider auto-scaling down resources during weekends'
      });
    }

    return insights;
  }

  generateCostTrends(userData) {
    const currentCost = this.calculateTotalCost(userData);
    const trends = [];
    
    // Generate 12 months of trend data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // Simulate cost variation based on company growth and seasonality
      let costVariation = 1.0;
      
      if (userData.seasonalVariation) {
        // Add seasonal variation (higher in Q4, lower in Q1)
        const month = date.getMonth();
        if (month >= 9) costVariation *= 1.15; // Q4 spike
        if (month <= 2) costVariation *= 0.9;  // Q1 dip
      }
      
      // Add growth trend
      const monthsAgo = i;
      const growthRate = (userData.expectedGrowth || 10) / 100 / 12; // Monthly growth
      costVariation *= Math.pow(1 + growthRate, -monthsAgo);
      
      // Add some randomness
      costVariation *= (0.9 + Math.random() * 0.2);
      
      trends.push({
        month: date.toISOString().slice(0, 7),
        cost: Math.round(currentCost * costVariation),
        optimizedCost: Math.round(currentCost * costVariation * 0.7) // 30% optimization
      });
    }
    
    return trends;
  }

  calculateSavingsByResource(userData) {
    const savings = [];
    
    // EC2 Savings
    if ((userData.ec2Instances || []).length > 0) {
      const ec2Cost = (userData.ec2Instances || []).reduce((sum, instance) => 
        sum + parseFloat(instance.monthlyCost || 0), 0);
      const ec2Savings = ec2Cost * 0.35; // 35% average savings for EC2
      savings.push({
        resourceType: 'EC2 Instances',
        currentCost: ec2Cost,
        potentialSavings: ec2Savings,
        optimizationMethods: ['Right-sizing', 'Reserved Instances', 'Spot Instances']
      });
    }
    
    // RDS Savings
    if ((userData.rdsInstances || []).length > 0) {
      const rdsCost = (userData.rdsInstances || []).reduce((sum, instance) => 
        sum + parseFloat(instance.monthlyCost || 0), 0);
      const rdsSavings = rdsCost * 0.25; // 25% average savings for RDS
      savings.push({
        resourceType: 'RDS Databases',
        currentCost: rdsCost,
        potentialSavings: rdsSavings,
        optimizationMethods: ['Reserved Instances', 'Storage Optimization', 'Multi-AZ Review']
      });
    }
    
    // S3 Savings
    if ((userData.s3Buckets || []).length > 0) {
      const s3Cost = (userData.s3Buckets || []).reduce((sum, bucket) => 
        sum + parseFloat(bucket.monthlyCost || 0), 0);
      const s3Savings = s3Cost * 0.4; // 40% average savings for S3
      savings.push({
        resourceType: 'S3 Storage',
        currentCost: s3Cost,
        potentialSavings: s3Savings,
        optimizationMethods: ['Lifecycle Policies', 'Storage Classes', 'Data Deduplication']
      });
    }
    
    // Lambda Savings
    if ((userData.lambdaFunctions || []).length > 0) {
      const lambdaCost = (userData.lambdaFunctions || []).reduce((sum, func) => 
        sum + parseFloat(func.monthlyCost || 0), 0);
      const lambdaSavings = lambdaCost * 0.2; // 20% average savings for Lambda
      savings.push({
        resourceType: 'Lambda Functions',
        currentCost: lambdaCost,
        potentialSavings: lambdaSavings,
        optimizationMethods: ['Memory Optimization', 'Provisioned Concurrency', 'Cold Start Reduction']
      });
    }
    
    return savings;
  }

  calculateProjectedCost(userData) {
    const currentCost = this.calculateTotalCost(userData);
    const growthRate = (userData.expectedGrowth || 10) / 100;
    const projections = [];
    
    for (let months = 1; months <= 12; months++) {
      const projectedCost = currentCost * Math.pow(1 + growthRate/12, months);
      const optimizedCost = projectedCost * 0.7; // 30% optimization
      
      projections.push({
        month: months,
        projectedCost: Math.round(projectedCost),
        optimizedCost: Math.round(optimizedCost),
        savings: Math.round(projectedCost - optimizedCost)
      });
    }
    
    return projections;
  }

  generateResourceStatusOverview(userData) {
    const allResources = [
      ...(userData.ec2Instances || []),
      ...(userData.rdsInstances || []),
      ...(userData.s3Buckets || []),
      ...(userData.lambdaFunctions || [])
    ];

    const statusOverview = {
      total: allResources.length,
      optimized: 0,
      needsAttention: 0,
      idle: 0,
      oversized: 0
    };

    allResources.forEach(resource => {
      const utilization = resource.utilizationRate || 50;
      
      if (utilization < 20) {
        statusOverview.idle++;
        statusOverview.needsAttention++;
      } else if (utilization > 80) {
        statusOverview.optimized++;
      } else if (utilization < 60 && (() => {
        const instanceType = resource.instanceType || resource.type || '';
        const typeStr = String(instanceType).toLowerCase();
        return typeStr.indexOf('large') !== -1 || typeStr.indexOf('xlarge') !== -1;
      })()) {
        statusOverview.oversized++;
        statusOverview.needsAttention++;
      } else {
        statusOverview.optimized++;
      }
    });

    return statusOverview;
  }

  generatePersonalizedRecommendations(userData) {
    const recommendations = [];
    const idleResources = this.identifyIdleResources(userData);
    const oversizedResources = this.identifyOversizedResources(userData);
    
    // Idle resource recommendations
    if (idleResources.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Resource Optimization',
        title: 'Terminate or Resize Idle Resources',
        description: `${idleResources.length} resources are running with very low utilization (<20%)`,
        potentialSavings: idleResources.reduce((sum, r) => sum + parseFloat(r.monthlyCost || 0), 0) * 0.8,
        effort: 'Low',
        timeframe: 'Immediate'
      });
    }
    
    // Oversized resource recommendations
    if (oversizedResources.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Right-sizing',
        title: 'Downsize Oversized Instances',
        description: `${oversizedResources.length} instances could be downsized based on current usage patterns`,
        potentialSavings: oversizedResources.reduce((sum, r) => sum + parseFloat(r.monthlyCost || 0), 0) * 0.4,
        effort: 'Medium',
        timeframe: '1-2 weeks'
      });
    }
    
    // Reserved instance recommendations
    const stableResources = userData.ec2Instances.filter(instance => 
      (instance.utilizationRate || 50) > 60
    );
    if (stableResources.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Cost Optimization',
        title: 'Purchase Reserved Instances',
        description: `${stableResources.length} stable instances could benefit from Reserved Instance pricing`,
        potentialSavings: stableResources.reduce((sum, r) => sum + parseFloat(r.monthlyCost || 0), 0) * 0.3,
        effort: 'Low',
        timeframe: '1 week'
      });
    }
    
    // Auto-scaling recommendations
    if (!userData.weekendUsage) {
      recommendations.push({
        priority: 'low',
        category: 'Automation',
        title: 'Implement Weekend Auto-scaling',
        description: 'Automatically scale down resources during weekends to reduce costs',
        potentialSavings: this.calculateTotalCost(userData) * 0.15,
        effort: 'High',
        timeframe: '2-4 weeks'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  compareToBenchmarks(userData) {
    const industry = userData.industry || 'Other';
    const benchmark = this.industryBenchmarks[industry];
    const totalCost = this.calculateTotalCost(userData);
    
    // Calculate average utilization
    const allResources = [
      ...userData.ec2Instances,
      ...userData.rdsInstances,
      ...userData.s3Buckets,
      ...userData.lambdaFunctions
    ];
    
    const avgUtilization = allResources.length > 0 ? 
      allResources.reduce((sum, resource) => sum + (resource.utilizationRate || 50), 0) / allResources.length : 0;
    
    return {
      industry,
      yourUtilization: Math.round(avgUtilization),
      industryAvgUtilization: benchmark.avgUtilization,
      utilizationComparison: avgUtilization > benchmark.avgUtilization ? 'above' : 'below',
      costPerEmployee: userData.companySize ? this.estimateCostPerEmployee(totalCost, userData.companySize) : null,
      industryCostPerEmployee: benchmark.costPerEmployee,
      recommendations: this.generateBenchmarkRecommendations(avgUtilization, benchmark)
    };
  }

  estimateCostPerEmployee(totalCost, companySize) {
    const employeeCounts = {
      'startup': 5,
      'small': 30,
      'medium': 125,
      'large': 600,
      'enterprise': 2000
    };
    
    const estimatedEmployees = employeeCounts[companySize] || 100;
    return Math.round(totalCost / estimatedEmployees);
  }

  generateBenchmarkRecommendations(yourUtilization, benchmark) {
    const recommendations = [];
    
    if (yourUtilization < benchmark.avgUtilization - 10) {
      recommendations.push('Focus on improving resource utilization to match industry standards');
    }
    
    if (yourUtilization > benchmark.avgUtilization + 15) {
      recommendations.push('Consider scaling up resources to avoid performance bottlenecks');
    }
    
    return recommendations;
  }
}

module.exports = PersonalizedMLAnalyzer;