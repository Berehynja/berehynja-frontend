import { Heart, Users, BookOpen, Calendar, type LucideIcon } from "lucide-react";
import { motion, type Variants } from "framer-motion";

// 1. Виносимо дані, щоб код був чистим і легше анімувався
interface FeatureItem {
  title: string;
  description: string;
  Icon: LucideIcon;
  borderColor: string; // Клас для верхньої межі
  iconColor: string; // Клас для кольору іконки
}

const features: FeatureItem[] = [
  {
    title: "Підтримка",
    description:
      "Емоційна та практична підтримка українських біженців, які адаптуються до життя в Німеччині",
    Icon: Heart,
    borderColor: "border-t-Blue",
    iconColor: "text-Blue",
  },
  {
    title: "Громада",
    description: "Налагодження зв'язків та створення відчуття належності в новій країні",
    Icon: Users,
    borderColor: "border-t-Green",
    iconColor: "text-Green",
  },
  {
    title: "Інтеграція",
    description: "Мовні курси, культурна орієнтація та допомога в повсякденному житті в Німеччині",
    Icon: BookOpen,
    borderColor: "border-t-Orange",
    iconColor: "text-Orange",
  },
  {
    title: "Події",
    description:
      "Культурні заходи, майстер-класи та діяльність для святкування українського спадщини",
    Icon: Calendar,
    borderColor: "border-t-Red",
    iconColor: "text-Red",
  },
];

// 2. Налаштування анімації (Варіанти)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Затримка між появою кожної картки (0.2с)
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100, // Початкова позиція: зміщена на 100px вправо
  },
  visible: {
    opacity: 1,
    x: 0, // Кінцева позиція: на своєму місці
    transition: {
      type: "spring", // Ефект пружини для плавності
      stiffness: 50,
      damping: 20,
    },
  },
};

export function HowWeHelp() {
  return (
    <section className="my-6 overflow-hidden">
      {" "}
      {/* overflow-hidden важливий, щоб не з'являвся скрол при анімації справа */}
      <div className="mx-auto max-w-[375px] px-4 py-6 md:max-w-full">
        {/* Анімація заголовка */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-preset-2 mt-0.5 font-semibold xl:mt-2.5">Як ми допомагаємо</h2>
        </motion.div>

        {/* Контейнер карток з анімацією */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // amount: 0.2 означає, що анімація почнеться, коли видно 20% секції
          className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`shadow-card relative h-[250px] w-full rounded-sm border-t-4 bg-white px-8 py-7 ${item.borderColor}`}
            >
              <h3 className="text-preset-3 font-semibold">{item.title}</h3>
              <p className="text-preset-5 mt-5 font-light">{item.description}</p>

              {/* Кружечок з іконкою */}
              <div
                className={`absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ${item.iconColor}`}
              >
                <item.Icon className="h-6 w-6" /> {/* Можна задати розмір іконки явно */}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
