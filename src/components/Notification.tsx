import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const bgColor = type === 'success' 
    ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-200 dark:border-accent-800' 
    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
  
  const iconColor = type === 'success' 
    ? 'text-accent-600 dark:text-accent-400' 
    : 'text-red-600 dark:text-red-400';
  
  const textColor = type === 'success' 
    ? 'text-accent-800 dark:text-accent-200' 
    : 'text-red-800 dark:text-red-200';

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl border backdrop-blur-sm shadow-strong ${bgColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <AlertCircle className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              title="Cerrar notificación"
              className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
