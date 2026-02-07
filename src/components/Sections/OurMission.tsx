import { Briefcase, Heart, HouseHeart, School, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";

// 1. Налаштування анімації контейнера (керує чергою)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Затримка 0.25с між появою кожної картки
    },
  },
};

// 2. Налаштування анімації окремої картки (виїзд знизу)
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50, // Початкова позиція: зміщена на 50px вниз
  },
  visible: {
    opacity: 1,
    y: 0, // Кінцева позиція: на своєму місці
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

export default function OurMission() {
  return (
    <section className="my-10 overflow-hidden">
      {/* Анімація заголовка */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-preset-2 font-semibold">Наша мета</h2>
      </motion.div>

      {/* Контейнер гріда */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }} // Почнеться, коли видно 15% секції
        className="mx-auto my-10 grid max-w-[375px] gap-8 md:grid md:max-w-full md:grid-cols-2 xl:grid-cols-4 xl:gap-y-6"
      >
        {/* 1. Головний блок (З'явиться першим) */}
        <motion.aside
          variants={cardVariants}
          className="bg-Blue-2 shadow-card bg-decor relative flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-span-2"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
              <HouseHeart />
            </div>
            <div>
              <h3 className="text-preset-3 mt-5">Місія клубу «Берегиня»</h3>
              <p className="text-preset-5 mt-1 text-gray-400">Підтримка та розуміння</p>
            </div>
          </div>
          <p className="text-preset-4">
            Ми прагнемо зробити так, щоб кожна українська сім'я відчувала себе не самотньою, мала
            підтримку та місце, де її розуміють.
          </p>
          <p className="text-preset-5">
            «Берегиня» — це не просто клуб, це маленький куточок України, який живе поруч, у серці
            Європи. Ми створили цей простір як відповідь на потребу мати «своє» місце — де можна
            говорити рідною мовою, святкувати традиційні свята, знайомити дітей із культурою та
            відчувати теплоту спільноти. Тут кожен може знайти щось для себе: підтримку, розвиток,
            дружбу чи просто спокій у приємному середовищі.
          </p>
        </motion.aside>

        {/* 2. Для дітей (З'явиться другим) */}
        <motion.aside
          variants={cardVariants}
          className="bg-Blue-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:row-start-2 xl:col-start-3 xl:row-start-1"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
              <School />
            </div>
            <div>
              <h3 className="text-preset-3">Для дітей</h3>
              <p className="text-preset-5 mt-1 text-gray-400">Розвиток та освіта</p>
            </div>
          </div>
          <p className="text-preset-4">Зберігаємо зв'язок з Україною та розвиваємо навички.</p>
          <p className="text-preset-5">
            Наші заняття і програми допомагають дітям та підліткам зберегти зв'язок з Україною,
            навіть перебуваючи за кордоном. Ми навчаємо мові та культурі, розвиваємо мислення,
            творчість, впевненість у собі та вміння працювати в команді.
          </p>
        </motion.aside>

        {/* 3. Для спільноти (З'явиться третім) */}
        <motion.aside
          variants={cardVariants}
          className="bg-Blue-2 text-grey-500 shadow-card flex flex-col gap-4 rounded-lg p-8 md:row-start-2 xl:col-start-4 xl:row-start-1"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
              <Users />
            </div>
            <div>
              <h3 className="text-preset-3">Спільнота</h3>
              <p className="text-preset-5 mt-1 text-gray-400">Зустрічі та події</p>
            </div>
          </div>
          <p className="text-preset-4">Формуємо відчуття єдності через спілкування</p>
          <p className="text-preset-5">
            Особливу увагу ми приділяємо взаємодії сімей через спільні зустрічі, майстер-класи,
            події та культурні заходи. Саме так формується відчуття єдності та теплоти.
          </p>
        </motion.aside>

        {/* 4. Для дорослих (З'явиться четвертим - початок другого ряду) */}
        <motion.aside
          variants={cardVariants}
          className="bg-Orange-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-start-1 xl:row-start-2"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
              <Briefcase />
            </div>
            <div>
              <h3 className="text-preset-3">Для батьків</h3>
              <p className="text-preset-5 mt-1 text-gray-400">Підтримка та інтеграція</p>
            </div>
          </div>
          <p className="text-preset-4">Консультації та підтримка з питань інтеграції в Німеччині</p>
          <p className="text-preset-5">
            Для дорослих ми організовуємо консультації, інформаційні зустрічі та підтримку з питань
            інтеграції, щоб кожен мав можливість легше будувати життя в Німеччині. Ми розуміємо
            виклики адаптації та готові допомогти на кожному етапі.
          </p>
        </motion.aside>

        {/* 5. Підсумок (З'явиться п'ятим) */}
        <motion.aside
          variants={cardVariants}
          className="bg-Orange-2 shadow-card flex flex-col gap-4 rounded-lg p-8 md:col-span-2 xl:col-start-3 xl:row-start-2"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black bg-gray-100">
              <Heart />
            </div>
            <div>
              <h3 className="text-preset-3">«Берегиня»</h3>
              <p className="text-preset-5 mt-1 text-gray-400">Місце теплоти та підтримки</p>
            </div>
          </div>
          <p className="text-preset-4">
            Тут зростають діти, підтримуються батьки, міцніє спільнота
          </p>
          <p className="text-preset-5">
            «Берегиня» — це місце, де зберігається те, що робить нас українцями. Ми працюємо для
            того, щоб кожен, хто переступає наш поріг, відчув тепло, безпеку та впевненість у тому,
            що він — не один. Це дає дітям опору та допомагає легше адаптуватися у школах та новому
            оточенні.
          </p>
        </motion.aside>
      </motion.div>
    </section>
  );
}
