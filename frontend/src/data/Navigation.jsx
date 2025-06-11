export const navigation = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'Home', 
    roles: ['TEACHER', 'PARENT', 'STUDENT'],
    href: '/dashboard'
  },
  { 
    id: 'students', 
    label: 'Manajemen Siswa', 
    icon: 'Users', 
    roles: ['TEACHER', 'STUDENT'],
    href: '/students'
  },
  { 
    id: 'input-scores', 
    label: 'Input Nilai', 
    icon: 'BookOpen', 
    roles: ['TEACHER'],
    href: '/input-scores'
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    icon: 'TrendingUp', 
    roles: ['TEACHER'],
    href: '/performance'
  },
  { 
    id: 'notifications', 
    label: 'Notifikasi', 
    icon: 'Bell', 
    roles: ['TEACHER', 'PARENT', 'STUDENT'],
    href: '/notifications'
  },
];


export const userNavigation = [
  { name: 'Profil', href: '/profile' },
  { name: 'Log out', href: '/logout' },
];
