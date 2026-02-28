import { ProgramsList } from "../../components/Programs/ProgramsList";


export const AdultPrograms = () => {
  return (
    <div className="font-nunito w-full py-8">
      {/* Шапка сторінки (Точна копія твого стилю) */}
      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            Програми для дорослих
          </h2>
          {/* Твоя фірмова градієнтна лінія */}
          <div className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-4xl items-center justify-center px-4 leading-8 font-semibold md:px-0">
          Короткострокові курси та інтенсиви, спрямовані на швидку адаптацію, 
          вивчення мови та професійний розвиток у новому середовищі.
        </p>
      </div>

      {/* Сітка програм */}
     <ProgramsList />
    </div>
  );
};

