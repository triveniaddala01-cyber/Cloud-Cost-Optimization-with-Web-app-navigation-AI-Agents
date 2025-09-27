const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

class KnowledgebaseReader {
  constructor() {
    this.knowledgebasePath = path.join(__dirname, 'knowledgebase');
    this.servicesCatalog = null;
    this.pricingData = null;
    this.dependencyRules = null;
  }

  // Read and parse the Cloud Service Catalog Excel file
  async loadServicesCatalog() {
    try {
      const filePath = path.join(this.knowledgebasePath, 'Table 1_ Cloud Service Catalog (Primary Service Information - 22 Services).xlsx');
      
      if (!fs.existsSync(filePath)) {
        console.warn('Services catalog file not found:', filePath);
        return null;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        console.warn('Services catalog file appears to be empty or invalid');
        return null;
      }

      // Parse the data with proper headers
      const headers = jsonData[0];
      const services = jsonData.slice(1).map(row => {
        const service = {};
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            service[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
          }
        });
        return service;
      }).filter(service => Object.keys(service).length > 0);

      this.servicesCatalog = services;
      console.log(`Loaded ${services.length} services from catalog`);
      return services;
    } catch (error) {
      console.error('Error loading services catalog:', error);
      return null;
    }
  }

  // Read and parse the Pricing and Cost Factors Excel file
  async loadPricingData() {
    try {
      const filePath = path.join(this.knowledgebasePath, 'Table 2_ Pricing and Cost Factors (Representative Data - 20+ Pricing Points).xlsx');
      
      if (!fs.existsSync(filePath)) {
        console.warn('Pricing data file not found:', filePath);
        return null;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        console.warn('Pricing data file appears to be empty or invalid');
        return null;
      }

      const headers = jsonData[0];
      const pricingPoints = jsonData.slice(1).map(row => {
        const pricing = {};
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            pricing[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
          }
        });
        return pricing;
      }).filter(pricing => Object.keys(pricing).length > 0);

      this.pricingData = pricingPoints;
      console.log(`Loaded ${pricingPoints.length} pricing points`);
      return pricingPoints;
    } catch (error) {
      console.error('Error loading pricing data:', error);
      return null;
    }
  }

  // Read and parse the Dependency and Compatibility Rules Excel file
  async loadDependencyRules() {
    try {
      const filePath = path.join(this.knowledgebasePath, 'Table 3_ Dependency and Compatibility Rules (20+ Decision Logic Rules).xlsx');
      
      if (!fs.existsSync(filePath)) {
        console.warn('Dependency rules file not found:', filePath);
        return null;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        console.warn('Dependency rules file appears to be empty or invalid');
        return null;
      }

      const headers = jsonData[0];
      const rules = jsonData.slice(1).map(row => {
        const rule = {};
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            rule[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
          }
        });
        return rule;
      }).filter(rule => Object.keys(rule).length > 0);

      this.dependencyRules = rules;
      console.log(`Loaded ${rules.length} dependency rules`);
      return rules;
    } catch (error) {
      console.error('Error loading dependency rules:', error);
      return null;
    }
  }

  // Load all knowledgebase data
  async loadAllData() {
    try {
      console.log('Loading knowledgebase data...');
      
      const [services, pricing, rules] = await Promise.all([
        this.loadServicesCatalog(),
        this.loadPricingData(),
        this.loadDependencyRules()
      ]);

      return {
        services: services || [],
        pricing: pricing || [],
        rules: rules || [],
        loaded: {
          services: !!services,
          pricing: !!pricing,
          rules: !!rules
        }
      };
    } catch (error) {
      console.error('Error loading knowledgebase data:', error);
      return {
        services: [],
        pricing: [],
        rules: [],
        loaded: {
          services: false,
          pricing: false,
          rules: false
        }
      };
    }
  }

  // Get services by category or type
  getServicesByCategory(category) {
    if (!this.servicesCatalog) return [];
    return this.servicesCatalog.filter(service => 
      service.category?.toLowerCase().includes(category.toLowerCase()) ||
      service.service_type?.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Get pricing for a specific service
  getPricingForService(serviceName) {
    if (!this.pricingData) return [];
    return this.pricingData.filter(pricing => 
      pricing.service_name?.toLowerCase().includes(serviceName.toLowerCase()) ||
      pricing.resource_type?.toLowerCase().includes(serviceName.toLowerCase())
    );
  }

  // Get dependency rules for a service
  getDependencyRules(serviceName) {
    if (!this.dependencyRules) return [];
    return this.dependencyRules.filter(rule => 
      rule.service_name?.toLowerCase().includes(serviceName.toLowerCase()) ||
      rule.source_service?.toLowerCase().includes(serviceName.toLowerCase()) ||
      rule.target_service?.toLowerCase().includes(serviceName.toLowerCase())
    );
  }

  // Generate cost optimization recommendations based on real data
  generateRecommendations(userContext = {}) {
    const recommendations = [];
    
    if (!this.servicesCatalog || !this.pricingData) {
      console.warn('Knowledgebase data not loaded, cannot generate recommendations');
      return [];
    }

    // Analyze services for cost optimization opportunities
    this.servicesCatalog.forEach(service => {
      const pricing = this.getPricingForService(service.service_name || '');
      
      if (pricing.length > 0) {
        // Generate rightsizing recommendations
        const rightsizingRec = this.generateRightsizingRecommendation(service, pricing, userContext);
        if (rightsizingRec) recommendations.push(rightsizingRec);

        // Generate storage optimization recommendations
        const storageRec = this.generateStorageOptimizationRecommendation(service, pricing, userContext);
        if (storageRec) recommendations.push(storageRec);

        // Generate reserved instance recommendations
        const reservedRec = this.generateReservedInstanceRecommendation(service, pricing, userContext);
        if (reservedRec) recommendations.push(reservedRec);
      }
    });

    return recommendations.slice(0, 10); // Return top 10 recommendations
  }

  generateRightsizingRecommendation(service, pricing, userContext) {
    // Logic to generate rightsizing recommendations based on service and pricing data
    if (service.service_type?.toLowerCase().includes('compute') || 
        service.service_name?.toLowerCase().includes('ec2')) {
      
      const baseCost = pricing.find(p => p.pricing_model?.toLowerCase().includes('on-demand'))?.cost_per_hour || 0;
      const estimatedSavings = baseCost * 24 * 30 * 0.3; // 30% savings estimate
      
      return {
        id: `rightsizing-${service.service_name?.replace(/\s+/g, '-').toLowerCase()}`,
        title: `Rightsize ${service.service_name || 'Compute Resources'}`,
        description: `Optimize instance sizes based on actual usage patterns for ${service.service_name}`,
        category: 'Rightsizing',
        priority: 'High',
        effort: 'Medium',
        estimatedSavings: `$${estimatedSavings.toFixed(2)}/month`,
        timeline: '1-2 weeks',
        implementation: `Analyze CPU and memory utilization for ${service.service_name} instances and downsize underutilized resources`,
        risks: 'Potential performance impact if not properly analyzed'
      };
    }
    return null;
  }

  generateStorageOptimizationRecommendation(service, pricing, userContext) {
    if (service.service_type?.toLowerCase().includes('storage') || 
        service.service_name?.toLowerCase().includes('s3')) {
      
      const baseCost = pricing.find(p => p.storage_class?.toLowerCase().includes('standard'))?.cost_per_gb || 0;
      const estimatedSavings = baseCost * 1000 * 0.5; // 50% savings on 1TB
      
      return {
        id: `storage-${service.service_name?.replace(/\s+/g, '-').toLowerCase()}`,
        title: `Optimize ${service.service_name || 'Storage'} Lifecycle`,
        description: `Implement intelligent tiering and lifecycle policies for ${service.service_name}`,
        category: 'Storage Optimization',
        priority: 'Medium',
        effort: 'Low',
        estimatedSavings: `$${estimatedSavings.toFixed(2)}/month`,
        timeline: '1 week',
        implementation: `Set up automated lifecycle policies to move infrequently accessed data to cheaper storage tiers`,
        risks: 'Minimal risk with proper access pattern analysis'
      };
    }
    return null;
  }

  generateReservedInstanceRecommendation(service, pricing, userContext) {
    if (service.service_type?.toLowerCase().includes('compute')) {
      const onDemandCost = pricing.find(p => p.pricing_model?.toLowerCase().includes('on-demand'))?.cost_per_hour || 0;
      const reservedCost = pricing.find(p => p.pricing_model?.toLowerCase().includes('reserved'))?.cost_per_hour || onDemandCost * 0.7;
      const estimatedSavings = (onDemandCost - reservedCost) * 24 * 30;
      
      if (estimatedSavings > 0) {
        return {
          id: `reserved-${service.service_name?.replace(/\s+/g, '-').toLowerCase()}`,
          title: `Reserved Instances for ${service.service_name || 'Compute'}`,
          description: `Convert on-demand ${service.service_name} instances to reserved instances`,
          category: 'Reserved Instances',
          priority: 'High',
          effort: 'Low',
          estimatedSavings: `$${estimatedSavings.toFixed(2)}/month`,
          timeline: 'Immediate',
          implementation: `Purchase reserved instances for stable ${service.service_name} workloads`,
          risks: 'Commitment risk if usage patterns change'
        };
      }
    }
    return null;
  }
}

module.exports = new KnowledgebaseReader();