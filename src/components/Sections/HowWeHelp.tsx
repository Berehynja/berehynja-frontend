import { Heart, Users, BookOpen, Calendar } from 'lucide-react';

export function HowWeHelp(){
    return(<section className="my-6">
        <div className="max-w-[375px] md:max-w-full py-6">
          <div className="text-center font-montserratBold">
           
            <h2
              className="text-preset-2 font-semibold mt-0.5 xl:mt-2.5"
            >
Як ми допомагаємо
            </h2>
           
          </div>

          <div
            className="font-manrope grid md:grid-cols-2 xl:grid-cols-4 mt-10 gap-8"
          >
            <div
              className="w-full h-[250px] rounded-sm border-t-4 border-t-Blue py-7 px-8 relative shadow-card"
            >
              <h3 className="text-preset-3 font-semibold">Підтримка</h3>
              <p
                className="text-preset-5 mt-5 font-light"
              >
                Емоційна та практична підтримка українських біженців, які адаптуються до життя в Німеччині
              </p>
             <div className="absolute bottom-8 right-8 text-Blue w-12 h-12 flex items-center justify-center rounded-full bg-gray-100  ">
               <Heart 
              />
             </div>
            </div>


              <div
                className="w-full h-[250px] bg-White rounded-sm border-t-4 border-t-Green py-7 px-8 relative shadow-card"
              >
                <h3 className="text-preset-3 font-semibold">Громада</h3>
                <p
                  className="text-preset-5 mt-5 font-light"
                >
                  Налагодження зв'язків та створення відчуття належності в новій країні
                </p>
                 <div className="absolute bottom-8 right-8 text-Green w-12 h-12 flex items-center justify-center rounded-full bg-gray-100  ">
               <Users 
              />
             </div>
              </div>
              <div
                className="w-full h-[250px] bg-White rounded-sm border-t-4 border-t-Orange py-7 px-8 relative shadow-card"
              >
                <h3 className="text-preset-3 font-semibold">Інтеграція</h3>
                <p
                  className="text-preset-5 mt-5 font-light"
                >
                  Мовні курси, культурна орієнтація та допомога в повсякденному житті в Німеччині
                </p>
                 <div className="absolute bottom-8 right-8 text-Orange w-12 h-12 flex items-center justify-center rounded-full bg-gray-100  ">
               <BookOpen 
              />
             </div>
              </div>
            
            
            <div
              className="w-full h-[250px] bg-White rounded-sm border-t-4 border-t-Red py-7 px-8 relative shadow-card"
            >
              <h3 className="text-preset-3 font-semibold">Події</h3>
              <p className="text-preset-5 mt-5 font-light"> Культурні заходи, майстер-класи та діяльність для святкування українського спадщини </p>
               <div className="absolute bottom-8 right-8 text-Red w-12 h-12 flex items-center justify-center rounded-full bg-gray-100  ">
               <Calendar 
              />
             </div>
            </div>
          </div>
        </div>
      </section>);
}