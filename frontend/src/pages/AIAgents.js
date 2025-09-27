import React, { useState, useEffect } from 'react';
import './AIAgents.css';

const AIAgents = () => {
  const [agentsStatus, setAgentsStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [automatedAnalysis, setAutomatedAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  useEffect(() => {
    fetchAgentsStatus();
    fetchRecommendations();
    fetchAutomatedAnalysis();
  }, []);

  const fetchAgentsStatus = async () => {
    try {
      const response = await fetch('/api/ai-agents/status');
      const data = await response.json();
      setAgentsStatus(data);
    } catch (error) {
      console.error('Error fetching agents status:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/ai-agents/recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchAutomatedAnalysis = async () => {
    try {
      const response = await fetch('/api/automated-analysis');
      const data = await response.json();
      setAutomatedAnalysis(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching automated analysis:', error);
      setLoading(false);
    }
  };

  const startAutomation = async () => {
    try {
      const response = await fetch('/api/ai-agents/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intervalMinutes: 30 })
      });
      const data = await response.json();
      if (data.success) {
        fetchAgentsStatus();
        alert('AI Agents automation started successfully!');
      }
    } catch (error) {
      console.error('Error starting automation:', error);
    }
  };

  const stopAutomation = async () => {
    try {
      const response = await fetch('/api/ai-agents/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        fetchAgentsStatus();
        alert('AI Agents automation stopped successfully!');
      }
    } catch (error) {
      console.error('Error stopping automation:', error);
    }
  };

  const runAllAgents = async () => {
    setRunningAnalysis(true);
    try {
      const response = await fetch('/api/ai-agents/run-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        await fetchAgentsStatus();
        await fetchRecommendations();
        await fetchAutomatedAnalysis();
        alert('All AI agents executed successfully!');
      }
    } catch (error) {
      console.error('Error running all agents:', error);
    } finally {
      setRunningAnalysis(false);
    }
  };

  const toggleAgent = async (agentKey, active) => {
    try {
      const response = await fetch(`/api/ai-agents/${agentKey}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      const data = await response.json();
      if (data.success) {
        fetchAgentsStatus();
      }
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  };

  const getAgentIcon = (specialty) => {
    const icons = {
      cost_navigation_optimization: '🧭',
      cost_savings_advisory: '💡',
      financial_operations: '📊',
      intelligent_decisions: '🧠',
      usage_optimization: '⚡',
      cost_management_assistance: '🤝',
      efficiency_sustainability: '🌱'
    };
    return icons[specialty] || '🤖';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="ai-agents-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading AI Agents Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-agents-container">
      <div className="ai-agents-header">
        <h1>🤖 AI Agents Dashboard</h1>
        <p>Automated cloud cost optimization powered by intelligent AI agents</p>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="automation-status">
          <h3>Automation Status</h3>
          <div className={`status-indicator ${agentsStatus?.isRunning ? 'active' : 'inactive'}`}>
            <span className="status-dot"></span>
            {agentsStatus?.isRunning ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="control-buttons">
          <button 
            className="btn-primary"
            onClick={startAutomation}
            disabled={agentsStatus?.isRunning}
          >
            Start Automation
          </button>
          <button 
            className="btn-secondary"
            onClick={stopAutomation}
            disabled={!agentsStatus?.isRunning}
          >
            Stop Automation
          </button>
          <button 
            className="btn-accent"
            onClick={runAllAgents}
            disabled={runningAnalysis}
          >
            {runningAnalysis ? 'Running...' : 'Run All Agents'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {automatedAnalysis && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">🤖</div>
            <div className="card-content">
              <h3>{automatedAnalysis.summary.totalAgents}</h3>
              <p>Total Agents</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>{automatedAnalysis.summary.activeAgents}</h3>
              <p>Active Agents</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">💡</div>
            <div className="card-content">
              <h3>{automatedAnalysis.summary.totalRecommendations}</h3>
              <p>Recommendations</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>${automatedAnalysis.summary.totalPotentialSavings.toLocaleString()}</h3>
              <p>Potential Savings</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Agents Grid */}
      <div className="agents-section">
        <h2>AI Agents</h2>
        <div className="agents-grid">
          {agentsStatus && Object.entries(agentsStatus.agents).map(([key, agent]) => (
            <div key={key} className={`agent-card ${agent.active ? 'active' : 'inactive'}`}>
              <div className="agent-header">
                <div className="agent-icon">{getAgentIcon(agent.specialty)}</div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p>{agent.role}</p>
                </div>
                <div className="agent-toggle">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={agent.active}
                      onChange={(e) => toggleAgent(key, e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="agent-stats">
                <div className="stat">
                  <span className="stat-label">Last Run:</span>
                  <span className="stat-value">
                    {agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Recommendations:</span>
                  <span className="stat-value">{agent.recommendations?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <h2>Latest Recommendations</h2>
        <div className="recommendations-grid">
          {recommendations.slice(0, 6).map((rec, index) => (
            <div key={rec.id || index} className="recommendation-card">
              <div className="recommendation-header">
                <h3>{rec.title}</h3>
                <div 
                  className="impact-badge"
                  style={{ backgroundColor: getImpactColor(rec.impact) }}
                >
                  {rec.impact}
                </div>
              </div>
              
              <p className="recommendation-description">{rec.description}</p>
              
              <div className="recommendation-details">
                <div className="detail">
                  <span className="detail-label">Agent:</span>
                  <span className="detail-value">{rec.agentName}</span>
                </div>
                {rec.savings && (
                  <div className="detail">
                    <span className="detail-label">Savings:</span>
                    <span className="detail-value">${rec.savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="detail">
                  <span className="detail-label">Effort:</span>
                  <span className="detail-value">{rec.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length > 6 && (
          <div className="view-all-recommendations">
            <button className="btn-outline">
              View All {recommendations.length} Recommendations
            </button>
          </div>
        )}
      </div>

      {/* Analysis Timeline */}
      {automatedAnalysis && (
        <div className="analysis-timeline">
          <h2>Recent Analysis</h2>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3>Automated Analysis Completed</h3>
              <p>All {automatedAnalysis.summary.totalAgents} AI agents completed their analysis</p>
              <span className="timeline-time">
                {new Date(automatedAnalysis.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgents;