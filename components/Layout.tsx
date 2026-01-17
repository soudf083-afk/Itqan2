
import React, { useState } from 'react';
import { Home, Trophy, MessageSquare, Book, Users, Heart, User, Settings, Map, Shield, Lock } from 'lucide-react';
import { UserProgress } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProgress: UserProgress;
  onUpdateRole: (role: 'admin' | 'user') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userProgress, onUpdateRole }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      const newRole = userProgress.role === 'admin' ? 'user' : 'admin';
      onUpdateRole(newRole);
      setClickCount(0);
      alert(newRole === 'admin' ? "تم تفعيل وضع المسؤول بنجاح" : "تم العودة لوضع المستخدم");
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'الرئيسية', adminOnly: false },
    { id: 'journey', icon: Map, label: 'رحلة الحافظ', adminOnly: false },
    { id: 'library', icon: Book, label: 'المصحف', adminOnly: false },
    { id: 'competitions', icon: Trophy, label: 'المسابقات', adminOnly: false },
    { id: 'recite', icon: MessageSquare, label: 'التصحيح', adminOnly: false },
    { id: 'reciters', icon: Users, label: 'المقرئون', adminOnly: false },
    { id: 'azkar', icon: Heart, label: 'الأذكار', adminOnly: false },
    { id: 'profile', icon: User, label: 'حسابي', adminOnly: false },
    { id: 'admin', icon: Shield, label: 'لوحة التحكم', adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || userProgress.role === 'admin');

  return (
    <div className="h-screen flex flex-col md:flex-row theme-bg overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 theme-card border-l p-8 z-20 shadow-[20px_0_60px_rgba(0,0,0,0.02)] h-full">
        <div 
          onClick={handleLogoClick}
          className="flex flex-col items-center text-center gap-4 mb-16 cursor-pointer select-none group active:scale-95 transition-transform"
        >
          <div className="relative">
            <div className="px-6 py-4 itqan-logo-seal rounded-[1.8rem] flex items-center justify-center border-2 border-soft-gold/30 shadow-lg">
              <span className="text-white font-bold text-2xl quran-font leading-none">إتقان</span>
            </div>
            {userProgress.role === 'admin' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-soft-gold rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                <Shield size={10} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-quiet-green leading-none tracking-tight">إتقان</h1>
            <span className="text-[10px] font-black text-soft-gold tracking-[0.3em] uppercase mt-2">The Golden Path</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] transition-all duration-400 ${
                activeTab === item.id
                  ? 'bg-soft-gold/10 text-quiet-green font-black shadow-[0_10px_20px_rgba(217,119,6,0.05)] border-r-4 border-soft-gold'
                  : 'theme-text-muted hover:bg-slate-50 hover:theme-text'
              }`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-sm font-bold">{item.label}</span>
              {item.adminOnly && <Lock size={14} className="mr-auto text-soft-gold/30" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t theme-border">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.8rem] transition-all duration-300 ${
              activeTab === 'settings' ? 'bg-quiet-green text-white font-black shadow-xl' : 'theme-text-muted hover:bg-slate-50'
            }`}
          >
            <Settings size={22} />
            <span className="text-sm font-bold">الإعدادات</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pb-32 md:pb-0 relative islamic-pattern custom-scrollbar">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 theme-card backdrop-blur-2xl border px-4 py-3 flex justify-around items-center z-40 shadow-[0_25px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem]">
        {visibleNavItems.filter(item => item.id !== 'admin').slice(0, 5).map((item) => ( 
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 min-w-[50px] transition-all p-2 rounded-2xl ${
              activeTab === item.id ? 'text-quiet-green scale-125 bg-soft-gold/5 shadow-inner' : 'theme-text-muted'
            }`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </button>
        ))}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 min-w-[50px] transition-all p-2 rounded-2xl ${
            activeTab === 'settings' ? 'text-quiet-green scale-125 bg-soft-gold/5 shadow-inner' : 'theme-text-muted'
          }`}
        >
          <Settings size={24} />
        </button>
      </nav>
    </div>
  );
};

export default Layout;
