const express = require('express');
const router = express.Router();
const CloudConnectorService = require('../services/cloudConnectors');

// Initialize cloud connector service
const cloudConnector = new CloudConnectorService();

/**
 * POST /api/automation/analyze
 * Execute automated cloud analysis
 */
router.post('/analyze', async (req, res) => {
  try {
    const {
      provider,
      credentials,
      analysisType = 'cost-optimization',
      includeUnusedResources = true,
      browserType = 'chromium',
      headless = true
    } = req.body;

    // Validate required fields
    if (!provider || !credentials) {
      return res.status(400).json({
        error: 'Provider and credentials are required',
        required: ['provider', 'credentials']
      });
    }

    // Validate provider
    if (!['azure', 'aws', 'gcp'].includes(provider.toLowerCase())) {
      return res.status(400).json({
        error: 'Unsupported provider',
        supportedProviders: ['azure', 'aws', 'gcp']
      });
    }

    // Validate credentials
    if (!credentials.email || !credentials.password) {
      return res.status(400).json({
        error: 'Email and password are required in credentials',
        required: ['credentials.email', 'credentials.password']
      });
    }

    console.log(`[Automation] Starting analysis for ${provider}...`);

    // Demo mode - check for demo credentials
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      console.log(`[Automation] Demo mode - Generating mock analysis for ${provider}`);
      
      const mockResults = {
        costAnalysis: {
          totalMonthlyCost: 2847.32,
          potentialSavings: 892.15,
          savingsPercentage: 31.3,
          currency: 'USD'
        },
        unusedResources: [
          {
            type: 'Virtual Machine',
            name: 'vm-unused-01',
            region: 'East US',
            monthlyCost: 156.80,
            lastActivity: '2024-01-15',
            recommendation: 'Delete or resize to smaller instance'
          },
          {
            type: 'Storage Account',
            name: 'storage-old-data',
            region: 'West Europe',
            monthlyCost: 89.45,
            lastActivity: '2024-01-10',
            recommendation: 'Archive old data or delete unused storage'
          }
        ],
        recommendations: [
          {
            category: 'Compute',
            title: 'Right-size underutilized VMs',
            impact: 'High',
            savings: 425.60,
            description: 'Several VMs are running at less than 20% CPU utilization'
          },
          {
            category: 'Storage',
            title: 'Implement lifecycle policies',
            impact: 'Medium',
            savings: 234.80,
            description: 'Move infrequently accessed data to cheaper storage tiers'
          }
        ],
        metadata: {
          provider,
          analysisType,
          executedAt: new Date().toISOString(),
          automationVersion: '1.0.0',
          demoMode: true
        }
      };

      return res.json({
        success: true,
        data: mockResults,
        message: `Demo mode: Automated analysis completed for ${provider}`
      });
    }

    // Initialize cloud connector
    await cloudConnector.initialize(browserType, headless);

    // Execute analysis
    const results = await cloudConnector.executeCloudAnalysis({
      provider,
      credentials,
      analysisType,
      includeUnusedResources
    });

    // Cleanup
    await cloudConnector.cleanup();

    console.log(`[Automation] Analysis completed for ${provider}`);

    res.json({
      success: true,
      data: results,
      message: `Automated analysis completed for ${provider}`
    });

  } catch (error) {
    console.error('[Automation] Analysis failed:', error);
    
    // Ensure cleanup on error
    try {
      await cloudConnector.cleanup();
    } catch (cleanupError) {
      console.error('[Automation] Cleanup failed:', cleanupError);
    }

    res.status(500).json({
      error: 'Automation analysis failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/automation/command
 * Execute specific automation command
 */
router.post('/command', async (req, res) => {
  try {
    const {
      command,
      provider,
      credentials,
      browserType = 'chromium',
      headless = true
    } = req.body;

    // Validate required fields
    if (!command || !provider || !credentials) {
      return res.status(400).json({
        error: 'Command, provider, and credentials are required',
        required: ['command', 'provider', 'credentials']
      });
    }

    console.log(`[Automation] Executing command: "${command}" for ${provider}`);

    // Initialize cloud connector
    await cloudConnector.initialize(browserType, headless);

    // Execute command
    const results = await cloudConnector.executeCommand(command, {
      provider,
      credentials
    });

    // Cleanup
    await cloudConnector.cleanup();

    console.log(`[Automation] Command executed successfully: "${command}"`);

    res.json({
      success: true,
      command,
      data: results,
      message: `Command executed successfully: "${command}"`
    });

  } catch (error) {
    console.error('[Automation] Command execution failed:', error);
    
    // Ensure cleanup on error
    try {
      await cloudConnector.cleanup();
    } catch (cleanupError) {
      console.error('[Automation] Cleanup failed:', cleanupError);
    }

    res.status(500).json({
      error: 'Command execution failed',
      message: error.message,
      command: req.body.command,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/automation/providers
 * Get list of supported cloud providers
 */
router.get('/providers', (req, res) => {
  res.json({
    success: true,
    providers: [
      {
        id: 'azure',
        name: 'Microsoft Azure',
        features: ['cost-analysis', 'unused-vms', 'resource-optimization'],
        loginUrl: 'https://portal.azure.com'
      },
      {
        id: 'aws',
        name: 'Amazon Web Services',
        features: ['cost-analysis', 'resource-optimization'],
        loginUrl: 'https://console.aws.amazon.com'
      },
      {
        id: 'gcp',
        name: 'Google Cloud Platform',
        features: ['cost-analysis', 'resource-optimization'],
        loginUrl: 'https://console.cloud.google.com'
      }
    ]
  });
});

/**
 * GET /api/automation/analysis-types
 * Get list of supported analysis types
 */
router.get('/analysis-types', (req, res) => {
  res.json({
    success: true,
    analysisTypes: [
      {
        id: 'cost-optimization',
        name: 'Cost Optimization',
        description: 'Comprehensive cost analysis with optimization recommendations',
        features: ['cost-breakdown', 'unused-resources', 'recommendations']
      },
      {
        id: 'unused-resources',
        name: 'Unused Resources',
        description: 'Find and analyze unused or underutilized resources',
        features: ['vm-analysis', 'storage-analysis', 'savings-calculation']
      },
      {
        id: 'cost-breakdown',
        name: 'Cost Breakdown',
        description: 'Detailed cost breakdown by service, region, and resource group',
        features: ['service-costs', 'regional-costs', 'trend-analysis']
      }
    ]
  });
});

/**
 * POST /api/automation/test-connection
 * Test connection to cloud provider
 */
router.post('/test-connection', async (req, res) => {
  try {
    const {
      provider,
      credentials,
      browserType = 'chromium',
      headless = true
    } = req.body;

    // Validate required fields
    if (!provider || !credentials) {
      return res.status(400).json({
        error: 'Provider and credentials are required'
      });
    }

    console.log(`[Automation] Testing connection to ${provider}...`);

    // Demo mode - check for demo credentials
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      console.log(`[Automation] Demo mode - Connection test successful for ${provider}`);
      return res.json({
        success: true,
        message: `Demo mode: Successfully connected to ${provider}`,
        provider,
        testedAt: new Date().toISOString(),
        demoMode: true
      });
    }

    // Initialize cloud connector for real authentication
    await cloudConnector.initialize(browserType, headless);

    // Test login
    const loginSuccess = await cloudConnector.loginToProvider(provider, credentials);

    // Cleanup
    await cloudConnector.cleanup();

    if (loginSuccess) {
      console.log(`[Automation] Connection test successful for ${provider}`);
      res.json({
        success: true,
        message: `Successfully connected to ${provider}`,
        provider,
        testedAt: new Date().toISOString()
      });
    } else {
      console.log(`[Automation] Connection test failed for ${provider}`);
      res.status(401).json({
        error: 'Authentication failed',
        message: `Failed to authenticate with ${provider}`,
        provider
      });
    }

  } catch (error) {
    console.error('[Automation] Connection test failed:', error);
    
    // Ensure cleanup on error
    try {
      await cloudConnector.cleanup();
    } catch (cleanupError) {
      console.error('[Automation] Cleanup failed:', cleanupError);
    }

    res.status(500).json({
      error: 'Connection test failed',
      message: error.message,
      provider: req.body.provider
    });
  }
});

/**
 * GET /api/automation/status
 * Get automation service status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    version: '1.0.0',
    features: {
      browserAutomation: true,
      cloudProviders: ['azure', 'aws', 'gcp'],
      analysisTypes: ['cost-optimization', 'unused-resources', 'cost-breakdown']
    },
    lastUpdated: new Date().toISOString()
  });
});

module.exports = router;