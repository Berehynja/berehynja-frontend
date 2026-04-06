import { ContactForm } from "../../components/Contacts/ContactForm";
import { ContactInfo } from "../../components/Contacts/ContactInfo";
import { WorkingHours } from "../../components/Contacts/WorkingHours";

export const Contact = () => {
  return (
    <div className="w-full pb-8">
      {/* HEADER SECTION - ПОВЕРНУТО ДО ОРИГІНАЛЬНОЇ СТРУКТУРИ */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl">
            Зв'яжіться з нами{" "}
          </h1>{" "}
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 leading-8 text-gray-600 md:px-0 md:text-left">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка чи ви хочете
          поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* CONTACT FORM - СУЧАСНИЙ СТИЛЬ */}
        <ContactForm />

        {/* INFO COLUMN */}
        <div className="flex flex-col gap-8">
          <ContactInfo />

          {/* WORKING HOURS */}
          <WorkingHours />

          {/* MAP */}
          <div className="h-64 overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-lg">
            <iframe
              className="h-full w-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.342981326442!2d8.7994689!3d52.2008399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba133a8c5e933d%3A0xc3c9f28d546222b!2sWeserstra%C3%9Fe%2024%2C%2032545%20Bad%20Oeynhausen!5e0!3m2!1sen!2sde!4v1710000000000!5m2!1sen!2sde"
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
