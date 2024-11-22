// components/dashboard/resumeProfile.jsx
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updateProfileSection, defaultResumeProfile } from '../../services/resumeProfileService';

const ResumeProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(defaultResumeProfile);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [activeSection, setActiveSection] = useState('skills');

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile(currentUser.uid);
      setProfile(userProfile);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error loading profile: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (section, data) => {
    try {
      setLoading(true);
      await updateProfileSection(currentUser.uid, section, data);
      setAlert({
        type: 'success',
        message: 'Profile section updated successfully'
      });
      loadProfile();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error updating profile: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Technical Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Expert Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.technical.expert.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Security Tools</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.securityTools.map((tool, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 rounded"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Job Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Preferred Roles</h4>
          <div className="flex flex-wrap gap-2">
            {profile.experience.preferredRoles.map((role, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Must-Haves</h4>
          <div className="flex flex-wrap gap-2">
            {profile.preferences.mustHaves.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Resume Profile</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveSection('skills')}
            variant={activeSection === 'skills' ? 'primary' : 'secondary'}
          >
            Skills
          </Button>
          <Button
            onClick={() => setActiveSection('preferences')}
            variant={activeSection === 'preferences' ? 'primary' : 'secondary'}
          >
            Preferences
          </Button>
        </div>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="space-y-6">
          {activeSection === 'skills' && renderSkillsSection()}
          {activeSection === 'preferences' && renderPreferencesSection()}
        </div>
      )}
    </Card>
  );
};

export default ResumeProfile;
