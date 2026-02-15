import { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Server, 
  Database, 
  UserCheck, 
  FileLock2, 
  Fingerprint, 
  AlertCircle, 
  Mail, 
  ShieldAlert, 
  X,
  Youtube,
  ImageIcon,
  ArrowRight,
  FileText
} from "lucide-react";

export const Privacy = () => {
  const [activeModal, setActiveModal] = useState<{title: string, text: string} | null>(null);

  const rights = [
    { 
      label: "Auskunft", 
      icon: <Eye size={18} />, 
      desc: "Art. 15 DSGVO",
      content: "Ви маєте право отримати інформацію про те, чи обробляються ваші дані, які саме дані зберігаються та мету їх обробки."
    },
    { 
      label: "Berichtigung", 
      icon: <ShieldCheck size={18} />, 
      desc: "Art. 16 DSGVO",
      content: "Ви маєте право вимагати негайного виправлення будь-яких неточних або неповних персональних даних."
    },
    { 
      label: "Löschung", 
      icon: <AlertCircle size={18} />, 
      desc: "Art. 17 DSGVO",
      content: "Ви маєте право вимагати видалення ваших даних, якщо вони більше не потрібні для цілей, для яких збиралися."
    },
    { 
      label: "Widerspruch", 
      icon: <ShieldAlert size={18} />, 
      desc: "Art. 21 DSGVO",
      content: "Ви маєте право заперечити проти обробки ваших даних, якщо ми використовуємо їх на основі законних інтересів."
    }
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 font-montserratRegular">
      
      {/* HEADER SECTION - Стиль Contact */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10 text-center md:text-left">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl text-gray-900 uppercase tracking-tighter">
            Datenschutz
          </h1>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0">
          Захист ваших даних — наш пріоритет. Ми обробляємо інформацію конфіденційно та лише у відповідності до вимог DSGVO та BDSG.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 mt-8">
        
        {/* ЛІВА КОЛОНКА: ВІДПОВІДАЛЬНІСТЬ ТА ТЕХНОЛОГІЇ */}
        <div className="flex flex-col gap-8">
          
          {/* 1. Verantwortlicher */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <UserCheck size={28} />
              </div>
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight">Verantwortlicher</h2>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-montserratBold text-gray-900 uppercase">Berehynja e.V.</p>
              <p className="text-gray-500 leading-relaxed italic">
                Відповідальною особою за обробку даних на цьому сайті є Berehynja e.V. Контактні дані вказані в Impressum.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Mail size={18} />
                <a href="mailto:info@berehynja.de" className="hover:underline">info@berehynja.de</a>
              </div>
            </div>
          </div>

          {/* 2. Firebase Infrastructure */}
          <div className="rounded-[2.5rem] bg-gray-900 p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 text-blue-400">
              <Server size={28} />
              <h3 className="font-montserratBold text-xl uppercase tracking-tight font-bold text-white">Firebase System</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              Весь текстовий контент, посилання та логіка сайту обробляються через <strong>Firebase (Google Ireland Ltd)</strong>. Дані зберігаються виключно на серверах у межах ЄС.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] text-blue-300 font-bold uppercase tracking-widest border-t border-white/10 pt-4">
              <Lock size={14} className="text-green-500" /> End-to-End Encryption
            </div>
          </div>

          {/* 3. Cookies Logic */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6 text-yellow-600">
              <Fingerprint size={32} />
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight font-bold">Cookies</h2>
            </div>
            <p className="text-gray-600 leading-7 font-montserratRegular italic">
              Ми використовуємо лише <strong>технічно необхідні Cookies</strong> для запам'ятовування вибору мови. Жодних маркетингових чи аналітичних Cookies не застосовується.
            </p>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: ПРАВА ТА МЕДІА */}
        <div className="flex flex-col gap-8">
          
          {/* 4. Ваші права (Grid з іконками) */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
            <div className="flex items-center gap-4 mb-8 text-blue-600">
              <FileLock2 size={32} />
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight font-bold">Ваші права</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rights.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveModal({ title: item.label, text: item.content })}
                  className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between group transition-all hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-500 group-hover:text-yellow-400 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-montserratBold text-sm leading-none mb-1">{item.label}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-tighter">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </div>

          {/* 5. Cloudinary & YouTube Media */}
          <div className="rounded-4xl bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Database size={24} className="text-yellow-400" />
              <h3 className="font-montserratBold text-xl uppercase tracking-widest font-bold text-white">Media Storage</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <ImageIcon size={20} className="text-blue-200 shrink-0 mt-1" />
                <p className="text-sm opacity-90 leading-6 italic">
                  <strong>Cloudinary:</strong> Використовується виключно для зберігання зображень.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Youtube size={20} className="text-red-400 shrink-0 mt-1" />
                <p className="text-sm opacity-90 leading-6 italic">
                  <strong>YouTube:</strong> Відео з закритих каналів транслюються в режимі підвищеної приватності.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Complaint Right */}
          <div className="rounded-[2.5rem] bg-gray-50 p-8 border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="font-montserratBold text-sm text-gray-800 uppercase font-bold leading-none mb-1">Beschwerderecht</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                Право на скаргу до наглядового органу (Art. 77 DSGVO).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODAL WINDOW --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setActiveModal(null)} 
          />
          
          <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setActiveModal(null)} className="absolute right-8 top-8 text-gray-300 hover:text-gray-900 transition-colors">
              <X size={28} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-5 bg-blue-50 text-blue-600 rounded-8 shadow-inner">
                <FileText size={40} />
              </div>
              <h3 className="font-montserratBold text-3xl text-gray-900 uppercase tracking-tighter mb-2">
                {activeModal.title}
              </h3>
              <div className="h-1.5 w-16 bg-yellow-400 rounded-full mb-8"></div>
              
              <p className="text-gray-600 leading-relaxed text-lg font-montserratRegular italic">
                {activeModal.text}
              </p>

              <button 
                onClick={() => setActiveModal(null)}
                className="mt-10 w-full py-5 bg-gray-900 text-white rounded-6 font-montserratBold uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};