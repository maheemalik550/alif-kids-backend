import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/books/schemas/book.schema';

const booksData = [
  {
    slug: "fatima-s-first-fast",
    title: "Fatima's First Fast",
    tagline:
      "She's little. She's determined. But can she make it till Maghrib?",
    isbn: "978-1-918105-62-9",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/fatima-s-first-fast",
    overview:
      "Fatima is trying her first ever fast during Ramadan — and she's beyond excited. But as the hours pass and her tummy rumbles, will she be able to keep going? A touching introduction to the spirit of Ramadan, patience, and the joy of growing up with faith.",
    learning_notes:
      "This story gently introduces children to the beauty of observing a first fast, helping them understand patience, gratitude, and the joy of trying their best. Young readers learn about family support, self-control, and the emotional accomplishment of participating in Ramadan in a small, meaningful way.",
    islamic_references:
      "This book softly highlights the importance of Ramadan, the value of family encouragement, and the concept of doing acts of worship according to one's ability. Themes of sincerity, kindness, and learning gradually are woven throughout the story.",
    for_parents_teachers:
      "Use this book to open conversations about Ramadan, age-appropriate fasting, and celebrating small achievements. It encourages emotional awareness and builds a child's confidence while helping them feel connected to their faith through gentle, nurturing storytelling.",
    featuredImage: "/assets/feature-book-1.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/Book1_Fatima_sFirstFast-BookCover_1__page-0001.jpg?v=1762836751&width=330",
    pages: [{
      "page": "fatimas-first-fast-page-1763454592104.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-first-fast-page-1763454592104.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-day-we-almost-missed-salah",
    title: "The Day We Almost Missed Salah",
    tagline: "Can a fun day turn into a race against time… for Salah?",
    isbn: "978-1-918105-61-2",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url:
      "https://shop.sidr.productions/products/the-day-we-almost-missed-salah",
    overview:
      "Abdullah and Fatima are having the best day — until they suddenly realize… it's prayer time! What follows is a lesson in urgency, prioritization, and the beauty of Salah at its proper time. This relatable story gently reminds kids that no matter how busy or distracted we get, prayer is always worth stopping for.",
    learning_notes:
      "A relatable story that teaches children about time management, responsibility, and the importance of salah in daily life.",
    islamic_references:
      "The story highlights the value of prayer, the joy of praying on time, and the teamwork needed within families to support each other's worship.",
    for_parents_teachers:
      "Use this book to build positive routines around salah. It helps children understand obligations with a gentle, encouraging tone.",
    featuredImage: "/assets/feature-book-5.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheDayWeAlmostMissedSalah.png?v=1762849172&width=330",
    pages: [{
      "page": "the-day-we-almost-missed-salah-page-1763465799410.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-day-we-almost-missed-salah-page-1763465799410.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-iftar-delivery-mission",
    title: "The Iftar Delivery Mission",
    tagline: "Ramadan isn't just about fasting… it's about giving too.",
    isbn: "978-1-918105-67-4",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url:
      "https://shop.sidr.productions/products/the-iftar-delivery-mission",
    overview:
      "Abdullah and Fatima team up with Baba for a special iftar delivery — but unexpected surprises are waiting along the way! Join them on this heartwarming mission that celebrates community, charity, and the blessings of Ramadan.",
    learning_notes:
      "This story highlights teamwork, generosity, and the excitement of helping others during Ramadan. Children learn that acts of service—even small ones—have a big impact.",
    islamic_references:
      "The book emphasises the virtues of giving, sharing food for iftar, and supporting one another as part of community spirit during Ramadan.",
    for_parents_teachers:
      "A wonderful tool for teaching children about charity and cooperation. It encourages families to involve children in small acts of goodness, nurturing a love for giving.",
    featuredImage: "/assets/feature-book-7.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheIftarDeliveryMission.png?v=1762850477&width=330",
    pages: [{
      "page": "the-iftar-delivery-mission-page-1763456008029.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-iftar-delivery-mission-page-1763456008029.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "fatima-and-the-furry-friend",
    title: "Fatima and the Furry Friend",
    tagline: "A lost kitten. A big heart. And an even bigger lesson.",
    isbn: "978-1-918105-65-0",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url:
      "https://shop.sidr.productions/products/fatima-and-the-furry-friend",
    overview:
      "Fatima finds a scared, shivering kitten near the masjid. She wants to help — but what should they do next? Through this gentle tale, children learn about mercy towards animals and why kindness is always the right choice, even when it's not easy.",
    learning_notes:
      "A gentle introduction to empathy and responsibility, this story helps children understand how to care for animals with compassion and thoughtfulness. It nurtures emotional intelligence and soft-heartedness.",
    islamic_references:
      "Inspired by Islamic teachings about kindness toward animals, the story echoes the values of mercy, gratitude, and gentle behaviour taught by the Prophet ﷺ.",
    for_parents_teachers:
      "Use this book to encourage conversations about responsibility, empathy, and kindness. It helps children appreciate the importance of treating all creatures with respect and care.",
    featuredImage: "/assets/feature-book-6.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/Fatima_sFurryFriend.png?v=1762840568&width=330",
    pages: [{
      "page": "fatimas-furry-friend-page-1763455816848.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-furry-friend-page-1763455816848.18.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-kindness-jar",
    title: "The Kindness Jar",
    tagline: "One little jar. Countless acts of kindness. Big rewards!",
    isbn: "978-1-918105-63-6",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-kindness-jar",
    overview:
      "When Mama brings out an empty jar and says it's time to fill it with kindness, Abdullah and Fatima begin to see their world differently. Small good deeds, loving words, and selfless actions — every act goes into the jar! But what will happen when the jar is full?",
    learning_notes:
      "Children learn the beauty of kindness, small good deeds, and the joy of spreading positivity through thoughtful actions.",
    islamic_references:
      "The story reflects the Islamic principle that even small acts of kindness are rewarded by Allah. It encourages children to build habits of goodness.",
    for_parents_teachers:
      "A wonderful way to introduce ongoing kindness challenges at home or in school. It helps families nurture compassionate character in a joyful way.",
    featuredImage: "/assets/feature-book-8.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheKindnessJar.png?v=1762850504&width=330",
    pages: [{
      "page": "the-kindness-jar-page-1763467796054.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-kindness-jar-page-1763467796054.18.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-forgotten-salam",
    title: "The Forgotten Salam",
    tagline: "What happens when we forget a single, powerful word?",
    isbn: "978-1-918105-64-3",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-forgotten-salam",
    overview:
      'Abdullah rushes into class without saying "Salam" — and suddenly everything feels… off. This charming story explores the significance of Islamic greetings and how the simple word "Salam" can change our day and connect hearts in a beautiful way.',
    learning_notes:
      `This book teaches children the power of good manners, especially the warm and welcoming greeting of "Assalamu Alaikum." Through a simple moment, little readers understand how a small act can brighten someone's day and strengthen relationships.`,
    islamic_references:
      "The story reflects the Prophetic sunnah of spreading salam and reminds children that kindness often begins with simple words. It encourages building love and unity within families, classrooms, and communities.",
    for_parents_teachers:
      "This book is perfect for guiding children to recognise the importance of greeting others with respect and warmth. Use it to model positive social behaviour and to remind children how small Islamic practices carry meaningful rewards.",
    featuredImage: "/assets/feature-book-2.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheForgottenIslamFrontCover.png?v=1762839642&width=330",
    pages: [{
      "page": "the-forgotten-salam-page-1763454885103.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-forgotten-salam-page-1763454885103.18.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "abdullah-s-angry-day",
    title: "Abdullah's Angry Day",
    tagline: "Some days are tough. But does anger have to win?",
    isbn: "978-1-918105-66-7",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/abdullah-s-angry-day",
    overview:
      "Abdullah's having one of those days — from spilled juice to a broken toy, everything feels frustrating. Will he let his anger control him, or will he remember what the Prophet(P.B.U.H) taught us about patience and emotional strength?",
    learning_notes:
      "This story gently helps children recognise emotions, understand anger, and learn calming techniques. It validates feelings while guiding young readers toward emotional balance and reflection.",
    islamic_references:
      "It introduces Islamic teachings about managing anger, patience, and self-control, reflecting the Prophetic manners of responding calmly.",
    for_parents_teachers:
      "A supportive resource for helping children navigate big emotions. Use it to introduce healthy ways to handle frustration and to reinforce Islamic character development.",
    featuredImage: "/assets/feature-book-9.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/Abdullah_sAngryDay.png?v=1762849075&width=330",
    pages: [{
      "page": "abdullahs-angry-day-page-1763464206303.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "abdullahs-angry-day-page-1763464206303.18.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "fatima-s-shiny-shoes",
    title: "Fatima's Shiny Shoes",
    tagline:
      "They sparkle. They shine. But will they make Fatima feel full inside?",
    isbn: "978-1-918105-68-1",
    age_group: "5 - 8",
    price_gbp: 9.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/fatima-s-shiny-shoes",
    overview:
      "Fatima loves her new shoes — until she sees someone with none. A powerful story about gratitude, humility, and the joy of giving something precious for the sake of Allah.",
    learning_notes:
      "This sweet story teaches children about gratitude, taking care of belongings, and showing appreciation for what they have.",
    islamic_references:
      "The book subtly reflects Islamic values of cleanliness, humility, and thanking Allah for His blessings.",
    for_parents_teachers:
      "Perfect for guiding children toward responsibility and mindful behaviour. Encourage children to recognise blessings in everyday moments.",
    featuredImage: "/assets/feature-book-10.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/Fatima_sShinyShoes.png?v=1762856781&width=330",
    pages: [{
      "page": "fatimas-shiny-shoes-page-1763465067267.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "fatimas-shiny-shoes-page-1763465067267.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-eid-surprise",
    title: "The Eid Surprise",
    tagline:
      "A joyful Eid tale about anticipation, family and sharing happiness.",
    isbn: "978-1-918105-69-8",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-eid-surprise",
    overview:
      'The Eid Surprise" is a heartwarming children\'s story that celebrates the joy, anticipation, and togetherness of Eid. Through engaging storytelling and delightful illustrations, young readers join the characters as they prepare for the big day — from decorating and giving gifts to sharing special moments with family. The book beautifully captures the true spirit of Eid, teaching children about kindness, gratitude, and the happiness that comes from sharing and caring for others. Perfect for early readers, this book helps families introduce Islamic values in a fun and memorable way.',
    learning_notes:
      "A heart-warming celebration of Eid that teaches children about joy, togetherness, and appreciating thoughtful surprises.",
    islamic_references:
      "The story highlights the spirit of Eid—gratitude, family bonding, gift-giving, and celebrating Allah's blessings.",
    for_parents_teachers:
      "Use this book to build excitement around Eid traditions and to help children understand the meaning behind celebration.",
    featuredImage: "/assets/feature-book-11.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheEidSurprise.png?v=1762850359&width=330",
    pages: [{
      "page": "the-eid-surprise-page-1763468730721.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-eid-surprise-page-1763468730721.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-midnight-visitor",
    title: "The Midnight Visitor",
    tagline: "A cosy bedtime story about facing night-time fears with faith.",
    isbn: "978-1-918105-70-4",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-midnight-visitor",
    overview:
      "The Midnight Fright is a comforting bedtime story from the beloved Abdullah & Fatima series that helps children overcome their fears through faith. When a loud thunderstorm wakes the siblings in the middle of the night, their father gently reminds them of the Prophet Muhammad (P.B.U.H) and his unwavering trust in Allah during moments of fear. Through heartwarming dialogue and beautiful illustrations, this story teaches children the power of tawakkul (trust in Allah), dhikr (remembrance of Allah), and finding peace in prayer. A perfect read to soothe young hearts and strengthen faith before bedtime.",
    learning_notes:
      "This gentle story helps children understand fear, courage, and reassurance. It normalises nighttime worries and shows how to overcome them.",
    islamic_references:
      "The story subtly integrates Islamic comfort practices such as remembering Allah and seeking calm through faith.",
    for_parents_teachers:
      "Use this book to discuss nighttime routines and coping with fear. It offers a nurturing, comforting message for children.",
    featuredImage: "/assets/feature-book-12.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheMidnightFright.png?v=1762848957&width=330",
    pages: [{
      "page": "the-midnight-fright-page-1763469155515.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-midnight-fright-page-1763469155515.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-lost-quran-page",
    title: "The Lost Quran Page",
    tagline:
      "A gentle lesson about honesty, the Qur'an and seeking forgiveness.",
    isbn: "978-1-918105-71-1",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-lost-quran-page",
    overview:
      "The Lost Quran Page is a touching story from the Abdullah & Fatima series that teaches children the importance of honesty, respect for the Holy Quran, and seeking forgiveness from Allah. When Abdullah accidentally tears a page from his Quran, he feels scared and hides his mistake. But through his parents' gentle guidance, he learns that admitting mistakes and asking for forgiveness makes us stronger in faith. Beautifully illustrated and written with warmth, this story helps young readers understand the value of truth, repentance, and love for the Quran — inspiring them to protect and cherish Allah's words in their everyday lives.",
    learning_notes:
      "A story that nurtures responsibility, focus, and respect for the Quran. Children learn about problem-solving and staying calm during challenges.",
    islamic_references:
      "The book highlights the honour of the Quran, the care it deserves, and the blessings of seeking guidance through sincere effort.",
    for_parents_teachers:
      "This book is ideal for encouraging children to build a relationship with the Quran. Use it to reinforce gentle reminders about respect and mindfulness",
    featuredImage: "/assets/feature-book-13.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheLostQuranPage_ab077a3a-75fb-41ec-9610-2bcb34b1b76c.png?v=1762850299&width=330",
    pages: [{
      "page": "the-lost-quran-page-page-1763469389555.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-lost-quran-page-page-1763469389555.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
  {
    slug: "the-masjid-race",
    title: "The Masjid Race",
    tagline:
      "A fun race to the masjid that shows what real winning looks like.",
    isbn: "978-1-918105-72-8",
    age_group: "5 - 8",
    price_gbp: 6.99,
    format: "Paper Back",
    series: "Abdullah and Fatima",
    product_url: "https://shop.sidr.productions/products/the-masjid-race",
    overview:
      "In The Masjid Race, Abdullah and Fatima set off on an exciting challenge with their Baba — to see who can reach the masjid first! Along the way, they learn that true victory isn't just about winning the race, but about the joy of going to the masjid and the blessings that come with it. Filled with cheerful illustrations and heartfelt lessons, this story inspires children to love visiting the masjid, value family time, and understand the beauty of doing good deeds for Allah. Written by Dr. Nousheen Zakaria and illustrated by Sidr Productions, The Masjid Race is a delightful reminder that faith, fun, and family make the best team.",
    learning_notes:
      "The Masjid Race beautifully highlights the importance of beginning the day with remembrance of Allah and approaching worship with sincerity, kindness, and good character. Through Abdullah and Fatima's early-morning excitement, children learn about preparing for salah, getting ready with cleanliness, helping others, racing toward good deeds, and appreciating the blessings that come with praying on time. The story encourages young readers to value responsibility, compassion, and the joy found in following Allah's guidance.",
    islamic_references:
      `This book gently introduces meaningful Islamic concepts in a child-friendly way — including the virtue of wudu, the beauty of starting actions with "Bismillah," the reward of praying Fajr, the importance of kindness, and the remembrance (tasbih) taught by the Prophet ﷺ. It reinforces that helping others is an act beloved to Allah, and that good deeds — even small ones — are recognised and rewarded. The story also touches on names of Allah, such as Al-Jameel, helping children connect faith with daily life in a soft and relatable manner.`,
    for_parents_teachers:
      "This story is an excellent tool for encouraging healthy routines around salah, morning habits, and positive character. Parents and teachers can use it to spark gentle conversations about responsibility, teamwork, kindness, and acting with ihsan (excellence). It provides opportunities to discuss family bonding, the value of helping others, and celebrating children's efforts in worship without pressure. The book also supports emotional development, allowing children to reflect on their choices, feelings, and the joy of doing good deeds together as a family.",
    featuredImage: "/assets/feature-book-14.png",
    cover_image:
      "https://shop.sidr.productions/cdn/shop/files/TheMasjidRace.png?v=1762849899&width=330",
    pages: [{
      "page": "the-masjid-race-page-1763469916503.1.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.2.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.3.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.4.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.5.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.6.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.7.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.8.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.9.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.10.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.11.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.12.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.13.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.14.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.15.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.16.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.17.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.18.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    },
    {
      "page": "the-masjid-race-page-1763469916503.19.png",
      "audio": null,
      "pageStatus": "pending",
      "audioStatus": "pending"
    }],
  },
];

@Injectable()
export class BooksSeeder {
  private readonly logger = new Logger(BooksSeeder.name);

  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<BookDocument>,
  ) {}

  async seed() {
    try {
      const existingBooks = await this.bookModel.countDocuments().exec();

      if (existingBooks > 0) {
        this.logger.warn('Books already exist in database. Skipping seeding.');
        return;
      }

      await this.bookModel.insertMany(booksData);
      this.logger.log(`✅ Successfully seeded ${booksData.length} books`);
    } catch (error) {
      this.logger.error('❌ Error seeding books:', error);
      throw error;
    }
  }
}
