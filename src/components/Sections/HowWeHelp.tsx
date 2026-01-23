import { Heart, Users, BookOpen, Calendar } from "lucide-react";

export function HowWeHelp() {
  return (
    <section className="my-6">
      <div className="max-w-[375px] py-6 md:max-w-full">
        <div className="font-montserratBold text-center">
          <h2 className="text-preset-2 mt-0.5 font-semibold xl:mt-2.5">Як ми допомагаємо</h2>
        </div>

        <div className="font-manrope mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="border-t-Blue shadow-card relative h-[250px] w-full rounded-sm border-t-4 px-8 py-7">
            <h3 className="text-preset-3 font-semibold">Підтримка</h3>
            <p className="text-preset-5 mt-5 font-light">
              Емоційна та практична підтримка українських біженців, які адаптуються до життя в
              Німеччині
            </p>
            <div className="text-Blue absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Heart />
            </div>
          </div>

          <div className="bg-White border-t-Green shadow-card relative h-[250px] w-full rounded-sm border-t-4 px-8 py-7">
            <h3 className="text-preset-3 font-semibold">Громада</h3>
            <p className="text-preset-5 mt-5 font-light">
              Налагодження зв'язків та створення відчуття належності в новій країні
            </p>
            <div className="text-Green absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Users />
            </div>
          </div>
          <div className="bg-White border-t-Orange shadow-card relative h-[250px] w-full rounded-sm border-t-4 px-8 py-7">
            <h3 className="text-preset-3 font-semibold">Інтеграція</h3>
            <p className="text-preset-5 mt-5 font-light">
              Мовні курси, культурна орієнтація та допомога в повсякденному житті в Німеччині
            </p>
            <div className="text-Orange absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <BookOpen />
            </div>
          </div>

          <div className="bg-White border-t-Red shadow-card relative h-[250px] w-full rounded-sm border-t-4 px-8 py-7">
            <h3 className="text-preset-3 font-semibold">Події</h3>
            <p className="text-preset-5 mt-5 font-light">
              {" "}
              Культурні заходи, майстер-класи та діяльність для святкування українського
              спадщини{" "}
            </p>
            <div className="text-Red absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
