import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Droplet, 
  Menu, 
  X, 
  Bell, 
  UserCheck, 
  Heart, 
  LogIn, 
  LogOut, 
  LayoutDashboard,
  PlusCircle,
  PhoneCall,
  User as UserIcon,
  ShieldCheck
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
  notifications,
  unreadCount,
  onNotificationClick,
  urgentCount,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'হোম' },
    { path: '/donors', label: 'রক্তদাতা খুঁজুন' },
    { path: '/request-blood', label: 'রক্তের অনুরোধ', hasBadge: true },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo / Brand - Never squished, shrink-0 */}
          <div className="flex items-center shrink-0">
            <Link 
              to="/"
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">
                  তথ্যহাব <span className="text-rose-600">ব্লাড</span>
                </span>
                <span className="text-[9px] text-slate-400 font-semibold leading-none hidden sm:block font-sans mt-0.5">
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* If NOT logged in: Show compact Login button */}
            {!currentUser && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-200/80 shadow-2xs whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </Link>
            )}

            {/* If logged in: Show Avatar / Profile link */}
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-xl hover:bg-slate-100 transition-colors"
                  title={currentUser.name}
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border border-rose-300 shadow-2xs" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </Link>
              </>
            )}

            {/* Become a Donor Button (Hidden on small mobile screens to prevent overflow; available in drawer and bottom nav) */}
            <Link
              to="/become-donor"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>রক্তদাতা হোন</span>
            </Link>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                aria-label="বিজ্ঞপ্তি"
                title="বিজ্ঞপ্তি"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">বিজ্ঞপ্তি</span>
                    <span className="text-xs text-rose-600 font-bold">{unreadCount}টি নতুন</span>
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

            {/* Dashboard Direct Button (Desktop/Tablet) */}
            <Link
              to="/dashboard"
              className={`p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors hidden sm:block ${
                location.pathname === '/dashboard' ? 'text-rose-600 bg-rose-50' : ''
              }`}
              title="ড্যাশবোর্ড"
            >
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200/90 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150 space-y-3">
          
          {/* User Status Card in Drawer */}
          {currentUser ? (
            <div className="p-3.5 bg-gradient-to-r from-rose-50 to-slate-50 rounded-2xl border border-rose-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-rose-300" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 text-sm leading-tight">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser.phone}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {currentUser.role}
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900">তথ্যহাব ব্লাড অ্যাকাউন্ট</div>
                <div className="text-[11px] text-slate-500">লগইন করে রক্তদান তথ্য আপডেট রাখুন</div>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shrink-0 shadow-2xs"
              >
                লগইন করুন
              </Link>
            </div>
          )}

          {/* Quick Actions Grid in Drawer */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/become-donor"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 text-center text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>রক্তদাতা হোন</span>
            </Link>

            <Link
              to="/request-blood"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 text-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>জরুরি অনুরোধ</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5 pt-1">
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
          </div>

          {/* User Links / Logout */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl block"
                >
                  আমার প্রোফাইল
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl block"
                >
                  ড্যাশবোর্ড
                </Link>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট করুন</span>
                </button>
              )}
            </div>
          )}

          {/* Emergency Helpline Footer in Drawer */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between px-1">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-rose-600" />
              <span>জরুরি রক্ত হেল্পলাইন:</span>
            </span>
            <a href="tel:16263" className="font-bold text-rose-600 font-mono hover:underline">
              ১৬২৬৩ / ৯৯৯
            </a>
          </div>

        </div>
      )}
    </header>
  );
};
