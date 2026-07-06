import API from './axiosConfig';

export const fetchLearningSkills = () => 
  API.get('/users/profile/skills/learning');

export const fetchAllSkills = () => 
  API.get('/mentors/skills/all');

export const addLearningSkill = (skillId, skillName) => {
  if (skillId) {
    return API.post('/users/profile/skills/learning', { skillId });
  }
  return API.post('/users/profile/skills/learning', { skillName });
};

export const removeLearningSkill = (skillId) => 
  API.delete(`/users/profile/skills/learning/${skillId}`);
