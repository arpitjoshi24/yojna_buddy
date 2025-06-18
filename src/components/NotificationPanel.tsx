import React from 'react';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, Info, CheckCircle, X, Clock } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications } = useData();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={16} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50';
      case 'error':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80 max-h-[80vh] border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Notifications</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 border-b border-gray-100 ${getBgColor(notification.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-2">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 flex flex-col items-center">
            <Clock size={24} className="mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;