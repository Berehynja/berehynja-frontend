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
        className="animate-in fade-in absolute inset-0 bg-gray-950/80 backdrop-blur-xl duration-500"
        onClick={onClose}
      />

      <div className="animate-in zoom-in-95 font-nunito relative w-full max-w-2xl rounded-4xl bg-white p-8 shadow-2xl duration-300 md:p-12">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-300 transition-colors hover:text-gray-900"
        >
          <X size={32} />
        </button>

        {!isSubmitted ? (
          <div className="text-left">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserPlus size={32} />
              </div>
              <div>
                <h3 className="font-nunito text-2xl tracking-tighter text-gray-900 uppercase">
                  Приєднатися
                </h3>
                <p className="text-sm text-gray-500 italic">Станьте частиною Berehynja</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Поле: Ім'я */}
              <div className="relative">
                <label className="text-3 mb-1 ml-2 block font-bold tracking-widest text-gray-900 uppercase">
                  Повне ім'я *
                </label>
                <div className="relative">
                  <User
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Ваше прізвище та ім'я"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Поле: E-mail */}
                <div className="relative">
                  <label className="text-3 mb-1 ml-2 block font-bold tracking-widest text-gray-900 uppercase">
                    E-mail *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="mail@example.com"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Поле: Телефон (За бажанням) */}
                <div className="relative">
                  <label className="text-3 mb-1 ml-2 block font-bold tracking-widest text-gray-900 uppercase">
                    Телефон{" "}
                    <span className="font-normal text-gray-500 lowercase">(за бажанням)</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="tel"
                      placeholder="+49..."
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Поле: Додаткова інформація */}
              <div className="relative">
                <label className="mb-1 ml-2 block text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                  Чим ви хотіли б допомогти?
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-4 left-4 text-gray-400" size={18} />
                  <textarea
                    rows={3}
                    placeholder="Напишіть трохи про себе або ваші ідеї..."
                    className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Кнопка відправки */}
              <button
                type="submit"
                className="group font-nunito flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 tracking-widest text-white uppercase shadow-lg shadow-blue-200 transition-all hover:bg-gray-900"
              >
                <span>Надіслати заявку</span>
                <Send
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>

              <p className="text-3 text-center leading-relaxed text-gray-400">
                Натискаючи кнопку, ви погоджуєтеся з нашою <br />
                <a
                  href="privacy"
                  target="_blank"
                  className="underline transition-colors hover:text-blue-600"
                >
                  Політикою конфіденційності
                </a>
                .
              </p>
            </form>
          </div>
        ) : (
          /* Вікно успіху */
          <div className="animate-in fade-in zoom-in py-10 text-center duration-500">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={56} />
            </div>
            <h3 className="font-nunito mb-4 text-3xl tracking-tighter text-gray-900 uppercase">
              Дякуємо!
            </h3>
            <p className="font-nunito mx-auto max-w-xs text-gray-500 italic">
              Ми отримали вашу заявку. Наш координатор зв'яжеться з вами найближчим часом.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
