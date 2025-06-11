import { Users, BookOpen, TrendingUp, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

const DashboardCard = ({ title, value, subtitle, color, icon: Icon, trend, onClick }) => {
  // Map warna untuk gradient background
  const colorMap = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600',
    yellow: 'from-yellow-400 to-yellow-500',
    teal: 'from-teal-400 to-teal-600'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color] || 'from-slate-400 to-slate-600'} 
      rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer 
      transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-4xl font-extrabold mb-1 drop-shadow-lg">{value}</h3>
          <p className="text-sm opacity-90 font-medium tracking-wide">{title}</p>
        </div>
        {Icon && <Icon className="w-12 h-12 opacity-90 drop-shadow-md" />}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs opacity-80 font-light">{subtitle}</p>
        {trend && (
          <span className="text-xs bg-white bg-opacity-30 px-3 py-1 rounded-full font-semibold shadow">
            {trend}
          </span>
        )}
      </div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white bg-opacity-5 rounded-full"></div>
    </div>
  );
};

export default DashboardCard;
