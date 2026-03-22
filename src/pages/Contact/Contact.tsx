import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { SocialMedia } from "../../components/SocialMedia/SocialMedia";

export const Contact = () => {
  return (
    <div className=" w-full  pb-8">
      {/* HEADER SECTION - ПОВЕРНУТО ДО ОРИГІНАЛЬНОЇ СТРУКТУРИ */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl">
            Зв'яжіться з нами{" "}
          </h1>{" "}
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0 md:text-left">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка чи ви хочете
          поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* CONTACT FORM - СУЧАСНИЙ СТИЛЬ */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:p-12">
          <h2 className="font-nunito mb-10 border-l-4 border-blue-600 pl-4 text-3xl font-black text-gray-900">
            Напишіть нам
          </h2>

          <form className="relative flex flex-col gap-8" name="email_form">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* FULL NAME */}
              <label className="flex flex-col gap-3">
                {/* Зробив текст темнішим (text-gray-700) та додав трохи розміру */}
                <span className="ml-1 text-[13px] font-black tracking-wider text-gray-700 uppercase">
                  Повне ім'я *
                </span>
                <input
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 transition-all duration-300 outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                  type="text"
                  name="name"
                  placeholder="Ваше ім'я"
                />
              </label>

              {/* EMAIL ADDRESS */}
              <label className="flex flex-col gap-3">
                <span className="ml-1 text-[13px] font-black tracking-wider text-gray-700 uppercase">
                  Електронна адреса *
                </span>
                <input
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 transition-all duration-300 outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                />
              </label>
            </div>

            {/* TELEPHONE */}
            <label className="flex flex-col gap-3">
              <span className="ml-1 text-[13px] font-black tracking-wider text-gray-700 uppercase">
                Телефон (необов'язково)
              </span>
              <input
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 transition-all duration-300 outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                type="tel"
                placeholder="+49..."
              />
            </label>

            {/* MESSAGE */}
            <label className="flex flex-col gap-3">
              <span className="ml-1 text-[13px] font-black tracking-wider text-gray-700 uppercase">
                Ваше повідомлення *
              </span>
              <textarea
                className="min-h-40 w-full resize-none rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 transition-all duration-300 outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                name="message"
                rows={4}
                placeholder="Текст повідомлення..."
              ></textarea>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-green-900 py-5 text-lg font-black text-white shadow-xl shadow-blue-900/20 transition-all duration-300 hover:bg-green-700 hover:shadow-green-600/40 active:scale-[0.98]"
              type="submit"
            >
              <span className="relative z-10">Відправити повідомлення</span>
              <Send
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
              />
            </button>
          </form>
        </div>

        {/* INFO COLUMN */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <h2 className="font-nunito mb-10 border-l-4 border-blue-600 pl-4 text-3xl font-black text-gray-900">
                Контакти
              </h2>

              <ul className="flex flex-col gap-8">
                {/* EMAIL */}
                <li className="group flex cursor-pointer items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-700 group-hover:shadow-blue-200">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase transition-colors group-hover:text-blue-600">
                      Напишіть нам
                    </p>
                    <a
                      href="mailto:bereginia.badoeynhausen@gmail.com"
                      className="text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600"
                    >
                      bereginia.badoeynhausen@gmail.com
                    </a>
                  </div>
                </li>

                {/* PHONE */}
                <li className="group flex cursor-pointer items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:shadow-yellow-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase transition-colors group-hover:text-blue-600">
                      Зателефонуйте
                    </p>
                    <a
                      href="tel:+4915128161383"
                      className="text-xl font-black text-gray-800 transition-colors group-hover:text-blue-600"
                    >
                      +49 151 28161383
                    </a>
                  </div>
                </li>

                {/* ADDRESS */}
                <li className="group flex cursor-pointer items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-blue-900 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:bg-blue-50">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase transition-colors group-hover:text-blue-600">
                      Наша адреса
                    </p>
                    <p className="text-lg leading-tight font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                      Weserstraße 24, <span className="text-blue-600">Bad Oeynhausen</span>
                    </p>
                  </div>
                </li>

                {/* SOCIALS */}
                <li className="mt-4 flex flex-col items-center gap-6 border-t border-gray-100  md:items-start">
                  <span className="text-xs font-black tracking-widest text-gray-400 uppercase">
                    Ми в мережах:
                  </span>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <SocialMedia />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* WORKING HOURS */}
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#041560] p-6 text-white shadow-xl">
            {/* Заголовок */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Clock size={18} />
              </div>
              <h3 className="font-nunito text-lg font-black tracking-tight">Робочі години</h3>
            </div>

            <div className="space-y-5">
              {/* Будні — Максимальний контраст */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-wider text-blue-400 uppercase">
                    Пн — Пт
                  </span>
                  <span className="text-sm font-bold text-white">Робочі дні</span>
                </div>
                <span className="text-base font-black text-white">9:00 — 18:00</span>
              </div>

              {/* Субота — Чітко видно, що зачинено */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-wider text-gray-400 uppercase">
                    Субота
                  </span>
                  <span className="text-sm font-bold text-gray-300">Вихідний</span>
                </div>
                <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-black text-white uppercase">
                  Зачинено
                </span>
              </div>

              {/* Неділя */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-wider text-blue-400 uppercase">
                    Неділя
                  </span>
                  <span className="text-sm font-bold text-white">Неділя</span>
                </div>
                <span className="text-base font-black text-white">10:00 — 17:00</span>
              </div>
            </div>

            {/* Примітка — тепер білим кольором, щоб було видно */}
            <p className="mt-6 text-center text-[10px] font-medium text-gray-300 italic opacity-80">
              * Графік може змінюватися у святкові дні
            </p>
          </div>

          {/* MAP */}
          <div className="h-64 overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-lg">
            <iframe
              className="h-full w-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.342981326442!2d8.7994689!3d52.2008399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba133a8c5e933d%3A0xc3c9f28d546222b!2sWeserstra%C3%9Fe%2024%2C%2032545%20Bad%20Oeynhausen!5e0!3m2!1sen!2sde!4v1710000000000!5m2!1sen!2sde"
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
