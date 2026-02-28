import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Target, Users, ArrowLeft, CheckCircle2, MapPin, Info } from "lucide-react";

// Ті самі дані (в ідеалі потім винести в окремий файл або брати з Firebase)
const adultPrograms = [
  {
    id: "1",
    dateRange: "15.05 - 25.05",
    title: "Інтеграційний інтенсив",
    fullDescription: "Цей курс розроблений спеціально для тих, хто нещодавно переїхав до Німеччини і стикається з першими побутовими та бюрократичними викликами. Ми не просто даємо теорію, а розбираємо реальні документи, заповнюємо анкети та вчимося взаємодіяти з місцевими установами.",
    duration: "10 днів",
    intensity: "Щодня (пн-пт)",
    target: "Новоприбулі",
    capacity: "15 осіб",
    location: "Наш центр / Online",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    features: ["Розбір страхування", "Пошук житла", "Основи Jobcenter", "Транспортна система"]
  },
  // ... інші програми
];

export const ProgramDetail = () => {
  const { id } = useParams();
  const program = adultPrograms.find((p) => p.id === id);

  if (!program) {
    return <div className="py-20 text-center font-nunito text-2xl">Програму не знайдено</div>;
  }

  return (
    <div className="font-nunito w-full pb-20">
      {/* Кнопка Повернутися */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link to="/programs/adults" className="flex items-center gap-2 text-blue-500 font-bold hover:text-blue-700 transition-colors">
          <ArrowLeft size={20} /> Повернутися до списку
        </Link>
      </div>

      {/* Шапка з назвою у твоїм стилі */}
      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            {program.title}
          </h2>
          <div className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* ЛІВА ЧАСТИНА: Контент */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[2.5rem] shadow-lg">
            <img src={program.image} className="h-full w-full object-cover" alt={program.title} />
            {/* Матова плашка дат на великому фото */}
            <div className="absolute top-6 right-6 rounded-2xl border border-white/30 bg-white/60 p-5 shadow-lg backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">Реєстрація відкрита</span>
              <span className="text-xl font-black text-gray-900">{program.dateRange}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Info className="text-blue-500" /> Про програму
            </h3>
            <p className="text-lg leading-8 text-gray-600 font-medium">
              {program.fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-8 rounded-4xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-xl mb-6">Що ви дізнаєтесь:</h4>
              <ul className="space-y-4">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 font-semibold text-gray-700">
                    <CheckCircle2 className="text-green-500" size={20} /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-8 rounded-4xl bg-blue-50 border border-blue-100 flex flex-col justify-center items-center text-center">
                <Target size={48} className="text-blue-500 mb-4" />
                <h4 className="font-bold text-xl mb-2">Мета курсу</h4>
                <p className="font-semibold text-blue-800">Швидка адаптація та впевненість у щоденних справах у Німеччині.</p>
            </div>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: Картка деталей (Side Card) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl space-y-8">
            <h4 className="text-xl font-bold border-b pb-4">Огляд програми</h4>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><Calendar size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Тривалість</p>
                  <p className="font-bold text-gray-800">{program.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-500"><Clock size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Графік</p>
                  <p className="font-bold text-gray-800">{program.intensity}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-500"><Users size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Місця</p>
                  <p className="font-bold text-gray-800">{program.capacity}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-2xl text-green-500"><MapPin size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Локація</p>
                  <p className="font-bold text-gray-800">{program.location}</p>
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              Записатися зараз
            </button>
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-tighter">Кількість місць обмежена</p>
          </div>
        </div>

      </div>
    </div>
  );
};