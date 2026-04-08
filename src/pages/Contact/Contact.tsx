import { useState, useEffect } from "react";
import { ContactForm } from "../../components/Contacts/ContactForm";
import { ContactInfo } from "../../components/Contacts/ContactInfo";
import { WorkingHours } from "../../components/Contacts/WorkingHours";
import { subscribeToContacts } from "../../services/contactService";
import type { ContactData } from "../../types/contactData";

export const Contact = () => {
  const [contacts, setContacts] = useState<ContactData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToContacts((data) => setContacts(data));
    return () => unsubscribe();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
      
      {/* HEADER SECTION */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-12">
        <div className="flex flex-col items-center justify-center text-nowrap md:items-start">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4 text-4xl md:text-5xl">
            Зв'яжіться з нами
          </h1>
          <div className="mb-4 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 text-center leading-8 text-gray-600 md:px-0 md:text-left">
          Ми тут, щоб допомогти вам. Якщо у вас є запитання, потрібна підтримка чи ви хочете
          поділитися відгуком, наша команда готова вам допомогти.
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* CONTACT FORM */}
        <ContactForm />

        {/* INFO COLUMN */}
        <div className="flex flex-col gap-10">
          <ContactInfo />

          <WorkingHours />

          {/* MAP SECTION - ПОВНІСТЮ НЕРУХОМА */}
          <div className="h-80 overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-lg transition-shadow duration-500 hover:shadow-2xl">
            {contacts?.mapUrl ? (
              <iframe
                className="h-full w-full border-0"
                src={contacts.mapUrl}
                loading="lazy"
                title="Google Maps"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                Карта не налаштована
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};