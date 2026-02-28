import { Calendar, Clock, ArrowRight, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

const adultPrograms = [
  {
    id: "1",
    dateRange: "15.05 - 25.05",
    title: "Інтеграційний інтенсив",
    description:
      "Швидкий курс адаптації: як працює страхування, оренда житла та пошук роботи в Німеччині. Практикуми та розбір реальних кейсів.",
    duration: "10 днів",
    intensity: "Щодня (пн-пт)",
    target: "Новоприбулі",
    capacity: "15 осіб",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    dateRange: "01.06 - 14.06",
    title: "Бізнес-комунікація",
    description:
      "Двотижнева програма для професіоналів: підготовка до співбесіди, написання CV за стандартами та ділове листування.",
    duration: "2 тижні",
    intensity: "3 рази на тиждень",
    target: "Рівень B1-B2",
    capacity: "10 осіб",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    dateRange: "20.06 - 30.06",
    title: "Цифрова адаптація",
    description:
      "Опанування ключових сервісів: від банківських додатків до державних порталів (Jobcenter, Ausländerbehörde) та транспортних систем.",
    duration: "10 днів",
    intensity: "Вечірня група",
    target: "Всі охочі",
    capacity: "12 осіб",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
  },
];

export const ProgramsList = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      {adultPrograms.map((program) => (
        <div
          key={program.id}
          className="group flex flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
          {/* Фото з матовою плашкою */}
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={program.image}
              alt={program.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Матова напівпрозора плашка дат */}
            <div className="absolute right-4 bottom-4 flex flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-md">
              <span className="mb-0.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                Період
              </span>
              <span className="text-sm font-black text-gray-900 uppercase">
                {program.dateRange}
              </span>
            </div>
          </div>

          {/* Контент */}
          <div className="flex flex-1 flex-col p-8">
            <h3 className="mb-4 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {program.title}
            </h3>

            <p className="mb-8 text-sm leading-relaxed text-gray-500">{program.description}</p>

            {/* Деталі з іконками */}
            <div className="mb-8 space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 font-medium text-gray-400">
                  <Calendar size={18} className="text-blue-500" />
                  Тривалість:
                </div>
                <span className="font-bold text-gray-700">{program.duration}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 font-medium text-gray-400">
                  <Clock size={18} className="text-orange-500" />
                  Графік:
                </div>
                <span className="font-bold text-gray-700">{program.intensity}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 font-medium text-gray-400">
                  <Target size={18} className="text-purple-500" />
                  Для кого:
                </div>
                <span className="font-bold text-gray-700">{program.target}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 font-medium text-gray-400">
                  <Users size={18} className="text-green-500" />
                  Група:
                </div>
                <span className="font-bold text-gray-700">{program.capacity}</span>
              </div>
            </div>

            {/* Кнопка */}
              <Link
                to={`/programs/adults/${program.id}`}
                className="mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
              >
                Детальніше <ArrowRight size={18} />
              </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
