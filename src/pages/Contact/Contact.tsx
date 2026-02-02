import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { SocialMedia } from "../../components/SocialMedia/SocialMedia";

export const Contact = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* HEADER SECTION - ПОВЕРНУТО ДО ОРИГІНАЛЬНОЇ СТРУКТУРИ */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl">
            Зв'яжіться з нами{" "}
          </h1>{" "}
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0 md:text-left">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка чи ви хочете
          поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 mt-8">
        {/* CONTACT FORM - СУЧАСНИЙ СТИЛЬ */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 md:p-12">
          <h2 className="font-montserratBold text-3xl mb-8 text-gray-800">Напишіть нам</h2>
          <form className="flex flex-col gap-6" name="email_form">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 font-semibold text-gray-700">
                Full Name *
                <input
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none"
                  type="text"
                  name="name"
                  placeholder="Your full Name"
                />
              </label>
              <label className="flex flex-col gap-2 font-semibold text-gray-700">
                Email Address *
                <input
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 font-semibold text-gray-700">
              Telephone (Optional)
              <input
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none"
                type="tel"
                placeholder="Your telephone number"
              />
            </label>

            <label className="flex flex-col gap-2 font-semibold text-gray-700">
              Message *
              <textarea
                className="min-h-[150px] w-full rounded-2xl border border-gray-200 bg-gray-50/50 p-4 transition-all focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-500/10 outline-none resize-none"
                name="message"
                rows={4}
                placeholder="Enter your message here..."
              ></textarea>
            </label>

            <button
              className="group flex items-center justify-center gap-2 rounded-2xl bg-lime-600 py-4 font-bold text-white shadow-lg shadow-lime-600/20 transition-all hover:bg-lime-700 active:scale-95"
              type="submit"
            >
              Send message
              <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>
        </div>

        {/* INFO COLUMN */}
        <div className="flex flex-col gap-8">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="font-montserratBold text-2xl mb-8 text-gray-800">Контактна інформація</h2>
            <ul className="flex flex-col gap-8">
              <li className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-100/50 text-lime-600 shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Електронна адреса</h3>
                  <a href="mailto:bereginia.badoeynhausen@gmail.com" className="text-gray-600 hover:text-lime-600 transition-colors break-all">
                    bereginia.badoeynhausen@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100/50 text-blue-600 shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Телефон</h3>
                  <a href="tel:+4915128161383" className="text-gray-600 hover:text-blue-600 transition-colors">
                    +49 151 28161383
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime-100/50 text-lime-700 shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Адреса</h3>
                  <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors leading-relaxed">
                    32545 Weserstraße 24 <br /> Bad-Oeynhausen, Germany
                  </a>
                </div>
              </li>
              <li>
                <SocialMedia />
              </li>
            </ul>
          </div>

          {/* WORKING HOURS */}
          <div className="rounded-4xl bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={24} />
              <h3 className="font-montserratBold text-xl">Робочі години</h3>
            </div>
            <div className="space-y-4 opacity-90">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Пн — Пт</span>
                <span>9:00 — 18:00</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Субота</span>
                <span className="font-bold text-blue-200">Зачинено</span>
              </div>
              <div className="flex justify-between">
                <span>Неділя</span>
                <span>10:00 — 17:00</span>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="overflow-hidden rounded-[2.5rem] shadow-lg h-64 border border-gray-100">
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
