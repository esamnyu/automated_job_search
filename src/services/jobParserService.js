// services/jobParserService.js
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

class JobParserService {
  constructor() {
    this.jobBoards = {
      linkedin: {
        baseUrl: 'https://api.linkedin.com/v2/jobs',
        parseFunction: this.parseLinkedInJob
      },
      indeed: {
        baseUrl: 'https://api.indeed.com/v2/jobs',
        parseFunction: this.parseIndeedJob
      }
      // Add more job boards as needed
    };
  }

  // Parse resume to extract key skills and experience
  async parseResume(resumeText) {
    const keywords = new Set();
    const skills = new Set();
    
    // Add your resume parsing logic here
    // This could involve NLP or keyword extraction
    
    return {
      keywords: Array.from(keywords),
      skills: Array.from(skills),
      yearsOfExperience: 0 // Calculate based on resume
    };
  }

  // Score job posting against resume
  async scoreJobMatch(jobPosting, resumeProfile) {
    let score = 0;
    const weights = {
      skillMatch: 0.4,
      keywordMatch: 0.3,
      experienceMatch: 0.3
    };

    // Calculate skill match percentage
    const skillMatches = resumeProfile.skills.filter(skill => 
      jobPosting.requiredSkills.includes(skill.toLowerCase())
    ).length;
    const skillScore = skillMatches / jobPosting.requiredSkills.length;

    // Calculate keyword match
    const keywordMatches = resumeProfile.keywords.filter(keyword =>
      jobPosting.description.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    const keywordScore = keywordMatches / resumeProfile.keywords.length;

    // Calculate experience match
    const experienceScore = jobPosting.requiredExperience <= resumeProfile.yearsOfExperience ? 1 : 0;

    score = (skillScore * weights.skillMatch) +
            (keywordScore * weights.keywordMatch) +
            (experienceScore * weights.experienceMatch);

    return {
      overall: score,
      details: {
        skillScore,
        keywordScore,
        experienceScore
      }
    };
  }

  // Fetch and parse jobs from multiple job boards
  async fetchJobs(searchCriteria) {
    const jobs = [];
    const errors = [];

    for (const [platform, config] of Object.entries(this.jobBoards)) {
      try {
        const response = await fetch(`${config.baseUrl}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add necessary API keys and authentication
          },
          body: JSON.stringify(searchCriteria)
        });

        if (!response.ok) throw new Error(`${platform} API error`);
        
        const data = await response.json();
        const parsedJobs = data.jobs.map(config.parseFunction);
        jobs.push(...parsedJobs);
      } catch (error) {
        errors.push({ platform, error: error.message });
      }
    }

    return { jobs, errors };
  }

  // Store matched jobs in Firebase
  async saveMatchedJob(job, matchScore) {
    try {
      const jobsRef = collection(db, 'matched_jobs');
      const jobData = {
        ...job,
        matchScore,
        timestamp: new Date(),
        status: 'new'
      };

      await addDoc(jobsRef, jobData);
      return true;
    } catch (error) {
      console.error('Error saving matched job:', error);
      return false;
    }
  }

  // Check if job was already processed
  async checkDuplicate(jobId) {
    const jobsRef = collection(db, 'matched_jobs');
    const q = query(jobsRef, where('jobId', '==', jobId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Platform-specific parsing functions
  parseLinkedInJob(job) {
    return {
      id: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      description: job.description,
      requiredSkills: job.skills || [],
      requiredExperience: this.extractExperience(job.description),
      url: job.url,
      platform: 'linkedin'
    };
  }

  parseIndeedJob(job) {
    return {
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      description: job.snippet,
      requiredSkills: [], // Extract from description
      requiredExperience: this.extractExperience(job.snippet),
      url: job.url,
      platform: 'indeed'
    };
  }

  // Helper function to extract years of experience from job description
  extractExperience(description) {
    const experiencePattern = /(\d+)[\+]?\s+years?/i;
    const match = description.match(experiencePattern);
    return match ? parseInt(match[1]) : 0;
  }
}

export const jobParserService = new JobParserService();