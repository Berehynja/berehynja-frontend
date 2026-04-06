import { Send } from "lucide-react";
export const ContactForm = () => {
  return (
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
  );
};
