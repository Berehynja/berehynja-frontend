import { 
   Building2, UserCircle, Mail, Phone, 
  Info, MapPin, Globe, FileBadge, CheckCircle2,
  ShieldAlert, Copyright, ExternalLink
} from "lucide-react";

export const Impressum = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      
      {/* HEADER SECTION - ТОЧНО ЯК У ТВОЄМУ ПРИКЛАДІ */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl text-gray-900">
            Impressum
          </h1>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0 md:text-left">
          Юридична інформація про організацію Berehynja e.V. відповідно до параграфа § 5 TMG. 
          Тут ви знайдете наші реєстраційні дані та офіційних представників.
        </p>
      </div>

      {/* CONTENT GRID */}
      <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 mt-8">
        
        {/* ЛІВА КОЛОНКА: ЮРИДИЧНІ ДАНІ */}
        <div className="flex flex-col gap-8">
          {/* Organization Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/50 text-blue-600">
                <Building2 size={28} />
              </div>
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight">Anbieter</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-2xl font-montserratBold text-gray-900 uppercase tracking-tighter">Berehynja e.V.</p>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="text-yellow-500 mt-1 shrink-0" size={20} />
                <p className="text-lg leading-relaxed italic">
                  32545 Weserstraße 24 <br /> Bad-Oeynhausen, Germany
                </p>
              </div>
            </div>
          </div>

          {/* Representation Card */}
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100/50 text-yellow-600">
                <UserCircle size={28} />
              </div>
              <h2 className="font-montserratBold text-2xl text-gray-800 uppercase tracking-tight">Vertretung</h2>
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-montserratBold text-gray-900 uppercase tracking-tighter">Olena Ivanenko</p>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <CheckCircle2 size={18} />
                </div>
                <p className="text-lg font-medium italic text-gray-500 underline decoration-yellow-400 decoration-2 underline-offset-8">
                  1. Vorsitzende
                </p>
              </div>
            </div>
          </div>

          {/* Register Info Card */}
          <div className="rounded-4xl bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FileBadge size={28} className="text-yellow-400" />
              <h3 className="font-montserratBold text-xl">Registereintrag</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 opacity-90">
              <div className="border-b border-white/10 pb-2">
                <p className="text-[10px] uppercase font-bold text-blue-200">Gericht</p>
                <p className="font-bold">Bad Oeynhausen</p>
              </div>
              <div className="border-b border-white/10 pb-2">
                <p className="text-[10px] uppercase font-bold text-blue-200">Nummer</p>
                <p className="font-bold">VR 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: КОНТАКТИ ТА ПРАВОВІ ТЕКСТИ */}
        <div className="flex flex-col gap-8">
          {/* Contact Bar (Modern Black) */}
          <div className="rounded-[2.5rem] bg-gray-900 p-8 shadow-2xl text-white">
            <h2 className="font-montserratBold text-xl mb-6 text-yellow-400 uppercase tracking-widest">Kontakt</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-400" size={24} />
                <p className="font-medium">bereginia.badoeynhausen@gmail.com</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-green-400" size={24} />
                <p className="font-medium">+49 151 28161383</p>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="text-yellow-400" size={24} />
                <p className="font-medium">www.berehynja.de</p>
              </div>
            </div>
          </div>

          {/* Haftung & Urheberrecht (Legal Text) */}
          <div className="rounded-[2.5rem] bg-gray-50 p-8 border border-gray-100 flex flex-col gap-6 text-gray-500 text-sm italic">
            <div className="flex gap-4">
              <ShieldAlert className="text-red-400 shrink-0" size={20} />
              <p><strong>Haftung для Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte verantwortlich.</p>
            </div>
            <div className="flex gap-4">
              <ExternalLink className="text-blue-400 shrink-0" size={20} />
              <p><strong>Haftung для Links:</strong> Wir haben keinen Einfluss auf die Inhalte externer Webseiten Dritter.</p>
            </div>
            <div className="flex gap-4">
              <Copyright className="text-orange-400 shrink-0" size={20} />
              <p><strong>Urheberrecht:</strong> Die Inhalte auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
            </div>
            
            <div className="mt-4 pt-6 border-t border-gray-200 flex items-start gap-3">
              <Info className="text-blue-600 shrink-0" size={18} />
              <p className="text-xs font-bold not-italic text-gray-400 uppercase tracking-tighter">
                Verantwortlich за Inhalt: Olena Ivanenko, 32545 Weserstraße 24, Bad-Oeynhausen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};