import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, BookOpen, Calendar, CreditCard, Bell, 
  Home, LogOut, GraduationCap, ClipboardList, FileText, User as UserIcon,
  Briefcase, DollarSign, ShoppingBag
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, hasRole, logout } = useAuth();

  const getNavLinks = () => {
    const links = [{ name: 'Dashboard', to: '/', icon: <Home className="w-5 h-5" /> }];

    if (hasRole('admin')) {
      links.push(
        { name: 'Users', to: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Registrations', to: '/admin/registrations', icon: <ClipboardList className="w-5 h-5" /> }
      );
    }
    
    if (hasRole('admin') || hasRole('director') || hasRole('secretary')) {
      links.push(
        { name: 'Announcements', to: '/announcements', icon: <Bell className="w-5 h-5" /> },
        { name: 'Teacher Jobs', to: '/admin/teacher-applications', icon: <Briefcase className="w-5 h-5" /> }
      );
    }
    
    if (hasRole('director')) {
      links.push(
        { name: 'Groups', to: '/director/groups', icon: <Users className="w-5 h-5" /> },
        { name: 'Courses', to: '/courses', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Timetable', to: '/director/timetable', icon: <Calendar className="w-5 h-5" /> }
      );
    }

    if (hasRole('teacher')) {
      links.push(
        { name: 'My Profile', to: '/teacher/profile', icon: <UserIcon className="w-5 h-5" /> },
        { name: 'My Courses', to: '/courses', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Announcements', to: '/announcements/feed', icon: <Bell className="w-5 h-5" /> },
        { name: 'Timetable', to: '/timetable', icon: <Calendar className="w-5 h-5" /> },
        { name: 'Homework', to: '/teacher/assignments', icon: <FileText className="w-5 h-5" /> },
        { name: 'Grades', to: '/teacher/grades', icon: <GraduationCap className="w-5 h-5" /> }
      );
    }

    if (hasRole('student')) {
      // Replace default Dashboard with student specific one
      if (links[0].to === '/') links.shift();
      links.push(
        { name: 'My Academic', to: '/', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Announcements', to: '/announcements/feed', icon: <Bell className="w-5 h-5" /> },
        { name: 'My Homework', to: '/student/homework', icon: <FileText className="w-5 h-5" /> },
        { name: 'Exam Results', to: '/student/grades', icon: <GraduationCap className="w-5 h-5" /> }
      );
    }

    if (hasRole('accountant')) {
      links.push(
        { name: 'Employee Salaries', to: '/accountant/payments', icon: <DollarSign className="w-5 h-5" /> },
        { name: 'Student Fees', to: '/accountant/student-payments', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'School Expenses', to: '/accountant/expenses', icon: <ShoppingBag className="w-5 h-5" /> }
      );
    }

    if (hasRole('secretary')) {
      links.push(
        { name: 'Users', to: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Registrations', to: '/admin/registrations', icon: <ClipboardList className="w-5 h-5" /> }
      );
    }

    return links;
  };

  const roleDisplay = user?.roles[0]?.display_name || 'User';

  return (
    <div className="w-64 glass h-screen flex flex-col fixed left-0 top-0 z-10 border-r border-slate-200">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
          E
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-800 leading-tight">Ecole<span className="text-primary-600">Langues</span></h1>
          <p className="text-xs text-slate-500 font-medium">Management System</p>
        </div>
      </div>

      <div className="px-6 py-4 mb-4">
        <div className="flex items-center space-x-3 p-3 bg-slate-100/50 rounded-xl border border-slate-200/60">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-slate-500 capitalize">{roleDisplay}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {getNavLinks().map((link) => (
          <NavLink
            key={`${link.to}-${link.name}`}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
