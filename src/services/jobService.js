// src/services/jobsService.js
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where,
    getDocs,
    orderBy 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  export const jobsService = {
    // Create a new job application
    async createJob(userId, jobData) {
      try {
        const docRef = await addDoc(collection(db, 'jobs'), {
          ...jobData,
          userId,
          createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...jobData };
      } catch (error) {
        console.error('Error creating job:', error);
        throw error;
      }
    },
  
    // Get all jobs for a user
    async getUserJobs(userId) {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting jobs:', error);
        throw error;
      }
    },
  
    // Update a job
    async updateJob(jobId, updates) {
      try {
        const jobRef = doc(db, 'jobs', jobId);
        await updateDoc(jobRef, updates);
        return { id: jobId, ...updates };
      } catch (error) {
        console.error('Error updating job:', error);
        throw error;
      }
    },
  
    // Delete a job
    async deleteJob(jobId) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId));
        return jobId;
      } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
      }
    },
  
    // Get job statistics
    async getJobStats(userId) {
      try {
        const jobs = await this.getUserJobs(userId);
        return {
          total: jobs.length,
          applied: jobs.filter(job => job.status === 'Applied').length,
          interview: jobs.filter(job => job.status === 'Interview').length,
          offer: jobs.filter(job => job.status === 'Offer').length,
          rejected: jobs.filter(job => job.status === 'Rejected').length
        };
      } catch (error) {
        console.error('Error getting job stats:', error);
        throw error;
      }
    }
  };