import * as mongoStore from './mongoStore.js';

export function createStore() {
  return {
    async getState(userId = 'default_user') {
      return mongoStore.getDashboard(userId);
    },
    async registerUser(payload) {
      return mongoStore.registerUser(payload);
    },
    async loginUser(payload) {
      return mongoStore.loginUser(payload);
    },
    async getDashboard(userId) {
      return mongoStore.getDashboard(userId);
    },
    async getGoals(userId) {
      return mongoStore.getGoals(userId);
    },
    async addGoal(userId, title) {
      return mongoStore.addGoal(userId, title);
    },
    async updateGoal(userId, id, patch) {
      return mongoStore.updateGoal(userId, id, patch);
    },
    async deleteGoal(userId, id) {
      return mongoStore.deleteGoal(userId, id);
    },
    async getResume(userId) {
      return mongoStore.getResume(userId);
    },
    async optimizeResume(userId, resumeText, targetRole) {
      return mongoStore.optimizeResume(userId, resumeText, targetRole);
    },
    async analyzeJD(userId, jobDescription) {
      return mongoStore.analyzeJD(userId, jobDescription);
    },
    async handleChat(userId, userMessage) {
      return mongoStore.handleChat(userId, userMessage);
    },
    async getCoachData(userId) {
      return mongoStore.getCoachData(userId);
    },
    async getRoadmap(userId) {
      return mongoStore.getRoadmap(userId);
    },
    async generateRoadmap(userId, targetRole, targetCompany) {
      return mongoStore.generateRoadmap(userId, targetRole, targetCompany);
    },
    async updateMilestone(userId, id, patch) {
      return mongoStore.updateMilestone(userId, id, patch);
    },
    async getNotifications(userId) {
      return mongoStore.getNotifications(userId);
    },
    async deleteNotification(userId, id) {
      return mongoStore.deleteNotification(userId, id);
    },
    async getPractice(userId) {
      return mongoStore.getPractice(userId);
    },
    async submitPractice(userId, payload) {
      return mongoStore.submitPractice(userId, payload);
    },
    async getInterviewReport(userId) {
      return mongoStore.getInterviewReport(userId);
    },
    async getProfile(userId) {
      return mongoStore.getProfile(userId);
    },
    async updateProfile(userId, profilePatch) {
      return mongoStore.updateProfile(userId, profilePatch);
    },
    async getSettings(userId) {
      return mongoStore.getSettings(userId);
    },
    async updateSettings(userId, settingsPatch) {
      return mongoStore.updateSettings(userId, settingsPatch);
    },
    async getAdminData() {
      return mongoStore.getAdminData();
    },
  };
}

export function resetStore() {
  // Store is now MongoDB backed.
}
