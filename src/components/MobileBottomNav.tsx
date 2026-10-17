import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Droplet, 
  PlusCircle, 
  LayoutDashboard, 
  User, 
  LogIn 
} from 'lucide-react';
import { User as UserType } from '../types';

interface MobileBottomNavProps {
  currentUser: UserType | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentUser }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center gap-1">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            isActive('/') ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">হোম</span>
        </Link>

        {/* Find Donors */}
        <Link
          to="/donors"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            isActive('/donors') ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">রক্তদাতা</span>
        </Link>

        {/* Request Blood (Center Action) */}
        <Link
          to="/request-blood"
          className="flex flex-col items-center justify-center -mt-4 py-1"
        >
          <div className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 ring-4 ring-white">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] mt-1 font-bold text-rose-600 leading-none">অনুরোধ</span>
        </Link>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            isActive('/dashboard') ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">ড্যাশবোর্ড</span>
        </Link>

        {/* Profile or Login */}
        {currentUser ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive('/profile') ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-black">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-[10px] mt-0.5 leading-none truncate max-w-[48px]">প্রোফাইল</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive('/login') ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">লগইন</span>
          </Link>
        )}
      </div>
    </nav>
  );
};
