import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Droplet, 
  Menu, 
  X, 
  Bell, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown,
  Layers,
  Heart,
  LogIn,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { User, UserRole, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onRoleChange: (role: UserRole) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onNotificationClick: (item: NotificationItem) => void;
  urgentCount: number;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  notifications,
  unreadCount,
  onNotificationClick,
  urgentCount,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'হোম' },
    { path: '/donors', label: 'রক্তদাতা খুঁজুন' },
    { path: '/request-blood', label: 'রক্তের অনুরোধ' },
    { path: '/emergency', label: 'জরুরি রক্ত', hasBadge: true },
    { path: '/campaigns', label: 'রক্তদান ক্যাম্প' },
    { path: '/organizations', label: 'সংগঠন' },
    { path: '/volunteer', label: 'স্বেচ্ছাসেবক' },
    { path: '/hospitals', label: 'হাসপাতাল' },
    { path: '/about', label: 'আমাদের সম্পর্কে' }
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/"
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Droplet className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  তথ্যহাব <span className="text-rose-600">ব্লাড</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block font-sans">
                  TotthoHub Blood
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 text-xs lg:text-[13px] font-medium text-slate-700">
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors hover:text-rose-600 flex items-center gap-1.5 whitespace-nowrap ${
                    active ? 'text-rose-600 font-bold' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hasBadge && urgentCount > 0 && (
                    <span className="text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                      {urgentCount}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* If NOT logged in: Show Login button */}
            {!currentUser && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-600" />
                <span>লগইন</span>
              </Link>
            )}

            {/* If logged in: Show User Profile link */}
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200"
                  title={currentUser.name}
                >
                  {currentUser.name.charAt(0)}
                </Link>

                <Link
                  to="/profile"
                  className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border-slate-200'
                  }`}
                  title="আমার প্রোফাইল"
                >
                  <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span className="max-w-[120px] truncate">{currentUser.name || 'আমার প্রোফাইল'}</span>
                </Link>
              </>
            )}

            {/* Logout button (Only when logged in) */}
            {currentUser && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">লগআউট</span>
              </button>
            )}

            {/* Become a Donor Button */}
            <Link
              to="/become-donor"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>রক্তদাতা হোন</span>
            </Link>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="বিজ্ঞপ্তি"
                title="বিজ্ঞপ্তি"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">বিজ্ঞপ্তি</span>
                    <span className="text-xs text-rose-600 font-medium">{unreadCount}টি নতুন</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">কোনো নতুন বিজ্ঞপ্তি নেই</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            onNotificationClick(n);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-rose-50/40' : ''}`}
                        >
                          <div className="text-xs font-medium text-slate-900 mb-0.5">{n.title}</div>
                          <div className="text-xs text-slate-600 line-clamp-2">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Direct Button */}
            <Link
              to="/dashboard"
              className={`p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors hidden sm:block ${
                location.pathname === '/dashboard' ? 'text-rose-600 bg-rose-50' : ''
              }`}
              title="ড্যাশবোর্ড"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-rose-600" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-150 space-y-1">
          {navLinks.map(link => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  active 
                    ? 'bg-rose-50 text-rose-600 font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.hasBadge && urgentCount > 0 && (
                  <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                    {urgentCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            {!currentUser ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                লগইন
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer"
              >
                লগআউট
              </button>
            )}
            <Link
              to="/become-donor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              রক্তদাতা হোন
            </Link>
          </div>

          {currentUser && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 text-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl block border border-rose-200"
              >
                আমার প্রোফাইল
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 text-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl block border border-slate-200"
              >
                ড্যাশবোর্ড
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
