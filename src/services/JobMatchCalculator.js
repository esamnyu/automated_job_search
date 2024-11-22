// services/JobMatchCalculator.js

export class JobMatchCalculator {
    // List of security-specific keywords from your resume
    static SECURITY_KEYWORDS = [
      'security', 'cybersecurity', 'vulnerability', 'threat', 'incident response',
      'forensics', 'penetration testing', 'security operations', 'grc', 'compliance',
      'nist', 'audit', 'risk assessment', 'threat intelligence', 'security tools',
      'security analysis', 'security engineering', 'security architecture'
    ];
  
    // List of AI/ML keywords from your resume
    static AI_ML_KEYWORDS = [
      'ai', 'artificial intelligence', 'machine learning', 'deep learning',
      'neural networks', 'nlp', 'natural language processing', 'tensorflow',
      'pytorch', 'data science', 'analytics', 'chatbot'
    ];
  
    // Security tools from your resume
    static SECURITY_TOOLS = [
      'crowdstrike', 'falcon', 'qradar', 'splunk', 'cortex', 'xsoar',
      'encase', 'wireshark', 'nist csf', 'nist sp-800-53'
    ];
  
    static calculateMatch(job, profile) {
      const scores = {
        securityMatch: this.calculateSecurityMatch(job),
        skillMatch: this.calculateSkillMatch(job, profile.skills),
        toolMatch: this.calculateToolMatch(job),
        aimlMatch: this.calculateAIMLMatch(job),
        educationMatch: this.calculateEducationMatch(job, profile.education)
      };
  
      // Calculate weighted average
      const weightedScore = (
        (scores.securityMatch * 0.3) +
        (scores.skillMatch * 0.25) +
        (scores.toolMatch * 0.20) +
        (scores.aimlMatch * 0.15) +
        (scores.educationMatch * 0.10)
      );
  
      return {
        overall: weightedScore,
        breakdown: scores,
        details: this.generateMatchDetails(scores)
      };
    }
  
    static calculateSecurityMatch(job) {
      const description = job.description.toLowerCase();
      const title = job.title.toLowerCase();
  
      const isSecurityRole = this.SECURITY_KEYWORDS.some(keyword => 
        title.includes(keyword.toLowerCase())
      );
  
      const securityKeywordCount = this.SECURITY_KEYWORDS.filter(keyword =>
        description.includes(keyword.toLowerCase())
      ).length;
  
      const securityScore = isSecurityRole ? 1 : 
        (securityKeywordCount / (this.SECURITY_KEYWORDS.length * 0.3));
  
      return Math.min(1, securityScore);
    }
  
    static calculateSkillMatch(job, profileSkills) {
      const description = job.description.toLowerCase();
      const requiredSkills = job.requiredSkills?.map(skill => skill.toLowerCase()) || [];
      
      const coreSkills = [
        'python', 'javascript', 'c++', 'sql', 'react native',
        'docker', 'firestore', 'bash'
      ];
  
      const skillMatches = coreSkills.filter(skill =>
        requiredSkills.includes(skill) || description.includes(skill)
      ).length;
  
      return skillMatches / Math.max(requiredSkills.length, coreSkills.length * 0.5);
    }
  
    static calculateToolMatch(job) {
      const description = job.description.toLowerCase();
      
      const toolMatches = this.SECURITY_TOOLS.filter(tool =>
        description.includes(tool.toLowerCase())
      ).length;
  
      if (toolMatches === 0 && !description.includes('security')) {
        return 1;
      }
  
      return Math.min(1, toolMatches / (this.SECURITY_TOOLS.length * 0.3));
    }
  
    static calculateAIMLMatch(job) {
      const description = job.description.toLowerCase();
      const title = job.title.toLowerCase();
  
      const isAIMLRole = this.AI_ML_KEYWORDS.some(keyword =>
        title.includes(keyword.toLowerCase())
      );
  
      const aimlKeywordCount = this.AI_ML_KEYWORDS.filter(keyword =>
        description.includes(keyword.toLowerCase())
      ).length;
  
      if (aimlKeywordCount === 0 && !isAIMLRole) {
        return 1;
      }
  
      return Math.min(1, (aimlKeywordCount / (this.AI_ML_KEYWORDS.length * 0.3)) + (isAIMLRole ? 0.5 : 0));
    }
  
    static calculateEducationMatch(job, education) {
      const description = job.description.toLowerCase();
      
      const degreeMap = {
        'bachelors': 1,
        "bachelor's": 1,
        'bs': 1,
        'masters': 2,
        "master's": 2,
        'ms': 2,
        'phd': 3,
        'doctorate': 3
      };
  
      let requiredLevel = 1;
      for (const [degree, level] of Object.entries(degreeMap)) {
        if (description.includes(degree)) {
          requiredLevel = level;
          break;
        }
      }
  
      const yourLevel = 2;
  
      return yourLevel >= requiredLevel ? 1 : 0.7;
    }
  
    static generateMatchDetails(scores) {
      const details = [];
      
      if (scores.securityMatch > 0.8) {
        details.push('Strong security focus matching your background');
      }
      
      if (scores.toolMatch > 0.7) {
        details.push('Requires security tools you\'re experienced with');
      }
      
      if (scores.aimlMatch > 0.7) {
        details.push('Involves AI/ML security applications');
      }
      
      if (scores.skillMatch > 0.8) {
        details.push('Excellent technical skill match');
      }
  
      return details;
    }
  
    static extractYearsOfExperience(description) {
      const experienceRegex = /(\d+)[\+]?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)/i;
      const match = description.match(experienceRegex);
      return match ? parseInt(match[1]) : null;
    }
}