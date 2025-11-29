export enum UserStage {
  StreamSprint = 'StreamSprint', // 11th-12th
  CourseCompass = 'CourseCompass', // College
  SkillBridge = 'SkillBridge', // Post Grads
  RoleRadar = 'RoleRadar', // Job Seekers
  CareerPivot = 'CareerPivot', // Switchers
}

export enum ToolType {
  None = 'None',
  QuizWise = 'QuizWise',
  WiseBot = 'WiseBot',
  CompareWise = 'CompareWise',
  PlayLab = 'PlayLab',
  MentorMate = 'MentorMate',
  WiseVault = 'WiseVault',
  ResuCraft = 'ResuCraft',
  InterViewer = 'InterViewer',
  ExploreHub = 'ExploreHub',
  Visualizer = 'Visualizer', // Image Gen & Edit
  LiveConversation = 'LiveConversation', // Live API
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  groundingUrls?: Array<{uri: string, title: string}>;
}

export interface CareerPath {
  title: string;
  description: string;
  skills: string[];
  outlook: string;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}