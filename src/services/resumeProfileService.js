// services/resumeProfileService.js

import { db } from '../firebase';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

// Collection names
const PROFILES_COLLECTION = 'resume_profiles';
const MATCHED_JOBS_COLLECTION = 'matched_jobs';

// Profile data
export const defaultResumeProfile = {
  basics: {
    name: 'Ethan Sam',
    email: 'es5888@nyu.edu',
    profiles: {
      linkedin: 'linkedin.com/in/ethansam',
      github: 'github.com/esamnyu',
    },
  },
  skills: {
    technical: {
      expert: [
        'Python',
        'JavaScript',
        'Cybersecurity',
        'Security Operations',
        'Vulnerability Assessment',
      ],
      proficient: [
        'C++',
        'SQL',
        'Bash',
        'React Native',
        'Docker',
        'Firestore',
        'TensorFlow',
        'PyTorch',
      ],
      familiar: [
        'Digital Forensics',
        'Cloud Security',
        'Applied Cryptography',
        'Network Security',
      ],
    },
    securityTools: [
      'CrowdStrike Falcon',
      'IBM QRadar',
      'Splunk',
      'Cortex XSoar',
      'EnCase',
      'Wireshark',
    ],
    frameworks: [
      'NIST CSF',
      'NIST SP-800-53',
      'React Native',
      'TensorFlow',
      'PyTorch',
    ],
  },
  experience: {
    currentRole: 'Security Engineer/Software Developer',
    yearsOfExperience: 3,
    preferredRoles: [
      'Security Engineer',
      'Software Developer',
      'Cybersecurity Engineer',
      'Security Analyst',
      'Software Security Engineer',
    ],
    industryExperience: [
      'Healthcare',
      'Government',
      'Cybersecurity',
      'Information Technology',
    ],
  },
  education: {
    highestDegree: {
      degree: 'M.S.',
      field: 'Cybersecurity',
      institution: 'New York University, Tandon School of Engineering',
      graduationYear: 2024,
      gpa: 3.96,
    },
  },
  preferences: {
    employmentType: ['Full-time'],
    workStyle: ['On-site', 'Hybrid', 'Remote'],
    salary: {
      minimum: 0,
      preferred: 0,
      currency: 'USD',
    },
    locations: {
      preferred: [],
      willingToRelocate: true,
    },
    mustHaves: [
      'Strong security focus',
      'Technical development opportunities',
      'AI/ML integration possibilities',
    ],
  },
  keywords: {
    technical: [
      'AI-driven solutions',
      'vulnerability assessments',
      'threat detection',
      'incident response',
      'security operations',
      'GRC',
      'infrastructure security',
      'cyber threat intelligence',
      'digital forensics',
      'machine learning',
      'NLP',
    ],
    domain: [
      'healthcare security',
      'government cybersecurity',
      'critical infrastructure',
      'OT/ICS systems',
      'security auditing',
    ],
  },
};

// Get user's resume profile
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION, userId));

    if (!profileDoc.exists()) {
      // Create default profile if none exists
      await createDefaultProfile(userId);
      return defaultResumeProfile;
    }

    return profileDoc.data();
  } catch (error) {
    console.error('Error fetching resume profile:', error);
    throw error;
  }
};

// Create default profile for new user
export const createDefaultProfile = async (userId) => {
  try {
    await setDoc(doc(db, PROFILES_COLLECTION, userId), {
      ...defaultResumeProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating default profile:', error);
    throw error;
  }
};

// Update specific section of the profile
export const updateProfileSection = async (userId, section, data) => {
  try {
    const updateData = {
      [section]: data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, PROFILES_COLLECTION, userId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating profile section:', error);
    throw error;
  }
};

// Save a matched job
export const saveMatchedJob = async (userId, jobData) => {
  try {
    const jobRef = collection(db, MATCHED_JOBS_COLLECTION);

    // Check for duplicate
    const duplicateQuery = query(
      jobRef,
      where('userId', '==', userId),
      where('jobId', '==', jobData.jobId)
    );

    const duplicateCheck = await getDocs(duplicateQuery);

    if (!duplicateCheck.empty) {
      return { success: false, message: 'Job already saved' };
    }

    await addDoc(jobRef, {
      ...jobData,
      userId,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: 'Job saved successfully' };
  } catch (error) {
    console.error('Error saving matched job:', error);
    throw error;
  }
};

// Update job application status
export const updateJobStatus = async (jobId, status) => {
  try {
    await updateDoc(doc(db, MATCHED_JOBS_COLLECTION, jobId), {
      status,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

// Get all matched jobs for a user
export const getMatchedJobs = async (userId) => {
  try {
    const jobsQuery = query(
      collection(db, MATCHED_JOBS_COLLECTION),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching matched jobs:', error);
    throw error;
  }
};

// Get jobs by status
export const getJobsByStatus = async (userId, status) => {
  try {
    const jobsQuery = query(
      collection(db, MATCHED_JOBS_COLLECTION),
      where('userId', '==', userId),
      where('status', '==', status)
    );

    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    throw error;
  }
};
