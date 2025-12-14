import { Briefcase, Heart, HouseHeart, School, Users } from "lucide-react";

export default function OurMission() {
  return (
    <section className="my-10">
        <div className="text-center">
        <h2 className="text-preset-2 font-semibold">Наша мета</h2>

        </div>
      <div className="max-w-[375px] mt-10 md:max-w-full  mx-auto grid gap-8 xl:gap-y-6 md:grid md:grid-cols-2 xl:grid-cols-4">
        {/* Головний блок - Наша мета */}
        <aside className="rounded-lg p-8 flex flex-col gap-4 shadow-card relative bg-decor md:col-span-2 xl:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <HouseHeart/>
            </div>
            <div>
              
              <h3 className="mt-5 text-preset-3">
                Місія клубу «Берегиня»
              </h3>
               <p className="mt-1 text-preset-5 text-gray-400">
                Підтримка та розуміння
              </p>
            </div>
          </div>
          <p className="text-preset-4">
            Ми прагнемо зробити так, щоб кожна українська сім'я відчувала себе не самотньою, мала підтримку та місце, де її розуміють.
          </p>
          <p className="text-preset-4">
            «Берегиня» — це не просто клуб, це маленький куточок України, який живе поруч, у серці Європи. Ми створили цей простір як відповідь на потребу мати «своє» місце — де можна говорити рідною мовою, святкувати традиційні свята, знайомити дітей із культурою та відчувати теплоту спільноти. Тут кожен може знайти щось для себе: підтримку, розвиток, дружбу чи просто спокій у приємному середовищі.
          </p>
        </aside>

        {/* Для дітей та підлітків */}
        <aside className="bg-grey-500 rounded-lg p-8 flex flex-col gap-4 shadow-card md:row-start-2 xl:col-start-3 xl:row-start-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <School/>
            </div>
            <div>
              <h3 className="text-preset-3">Для дітей</h3>
              <p className="mt-1 text-preset-5 text-gray-400">
                Розвиток та освіта
              </p>
            </div>
          </div>
          <p className="text-preset-4">
            Зберігаємо зв'язок з Україною та розвиваємо навички.
          </p>
          <p className="text-preset-4">
            Наші заняття і програми допомагають дітям та підліткам зберегти зв'язок з Україною, навіть перебуваючи за кордоном. Ми навчаємо мові та культурі, розвиваємо мислення, творчість, впевненість у собі та вміння працювати в команді.
          </p>
        </aside>

        {/* Для спільноти */}
        <aside className="bg-white text-grey-500 rounded-lg p-8 flex flex-col gap-4 shadow-card md:row-start-2 xl:col-start-4 xl:row-start-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
<Users/>
            </div>
            <div>
              <h3 className="text-preset-3">Спільнота</h3>
              <p className="mt-1 text-preset-5 text-gray-400">
                Зустрічі та події
              </p>
            </div>
          </div>
          <p className="text-preset-4">
            Формуємо відчуття єдності через спілкування
          </p>
          <p className="text-preset-4">
            Особливу увагу ми приділяємо взаємодії сімей через спільні зустрічі, майстер-класи, події та культурні заходи. Саме так формується відчуття єдності та теплоти.
          </p>
        </aside>

        {/* Для дорослих */}
        <aside className="bg-dark-blue rounded-lg p-8 flex flex-col gap-4 shadow-card md:col-span-2 xl:col-start-1 xl:row-start-2">
          <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Briefcase/>
            </div>
            <div>
              <h3 className="text-preset-3">Для батьків</h3>
              <p className="mt-1 text-preset-5 text-gray-400">
                Підтримка та інтеграція
              </p>
            </div>
          </div>
          <p className="text-preset-4">
            Консультації та підтримка з питань інтеграції в Німеччині
          </p>
          <p className="text-preset-4">
            Для дорослих ми організовуємо консультації, інформаційні зустрічі та підтримку з питань інтеграції, щоб кожен мав можливість легше будувати життя в Німеччині. Ми розуміємо виклики адаптації та готові допомогти на кожному етапі.
          </p>
        </aside>

        {/* Підсумок */}
        <aside className="rounded-lg p-8 flex flex-col gap-4 shadow-card md:col-span-2 xl:row-start-2 xl:col-start-3">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Heart/>
            </div>  
            <div>
              <h3 className="text-preset-3">«Берегиня»</h3>
              <p className="mt-1 text-preset-5 text-gray-400">
                Місце теплоти та підтримки
              </p>
            </div>
          </div>
          <p className="text-preset-4">
            Тут зростають діти, підтримуються батьки, міцніє спільнота
          </p>
          <p className="text-preset-4">
            «Берегиня» — це місце, де зберігається те, що робить нас українцями. Ми працюємо для того, щоб кожен, хто переступає наш поріг, відчув тепло, безпеку та впевненість у тому, що він — не один. Це дає дітям опору та допомагає легше адаптуватися у школах та новому оточенні.
          </p>
        </aside>

      </div>
    </section>
  );
}