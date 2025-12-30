import { Phone, Mail, MapPin } from "lucide-react";

import { SocialMedia } from "../../components/SocialMedia/SocialMedia";

export const Contact = () => {
  return (
    <div className="w-full py-8">
      <div
        className="flex flex-col justify-center items-center gap-8 py-7 md:py-10 font-montserratBold 
      md:flex-row "
      >
        <div className="flex flex-col text-nowrap justify-center items-center ">
          <h1 className="flex flex-nowrap  text-preset-2 font-montserratBold pb-4 justify-center ">
            Зв'яжіться з нами{" "}
          </h1>{" "}
          <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-yellow-400  mb-4"></div>
        </div>

        <p className="flex justify-center items-center max-w-3xl text-preset-4 px-4 md:px-0 leading-8">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка
          чи ви хочете поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="flex w-full flex-col md:flex-row justify-center items-center md:gap-6 lg:gap-8 py-12 ">
        <form
          className=" flex flex-col text-preset-4 min-w-80 w-full max-w-120 p-5 gap-8 md:max-w-1/2  px-6  rounded-lg shadow-lg"
          name="email_form"
        >
          <h2 className="font-montserratBold text-preset-4 py-3 xl:py-4">
            Напишіть нам
          </h2>
          <label className=" flex flex-col gap-2">
            Full Name *
            <input
              className="w-full h-10 p-2 border rounded-md "
              type="name"
              name="name"
              placeholder="Your full Name"
            />
          </label>

          <label className=" flex flex-col gap-2">
            Email Address *
            <input
              className="w-full h-10 p-2 border rounded-md"
              type="email"
              name="email"
              placeholder="your@email.com"
            />
          </label>
          <label className=" flex flex-col gap-2">
            Telephone Number (Optional)
            <input
              className="w-full h-10 p-2 border rounded-md"
              type="tel"
              name="tel"
              placeholder="Your telephone number"
            />
          </label>

          <label className=" flex flex-col gap-2">
            Message *
            <textarea
              className="p-2 h-30 border rounded-md"
              name="message"
              rows={5}
              placeholder="Enter your message here..."
            ></textarea>
          </label>

          <button className=" w-full h-10 rounded-lg cursor-pointer bg-lime-600 hover:bg-lime-500 transition-colors duration-250" type="submit">
            Send message
          </button>
        </form>

        <div className="flex flex-col min-w-80 w-full max-w-120 p-5 md:max-w-1/2 md:p-0 gap-8 ">
          <div className="p-5 rounded-lg shadow-lg">
            <h2 className="font-montserratBold text-preset-3 mb-3 py-3 xl:py-4">
              Контактна інформація
            </h2>

            <ul className="flex flex-col gap-6 text-preset-4 ">
              <li className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-12 h-12 p-3 rounded-full bg-yellow-100">
                  <Mail className=" stroke-lime-600"/>
                </span>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="font-montserratMedium  ">Електронна адреса</h3>
                  <a
                    className=" text-lime-600 hover:text-lime-500  transition-colors duration-250"
                    href="mailto:bereginia.badoeynhausen@gmail.com"
                    target="_blank"
                  >
                    bereginia.badoeynhausen@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                  <Phone className=" stroke-lime-600"/>
                </span>
                <div>
                  <h3 className="font-montserratMedium ">Телефон</h3>
                  <a
                    className=" text-lime-600 hover:text-lime-500  transition-colors duration-250"
                    href="tel:+4915128161383"
                  >
                    +49 151 28161383
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-12 h-12 rounded-full p-3 bg-yellow-100">
                  <MapPin className=" stroke-lime-600"/>
                </span>
                <div>
                  <h3 className="font-montserratMedium ">Адреса</h3>
                  <a
                    className="text-lime-600 hover:text-lime-500  transition-colors duration-250"
                    href="https://www.google.com/maps/place/Johanniter-Mehrgenerationenhaus+Bad+Oeynhausen/@52.1979902,8.8037727,314m/data=!3m1!1e3!4m6!3m5!1s0x47ba72a07b459829:0x19fbe41cee571634!8m2!3d52.1978688!4d8.8039899!16s%2Fg%2F11c6q9n5kc?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    aria-label="Google Maps location"
                  >
                    32545 Weserstraße 24 Bad-Oeynhausen, Germany
                  </a>
                </div>
              </li>
              <li>
                <SocialMedia />
              </li>
            </ul>
          </div>

          <div className="flex flex-col p-5 gap-4 rounded-lg bg-blue-50">
            <h3 className="font-montserratBold text-preset-4 py-3 xl:py-4">
              Робочі години
            </h3>
            <div className="flex justify-between">
              <span>Понеділок - П'ятниця</span>
              <span>9:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>Субота</span>
              <span>Зачинено</span>
            </div>
            <div className="flex justify-between">
              <span>Неділя</span>
              <span>10:00 - 17:00</span>
            </div>
          </div>

          <div></div>
        </div>
      </section>
    </div>
  );
};
