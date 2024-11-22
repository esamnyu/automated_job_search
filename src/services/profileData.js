// services/profileData.js

export const profileData = {
    // Basic Information
    basics: {
      name: "Ethan Sam",
      email: "es5888@nyu.edu",
      profiles: {
        linkedin: "linkedin.com/in/ethansam",
        github: "github.com/esamnyu"
      }
    },
  
    // Core Competencies
    coreCompetencies: {
      security: [
        "Security Operations",
        "Vulnerability Assessment",
        "Threat Detection",
        "Incident Response",
        "Security Auditing",
        "GRC Implementation",
        "Digital Forensics",
        "Security Architecture"
      ],
      development: [
        "Full Stack Development",
        "AI/ML Integration",
        "Mobile Development",
        "API Development",
        "Database Design",
        "Cloud Architecture"
      ]
    },
  
    // Technical Skills Matrix
    skills: {
      programming: {
        expert: [
          "Python",
          "JavaScript",
          "SQL"
        ],
        proficient: [
          "C++",
          "Bash",
          "React Native"
        ],
        familiar: [
          "Ruby",
          "Go"
        ]
      },
      security: {
        expert: [
          "Vulnerability Assessment",
          "Security Operations",
          "NIST Framework Implementation"
        ],
        proficient: [
          "Digital Forensics",
          "Incident Response",
          "Threat Intelligence"
        ],
        familiar: [
          "Cloud Security",
          "Applied Cryptography",
          "Network Security"
        ]
      },
      tools: {
        security: [
          "CrowdStrike Falcon",
          "IBM QRadar",
          "Splunk",
          "Cortex XSoar",
          "EnCase",
          "Wireshark"
        ],
        development: [
          "Docker",
          "Firestore",
          "Git",
          "React Native",
          "TensorFlow",
          "PyTorch"
        ],
        frameworks: [
          "NIST CSF",
          "NIST SP-800-53"
        ]
      }
    },
  
    // Professional Experience Keywords
    experienceKeywords: {
      achievements: [
        "Reduced manual policy queries by 30%",
        "Enhanced infrastructure security by 25%",
        "Increased detection rates by 40%",
        "Improved accuracy by 20%",
        "Cut incident resolution times by 20%",
        "Boosted incident response efficiency by 15%"
      ],
      responsibilities: [
        "Security operations management",
        "Vulnerability assessment",
        "Threat detection implementation",
        "Incident response optimization",
        "Security tool integration",
        "Policy compliance",
        "Security auditing"
      ]
    },
  
    // Education and Certifications
    education: {
      degrees: [
        {
          degree: "M.S.",
          field: "Cybersecurity",
          institution: "New York University, Tandon School of Engineering",
          graduationYear: 2024,
          gpa: 3.96,
          relevantCoursework: [
            "Network Security",
            "Digital Forensics",
            "Cloud Security",
            "Applied Cryptography",
            "Penetration Testing",
            "Vulnerability Analysis",
            "Threat Intelligence",
            "Artificial Intelligence",
            "Machine Learning",
            "NLP"
          ]
        },
        {
          degree: "B.S.",
          field: "Computer Science",
          institution: "City University of New York: Hunter College",
          graduationYear: 2021
        }
      ]
    },
  
    // Job Preferences
    preferences: {
      roles: [
        "Security Engineer",
        "Security Analyst",
        "Software Security Engineer",
        "Cybersecurity Engineer",
        "Security Operations Engineer",
        "AI Security Engineer"
      ],
      industries: [
        "Healthcare",
        "Government",
        "Technology",
        "Financial Services",
        "Critical Infrastructure"
      ],
      workType: {
        preferred: ["Full-time"],
        considered: ["Contract", "Remote"]
      },
      locations: {
        preferred: ["New York", "Remote"],
        willingToRelocate: true
      }
    },
  
    // Application Parameters
    applicationParams: {
      matchWeights: {
        securitySkills: 0.30,
        technicalSkills: 0.25,
        toolExperience: 0.20,
        aimlExperience: 0.15,
        education: 0.10
      },
      minimumMatchScore: 0.70,
      keywordBoosts: {
        security: 1.5,
        ai: 1.3,
        development: 1.2
      }
    },
  
    // Achievement Metrics
    achievements: {
      awards: [
        "CSAW LLM Attack CTF – 2nd Place",
        "ISACA/National Cyber League CTF Scholarship",
        "Best Challenge Award - CSAW"
      ],
      projects: [
        {
          name: "Roomies App",
          role: "Lead Developer",
          technologies: ["React Native", "Firestore"],
          metrics: ["40% reduction in roommate disputes", "30% improvement in task completion"]
        },
        {
          name: "Cyber Security Awareness Week",
          role: "Developer",
          technologies: ["CNNs", "GPT-3", "TensorFlow", "PyTorch", "Docker"],
          achievements: ["Best Challenge Award", "300+ participants"]
        }
      ]
    },
  
    // Industry Keywords
    industryKeywords: {
      technical: [
        "cybersecurity",
        "artificial intelligence",
        "machine learning",
        "cloud security",
        "threat detection",
        "vulnerability assessment",
        "incident response",
        "security operations",
        "digital forensics",
        "network security"
      ],
      domain: [
        "healthcare security",
        "government systems",
        "critical infrastructure",
        "OT/ICS systems",
        "compliance",
        "risk management"
      ],
      methodologies: [
        "NIST framework",
        "agile development",
        "DevSecOps",
        "security by design"
      ]
    }
  };
  
  // Export specialized keyword sets for matching
  export const keywordSets = {
    securityKeywords: [
      ...profileData.coreCompetencies.security,
      ...profileData.skills.security.expert,
      ...profileData.skills.security.proficient
    ],
    
    technicalKeywords: [
      ...profileData.skills.programming.expert,
      ...profileData.skills.programming.proficient,
      ...profileData.skills.tools.development
    ],
    
    aiKeywords: [
      "artificial intelligence",
      "machine learning",
      "neural networks",
      "deep learning",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "computer vision"
    ]
  };
  
  // Export matching thresholds
  export const matchingThresholds = {
    excellent: 0.85,
    good: 0.75,
    moderate: 0.65,
    minimum: 0.50
  };
  
  // Export job types to watch for
  export const targetJobTypes = {
    primary: [
      "Security Engineer",
      "Cybersecurity Engineer",
      "Security Analyst",
      "Software Security Engineer"
    ],
    secondary: [
      "Software Engineer",
      "DevSecOps Engineer",
      "AI Engineer",
      "Machine Learning Engineer"
    ]
  };
  
  // Helper function to get relevance score for a job title
  export const getJobTitleRelevance = (title) => {
    const titleLower = title.toLowerCase();
    
    // Check primary job types
    for (const primaryRole of targetJobTypes.primary) {
      if (titleLower.includes(primaryRole.toLowerCase())) {
        return 1.0;
      }
    }
    
    // Check secondary job types
    for (const secondaryRole of targetJobTypes.secondary) {
      if (titleLower.includes(secondaryRole.toLowerCase())) {
        return 0.8;
      }
    }
    
    // Default score for other titles
    return 0.4;
  };