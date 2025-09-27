const crypto = require('crypto');

class ResourceUsageSimulator {
  constructor() {
    this.resourceTypes = {
      'EC2': {
        baseUtilization: 0.65,
        volatility: 0.15,
        costPerHour: 0.10,
        scalingFactor: 1.2,
        optimizationPotential: 0.25
      },
      'EBS': {
        baseUtilization: 0.45,
        volatility: 0.08,
        costPerHour: 0.05,
        scalingFactor: 1.1,
        optimizationPotential: 0.35
      },
      'S3': {
        baseUtilization: 0.70,
        volatility: 0.12,
        costPerHour: 0.02,
        scalingFactor: 1.05,
        optimizationPotential: 0.40
      },
      'RDS': {
        baseUtilization: 0.55,
        volatility: 0.10,
        costPerHour: 0.25,
        scalingFactor: 1.3,
        optimizationPotential: 0.20
      },
      'Lambda': {
        baseUtilization: 0.85,
        volatility: 0.20,
        costPerHour: 0.001,
        scalingFactor: 2.0,
        optimizationPotential: 0.15
      },
      'CloudFront': {
        baseUtilization: 0.60,
        volatility: 0.18,
        costPerHour: 0.08,
        scalingFactor: 1.15,
        optimizationPotential: 0.30
      }
    };
    
    this.workloadPatterns = {
      'business_hours': {
        peak_hours: [9, 10, 11, 14, 15, 16],
        peak_multiplier: 1.5,
        off_hours_multiplier: 0.3
      },
      'web_traffic': {
        peak_hours: [12, 13, 19, 20, 21],
        peak_multiplier: 2.0,
        off_hours_multiplier: 0.4
      },
      'batch_processing': {
        peak_hours: [2, 3, 4, 22, 23],
        peak_multiplier: 3.0,
        off_hours_multiplier: 0.1
      },
      'continuous': {
        peak_hours: [],
        peak_multiplier: 1.0,
        off_hours_multiplier: 0.9
      }
    };
    
    this.instances = this.initializeInstances();
  }

  // Initialize simulated instances
  initializeInstances() {
    const instances = [];
    const resourceTypes = Object.keys(this.resourceTypes);
    
    for (let i = 0; i < 50; i++) {
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const workloadPattern = Object.keys(this.workloadPatterns)[Math.floor(Math.random() * 4)];
      
      instances.push({
        id: crypto.randomUUID(),
        name: `${resourceType}-instance-${i + 1}`,
        type: resourceType,
        region: this.getRandomRegion(),
        workloadPattern: workloadPattern,
        baseCapacity: Math.round(10 + Math.random() * 90), // 10-100 units
        currentUtilization: 0,
        costPerHour: this.resourceTypes[resourceType].costPerHour * (0.8 + Math.random() * 0.4),
        tags: this.generateTags(),
        createdAt: Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000, // Created within last 90 days
        lastOptimized: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Last optimized within 30 days
      });
    }
    
    return instances;
  }

  // Generate random AWS regions
  getRandomRegion() {
    const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  // Generate realistic tags
  generateTags() {
    const environments = ['production', 'staging', 'development', 'testing'];
    const teams = ['frontend', 'backend', 'data', 'ml', 'devops'];
    const projects = ['web-app', 'api-service', 'data-pipeline', 'ml-model', 'monitoring'];
    
    return {
      Environment: environments[Math.floor(Math.random() * environments.length)],
      Team: teams[Math.floor(Math.random() * teams.length)],
      Project: projects[Math.floor(Math.random() * projects.length)],
      Owner: `user${Math.floor(Math.random() * 20) + 1}@company.com`
    };
  }

  // Generate Gaussian noise
  generateGaussianNoise(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  // Calculate workload multiplier based on time and pattern
  getWorkloadMultiplier(workloadPattern, timestamp = Date.now()) {
    const hour = new Date(timestamp).getHours();
    const pattern = this.workloadPatterns[workloadPattern];
    
    if (pattern.peak_hours.includes(hour)) {
      return pattern.peak_multiplier;
    } else {
      return pattern.off_hours_multiplier;
    }
  }

  // Simulate real-time utilization for an instance
  simulateInstanceUtilization(instance, timestamp = Date.now()) {
    const resourceConfig = this.resourceTypes[instance.type];
    const workloadMultiplier = this.getWorkloadMultiplier(instance.workloadPattern, timestamp);
    const noise = this.generateGaussianNoise(0, resourceConfig.volatility);
    
    // Base utilization with workload pattern and noise
    let utilization = resourceConfig.baseUtilization * workloadMultiplier * (1 + noise);
    
    // Add some randomness for special events (deployments, traffic spikes, etc.)
    if (Math.random() < 0.05) { // 5% chance of special event
      utilization *= (1.5 + Math.random() * 0.5); // 150-200% spike
    }
    
    // Ensure utilization stays within realistic bounds
    utilization = Math.max(0.01, Math.min(0.98, utilization));
    
    return Math.round(utilization * 100) / 100;
  }

  // Calculate current cost for an instance
  calculateInstanceCost(instance, utilization) {
    const baseCost = instance.costPerHour * instance.baseCapacity;
    const utilizationFactor = Math.max(0.1, utilization); // Minimum 10% cost even when idle
    return Math.round(baseCost * utilizationFactor * 100) / 100;
  }

  // Identify optimization opportunities for an instance
  identifyOptimizations(instance, utilization) {
    const optimizations = [];
    const resourceConfig = this.resourceTypes[instance.type];
    
    // Idle resource detection
    if (utilization < 0.05) {
      optimizations.push({
        type: 'idle_resource',
        severity: 'high',
        description: `${instance.name} has been idle (${Math.round(utilization * 100)}% utilization)`,
        potentialSavings: instance.costPerHour * instance.baseCapacity * 24 * 30 * 0.9,
        action: 'Consider terminating or scheduling shutdown'
      });
    }
    
    // Oversized resource detection
    if (utilization < 0.3 && instance.baseCapacity > 20) {
      const rightsizedCapacity = Math.ceil(instance.baseCapacity * utilization / 0.7);
      const savings = (instance.baseCapacity - rightsizedCapacity) * instance.costPerHour * 24 * 30;
      
      optimizations.push({
        type: 'oversized_resource',
        severity: 'medium',
        description: `${instance.name} is oversized (${Math.round(utilization * 100)}% utilization)`,
        potentialSavings: savings,
        action: `Rightsize from ${instance.baseCapacity} to ${rightsizedCapacity} units`
      });
    }
    
    // Underutilized but not idle
    if (utilization > 0.05 && utilization < 0.4) {
      optimizations.push({
        type: 'underutilized',
        severity: 'low',
        description: `${instance.name} is underutilized (${Math.round(utilization * 100)}% utilization)`,
        potentialSavings: instance.costPerHour * instance.baseCapacity * 24 * 30 * 0.3,
        action: 'Consider auto-scaling or workload consolidation'
      });
    }
    
    // Storage optimization for EBS and S3
    if (instance.type === 'EBS' || instance.type === 'S3') {
      optimizations.push({
        type: 'storage_optimization',
        severity: 'low',
        description: `${instance.name} may benefit from lifecycle policies`,
        potentialSavings: instance.costPerHour * instance.baseCapacity * 24 * 30 * 0.2,
        action: 'Implement intelligent tiering or lifecycle policies'
      });
    }
    
    return optimizations;
  }

  // Generate real-time resource usage data
  generateRealTimeUsage(timestamp = Date.now()) {
    const usageData = this.instances.map(instance => {
      const utilization = this.simulateInstanceUtilization(instance, timestamp);
      const cost = this.calculateInstanceCost(instance, utilization);
      const optimizations = this.identifyOptimizations(instance, utilization);
      
      return {
        ...instance,
        currentUtilization: utilization,
        currentCost: cost,
        optimizations: optimizations,
        status: this.getInstanceStatus(utilization),
        lastUpdated: timestamp
      };
    });
    
    return usageData;
  }

  // Determine instance status based on utilization
  getInstanceStatus(utilization) {
    if (utilization < 0.05) return 'idle';
    if (utilization < 0.3) return 'underutilized';
    if (utilization < 0.7) return 'optimal';
    if (utilization < 0.9) return 'high_usage';
    return 'overloaded';
  }

  // Generate aggregated usage statistics
  generateUsageStatistics(usageData) {
    const totalInstances = usageData.length;
    const totalCost = usageData.reduce((sum, instance) => sum + instance.currentCost, 0);
    const avgUtilization = usageData.reduce((sum, instance) => sum + instance.currentUtilization, 0) / totalInstances;
    
    // Count instances by status
    const statusCounts = usageData.reduce((counts, instance) => {
      counts[instance.status] = (counts[instance.status] || 0) + 1;
      return counts;
    }, {});
    
    // Calculate potential savings
    const totalOptimizations = usageData.reduce((sum, instance) => {
      return sum + instance.optimizations.reduce((optSum, opt) => optSum + opt.potentialSavings, 0);
    }, 0);
    
    // Resource type breakdown
    const resourceBreakdown = usageData.reduce((breakdown, instance) => {
      if (!breakdown[instance.type]) {
        breakdown[instance.type] = {
          count: 0,
          totalCost: 0,
          avgUtilization: 0,
          optimizationOpportunities: 0
        };
      }
      
      breakdown[instance.type].count++;
      breakdown[instance.type].totalCost += instance.currentCost;
      breakdown[instance.type].avgUtilization += instance.currentUtilization;
      breakdown[instance.type].optimizationOpportunities += instance.optimizations.length;
      
      return breakdown;
    }, {});
    
    // Calculate averages for resource breakdown
    Object.keys(resourceBreakdown).forEach(type => {
      const data = resourceBreakdown[type];
      data.avgUtilization = Math.round((data.avgUtilization / data.count) * 100) / 100;
      data.totalCost = Math.round(data.totalCost * 100) / 100;
    });
    
    return {
      summary: {
        totalInstances,
        totalCost: Math.round(totalCost * 100) / 100,
        avgUtilization: Math.round(avgUtilization * 100) / 100,
        potentialSavings: Math.round(totalOptimizations * 100) / 100
      },
      statusDistribution: statusCounts,
      resourceBreakdown,
      topOptimizations: this.getTopOptimizations(usageData),
      utilizationTrend: this.generateUtilizationTrend(),
      lastUpdated: Date.now()
    };
  }

  // Get top optimization opportunities
  getTopOptimizations(usageData) {
    const allOptimizations = usageData.reduce((all, instance) => {
      return all.concat(instance.optimizations.map(opt => ({
        ...opt,
        instanceName: instance.name,
        instanceType: instance.type
      })));
    }, []);
    
    return allOptimizations
      .sort((a, b) => b.potentialSavings - a.potentialSavings)
      .slice(0, 10);
  }

  // Generate utilization trend data
  generateUtilizationTrend() {
    const hours = 24;
    const trend = [];
    
    for (let i = 0; i < hours; i++) {
      const timestamp = Date.now() - (hours - i - 1) * 60 * 60 * 1000;
      const hour = new Date(timestamp).getHours();
      
      // Simulate average utilization for that hour
      let avgUtilization = 0.5; // Base utilization
      
      // Business hours pattern
      if (hour >= 9 && hour <= 17) {
        avgUtilization *= 1.3;
      } else if (hour >= 22 || hour <= 6) {
        avgUtilization *= 0.6;
      }
      
      // Add some noise
      avgUtilization += this.generateGaussianNoise(0, 0.1);
      avgUtilization = Math.max(0.1, Math.min(0.9, avgUtilization));
      
      trend.push({
        timestamp,
        hour: hour,
        utilization: Math.round(avgUtilization * 100) / 100
      });
    }
    
    return trend;
  }

  // Simulate resource scaling events
  simulateScalingEvents() {
    const events = [];
    const eventTypes = ['scale_up', 'scale_down', 'auto_scale', 'manual_intervention'];
    
    // Generate 3-5 recent scaling events
    for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
      const instance = this.instances[Math.floor(Math.random() * this.instances.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const timestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000; // Within last week
      
      events.push({
        id: crypto.randomUUID(),
        timestamp,
        instanceId: instance.id,
        instanceName: instance.name,
        eventType,
        description: this.generateEventDescription(eventType, instance),
        impact: this.calculateEventImpact(eventType, instance)
      });
    }
    
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Generate event descriptions
  generateEventDescription(eventType, instance) {
    switch (eventType) {
      case 'scale_up':
        return `Scaled up ${instance.name} due to high utilization`;
      case 'scale_down':
        return `Scaled down ${instance.name} due to low utilization`;
      case 'auto_scale':
        return `Auto-scaling triggered for ${instance.name}`;
      case 'manual_intervention':
        return `Manual scaling adjustment for ${instance.name}`;
      default:
        return `Scaling event for ${instance.name}`;
    }
  }

  // Calculate event impact
  calculateEventImpact(eventType, instance) {
    const baseCost = instance.costPerHour * instance.baseCapacity;
    
    switch (eventType) {
      case 'scale_up':
        return { costChange: baseCost * 0.3, performanceChange: 'improved' };
      case 'scale_down':
        return { costChange: -baseCost * 0.2, performanceChange: 'maintained' };
      case 'auto_scale':
        return { costChange: baseCost * 0.1, performanceChange: 'optimized' };
      case 'manual_intervention':
        return { costChange: -baseCost * 0.15, performanceChange: 'improved' };
      default:
        return { costChange: 0, performanceChange: 'unchanged' };
    }
  }

  // Get comprehensive resource simulation data
  getSimulationData() {
    const usageData = this.generateRealTimeUsage();
    const statistics = this.generateUsageStatistics(usageData);
    const scalingEvents = this.simulateScalingEvents();
    
    return {
      instances: usageData,
      statistics,
      scalingEvents,
      metadata: {
        simulationTime: Date.now(),
        totalInstances: this.instances.length,
        resourceTypes: Object.keys(this.resourceTypes),
        workloadPatterns: Object.keys(this.workloadPatterns)
      }
    };
  }
}

module.exports = ResourceUsageSimulator;