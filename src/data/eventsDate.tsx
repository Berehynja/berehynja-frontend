import type { Event } from '../types/types';

export const upcomingEvents: (Event & { images?: Array<{ id: string; url: string; type: 'image'; alt: string }>, videos?: Array<{ id: string; url: string; type:'video'; alt: string }> })[] = [
    {
      id: '1',
      title: 'Святкування Дня незалежності України',
      date: '2024-08-24',
      time: '14:00 - 20:00',
      location: 'Berlin Community Center',
      description: 'Приєднайтеся до нас на спеціальне святкування Дня незалежності України з традиційною музикою, танцювальними виступами, їжею та культурною діяльністю для всієї сім\'ї.',
      imageBanner: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Ukrainian flag' },
        { id: '2', url: 'https://images.pexels.com/photos/2696063/pexels-photo-2696063.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Festival' },
        { id: '3', url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Community gathering' },
        { id: '4', url: 'https://images.pexels.com/photos/3769711/pexels-photo-3769711.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Traditional costumes' },
        { id: '5', url: 'https://images.pexels.com/photos/210647/pexels-photo-210647.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Live music' },
      ],
      videos: [
        { id: '1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video' as const, alt: 'Cultural Performances' },
        { id: '2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video' as const, alt: 'Traditional Dance' },
      ],
    },
    {
      id: '2',
      title: 'Німецько-український культурний обмін',
      date: '2024-07-15',
      time: '16:00 - 19:00',
      location: 'Cultural Hall, Berlin',
      description: "Вечір культурного обміну з презентаціями, дискусіями та можливостями налагодження контактів між німецькою та українською громадами.",
      imageBanner: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/3587620/pexels-photo-3587620.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Cultural exchange' },
        { id: '2', url: 'https://images.pexels.com/photos/3735648/pexels-photo-3735648.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Networking' },
      { id: '3', url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Presentations' },
      { id: '4', url: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Discussion' },
      { id: '5', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Community gathering' },
      ]
    },
    {
      id: '3',
      title: "Вечір культурного обміну з презентаціями, дискусіями та можливостями налагодження контактів між німецькою та українською громадами.",
      date: '2024-07-22',
      time: '11:00 - 17:00',
      location: 'Tiergarten Park',
      description: "Зовнішній сімейний захід з традиційними іграми, спортивними заходами, пікніком та розвагою для дітей та дорослих.",
      imageBanner: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Park picnic' },
        { id: '2', url: 'https://images.pexels.com/photos/1619290/pexels-photo-1619290.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Family fun' },
        { id: '3', url: 'https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Outdoor games' },
        { id: '4', url: 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Community gathering' },
        { id: '5', url: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Children playing' },
      ]
    },
    {
      id: '4',
      title: "Українська кінонь",
      date: '2024-08-05',
      time: '18:30 - 21:30',
      location: 'BEREGENIA Cinema Room',
      description:  "Трансляція сучасного українського кіно з подальшою дискусією. Безкоштовний попкорн та освіжаючі напої.",
      imageBanner: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Cinema event' },
        { id: '2', url: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Movie screening' },
        { id: '3', url: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Film discussion' },
        { id: '4', url: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Popcorn and drinks' },
        { id: '5', url: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Cinematic experience' },
      ]
    },
    {
      id: '5',
      title: "Майстер-клас традиційної кухні",
      date: '2024-08-12',
      time: '15:00 - 18:00',
      location: 'Community Kitchen',
      description: "Вивчіть підготовку традиційних українських страв з досвідченими кухарями. Усі інгредієнти надаються.",
      imageBanner: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Cooking workshop' },
        { id: '2', url: 'https://images.pexels.com/photos/3535182/pexels-photo-3535182.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Traditional food' },
        { id: '3', url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Cooking class' },
        { id: '4', url: 'https://images.pexels.com/photos/5938/food-healthy-lunch-restaurant.jpg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Ukrainian dishes' },
        { id: '5', url: 'https://images.pexels.com/photos/1435896/pexels-photo-1435896.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Group cooking' },
      ]
    },
    {
      id: '6',
      title: "Вечір мережування для професіоналів",
      date: '2024-09-01',
      time: '17:00 - 20:00',
      location: 'Business Center, Berlin',
      description: "Спілкуйтеся з іншими українськими професіоналами, підприємцями та місцевими німецькими бізнес-представниками.",
      imageBanner: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        { id: '1', url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Professional networking' },
        { id: '2', url: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Business meeting' },
        { id: '3', url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Networking event' },
        { id: '4', url: 'https://images.pexels.com/photos/3184290/pexels-photo-3184290.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Business connections' },
        { id: '5', url: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800', type: 'image' as const, alt: 'Professional gathering' },
      ]
    }
  ];