const BrowserAutomationService = require('./browserAutomation');

class CloudConnectorService {
  constructor() {
    this.browserService = new BrowserAutomationService();
    this.supportedProviders = ['azure', 'aws', 'gcp'];
  }

  /**
   * Initialize cloud connector
   * @param {string} browserType - Browser type to use
   * @param {boolean} headless - Run in headless mode
   */
  async initialize(browserType = 'chromium', headless = true) {
    try {
      await this.browserService.initBrowser(browserType, headless);
      console.log('Cloud connector service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize cloud connector:', error);
      throw error;
    }
  }

  /**
   * Execute automated cloud analysis
   * @param {Object} config - Analysis configuration
   * @returns {Object} Analysis results
   */
  async executeCloudAnalysis(config) {
    const {
      provider,
      credentials,
      analysisType = 'cost-optimization',
      includeUnusedResources = true
    } = config;

    try {
      console.log(`Starting automated analysis for ${provider}...`);
      
      // Check for demo mode and return mock data
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        console.log(`Demo mode detected - returning mock analysis data for ${provider}`);
        return this.getMockAnalysisData(provider, analysisType);
      }
      
      // Login to cloud provider
      const loginSuccess = await this.loginToProvider(provider, credentials);
      if (!loginSuccess) {
        throw new Error(`Failed to login to ${provider}`);
      }

      // Extract data based on analysis type
      let results = {};
      
      switch (analysisType) {
        case 'cost-optimization':
          results = await this.performCostOptimizationAnalysis(provider, includeUnusedResources);
          break;
        case 'unused-resources':
          results = await this.findUnusedResources(provider);
          break;
        case 'cost-breakdown':
          results = await this.extractCostBreakdown(provider);
          break;
        default:
          results = await this.performCostOptimizationAnalysis(provider, includeUnusedResources);
      }

      // Add metadata
      results.metadata = {
        provider,
        analysisType,
        executedAt: new Date().toISOString(),
        automationVersion: '1.0.0'
      };

      console.log(`Analysis completed for ${provider}`);
      return results;

    } catch (error) {
      console.error(`Cloud analysis failed for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Login to specified cloud provider
   * @param {string} provider - Cloud provider name
   * @param {Object} credentials - Login credentials
   * @returns {boolean} Success status
   */
  async loginToProvider(provider, credentials) {
    // Check for demo mode credentials
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      console.log(`Demo mode detected for ${provider} - bypassing real authentication`);
      return true; // Always return success for demo mode
    }

    switch (provider.toLowerCase()) {
      case 'azure':
        return await this.browserService.loginToAzure(credentials);
      case 'aws':
        return await this.browserService.loginToAWS(credentials);
      case 'gcp':
        return await this.browserService.loginToGCP(credentials);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Perform comprehensive cost optimization analysis
   * @param {string} provider - Cloud provider
   * @param {boolean} includeUnusedResources - Include unused resource analysis
   * @returns {Object} Analysis results
   */
  async performCostOptimizationAnalysis(provider, includeUnusedResources = true) {
    const results = {
      costData: null,
      unusedResources: [],
      recommendations: [],
      potentialSavings: 0
    };

    try {
      // Extract cost data
      results.costData = await this.extractCostData(provider);

      // Find unused resources if requested
      if (includeUnusedResources) {
        results.unusedResources = await this.findUnusedResources(provider);
      }

      // Generate recommendations based on findings
      results.recommendations = this.generateRecommendations(results.costData, results.unusedResources, provider);

      // Calculate potential savings
      results.potentialSavings = this.calculatePotentialSavings(results.unusedResources, results.recommendations);

      return results;
    } catch (error) {
      console.error(`Cost optimization analysis failed for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Extract cost data from cloud provider
   * @param {string} provider - Cloud provider
   * @returns {Object} Cost data
   */
  async extractCostData(provider) {
    switch (provider.toLowerCase()) {
      case 'azure':
        return await this.browserService.extractAzureCostData();
      case 'aws':
        return await this.browserService.extractAWSCostData();
      case 'gcp':
        return await this.browserService.extractGCPCostData();
      default:
        throw new Error(`Cost extraction not supported for provider: ${provider}`);
    }
  }

  /**
   * Find unused resources across cloud providers
   * @param {string} provider - Cloud provider
   * @returns {Array} List of unused resources
   */
  async findUnusedResources(provider) {
    switch (provider.toLowerCase()) {
      case 'azure':
        return await this.browserService.findUnusedAzureVMs();
      case 'aws':
        // TODO: Implement AWS unused resource detection
        return [];
      case 'gcp':
        // TODO: Implement GCP unused resource detection
        return [];
      default:
        return [];
    }
  }

  /**
   * Extract detailed cost breakdown
   * @param {string} provider - Cloud provider
   * @returns {Object} Cost breakdown data
   */
  async extractCostBreakdown(provider) {
    const costData = await this.extractCostData(provider);
    
    return {
      ...costData,
      breakdown: {
        byService: costData.serviceBreakdown || [],
        byRegion: [], // TODO: Implement region breakdown
        byResourceGroup: [], // TODO: Implement resource group breakdown
        trends: [] // TODO: Implement trend analysis
      }
    };
  }

  /**
   * Generate recommendations based on analysis results
   * @param {Object} costData - Cost data
   * @param {Array} unusedResources - Unused resources
   * @param {string} provider - Cloud provider
   * @returns {Array} Recommendations
   */
  generateRecommendations(costData, unusedResources, provider) {
    const recommendations = [];

    // Unused resource recommendations
    if (unusedResources && unusedResources.length > 0) {
      const totalUnusedCost = unusedResources.reduce((sum, resource) => {
        const cost = parseFloat(resource.estimatedMonthlyCost?.replace(/[^0-9.]/g, '') || 0);
        return sum + cost;
      }, 0);

      recommendations.push({
        id: 'unused-resources',
        title: `Stop or Delete ${unusedResources.length} Unused Resources`,
        description: `Found ${unusedResources.length} unused resources that could save approximately $${totalUnusedCost.toFixed(2)} per month.`,
        category: 'compute',
        priority: 'high',
        estimatedSavings: `$${totalUnusedCost.toFixed(2)}/month`,
        effort: 'low',
        timeline: 'immediate',
        implementation: `1. Review unused resources: ${unusedResources.map(r => r.name).join(', ')} 2. Verify they are truly unused 3. Stop or delete resources 4. Monitor cost reduction`,
        risks: 'Ensure resources are not needed for disaster recovery or future use',
        provider: provider,
        resources: unusedResources
      });
    }

    // Service-specific recommendations based on cost data
    if (costData && costData.serviceBreakdown) {
      const topServices = costData.serviceBreakdown
        .sort((a, b) => parseFloat(b.cost.replace(/[^0-9.]/g, '')) - parseFloat(a.cost.replace(/[^0-9.]/g, '')))
        .slice(0, 3);

      topServices.forEach((service, index) => {
        const cost = parseFloat(service.cost.replace(/[^0-9.]/g, '') || 0);
        if (cost > 100) { // Only recommend for services costing more than $100
          recommendations.push({
            id: `optimize-${service.name.toLowerCase().replace(/\s+/g, '-')}`,
            title: `Optimize ${service.name} Usage`,
            description: `${service.name} is one of your top cost drivers at ${service.cost}. Consider rightsizing, reserved instances, or alternative configurations.`,
            category: this.categorizeService(service.name),
            priority: index === 0 ? 'high' : 'medium',
            estimatedSavings: `$${(cost * 0.2).toFixed(2)}/month (20% potential savings)`,
            effort: 'medium',
            timeline: '1-2 weeks',
            implementation: `1. Analyze ${service.name} usage patterns 2. Identify optimization opportunities 3. Implement changes gradually 4. Monitor performance impact`,
            risks: 'Performance impact during optimization',
            provider: provider,
            service: service.name
          });
        }
      });
    }

    return recommendations;
  }

  /**
   * Categorize service for recommendation classification
   * @param {string} serviceName - Service name
   * @returns {string} Category
   */
  categorizeService(serviceName) {
    const name = serviceName.toLowerCase();
    if (name.includes('compute') || name.includes('vm') || name.includes('ec2') || name.includes('instance')) {
      return 'compute';
    } else if (name.includes('storage') || name.includes('blob') || name.includes('s3')) {
      return 'storage';
    } else if (name.includes('database') || name.includes('sql') || name.includes('rds')) {
      return 'database';
    } else if (name.includes('network') || name.includes('cdn') || name.includes('load')) {
      return 'networking';
    }
    return 'general';
  }

  /**
   * Calculate potential savings from recommendations
   * @param {Array} unusedResources - Unused resources
   * @param {Array} recommendations - Recommendations
   * @returns {number} Total potential savings
   */
  calculatePotentialSavings(unusedResources, recommendations) {
    let totalSavings = 0;

    // Calculate savings from unused resources
    if (unusedResources) {
      totalSavings += unusedResources.reduce((sum, resource) => {
        const cost = parseFloat(resource.estimatedMonthlyCost?.replace(/[^0-9.]/g, '') || 0);
        return sum + cost;
      }, 0);
    }

    // Calculate savings from other recommendations
    if (recommendations) {
      recommendations.forEach(rec => {
        if (rec.id !== 'unused-resources') {
          const savings = parseFloat(rec.estimatedSavings?.replace(/[^0-9.]/g, '') || 0);
          totalSavings += savings;
        }
      });
    }

    return Math.round(totalSavings * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get mock analysis data for demo mode
   * @param {string} provider - Cloud provider
   * @param {string} analysisType - Type of analysis
   * @returns {Object} Mock analysis results
   */
  getMockAnalysisData(provider, analysisType) {
    const mockData = {
      costData: {
        totalCost: '$2,847.32',
        currency: 'USD',
        period: 'Last 30 days',
        serviceBreakdown: [
          { name: 'Virtual Machines', cost: '$1,245.67', percentage: '43.7%' },
          { name: 'Storage', cost: '$567.89', percentage: '19.9%' },
          { name: 'Networking', cost: '$234.56', percentage: '8.2%' },
          { name: 'Databases', cost: '$456.78', percentage: '16.0%' },
          { name: 'Other Services', cost: '$342.42', percentage: '12.2%' }
        ]
      },
      unusedResources: [
        {
          name: 'vm-dev-server-01',
          type: 'Virtual Machine',
          status: 'Stopped',
          lastUsed: '2024-01-15',
          estimatedMonthlyCost: '$89.50',
          region: 'East US'
        },
        {
          name: 'storage-temp-backup',
          type: 'Storage Account',
          status: 'Unused',
          lastUsed: '2024-01-10',
          estimatedMonthlyCost: '$45.20',
          region: 'West US'
        },
        {
          name: 'db-test-instance',
          type: 'SQL Database',
          status: 'Idle',
          lastUsed: '2024-01-08',
          estimatedMonthlyCost: '$156.80',
          region: 'Central US'
        }
      ],
      recommendations: [
        {
          id: 'unused-resources',
          title: 'Stop or Delete 3 Unused Resources',
          description: 'Found 3 unused resources that could save approximately $291.50 per month.',
          category: 'compute',
          priority: 'high',
          estimatedSavings: '$291.50/month',
          effort: 'low',
          timeline: 'immediate'
        },
        {
          id: 'optimize-vm-sizing',
          title: 'Optimize Virtual Machine Sizing',
          description: 'Several VMs are over-provisioned and could be downsized to save costs.',
          category: 'compute',
          priority: 'medium',
          estimatedSavings: '$249.13/month',
          effort: 'medium',
          timeline: '1-2 weeks'
        },
        {
          id: 'reserved-instances',
          title: 'Purchase Reserved Instances',
          description: 'Convert pay-as-you-go VMs to reserved instances for long-term savings.',
          category: 'compute',
          priority: 'medium',
          estimatedSavings: '$373.70/month',
          effort: 'low',
          timeline: '1 week'
        }
      ],
      potentialSavings: 914.33,
      metadata: {
        provider: provider,
        analysisType: analysisType,
        executedAt: new Date().toISOString(),
        automationVersion: '1.0.0',
        demoMode: true
      }
    };

    // Customize based on analysis type
    switch (analysisType) {
      case 'unused-resources':
        return {
          unusedResources: mockData.unusedResources,
          metadata: mockData.metadata
        };
      case 'cost-breakdown':
        return {
          costData: mockData.costData,
          breakdown: {
            byService: mockData.costData.serviceBreakdown,
            byRegion: [
              { region: 'East US', cost: '$1,234.56', percentage: '43.4%' },
              { region: 'West US', cost: '$876.54', percentage: '30.8%' },
              { region: 'Central US', cost: '$736.22', percentage: '25.8%' }
            ]
          },
          metadata: mockData.metadata
        };
      default:
        return mockData;
    }
  }

  /**
   * Execute specific analysis command
   * @param {string} command - Analysis command
   * @param {Object} config - Configuration
   * @returns {Object} Analysis results
   */
  async executeCommand(command, config) {
    const { provider, credentials } = config;

    try {
      // Check for demo mode and return mock command results
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        console.log(`Demo mode detected - returning mock command results for: ${command}`);
        return {
          command: command,
          status: 'success',
          results: this.getMockAnalysisData(provider, 'cost-optimization'),
          executedAt: new Date().toISOString(),
          demoMode: true
        };
      }

      // Initialize if not already done
      if (!this.browserService.browser) {
        await this.initialize();
      }

      // Parse command
      const commandParts = command.toLowerCase().split(' ');
      const action = commandParts[0];
      const target = commandParts.slice(1).join(' ');

      switch (action) {
        case 'find':
          if (target.includes('unused') && target.includes('vm')) {
            return await this.executeCloudAnalysis({
              provider,
              credentials,
              analysisType: 'unused-resources'
            });
          }
          break;
        case 'analyze':
          if (target.includes('cost')) {
            return await this.executeCloudAnalysis({
              provider,
              credentials,
              analysisType: 'cost-optimization'
            });
          }
          break;
        default:
          return await this.executeCloudAnalysis({
            provider,
            credentials,
            analysisType: 'cost-optimization'
          });
      }
    } catch (error) {
      console.error(`Command execution failed: ${command}`, error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    await this.browserService.cleanup();
  }
}

module.exports = CloudConnectorService;