import { create } from 'zustand';
import { Task, Group, EcoEvent, Category } from '../types';
import { autoEmailService } from '../services/autoEmailService';

interface AppState {
  tasks: Task[];
  groups: Group[];
  events: EcoEvent[];
  categories: Category[];
  selectedTask: Task | null;
  selectedGroup: Group | null;
  selectedEvent: EcoEvent | null;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  
  // Group actions
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  setSelectedGroup: (group: Group | null) => void;
  
  // Event actions
  addEvent: (event: Omit<EcoEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<EcoEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedEvent: (event: EcoEvent | null) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Trabajo', color: '#3B82F6', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#10B981', icon: 'user' },
  { id: '3', name: 'Ecológico', color: '#059669', icon: 'leaf' },
  { id: '4', name: 'Educación', color: '#8B5CF6', icon: 'book-open' },
];

export const useAppStore = create<AppState>((set) => ({
  tasks: [],
  groups: [],
  events: [],
  categories: defaultCategories,
  selectedTask: null,
  selectedGroup: null,
  selectedEvent: null,
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    
    // Enviar notificación automática por email
    autoEmailService.notifyTaskCreated(newTask).catch(error => {
      console.error('Error al enviar notificación de tarea creada:', error);
    });
  },
  
  updateTask: (id, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      );
      
      // Obtener la tarea actualizada para la notificación
      const updatedTask = updatedTasks.find(task => task.id === id);
      if (updatedTask) {
        // Enviar notificación automática por email
        autoEmailService.notifyTaskUpdated(updatedTask).catch(error => {
          console.error('Error al enviar notificación de tarea actualizada:', error);
        });
      }
      
      return { tasks: updatedTasks };
    });
  },
  
  deleteTask: (id) => {
    set((state) => {
      // Obtener la tarea antes de eliminarla para la notificación
      const taskToDelete = state.tasks.find(task => task.id === id);
      if (taskToDelete) {
        // Enviar notificación automática por email
        autoEmailService.notifyTaskDeleted(taskToDelete.title).catch(error => {
          console.error('Error al enviar notificación de tarea eliminada:', error);
        });
      }
      
      return {
        tasks: state.tasks.filter(task => task.id !== id)
      };
    });
  },
  
  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },
  
  addGroup: (groupData) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => ({ groups: [...state.groups, newGroup] }));
    
    // Enviar notificación automática por email
    autoEmailService.notifyGroupCreated(newGroup).catch(error => {
      console.error('Error al enviar notificación de grupo creado:', error);
    });
  },
  
  updateGroup: (id, updates) => {
    set((state) => {
      const updatedGroups = state.groups.map(group => 
        group.id === id ? { ...group, ...updates } : group
      );
      
      // Obtener el grupo actualizado para la notificación
      const updatedGroup = updatedGroups.find(group => group.id === id);
      if (updatedGroup) {
        // Enviar notificación automática por email
        autoEmailService.notifyGroupUpdated(updatedGroup).catch(error => {
          console.error('Error al enviar notificación de grupo actualizado:', error);
        });
      }
      
      return { groups: updatedGroups };
    });
  },
  
  deleteGroup: (id) => {
    set((state) => {
      // Obtener el grupo antes de eliminarlo para la notificación
      const groupToDelete = state.groups.find(group => group.id === id);
      if (groupToDelete) {
        // Enviar notificación automática por email
        autoEmailService.notifyGroupDeleted(groupToDelete.name).catch(error => {
          console.error('Error al enviar notificación de grupo eliminado:', error);
        });
      }
      
      return {
        groups: state.groups.filter(group => group.id !== id)
      };
    });
  },
  
  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
  },
  
  addEvent: (eventData) => {
    const newEvent: EcoEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => ({ events: [...state.events, newEvent] }));
    
    // Enviar notificación automática por email
    autoEmailService.notifyEventCreated(newEvent).catch(error => {
      console.error('Error al enviar notificación de evento creado:', error);
    });
  },
  
  updateEvent: (id, updates) => {
    set((state) => {
      const updatedEvents = state.events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      
      // Obtener el evento actualizado para la notificación
      const updatedEvent = updatedEvents.find(event => event.id === id);
      if (updatedEvent) {
        // Enviar notificación automática por email
        autoEmailService.notifyEventUpdated(updatedEvent).catch(error => {
          console.error('Error al enviar notificación de evento actualizado:', error);
        });
      }
      
      return { events: updatedEvents };
    });
  },
  
  deleteEvent: (id) => {
    set((state) => {
      // Obtener el evento antes de eliminarlo para la notificación
      const eventToDelete = state.events.find(event => event.id === id);
      if (eventToDelete) {
        // Enviar notificación automática por email
        autoEmailService.notifyEventDeleted(eventToDelete.title).catch(error => {
          console.error('Error al enviar notificación de evento eliminado:', error);
        });
      }
      
      return {
        events: state.events.filter(event => event.id !== id)
      };
    });
  },
  
  setSelectedEvent: (event) => {
    set({ selectedEvent: event });
  },
}));