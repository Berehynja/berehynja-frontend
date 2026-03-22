import type { TeamMember } from "../types/teamMember";

export const teamData: TeamMember[] = [
  {
    id: "1",
    name: {ua: "Олена Іваненко", en: "Olena Ivanenko", de: "Olena Ivanenko"},
    role: {ua: "Засновниця та виконавча директорка", en: "Co-founder and Executive Director", de: "Gründerin und Geschäftsführerin"},
    description: {ua: "Понад 10 років досвіду в управлінні неприбутковими організаціями. Олена є серцем нашого фонду, забезпечуючи стратегічне планування та міжнародне партнерство для підтримки українців у Німеччині.", en: "Over 10 years of experience in managing non-profit organizations. Olena is the heart of our foundation, ensuring strategic planning and international partnerships to support Ukrainians in Germany.", de: "Über 10 Jahre Erfahrung in der Führung von gemeinnützigen Organisationen. Olena ist das Herz unserer Stiftung und sorgt für strategische Planung sowie internationale Partnerschaften zur Unterstützung ukrainischer Bürger in Deutschland."},
    skills: {ua: ["Стратегічне управління", "Фандрейзинг", "Зв'язки з громадськістю"], en: ["Strategic Management", "Fundraising", "Community Relations"], de: ["Strategisches Management", "Spendenkampagnen", "Gemeinschaftsbeziehungen"]},
    education: {ua: "Магістр державного управління, КНУ ім. Т. Шевченка", en: "Master of Public Administration, Kyiv National University named after Taras Shevchenko", de: "Master der öffentlichen Verwaltung, Kyiv National University named after Taras Shevchenko"},
    image: "" 
  },
  {
    id: "2",
    name: {ua: "Марія Ковальчук", en: "Maria Kovalchuk", de: "Maria Kovalchuk"},
    role: {ua: "Координаторка програм", en: "Program Coordinator", de: "Programmkoordinatorin"},
    description: {ua: "Спеціалізується на створенні та впровадженні соціальних та культурних ініціатив. Марія забезпечує чітку логістику кожного заходу, від майстер-класів до великих благодійних вечорів.", en: "Specializes in creating and implementing social and cultural initiatives. Maria ensures clear logistics for each event, from masterclasses to large charitable evenings.", de: "Spezialisiert auf die Erstellung und Umsetzung sozialer und kultureller Initiativen. Maria sorgt für klare Logistik für jedes Event, von Masterkursen bis hin zu großen wohltätigen Abenden."},
    skills: {ua: ["Керування проектами", "Планування подій", "Кризовий менеджмент"], en: ["Project Management", "Event Planning", "Crisis Management"], de: ["Projektmanagement", "Veranstaltungsplanung", "Krisenmanagement"]},
    education: {ua: "Соціологія, Національний університет «Києво-Могилянська академія»", en: "Sociology, National University «Kiev-Mohyla Academy»", de: "Soziologie, Nationale Universität «Kiew-Mogila-Akademie»"},
    image: ""
  },
  {
    id: "3",
    name: {ua: "Ірина Петренко", en: "Irina Petrenko", de: "Irina Petrenko"},
    role: {ua: "Спеціалістка з комунікацій", en: "Communications Specialist", de: "Kommunikationsexpertin"},
    description: {ua: "Відповідає за те, щоб голос нашої організації був почутий. Ірина створює контент, працює зі ЗМІ та веде наші соціальні мережі, об'єднуючи спільноту в онлайн-просторі.", en: "Responsible for ensuring our organization's voice is heard. Irina creates content, works with the media, and manages our social media platforms, connecting the community in the online space.", de: "Verantwortlich dafür, dass die Stimme unserer Organisation gehört wird. Irina erstellt Inhalte, arbeitet mit den Medien zusammen und verwaltet unsere Social-Media-Plattformen, um die Gemeinschaft im Online-Raum zu verbinden."},
    skills: {ua: ["SMM", "Копірайтинг", "Медіа-стратегія"], en: ["SMM", "Copywriting", "Media Strategy"], de: ["SMM", "Copywriting", "Medienstrategie"]},
    education: {ua: "Журналістика та медіа-комунікації, ЛНУ ім. І. Франка", en: "Journalism and Media Communication, Lviv National University named after Ivan Franko", de: "Journalistik und Medienkommunikation, Lviv National University named after Ivan Franko"},
    image: ""
  },
  {
    id: "4",
    name: {ua: "Анна Шевченко", en: "Anna Shevchenko", de: "Anna Shevchenko"},
    role: {ua: "Юридична консультантка", en: "Legal Consultant", de: "Rechtsberaterin"},
    description: {ua: "Надає важливу юридичну підтримку нашим співвітчизникам, допомагаючи розібратися в тонкощах німецького законодавства та оформленні документів.", en: "Provides important legal support to our compatriots, helping them navigate the intricacies of German law and document preparation.", de: "Bietet wichtige rechtliche Unterstützung unseren Mitbürgern, wobei sie ihnen hilft, die Feinheiten des deutschen Rechts und die Dokumentenerstellung zu verstehen."},
    skills: {ua: ["Міграційне право", "Юридичний консалтинг", "Аналітика"], en: ["Migration Law", "Legal Consulting", "Analysis"], de: ["Migrationsrecht", "Rechtsberatung", "Analyse"]},
    education: {ua: "Правознавство, Одеська юридична академія", en: "Law, Odesa Legal Academy", de: "Rechtswissenschaft, Odesa Rechtliche Akademie"},
    image: ""
  },
  {
    id: "5",
    name: {ua: "Оксана Литвин", en: "Oksana Litvin", de: "Oksana Litvin"},
    role: {ua: "Координаторка волонтерів", en: "Volunteer Coordinator", de: " ehrenamtliche Koordinatorin"},
    description: {ua: "Оксана знає, як надихнути людей. Вона керує нашою великою мережею волонтерів, допомагаючи кожному знайти напрямок, де він може принести найбільшу користь.", en: "Oksana knows how to inspire people. She leads our large network of volunteers, helping each one find a direction where they can make the most impact.", de: "Oksana weiß, wie man Menschen inspiriert. Sie leitet unser großes Netzwerk von Freiwilligen und hilft jedem dabei, einen Weg zu finden, wo er den größten Nutzen bringen kann."},
    skills: {ua: ["HR", "Коучинг", "Управління персоналом"], en: ["HR", "Coaching", "Human Resources Management"], de: ["HR", "Coaching", "Personalmanagement"]},
    education: {ua: "Психологія та соціальна робота, НПУ ім. М. Драгоманова", en: "Psychology and Social Work, National Pedagogical University named after M. Dragomanov", de: "Psychologie und Soziale Arbeit, Nationale Pädagogische Universität nach M. Dragomanov"},
    image: ""
  },
  {
    id: "6",
    name: {ua: "Світлана Бондаренко", en: "Svitlana Bondarenko", de: "Svitlana Bondarenko"},
    role: {ua: "Фінансовий менеджер", en: "Financial Manager", de: "Finanzmanager"},
    description: {ua: "Забезпечує фінансову стабільність та прозорість організації. Світлана відповідає за бюджетування, звітність та контроль усіх благодійних надходжень.", en: "Ensures financial stability and transparency of the organization. Svitlana is responsible for budgeting, reporting, and monitoring all charitable contributions.", de: "Sorgt für finanzielle Stabilität und Transparenz der Organisation. Svitlana ist für die Planung, Berichterstattung und Überwachung aller wohltätigen Zuwendungen verantwortlich."},
    skills: {ua: ["Фінансовий облік", "Аудит", "Бюджетування"], en: ["Financial Accounting", "Audit", "Budgeting"], de: ["Finanzbuchhaltung", "Audit", "Budgetierung"]},
    education: {ua: "Економіка та фінанси, КНЕУ", en: "Economics and Finance, KNEU", de: "Wirtschafts- und Finanzwissenschaften, KNEU"},
    image: ""
  },
  {
    id: "7",
    name: {ua: "Тетяна Грищук", en: "Tetiana Hryshchuk", de: "Tetiana Hryshchuk"},
    role: {ua: "Культурна кураторка", en: "Cultural Curator", de: "Kulturelle Kuratorin"},
    description: {ua: "Займається популяризацією української культури через мистецтво. Тетяна організовує виставки сучасних митців та традиційні українські свята в Бад-Ейнхаузені.", en: "Engages in promoting Ukrainian culture through art. Tetiana organizes exhibitions of contemporary artists and traditional Ukrainian festivals in Bad Eynaehausen.", de: "Befasst sich mit der Verbreitung ukrainischer Kultur durch Kunst. Tetiana organisiert Ausstellungen zeitgenössischer Künstler und traditionelle ukrainische Feste in Bad Eynaehausen."},
    skills: {ua: ["Мистецтвознавство", "Кураторство", "Дизайн"], en: ["Art History", "Curating", "Design"], de: ["Kunstgeschichte", "Kuratorik", "Design"]},
    education: {ua: "Харківська державна академія дизайну і мистецтв", en: "Kharkiv State Academy of Design and Arts", de: "Kharkiv Staatsakademie für Gestaltung und Künste"},
    image: ""
  },
  {
    id: "8",
    name: {ua: "Олена Грищук", en: "Olena Hryshchuk", de: "Olena Hryshchuk"},
    role: {ua: "Психологиня", en: "Psychologist", de: "Psychologin"},
    description: {ua: "Надає професійну психологічну підтримку тим, хто цього потребує. Спеціалізується на адаптації переселенців та подоланні наслідків травматичних подій.", en: "Provides professional psychological support to those who need it. Specializes in adapting refugees and overcoming the consequences of traumatic events.", de: "Bietet professionelle psychologische Unterstützung denjenigen an, die sie benötigen. Spezialisiert sich auf die Anpassung von Flüchtlingen und das Überwinden der Folgen traumatischer Ereignisse."},
    skills: {ua: ["Кризова психологія", "Гештальт-терапія", "Консультування"], en: ["Crisis Psychology", "Gestalt Therapy", "Counseling"], de: ["Krisenpsychologie", "Gestalt-Therapie", "Beratung"]},
    education: {ua: "Клінічна психологія, ХНУ ім. В. Каразіна", en: "Clinical Psychology, KhNU named after V. Karazin", de: "Klinische Psychologie, KhNU nach V. Karazin"},
    image: ""
  },
  {
    id: "9",
    name: {ua: "Вікторія Грищук", en: "Viktoriya Hryshchuk", de: "Viktoriya Hryshchuk"},
    role: {ua: "Дитяча психологиня", en: "Child Psychologist", de: "Kinderpsychologin"},
    description: {ua: "Працює з нашими наймолодшими членами громади. Вікторія використовує арт-терапію та ігрові методики для легкої адаптації дітей до нового середовища.", en: "Works with our youngest community members. Viktoriya uses art therapy and play-based methods for easy adaptation of children to the new environment.", de: "Arbeitet mit unseren jüngsten Gemeindegliedern. Viktoriya verwendet Kunsttherapie und spielerische Methoden für eine einfache Anpassung von Kindern an die neue Umgebung."},
    skills: {ua: ["Арт-терапія", "Дитяча психологія", "Педагогіка"], en: ["Art Therapy", "Child Psychology", "Pedagogy"], de: ["Kunsttherapie", "Kinderpsychologie", "Pädagogik"]},
    education: {ua: "Педагогічна психологія, Київський університет імені Бориса Грінченка", en: "Educational Psychology, Kyiv University named after Boris Grinchenko", de: "Erziehungswissenschaft, Kyiv University nach Boris Grinchenko"},
    image: ""
  }
];