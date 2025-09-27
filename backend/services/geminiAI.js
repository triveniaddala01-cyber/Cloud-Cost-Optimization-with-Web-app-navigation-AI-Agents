const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

class GeminiAIService {
  constructor(apiKey) {
    this.apiKey = apiKey || 'AIzaSyA3NBN5MK_wSWABGKskpVKMSwYjN9kV_Wk';
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.knowledgebaseData = null;
  }

  async initializeKnowledgebase(knowledgebasePath, knowledgebaseReader = null) {
    try {
      // If knowledgebaseReader is provided, use it for structured data
      if (knowledgebaseReader) {
        this.knowledgebaseData = this.formatKnowledgebaseData(knowledgebaseReader);
        console.log('Knowledgebase initialized with structured data from Excel files');
        return;
      }

      // Fallback to PDF reading if no knowledgebaseReader provided
      const kbPath = knowledgebasePath || path.join(__dirname, '../../frontend/src/knowledgebase');
      const pdfFiles = [
        'Table 1_ Cloud Service Catalog (Primary Service Information - 22 Services) - Google Sheets.pdf',
        'Table 2_ Pricing and Cost Factors (Representative Data - 20+ Pricing Points) - Google Sheets.pdf',
        'Table 3_ Dependency and Compatibility Rules (20+ Decision Logic Rules) - Google Sheets.pdf'
      ];

      let combinedKnowledgebase = '';
      
      for (const pdfFile of pdfFiles) {
        const pdfPath = path.join(kbPath, pdfFile);
        if (fs.existsSync(pdfPath)) {
          try {
            const dataBuffer = fs.readFileSync(pdfPath);
            const pdfData = await pdf(dataBuffer);
            combinedKnowledgebase += `\n\n=== ${pdfFile} ===\n${pdfData.text}`;
          } catch (error) {
            console.warn(`Could not read PDF ${pdfFile}:`, error.message);
          }
        }
      }

      this.knowledgebaseData = combinedKnowledgebase || this.getFallbackKnowledgebase();
      console.log('Knowledgebase initialized successfully');
    } catch (error) {
      console.error('Error initializing knowledgebase:', error);
      // Fallback to structured data if PDF reading fails
      this.knowledgebaseData = this.getFallbackKnowledgebase();
    }
  }

  formatKnowledgebaseData(knowledgebaseReader) {
    try {
      const services = knowledgebaseReader.getServices();
      const pricing = knowledgebaseReader.getPricing();
      const rules = knowledgebaseReader.getDependencyRules();

      return `
CLOUD SERVICE CATALOG (${services.length} services):
${services.map(service => `
- ${service.serviceName}: ${service.description}
  Category: ${service.category}
  Provider: ${service.provider}
  Pricing Model: ${service.pricingModel}
  Use Cases: ${service.useCases}
  Performance Tier: ${service.performanceTier}
`).join('')}

PRICING AND COST FACTORS (${pricing.length} pricing points):
${pricing.map(price => `
- ${price.serviceName} (${price.provider}):
  Base Cost: ${price.baseCost}
  Unit: ${price.unit}
  Region: ${price.region}
  Tier: ${price.tier}
  Additional Costs: ${price.additionalCosts}
`).join('')}

DEPENDENCY AND COMPATIBILITY RULES (${rules.length} rules):
${rules.map(rule => `
- Rule ${rule.ruleId}: ${rule.description}
  Condition: ${rule.condition}
  Action: ${rule.action}
  Impact: ${rule.impact}
  Priority: ${rule.priority}
`).join('')}
`;
    } catch (error) {
      console.error('Error formatting knowledgebase data:', error);
      return this.getFallbackKnowledgebase();
    }
  }

  getFallbackKnowledgebase() {
    return `
    CLOUD SERVICE CATALOG:
    - Compute Services: EC2, Lambda, ECS, EKS, Fargate
    - Storage Services: S3, EBS, EFS, Glacier, FSx
    - Database Services: RDS, DynamoDB, ElastiCache, Redshift
    - Networking: VPC, CloudFront, Route 53, Load Balancer
    - Security: IAM, KMS, WAF, Shield, GuardDuty
    - Analytics: EMR, Kinesis, Athena, QuickSight
    - Machine Learning: SageMaker, Comprehend, Rekognition
    
    PRICING FACTORS:
    - Instance types and sizes affect hourly rates
    - Reserved instances provide 30-60% savings
    - Spot instances offer up to 90% savings with interruption risk
    - Storage classes impact costs (Standard, IA, Glacier)
    - Data transfer costs vary by region and volume
    - Multi-AZ deployments increase costs but improve availability
    
    DEPENDENCY RULES:
    - Load balancers require multiple AZs for high availability
    - RDS Multi-AZ requires compatible instance types
    - Auto Scaling groups need launch templates or configurations
    - VPC endpoints reduce data transfer costs
    - CloudFront improves performance and reduces origin costs
    `;
  }

  async generateRecommendations(costData, userContext = {}) {
    try {
      const prompt = this.buildRecommendationPrompt(costData, userContext);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const recommendations = this.parseRecommendations(response.text());
      
      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return this.getFallbackRecommendations(costData);
    }
  }

  buildRecommendationPrompt(costData, userContext) {
    const contextInfo = userContext?.userContext || {};
    const includeAlternatives = userContext?.includeAlternatives || false;
    
    return `
    You are a cloud cost optimization expert with extensive knowledge of multiple cloud providers. Based on the following knowledgebase and user context, provide specific, actionable recommendations to reduce cloud costs.

    KNOWLEDGEBASE:
    ${this.knowledgebaseData}

    CURRENT COST DATA:
    - Total Monthly Cost: $${costData.totalCost || 0}
    - Top Services by Cost: ${JSON.stringify(costData.serviceBreakdown || [])}
    - Resource Utilization: ${JSON.stringify(costData.utilization || {})}

    USER CONTEXT:
    - Current Cloud Provider: ${contextInfo.currentArchitecture?.primaryProvider || 'Not specified'}
    - Monthly Spend: $${contextInfo.currentArchitecture?.monthlySpend || 'Not specified'}
    - Target Budget: $${contextInfo.currentArchitecture?.targetBudget || 'Not specified'}
    - Business Type: ${contextInfo.businessRequirements?.businessType || 'Not specified'}
    - Team Size: ${contextInfo.businessRequirements?.teamSize || 'Not specified'}
    - Compliance Requirements: ${contextInfo.businessRequirements?.compliance?.join(', ') || 'None specified'}
    - Optimization Priorities: Cost (${contextInfo.optimizationPriorities?.cost || 50}%), Performance (${contextInfo.optimizationPriorities?.performance || 50}%), Security (${contextInfo.optimizationPriorities?.security || 50}%), Scalability (${contextInfo.optimizationPriorities?.scalability || 50}%)
    - Timeline: ${contextInfo.implementationPreferences?.timeline || 'Not specified'}
    - Risk Tolerance: ${contextInfo.implementationPreferences?.riskTolerance || 'Not specified'}
    - Technical Expertise: ${contextInfo.implementationPreferences?.technicalExpertise || 'Not specified'}

    ${includeAlternatives ? `
    IMPORTANT: Include recommendations for alternative cloud providers beyond AWS, GCP, and Azure. Consider:
    - DigitalOcean for simple web applications and startups
    - Linode for cost-effective compute and storage
    - Vultr for high-performance computing
    - Hetzner for European data residency requirements
    - Oracle Cloud for database workloads
    - IBM Cloud for enterprise hybrid solutions
    - Alibaba Cloud for Asia-Pacific presence
    - Scaleway for European startups
    - OVHcloud for cost-effective European hosting
    
    For each alternative provider recommendation, explain:
    - Cost comparison with current provider
    - Migration complexity and timeline
    - Feature parity analysis
    - Specific use cases where the alternative excels
    ` : ''}

    Please provide 5-7 specific recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "title": "Recommendation Title",
          "description": "Detailed description of the recommendation",
          "category": "compute|storage|database|networking|security|analytics|migration",
          "priority": "high|medium|low",
          "estimatedSavings": "dollar amount or percentage",
          "effort": "low|medium|high",
          "timeline": "immediate|1-2 weeks|1-3 months",
          "implementation": "Step-by-step implementation guide",
          "risks": "Potential risks or considerations",
          "provider": "current|aws|gcp|azure|digitalocean|linode|vultr|hetzner|oracle|ibm|alibaba|scaleway|ovh"
        }
      ]
    }

    Focus on:
    1. Right-sizing based on actual usage patterns
    2. Reserved instance opportunities matching user's commitment level
    3. Storage optimization based on access patterns
    4. Architectural improvements aligned with priorities
    5. Alternative cloud providers for cost optimization
    6. Automation opportunities matching technical expertise
    7. Service-specific optimizations for the user's business type

    Ensure recommendations are:
    - Specific to the user's context and priorities
    - Measurable with clear savings estimates
    - Actionable with detailed implementation steps
    - Risk-aware considering the user's risk tolerance
    - Appropriate for the team's technical expertise level
    `;
  }

  parseRecommendations(aiResponse) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.recommendations || [];
      }
      
      // If JSON parsing fails, create structured recommendations from text
      return this.extractRecommendationsFromText(aiResponse);
    } catch (error) {
      console.error('Error parsing AI recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  extractRecommendationsFromText(text) {
    // Simple text parsing to extract recommendations
    const recommendations = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentRec = null;
    for (const line of lines) {
      if (line.includes('Recommendation') || line.match(/^\d+\./)) {
        if (currentRec) recommendations.push(currentRec);
        currentRec = {
          title: line.replace(/^\d+\.?\s*/, '').trim(),
          description: '',
          category: 'general',
          priority: 'medium',
          estimatedSavings: 'TBD',
          effort: 'medium',
          timeline: '1-2 weeks',
          implementation: '',
          risks: 'Standard implementation risks'
        };
      } else if (currentRec && line.trim()) {
        currentRec.description += line.trim() + ' ';
      }
    }
    
    if (currentRec) recommendations.push(currentRec);
    return recommendations.slice(0, 7); // Limit to 7 recommendations
  }

  getFallbackRecommendations(costData = {}) {
    return [
      {
        title: "Implement Reserved Instance Strategy",
        description: "Purchase Reserved Instances for predictable workloads to achieve 30-60% cost savings compared to On-Demand pricing.",
        category: "compute",
        priority: "high",
        estimatedSavings: "30-60%",
        effort: "low",
        timeline: "immediate",
        implementation: "1. Analyze usage patterns 2. Purchase 1-year or 3-year RIs 3. Monitor utilization",
        risks: "Commitment to specific instance types and regions"
      },
      {
        title: "Right-size Over-provisioned Instances",
        description: "Analyze CPU and memory utilization to identify oversized instances and downgrade to appropriate sizes.",
        category: "compute",
        priority: "high",
        estimatedSavings: "20-40%",
        effort: "medium",
        timeline: "1-2 weeks",
        implementation: "1. Monitor metrics for 2 weeks 2. Identify low utilization 3. Test smaller instances 4. Implement changes",
        risks: "Potential performance impact during transition"
      },
      {
        title: "Optimize Storage Classes",
        description: "Move infrequently accessed data to cheaper storage tiers like S3 IA or Glacier.",
        category: "storage",
        priority: "medium",
        estimatedSavings: "40-70%",
        effort: "low",
        timeline: "1-2 weeks",
        implementation: "1. Analyze access patterns 2. Set up lifecycle policies 3. Monitor cost impact",
        risks: "Increased retrieval costs for frequent access"
      },
      {
        title: "Implement Auto Scaling",
        description: "Set up auto scaling to automatically adjust capacity based on demand, reducing idle resource costs.",
        category: "compute",
        priority: "medium",
        estimatedSavings: "15-30%",
        effort: "medium",
        timeline: "2-4 weeks",
        implementation: "1. Define scaling policies 2. Set up CloudWatch alarms 3. Test scaling behavior 4. Monitor performance",
        risks: "Potential service disruption during scaling events"
      },
      {
        title: "Use Spot Instances for Fault-tolerant Workloads",
        description: "Leverage Spot Instances for batch processing, development, and testing environments.",
        category: "compute",
        priority: "medium",
        estimatedSavings: "60-90%",
        effort: "high",
        timeline: "1-3 months",
        implementation: "1. Identify suitable workloads 2. Implement fault tolerance 3. Set up Spot Fleet 4. Monitor interruptions",
        risks: "Instance interruptions may affect workload completion"
      }
    ];
  }

  async analyzeAnomalies(costData) {
    try {
      const prompt = `
      Analyze the following cost data for anomalies and unusual spending patterns:
      ${JSON.stringify(costData)}
      
      Based on the knowledgebase:
      ${this.knowledgebaseData}
      
      Identify potential cost anomalies and provide explanations. Return a JSON array of anomalies.
      `;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseAnomalies(response.text());
    } catch (error) {
      console.error('Error analyzing anomalies:', error);
      return [];
    }
  }

  parseAnomalies(aiResponse) {
    // Implementation for parsing anomaly analysis
    return [];
  }

  async generateWhatIfScenario(scenario) {
    try {
      const prompt = `
      Based on the knowledgebase and the following scenario, predict the cost impact:
      ${JSON.stringify(scenario)}
      
      Knowledgebase:
      ${this.knowledgebaseData}
      
      Provide a detailed cost analysis and recommendations.
      `;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return this.parseWhatIfAnalysis(response.text());
    } catch (error) {
      console.error('Error generating what-if scenario:', error);
      return null;
    }
  }

  parseWhatIfAnalysis(aiResponse) {
    // Implementation for parsing what-if analysis
    return {
      estimatedCostChange: 0,
      analysis: aiResponse,
      recommendations: []
    };
  }
}

module.exports = GeminiAIService;