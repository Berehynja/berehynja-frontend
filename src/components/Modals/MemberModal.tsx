import { X, Award, Briefcase, GraduationCap, User2 } from "lucide-react";
import { useEffect } from "react";

// Використовуємо той самий інтерфейс, що і в основному файлі
interface TeamMember {
  name: string;
  role: string;
  description: string;
  skills: string[];
  education: string;
  image?: string;
}

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export const MemberModal = ({ member, onClose }: MemberModalProps) => {
  // Блокування скролу фону при відкритій модалці
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [member]);

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Задній фон (Backdrop) з розмиттям */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Контент Модалки */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[3rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Кнопка закриття */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 rounded-full bg-white/80 p-2 text-gray-500 backdrop-blur-md transition-all hover:bg-red-50 hover:text-red-500 shadow-sm"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          
          {/* ЛІВА ЧАСТИНА: Велике фото або заглушка */}
          <div className="relative w-full md:w-[45%] h-[350px] md:h-auto bg-gray-100 overflow-hidden">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 text-gray-300">
                <User2 size={120} strokeWidth={0.5} />
              </div>
            )}
            {/* Декоративний градієнт знизу для мобільних */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent md:hidden" />
          </div>

          {/* ПРАВА ЧАСТИНА: Інформація */}
          <div className="flex w-full md:w-[55%] flex-col p-8 md:p-14 overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
            
            {/* Шапка модалки */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-blue-500"></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  {member.role}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-montserratBold text-gray-900 leading-tight">
                {member.name}
              </h2>
              {/* Та сама декоративна лінія, як на головній */}
              <div className="mt-5 h-1.5 w-24 bg-linear-to-r from-blue-500 to-yellow-400 rounded-full" />
            </div>

            <div className="space-y-8">
              {/* Професійні навички */}
              <section>
                <div className="flex items-center gap-3 mb-4 text-gray-900">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Професійні навички</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-100 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Детальний опис (цитата/досвід) */}
              <section>
                <div className="flex items-center gap-3 mb-4 text-gray-900">
                  <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                    <Award size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Досвід та експертиза</h3>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-4 text-6xl text-gray-100 font-serif leading-none select-none">“</span>
                  <p className="relative text-gray-600 leading-relaxed italic text-lg pl-2">
                    {member.description}
                  </p>
                </div>
              </section>

              {/* Освіта */}
              <section className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-2 text-gray-500">
                  <GraduationCap size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Освіта</h3>
                </div>
                <p className="text-gray-500 ml-8">
                  {member.education}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};