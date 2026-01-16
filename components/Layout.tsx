
import React from 'react';
import { Home, Trophy, MessageSquare, Book, Users, Heart, User, Settings, Map, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'الرئيسية' },
    { id: 'journey', icon: Map, label: 'رحلة الحافظ' },
    { id: 'library', icon: Book, label: 'المصحف' },
    { id: 'competitions', icon: Trophy, label: 'المسابقات' },
    { id: 'recite', icon: MessageSquare, label: 'التصحيح' },
    { id: 'reciters', icon: Users, label: 'المقرئون' },
    { id: 'azkar', icon: Heart, label: 'الأذكار' },
    { id: 'profile', icon: User, label: 'حسابي' },
    { id: 'admin', icon: Shield, label: 'لوحة التحكم' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fdfcf9] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-l border-slate-100 p-6 z-20 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-quiet-green rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 border-b-4 border-soft-gold">
            <span className="text-white font-bold text-2xl quran-font">إ</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-quiet-green leading-none">إتقان</h1>
            <span className="text-[10px] font-bold text-soft-gold tracking-widest uppercase mt-1">itqan platform</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-emerald-50/50 text-quiet-green font-black shadow-sm border-r-4 border-soft-gold'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
            <Settings size={20} />
            <span className="text-sm">الإعدادات</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pb-24 md:pb-0 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl border border-slate-100 px-4 py-3 flex justify-around items-center z-30 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-[2.5rem]">
        {navItems.filter(item => item.id !== 'admin').slice(0, 5).map((item) => ( // Show first 5 items on mobile, excluding admin
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 min-w-[50px] transition-all ${
              activeTab === item.id ? 'text-quiet-green scale-110' : 'text-slate-300'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
