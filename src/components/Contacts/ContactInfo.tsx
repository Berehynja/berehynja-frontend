import { Phone, Mail, MapPin } from "lucide-react";
import { SocialMedia } from "../../components/SocialMedia/SocialMedia";

export const ContactInfo = () => {
  return (
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
            <div className="flex min-w-0 flex-col">
              <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase transition-colors group-hover:text-blue-600">
                Напишіть нам
              </p>
              <a
                href="mailto:bereginia.badoeynhausen@gmail.com"
                className="block w-full truncate text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600"
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
          <li className="mt-4 flex flex-col items-center gap-6 border-t border-gray-100 md:items-start">
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
  );
};
