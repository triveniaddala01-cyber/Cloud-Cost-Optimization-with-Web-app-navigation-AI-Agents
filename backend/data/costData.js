// Enhanced cost data for the cloud cost optimizer application
const costData = {
  totalCost: 12500.75,
  estimatedSavings: 3750.25,
  idleResources: 15,
  oversizedResources: 23,
  
  costTrends: [
    { month: 'Jan', cost: 10200.50 },
    { month: 'Feb', cost: 11300.75 },
    { month: 'Mar', cost: 10800.25 },
    { month: 'Apr', cost: 11500.00 },
    { month: 'May', cost: 12000.50 },
    { month: 'Jun', cost: 12500.75 }
  ],
  
  recommendations: [
    {
      id: 1,
      title: 'Rightsize EC2 instances',
      description: 'Downsize 8 EC2 instances from t3.large to t3.medium based on usage patterns',
      estimatedSavings: 1250.50,
      difficulty: 'Easy',
      impact: 'Medium'
    },
    {
      id: 2,
      title: 'Remove unused EBS volumes',
      description: 'Delete 12 unattached EBS volumes that have been idle for over 30 days',
      estimatedSavings: 850.25,
      difficulty: 'Easy',
      impact: 'Low'
    },
    {
      id: 3,
      title: 'Implement S3 lifecycle policies',
      description: 'Move infrequently accessed data to cheaper storage tiers',
      estimatedSavings: 950.75,
      difficulty: 'Medium',
      impact: 'High'
    },
    {
      id: 4,
      title: 'Reserved Instances purchase',
      description: 'Convert 15 on-demand instances to reserved instances',
      estimatedSavings: 2200.00,
      difficulty: 'Medium',
      impact: 'High'
    }
  ],
  
  savingsByResource: [
    { resource: 'EC2', savings: 1850.50 },
    { resource: 'EBS', savings: 850.25 },
    { resource: 'S3', savings: 950.75 },
    { resource: 'RDS', savings: 650.30 },
    { resource: 'Other', savings: 450.45 }
  ],
  
  projectedCost: [
    { month: 'Jul', current: 12500.75, optimized: 10500.50 },
    { month: 'Aug', current: 13000.25, optimized: 10800.75 },
    { month: 'Sep', current: 13500.50, optimized: 11200.25 }
  ],

  // Enhanced features data
  costByEnvironment: [
    { environment: 'Production', cost: 7500.45, percentage: 60 },
    { environment: 'Staging', cost: 2500.15, percentage: 20 },
    { environment: 'Development', cost: 1875.10, percentage: 15 },
    { environment: 'Testing', cost: 625.05, percentage: 5 }
  ],

  costByTags: [
    { tag: 'project-alpha', cost: 4200.30, resources: 45 },
    { tag: 'project-beta', cost: 3150.25, resources: 32 },
    { tag: 'shared-services', cost: 2800.15, resources: 28 },
    { tag: 'legacy-systems', cost: 2350.05, resources: 18 }
  ],

  reservedInstanceCoverage: {
    totalUsage: 12500.75,
    reservedCoverage: 8750.50,
    onDemandCost: 3750.25,
    coveragePercentage: 70,
    potentialSavings: 1125.08,
    recommendations: [
      {
        instanceType: 't3.large',
        currentOnDemand: 15,
        recommendedReserved: 12,
        monthlySavings: 450.25
      },
      {
        instanceType: 'm5.xlarge',
        currentOnDemand: 8,
        recommendedReserved: 6,
        monthlySavings: 675.50
      }
    ]
  },

  anomalies: [
    {
      id: 1,
      date: '2024-01-15',
      service: 'EC2',
      normalCost: 850.00,
      actualCost: 1420.50,
      variance: 67.1,
      severity: 'high',
      description: 'Unusual spike in EC2 costs due to auto-scaling event',
      resolved: false
    },
    {
      id: 2,
      date: '2024-01-12',
      service: 'S3',
      normalCost: 120.00,
      actualCost: 185.75,
      variance: 54.8,
      severity: 'medium',
      description: 'Increased data transfer costs',
      resolved: true
    }
  ],

  rightsizingHistory: [
    {
      id: 1,
      date: '2024-01-01',
      resourceId: 'i-1234567890abcdef0',
      oldInstanceType: 't3.large',
      newInstanceType: 't3.medium',
      estimatedSavings: 125.50,
      actualSavings: 118.75,
      status: 'completed',
      successRate: 94.6
    },
    {
      id: 2,
      date: '2023-12-15',
      resourceId: 'i-0987654321fedcba0',
      oldInstanceType: 'm5.xlarge',
      newInstanceType: 'm5.large',
      estimatedSavings: 245.00,
      actualSavings: 238.25,
      status: 'completed',
      successRate: 97.2
    }
  ],

  licenseOptimization: [
    {
      software: 'Windows Server',
      currentLicenses: 25,
      utilizationRate: 68,
      recommendedLicenses: 17,
      monthlySavings: 320.00,
      licenseType: 'BYOL'
    },
    {
      software: 'SQL Server',
      currentLicenses: 12,
      utilizationRate: 85,
      recommendedLicenses: 10,
      monthlySavings: 450.00,
      licenseType: 'License Included'
    }
  ],

  dataLifecycleRecommendations: [
    {
      bucket: 'company-logs',
      currentTier: 'Standard',
      recommendedTier: 'Infrequent Access',
      dataSize: '2.5 TB',
      lastAccessed: '45 days ago',
      monthlySavings: 125.75
    },
    {
      bucket: 'backup-archives',
      currentTier: 'Standard',
      recommendedTier: 'Glacier',
      dataSize: '8.2 TB',
      lastAccessed: '180 days ago',
      monthlySavings: 485.50
    }
  ],

  budgetAlerts: [
    {
      id: 1,
      budgetName: 'Monthly Cloud Budget',
      budgetAmount: 15000,
      currentSpend: 12500.75,
      forecastedSpend: 16250.50,
      alertThreshold: 80,
      status: 'warning',
      daysRemaining: 12
    }
  ],

  whatIfScenarios: [
    {
      id: 1,
      scenarioName: 'Switch 50% VMs to Spot Instances',
      changeType: 'instance_type',
      currentMonthlyCost: 12500.75,
      projectedMonthlyCost: 10250.60,
      totalImpact: -2250.15,
      roi: 18.0,
      paybackMonths: 0,
      baselineCosts: [12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600],
      projectedCosts: [10250, 10300, 10350, 10400, 10450, 10500, 10550, 10600, 10650, 10700, 10750, 10800],
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      scenarioName: 'Implement Auto-Scaling',
      changeType: 'user_growth',
      currentMonthlyCost: 12500.75,
      projectedMonthlyCost: 10625.50,
      totalImpact: -1875.25,
      roi: 15.0,
      paybackMonths: 0,
      baselineCosts: [12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600],
      projectedCosts: [10625, 10675, 10725, 10775, 10825, 10875, 10925, 10975, 11025, 11075, 11125, 11175],
      createdAt: '2024-01-08T14:30:00Z'
    },
    {
      id: 3,
      scenarioName: 'Reserved Instance Purchase',
      changeType: 'reserved_instances',
      currentMonthlyCost: 12500.75,
      projectedMonthlyCost: 9375.56,
      totalImpact: -3125.19,
      roi: 25.0,
      paybackMonths: 0,
      baselineCosts: [12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600],
      projectedCosts: [9375, 9425, 9475, 9525, 9575, 9625, 9675, 9725, 9775, 9825, 9875, 9925],
      createdAt: '2024-01-05T09:15:00Z'
    }
  ],

  // Custom reports data
  reports: [
    {
      id: 1,
      name: 'Monthly Cost Analysis - December 2024',
      type: 'cost_analysis',
      status: 'completed',
      format: 'pdf',
      fileSize: 2048576, // 2MB
      createdAt: '2024-01-15T09:00:00Z',
      metrics: ['Total Cost', 'Cost by Service', 'Cost Trends'],
      dateRange: 'last_30_days'
    },
    {
      id: 2,
      name: 'Q4 Savings Summary',
      type: 'savings_summary',
      status: 'completed',
      format: 'excel',
      fileSize: 1536000, // 1.5MB
      createdAt: '2024-01-10T14:30:00Z',
      metrics: ['Total Savings', 'Savings by Category', 'ROI Analysis'],
      dateRange: 'last_90_days'
    },
    {
      id: 3,
      name: 'Budget Performance Report',
      type: 'budget_performance',
      status: 'processing',
      format: 'pdf',
      fileSize: 0,
      createdAt: '2024-01-16T11:00:00Z',
      metrics: ['Budget vs Actual', 'Forecast Accuracy'],
      dateRange: 'last_30_days'
    }
  ],

  // Scheduled reports data
  scheduledReports: [
    {
      id: 1,
      name: 'Weekly Cost Summary',
      type: 'cost_analysis',
      frequency: 'weekly',
      enabled: true,
      recipients: ['finance@company.com', 'ops@company.com'],
      nextRun: '2024-01-22T09:00:00Z',
      lastRun: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      name: 'Monthly Optimization Report',
      type: 'optimization_status',
      frequency: 'monthly',
      enabled: true,
      recipients: ['cto@company.com', 'devops@company.com'],
      nextRun: '2024-02-01T10:00:00Z',
      lastRun: '2024-01-01T10:00:00Z'
    },
    {
      id: 3,
      name: 'Quarterly Executive Summary',
      type: 'savings_summary',
      frequency: 'quarterly',
      enabled: false,
      recipients: ['ceo@company.com', 'cfo@company.com'],
      nextRun: '2024-04-01T08:00:00Z',
      lastRun: '2024-01-01T08:00:00Z'
    }
  ],

  // Implementation tracker data
  implementationTracker: [
    {
      id: 1,
      title: 'EC2 Instance Rightsizing - Production',
      description: 'Downsize oversized EC2 instances in production environment',
      category: 'compute',
      status: 'completed',
      startDate: '2023-12-01T00:00:00Z',
      completionDate: '2023-12-15T00:00:00Z',
      estimatedSavings: 3500,
      actualSavings: 3800,
      notes: 'Exceeded expectations with additional optimization opportunities identified',
      assignee: 'DevOps Team'
    },
    {
      id: 2,
      title: 'S3 Storage Lifecycle Implementation',
      description: 'Implement intelligent tiering for S3 buckets',
      category: 'storage',
      status: 'completed',
      startDate: '2023-11-15T00:00:00Z',
      completionDate: '2023-12-01T00:00:00Z',
      estimatedSavings: 1200,
      actualSavings: 1450,
      notes: 'Great results from automated lifecycle policies',
      assignee: 'Cloud Architecture Team'
    },
    {
      id: 3,
      title: 'RDS Reserved Instance Purchase',
      description: 'Purchase reserved instances for production databases',
      category: 'database',
      status: 'in_progress',
      startDate: '2024-01-10T00:00:00Z',
      estimatedSavings: 5200,
      actualSavings: 0,
      notes: 'Procurement in progress, expected completion by end of month',
      assignee: 'Database Team'
    },
    {
      id: 4,
      title: 'Lambda Function Optimization',
      description: 'Optimize memory allocation for Lambda functions',
      category: 'compute',
      status: 'planned',
      startDate: '2024-02-01T00:00:00Z',
      estimatedSavings: 800,
      actualSavings: 0,
      notes: 'Waiting for development team availability',
      assignee: 'Development Team'
    },
    {
      id: 5,
      title: 'CloudWatch Logs Retention Policy',
      description: 'Implement retention policies for CloudWatch logs',
      category: 'monitoring',
      status: 'completed',
      startDate: '2023-12-20T00:00:00Z',
      completionDate: '2024-01-05T00:00:00Z',
      estimatedSavings: 600,
      actualSavings: 720,
      notes: 'Identified additional log groups for optimization',
      assignee: 'Platform Team'
    },
    {
      id: 6,
      title: 'EBS Volume Optimization',
      description: 'Convert GP2 volumes to GP3 for better cost efficiency',
      category: 'storage',
      status: 'on_hold',
      startDate: '2024-01-08T00:00:00Z',
      estimatedSavings: 2100,
      actualSavings: 0,
      notes: 'On hold pending application testing',
      assignee: 'Infrastructure Team'
    }
  ],

  // Implementation tracker summary
  implementationSummary: {
    completed: 3,
    inProgress: 1,
    planned: 1,
    onHold: 1,
    failed: 0,
    totalEstimatedSavings: 13400,
    totalActualSavings: 5970,
    overallProgress: 65,
    savingsAchievement: 108.2,
    successRate: 85.7
  }
};

module.exports = { costData };