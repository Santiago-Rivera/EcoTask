export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider?: 'email' | 'google';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  groupId?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  assignedTo?: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  color: string;
  createdAt: Date;
}

export interface EcoEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'cleanup' | 'planting' | 'education' | 'conservation' | 'other';
  maxParticipants?: number;
  participants: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}