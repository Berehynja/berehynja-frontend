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
  FileText,
} from "lucide-react";

export const Privacy = () => {
  const [activeModal, setActiveModal] = useState<{ title: string; text: string } | null>(null);

  const rights = [
    {
      label: "Auskunft",
      icon: <Eye size={18} />,
      desc: "Art. 15 DSGVO",
      content:
        "Ви маєте право отримати інформацію про те, чи обробляються ваші дані, які саме дані зберігаються та мету їх обробки.",
    },
    {
      label: "Berichtigung",
      icon: <ShieldCheck size={18} />,
      desc: "Art. 16 DSGVO",
      content:
        "Ви маєте право вимагати негайного виправлення будь-яких неточних або неповних персональних даних.",
    },
    {
      label: "Löschung",
      icon: <AlertCircle size={18} />,
      desc: "Art. 17 DSGVO",
      content:
        "Ви маєте право вимагати видалення ваших даних, якщо вони більше не потрібні для цілей, для яких збиралися.",
    },
    {
      label: "Widerspruch",
      icon: <ShieldAlert size={18} />,
      desc: "Art. 21 DSGVO",
      content:
        "Ви маєте право заперечити проти обробки ваших даних, якщо ми використовуємо їх на основі законних інтересів.",
    },
  ];

  return (
    <div className="font-nunito mx-auto w-full max-w-7xl px-4 py-8">
      {/* HEADER SECTION - Стиль Contact */}
      <div className="font-nunito flex flex-col items-center justify-center gap-8 py-7 text-center md:flex-row md:py-10 md:text-left">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-nunito flex flex-nowrap justify-center pb-4 text-4xl tracking-tighter text-gray-900 uppercase md:text-5xl">
            Datenschutz
          </h1>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0">
          Захист ваших даних — наш пріоритет. Ми обробляємо інформацію конфіденційно та лише у
          відповідності до вимог DSGVO та BDSG.
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* ЛІВА КОЛОНКА: ВІДПОВІДАЛЬНІСТЬ ТА ТЕХНОЛОГІЇ */}
        <div className="flex flex-col gap-8">
          {/* 1. Verantwortlicher */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <UserCheck size={28} />
              </div>
              <h2 className="font-nunito text-2xl tracking-tight text-gray-800 uppercase">
                Verantwortlicher
              </h2>
            </div>
            <div className="space-y-4">
              <p className="font-nunito text-xl text-gray-900 uppercase">Berehynja e.V.</p>
              <p className="leading-relaxed text-gray-500 italic">
                Відповідальною особою за обробку даних на цьому сайті є Berehynja e.V. Контактні
                дані вказані в Impressum.
              </p>
              <div className="flex items-center gap-2 font-semibold text-blue-600">
                <Mail size={18} />
                <a href="mailto:info@berehynja.de" className="hover:underline">
                  info@berehynja.de
                </a>
              </div>
            </div>
          </div>

          {/* 2. Firebase Infrastructure */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-8 text-white shadow-xl">
            <div className="mb-6 flex items-center gap-3 text-blue-400">
              <Server size={28} />
              <h3 className="font-nunito text-xl font-bold tracking-tight text-white uppercase">
                Firebase System
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 italic">
              Весь текстовий контент, посилання та логіка сайту обробляються через{" "}
              <strong>Firebase (Google Ireland Ltd)</strong>. Дані зберігаються виключно на серверах
              у межах ЄС.
            </p>
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] font-bold tracking-widest text-blue-300 uppercase">
              <Lock size={14} className="text-green-500" /> End-to-End Encryption
            </div>
          </div>

          {/* 3. Cookies Logic */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center gap-4 text-yellow-600">
              <Fingerprint size={32} />
              <h2 className="font-nunito text-2xl font-bold tracking-tight text-gray-800 uppercase">
                Cookies
              </h2>
            </div>
            <p className="font-nunito leading-7 text-gray-600 italic">
              Ми використовуємо лише <strong>технічно необхідні Cookies</strong> для
              запам'ятовування вибору мови. Жодних маркетингових чи аналітичних Cookies не
              застосовується.
            </p>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: ПРАВА ТА МЕДІА */}
        <div className="flex flex-col gap-8">
          {/* 4. Ваші права (Grid з іконками) */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-8 flex items-center gap-4 text-blue-600">
              <FileLock2 size={32} />
              <h2 className="font-nunito text-2xl font-bold tracking-tight text-gray-800 uppercase">
                Ваші права
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rights.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModal({ title: item.label, text: item.content })}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:bg-blue-600 hover:text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-500 transition-colors group-hover:text-yellow-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-nunito mb-1 text-sm leading-none">{item.label}</p>
                      <p className="text-[10px] tracking-tighter uppercase opacity-50">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="-translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 5. Cloudinary & YouTube Media */}
          <div className="rounded-4xl bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <Database size={24} className="text-yellow-400" />
              <h3 className="font-nunito text-xl font-bold tracking-widest text-white uppercase">
                Media Storage
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <ImageIcon size={20} className="mt-1 shrink-0 text-blue-200" />
                <p className="text-sm leading-6 italic opacity-90">
                  <strong>Cloudinary:</strong> Використовується виключно для зберігання зображень.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Youtube size={20} className="mt-1 shrink-0 text-red-400" />
                <p className="text-sm leading-6 italic opacity-90">
                  <strong>YouTube:</strong> Відео з закритих каналів транслюються в режимі
                  підвищеної приватності.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Complaint Right */}
          <div className="flex items-center gap-4 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-8">
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="font-nunito mb-1 text-sm leading-none font-bold text-gray-800 uppercase">
                Beschwerderecht
              </p>
              <p className="text-[10px] leading-relaxed tracking-widest text-gray-400 uppercase">
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
            className="animate-in fade-in absolute inset-0 bg-gray-900/60 backdrop-blur-md duration-300"
            onClick={() => setActiveModal(null)}
          />

          <div className="animate-in zoom-in-95 relative w-full max-w-md rounded-[3rem] bg-white p-10 shadow-2xl duration-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-8 right-8 text-gray-300 transition-colors hover:text-gray-900"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="rounded-8 mb-6 bg-blue-50 p-5 text-blue-600 shadow-inner">
                <FileText size={40} />
              </div>
              <h3 className="font-nunito mb-2 text-3xl tracking-tighter text-gray-900 uppercase">
                {activeModal.title}
              </h3>
              <div className="mb-8 h-1.5 w-16 rounded-full bg-yellow-400"></div>

              <p className="font-nunito text-lg leading-relaxed text-gray-600 italic">
                {activeModal.text}
              </p>

              <button
                onClick={() => setActiveModal(null)}
                className="rounded-6 font-nunito mt-10 w-full bg-gray-900 py-5 tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-600 active:scale-95"
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
