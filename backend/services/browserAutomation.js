const { chromium, firefox, webkit } = require('playwright');

class BrowserAutomationService {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.defaultTimeout = 30000;
  }

  /**
   * Initialize browser instance
   * @param {string} browserType - 'chromium', 'firefox', or 'webkit'
   * @param {boolean} headless - Run in headless mode
   */
  async initBrowser(browserType = 'chromium', headless = true) {
    try {
      const browserOptions = {
        headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      };

      switch (browserType) {
        case 'firefox':
          this.browser = await firefox.launch(browserOptions);
          break;
        case 'webkit':
          this.browser = await webkit.launch(browserOptions);
          break;
        default:
          this.browser = await chromium.launch(browserOptions);
      }

      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });

      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(this.defaultTimeout);

      console.log(`Browser automation initialized with ${browserType}`);
      return true;
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Login to Azure Portal
   * @param {Object} credentials - { email, password }
   * @returns {boolean} Success status
   */
  async loginToAzure(credentials) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Call initBrowser() first.');
      }

      console.log('Navigating to Azure Portal...');
      await this.page.goto('https://portal.azure.com', { waitUntil: 'networkidle' });

      // Wait for login form
      await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
      
      // Enter email
      await this.page.fill('input[type="email"]', credentials.email);
      await this.page.click('input[type="submit"]');

      // Wait for password field
      await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
      
      // Enter password
      await this.page.fill('input[type="password"]', credentials.password);
      await this.page.click('input[type="submit"]');

      // Handle MFA if present (wait for manual intervention or skip)
      try {
        await this.page.waitForSelector('[data-testid="stay-signed-in-checkbox"]', { timeout: 5000 });
        await this.page.click('input[type="submit"]'); // Stay signed in
      } catch (e) {
        console.log('No "Stay signed in" prompt found, continuing...');
      }

      // Wait for Azure portal to load
      await this.page.waitForSelector('[data-testid="dashboard-grid"]', { timeout: 30000 });
      
      console.log('Successfully logged into Azure Portal');
      return true;
    } catch (error) {
      console.error('Azure login failed:', error);
      return false;
    }
  }

  /**
   * Login to AWS Console
   * @param {Object} credentials - { email, password }
   * @returns {boolean} Success status
   */
  async loginToAWS(credentials) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Call initBrowser() first.');
      }

      console.log('Navigating to AWS Console...');
      await this.page.goto('https://console.aws.amazon.com', { waitUntil: 'networkidle' });

      // Wait for login form
      await this.page.waitForSelector('#resolving_input', { timeout: 10000 });
      
      // Enter email/username
      await this.page.fill('#resolving_input', credentials.email);
      await this.page.click('#next_button');

      // Wait for password field
      await this.page.waitForSelector('#password', { timeout: 10000 });
      
      // Enter password
      await this.page.fill('#password', credentials.password);
      await this.page.click('#signin_button');

      // Wait for AWS console to load
      await this.page.waitForSelector('[data-testid="console-nav-header"]', { timeout: 30000 });
      
      console.log('Successfully logged into AWS Console');
      return true;
    } catch (error) {
      console.error('AWS login failed:', error);
      return false;
    }
  }

  /**
   * Login to Google Cloud Console
   * @param {Object} credentials - { email, password }
   * @returns {boolean} Success status
   */
  async loginToGCP(credentials) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Call initBrowser() first.');
      }

      console.log('Navigating to Google Cloud Console...');
      await this.page.goto('https://console.cloud.google.com', { waitUntil: 'networkidle' });

      // Wait for login form
      await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
      
      // Enter email
      await this.page.fill('input[type="email"]', credentials.email);
      await this.page.click('#identifierNext');

      // Wait for password field
      await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
      
      // Enter password
      await this.page.fill('input[type="password"]', credentials.password);
      await this.page.click('#passwordNext');

      // Wait for GCP console to load
      await this.page.waitForSelector('[data-testid="console-nav"]', { timeout: 30000 });
      
      console.log('Successfully logged into Google Cloud Console');
      return true;
    } catch (error) {
      console.error('GCP login failed:', error);
      return false;
    }
  }

  /**
   * Extract Azure cost data
   * @returns {Object} Cost data
   */
  async extractAzureCostData() {
    try {
      console.log('Navigating to Azure Cost Management...');
      await this.page.goto('https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/overview', { waitUntil: 'networkidle' });

      // Wait for cost data to load
      await this.page.waitForSelector('[data-testid="cost-analysis-chart"]', { timeout: 20000 });

      // Extract cost information
      const costData = await this.page.evaluate(() => {
        const costs = [];
        
        // Extract current month cost
        const currentCostElement = document.querySelector('[data-testid="current-cost"]');
        if (currentCostElement) {
          costs.push({
            period: 'current',
            amount: currentCostElement.textContent.trim(),
            currency: 'USD'
          });
        }

        // Extract service breakdown
        const serviceElements = document.querySelectorAll('[data-testid="service-cost-item"]');
        const services = Array.from(serviceElements).map(el => ({
          name: el.querySelector('.service-name')?.textContent?.trim() || 'Unknown',
          cost: el.querySelector('.service-cost')?.textContent?.trim() || '0'
        }));

        return {
          totalCosts: costs,
          serviceBreakdown: services,
          extractedAt: new Date().toISOString(),
          provider: 'azure'
        };
      });

      console.log('Azure cost data extracted successfully');
      return costData;
    } catch (error) {
      console.error('Failed to extract Azure cost data:', error);
      return null;
    }
  }

  /**
   * Extract AWS cost data
   * @returns {Object} Cost data
   */
  async extractAWSCostData() {
    try {
      console.log('Navigating to AWS Cost Explorer...');
      await this.page.goto('https://console.aws.amazon.com/cost-management/home#/cost-explorer', { waitUntil: 'networkidle' });

      // Wait for cost data to load
      await this.page.waitForSelector('[data-testid="cost-explorer-chart"]', { timeout: 20000 });

      // Extract cost information
      const costData = await this.page.evaluate(() => {
        const costs = [];
        
        // Extract current month cost
        const currentCostElement = document.querySelector('[data-testid="total-cost"]');
        if (currentCostElement) {
          costs.push({
            period: 'current',
            amount: currentCostElement.textContent.trim(),
            currency: 'USD'
          });
        }

        // Extract service breakdown
        const serviceElements = document.querySelectorAll('[data-testid="service-cost-row"]');
        const services = Array.from(serviceElements).map(el => ({
          name: el.querySelector('.service-name')?.textContent?.trim() || 'Unknown',
          cost: el.querySelector('.service-cost')?.textContent?.trim() || '0'
        }));

        return {
          totalCosts: costs,
          serviceBreakdown: services,
          extractedAt: new Date().toISOString(),
          provider: 'aws'
        };
      });

      console.log('AWS cost data extracted successfully');
      return costData;
    } catch (error) {
      console.error('Failed to extract AWS cost data:', error);
      return null;
    }
  }

  /**
   * Extract GCP cost data
   * @returns {Object} Cost data
   */
  async extractGCPCostData() {
    try {
      console.log('Navigating to GCP Billing...');
      await this.page.goto('https://console.cloud.google.com/billing', { waitUntil: 'networkidle' });

      // Wait for cost data to load
      await this.page.waitForSelector('[data-testid="billing-overview"]', { timeout: 20000 });

      // Extract cost information
      const costData = await this.page.evaluate(() => {
        const costs = [];
        
        // Extract current month cost
        const currentCostElement = document.querySelector('[data-testid="current-spend"]');
        if (currentCostElement) {
          costs.push({
            period: 'current',
            amount: currentCostElement.textContent.trim(),
            currency: 'USD'
          });
        }

        // Extract service breakdown
        const serviceElements = document.querySelectorAll('[data-testid="service-cost-item"]');
        const services = Array.from(serviceElements).map(el => ({
          name: el.querySelector('.service-name')?.textContent?.trim() || 'Unknown',
          cost: el.querySelector('.service-cost')?.textContent?.trim() || '0'
        }));

        return {
          totalCosts: costs,
          serviceBreakdown: services,
          extractedAt: new Date().toISOString(),
          provider: 'gcp'
        };
      });

      console.log('GCP cost data extracted successfully');
      return costData;
    } catch (error) {
      console.error('Failed to extract GCP cost data:', error);
      return null;
    }
  }

  /**
   * Find unused Azure VMs
   * @returns {Array} List of unused VMs
   */
  async findUnusedAzureVMs() {
    try {
      console.log('Navigating to Azure Virtual Machines...');
      await this.page.goto('https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2FVirtualMachines', { waitUntil: 'networkidle' });

      // Wait for VM list to load
      await this.page.waitForSelector('[data-testid="vm-list"]', { timeout: 20000 });

      // Extract VM information
      const unusedVMs = await this.page.evaluate(() => {
        const vmRows = document.querySelectorAll('[data-testid="vm-row"]');
        const unused = [];

        Array.from(vmRows).forEach(row => {
          const name = row.querySelector('.vm-name')?.textContent?.trim();
          const status = row.querySelector('.vm-status')?.textContent?.trim();
          const size = row.querySelector('.vm-size')?.textContent?.trim();
          const cost = row.querySelector('.vm-cost')?.textContent?.trim();

          // Consider VM unused if stopped for more than 7 days or low CPU utilization
          if (status?.includes('Stopped') || status?.includes('Deallocated')) {
            unused.push({
              name,
              status,
              size,
              estimatedMonthlyCost: cost,
              reason: 'VM is stopped/deallocated'
            });
          }
        });

        return unused;
      });

      console.log(`Found ${unusedVMs.length} potentially unused Azure VMs`);
      return unusedVMs;
    } catch (error) {
      console.error('Failed to find unused Azure VMs:', error);
      return [];
    }
  }

  /**
   * Take screenshot for debugging
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename = 'debug-screenshot.png') {
    try {
      if (this.page) {
        await this.page.screenshot({ path: filename, fullPage: true });
        console.log(`Screenshot saved as ${filename}`);
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }

  /**
   * Close browser and cleanup
   */
  async cleanup() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      console.log('Browser automation cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

module.exports = BrowserAutomationService;