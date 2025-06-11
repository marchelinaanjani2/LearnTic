import { useState, useEffect } from 'react'; // Add this import
import api from '../../api/Axios';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Bell 
} from 'lucide-react'; // Import the icons you're using

const NotificationsPanel = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/notification/viewall');
        setNotifications(response.data.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifikasi</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="p-6 text-center">Loading notifikasi...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Tidak ada notifikasi</div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;