import { X, Send, UserPlus, CheckCircle2, Phone, MessageSquare, User } from "lucide-react";
import { useState } from "react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal = ({ isOpen, onClose }: JoinModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Імітація відправки даних
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Фон із розмиттям */}
      <div 
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl rounded-4xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300 md:p-12 font-montserratRegular">
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 text-gray-300 hover:text-gray-900 transition-colors"
        >
          <X size={32} />
        </button>

        {!isSubmitted ? (
          <div className="text-left">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserPlus size={32} />
              </div>
              <div>
                <h3 className="font-montserratBold text-2xl uppercase tracking-tighter text-gray-900">
                  Приєднатися
                </h3>
                <p className="text-sm text-gray-500 italic">
                  Станьте частиною Berehynja 
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Поле: Ім'я */}
              <div className="relative">
                <label className="text-3 font-bold uppercase text-gray-900 ml-2 mb-1 block tracking-widest">
                  Повне ім'я *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ваше прізвище та ім'я" 
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Поле: E-mail */}
                <div className="relative">
                  <label className="text-3 font-bold uppercase text-gray-900 ml-2 mb-1 block tracking-widest">
                    E-mail *
                  </label>
                  <input 
                    required
                    type="email" 
                    placeholder="mail@example.com" 
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 px-5 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Поле: Телефон (За бажанням) */}
                <div className="relative">
                  <label className="text-3 font-bold uppercase text-gray-900 ml-2 mb-1 block tracking-widest">
                    Телефон <span className="lowercase font-normal text-gray-500">(за бажанням)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="tel" 
                      placeholder="+49..." 
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Поле: Додаткова інформація */}
              <div className="relative">
                <label className="text-[10px] font-bold uppercase text-gray-900 ml-2 mb-1 block tracking-widest">
                  Чим ви хотіли б допомогти?
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                  <textarea 
                    rows={3}
                    placeholder="Напишіть трохи про себе або ваші ідеї..." 
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Кнопка відправки */}
              <button 
                type="submit" 
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 font-montserratBold uppercase tracking-widest text-white transition-all hover:bg-gray-900 shadow-lg shadow-blue-200"
              >
                <span>Надіслати заявку</span>
                <Send size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>

              <p className="text-3 text-gray-400 text-center leading-relaxed">
                Натискаючи кнопку, ви погоджуєтеся з нашою <br />
                <a href="privacy" target="_blank" className="underline hover:text-blue-600 transition-colors">Політикою конфіденційності</a>.
              </p>
            </form>
          </div>
        ) : (
          /* Вікно успіху */
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={56} />
            </div>
            <h3 className="font-montserratBold text-3xl text-gray-900 uppercase mb-4 tracking-tighter">Дякуємо!</h3>
            <p className="font-montserratRegular text-gray-500 italic max-w-xs mx-auto">
              Ми отримали вашу заявку. Наш координатор зв'яжеться з вами найближчим часом.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};