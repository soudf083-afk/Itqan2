
import React, { useState } from 'react';
import { Shield, Users, Edit, Save, User } from 'lucide-react';
import { UserProgress } from '../types';

interface AdminPanelProps {
  reciters: any[];
  setReciters: React.Dispatch<React.SetStateAction<any[]>>;
  userProgress: UserProgress;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ reciters, setReciters, userProgress }) => {
  const [welcomeTitle, setWelcomeTitle] = useState(`${userProgress.userName}،<br/><span class="text-soft-gold">نور قلبك</span> يزداد إشراقاً`);
  const [motivationMessage, setMotivationMessage] = useState("خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ");
  
  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 bg-quiet-green text-white rounded-3xl flex items-center justify-center border-4 border-soft-gold shadow-lg">
          <Shield size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-800">لوحة تحكم المسؤول</h2>
          <p className="text-slate-500 font-medium">إدارة محتوى تطبيق إتقان</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Reciters Management */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <Users size={24} className="text-soft-gold" />
            <h3 className="text-2xl font-bold text-slate-800">إدارة المقرئين</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {reciters.map(reciter => (
              <div key={reciter.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <User size={24} className="text-quiet-green" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{reciter.name}</p>
                    <p className="text-xs text-slate-400">{reciter.style}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <Edit size={24} className="text-soft-gold" />
            <h3 className="text-2xl font-bold text-slate-800">إدارة المحتوى</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-500 mb-2 block">عنوان الترحيب (لوحة الإنجاز)</label>
              <textarea
                value={welcomeTitle.replace(/<br\/>/g, "\n").replace(/<span class="text-soft-gold">/g, "").replace(/<\/span>/g, "")}
                onChange={(e) => {
                  const lines = e.target.value.split('\n');
                  const newTitle = `${lines[0]}<br/><span class="text-soft-gold">${lines.slice(1).join(' ')}</span>`;
                  setWelcomeTitle(newTitle);
                }}
                className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-soft-gold outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 mb-2 block">رسالة السماء اليومية (كنص احتياطي)</label>
              <input
                type="text"
                value={motivationMessage}
                onChange={(e) => setMotivationMessage(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-soft-gold outline-none transition-all"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-4 bg-quiet-green text-white font-bold rounded-xl shadow-lg hover:bg-emerald-800 transition-all">
              <Save size={18} />
              حفظ كل التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
