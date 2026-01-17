
import React from 'react';
import { Settings as SettingsIcon, Palette, Moon, Sun, Leaf, Check, Bell, Shield } from 'lucide-react';
import { UserProgress } from '../types';

interface SettingsProps {
  userProgress: UserProgress;
  onUpdateProgress: (data: Partial<UserProgress>) => void;
}

const Settings: React.FC<SettingsProps> = ({ userProgress, onUpdateProgress }) => {
  const themes = [
    { id: 'green', label: 'النمط الأخضر', icon: Leaf, color: 'bg-[#1e3f1c]', description: 'الأصيل والكلاسيكي' },
    { id: 'light', label: 'النمط الأبيض', icon: Sun, color: 'bg-white', border: 'border-slate-200', description: 'نقاء وهدوء تام' },
    { id: 'dark', label: 'النمط الداكن', icon: Moon, color: 'bg-[#0f172a]', description: 'للقراءة الليلية المريحة' },
  ];

  const handleThemeChange = (themeId: any) => {
    onUpdateProgress({ theme: themeId });
    document.body.setAttribute('data-theme', themeId === 'green' ? '' : themeId);
  };

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="theme-card p-10 rounded-[3.5rem] border shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 bg-soft-gold text-white rounded-3xl flex items-center justify-center border-4 border-white shadow-lg">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black theme-text">الإعدادات</h2>
          <p className="theme-text-muted font-medium">خصص تجربتك في منصة إتقان</p>
        </div>
      </header>

      <section className="theme-card p-10 rounded-[3.5rem] border shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b theme-border pb-6">
          <Palette size={24} className="text-soft-gold" />
          <h3 className="text-2xl font-bold theme-text">مظهر التطبيق (الألوان)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => {
            const isActive = userProgress.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
                  isActive 
                    ? 'border-soft-gold bg-soft-gold/5 scale-105 shadow-xl' 
                    : 'theme-border hover:border-soft-gold/30'
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner ${theme.color} ${theme.border || ''}`}>
                  <theme.icon size={32} className={theme.id === 'light' ? 'text-quiet-green' : 'text-white'} />
                </div>
                <div className="text-center">
                  <p className="font-black theme-text">{theme.label}</p>
                  <p className="text-[10px] theme-text-muted mt-1 uppercase tracking-widest">{theme.description}</p>
                </div>
                {isActive && (
                  <div className="absolute top-4 left-4 w-6 h-6 bg-soft-gold rounded-full flex items-center justify-center text-white shadow-lg">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="theme-card p-8 rounded-[3rem] border shadow-sm space-y-6">
           <div className="flex items-center gap-4 border-b theme-border pb-4">
              <Bell size={20} className="text-soft-gold" />
              <h4 className="font-bold theme-text">التنبيهات</h4>
           </div>
           <div className="flex items-center justify-between">
              <span className="theme-text font-medium">تنبيهات الأذكار</span>
              <div className="w-12 h-6 bg-quiet-green rounded-full relative">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="theme-text font-medium">تنبيهات الورد اليومي</span>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>
        </div>

        <div className="theme-card p-8 rounded-[3rem] border shadow-sm space-y-6">
           <div className="flex items-center gap-4 border-b theme-border pb-4">
              <Shield size={20} className="text-soft-gold" />
              <h4 className="font-bold theme-text">الحساب والخصوصية</h4>
           </div>
           <div className="space-y-4">
              <button className="w-full py-3 text-right px-4 hover:bg-soft-gold/5 rounded-xl transition-all theme-text text-sm">تغيير الاسم المستعار</button>
              <button className="w-full py-3 text-right px-4 hover:bg-soft-gold/5 rounded-xl transition-all theme-text text-sm">مسح الذاكرة المؤقتة</button>
              <button className="w-full py-3 text-right px-4 text-red-500 rounded-xl transition-all text-sm font-bold">حذف بيانات الرحلة نهائياً</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
