import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs,
    serverTimestamp 
  } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  export const jobService = {
    async getAllJobs() {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');
  
        // Query Firestore for all jobs belonging to the current user
        const jobsRef = collection(db, 'jobs');
        const q = query(jobsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        // Convert the query snapshot to an array of jobs
        const jobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        // Convert Firestore Timestamps to regular dates for easier handling
        return jobs.map(job => ({
          ...job,
          createdAt: job.createdAt?.toDate(),
          updatedAt: job.updatedAt?.toDate()
        }));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
    },
  
    async addJob(jobData) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');
  
        // Prepare the job data with timestamps and user ID
        const newJob = {
          ...jobData,
          userId,
          status: jobData.status || 'applied',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
  
        // Add the document to Firestore
        const jobsRef = collection(db, 'jobs');
        const docRef = await addDoc(jobsRef, newJob);
  
        // Return the new job with its ID
        return {
          id: docRef.id,
          ...newJob,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } catch (error) {
        console.error('Error adding job:', error);
        throw error;
      }
    },
  
    async updateJob(jobId, updates) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');
  
        // Get reference to the job document
        const jobRef = doc(db, 'jobs', jobId);
  
        // Prepare updates with timestamp
        const updatedData = {
          ...updates,
          updatedAt: serverTimestamp()
        };
  
        // Update the document in Firestore
        await updateDoc(jobRef, updatedData);
  
        // Return the updated data
        return {
          id: jobId,
          ...updates,
          updatedAt: new Date()
        };
      } catch (error) {
        console.error('Error updating job:', error);
        throw error;
      }
    },
  
    async deleteJob(jobId) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');
  
        // Delete the document from Firestore
        const jobRef = doc(db, 'jobs', jobId);
        await deleteDoc(jobRef);
        
        return true;
      } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
      }
    }
  };