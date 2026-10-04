// Every third-party asset in the Kalemkâr concept, with source and licence.
// Photos: Pexels licence (free to use, no attribution required; credited anyway).
// Licence and author read from each photo's Pexels page on 2026-10-04.
// The copper sini, the counter tray and their engravings are our own work
// (Blender 5.2 + a procedural engraving drawn in Python; scripts/kalemkar-blender/).
// Originals are graded and resized by scripts/process-kalemkar-images.mjs.

export type Credit = {
  group: "photo" | "render" | "font" | "hdri";
  key?: string;
  author: string;
  title: string;
  url: string;
  licence: string;
  use: string;
};

export const credits: Credit[] = [
  { group: "photo", key: "domates", author: "Fatma", title: "Fresh Tomato and Herb Salad Top View", url: "https://www.pexels.com/photo/fresh-tomato-and-herb-salad-top-view-33793968/", licence: "Pexels License", use: "Bahçe domatesi" },
  { group: "photo", key: "patlican", author: "Anat Landa", title: "Gourmet Roasted Eggplant Dish with Herbs", url: "https://www.pexels.com/photo/gourmet-roasted-eggplant-dish-with-herbs-38431254/", licence: "Pexels License", use: "Köz patlıcan" },
  { group: "photo", key: "corba", author: "Teja J", title: "A Flatlay Shot of a Bowl of Soup on a Rustic Background", url: "https://www.pexels.com/photo/a-flatlay-shot-of-a-bowl-of-soup-on-a-rustic-background-7160694/", licence: "Pexels License", use: "Mercimek" },
  { group: "photo", key: "firik", author: "Anat Landa", title: "Delicious Bulgur and Meat Dish with Orange Garnish", url: "https://www.pexels.com/photo/delicious-bulgur-and-meat-dish-with-orange-garnish-38431255/", licence: "Pexels License", use: "Firik" },
  { group: "photo", key: "salata", author: "Collab Media", title: "A bowl of food with vegetables and herbs", url: "https://www.pexels.com/photo/a-bowl-of-food-with-vegetables-and-herbs-27612521/", licence: "Pexels License", use: "Kış lahanası" },
  { group: "photo", key: "humus", author: "Vincent Rivaud", title: "Herb and Meat on Hummus", url: "https://www.pexels.com/photo/herb-and-meat-on-hummus-19328883/", licence: "Pexels License", use: "Humus, kavurma" },
  { group: "photo", key: "incik", author: "Pixie Pannier", title: "Close-Up Shot of a Meal on a Plate", url: "https://www.pexels.com/photo/close-up-shot-of-a-meal-on-a-plate-12312118/", licence: "Pexels License", use: "Kuzu incik" },
  { group: "photo", key: "ayva", author: "Carpe Jugulum", title: "Delicious Baked Quince with Spices in Cast Iron Skillet", url: "https://www.pexels.com/photo/36865387/", licence: "Pexels License", use: "Ayva" },
  { group: "photo", key: "sarma", author: "Oben Kural", title: "Traditional Turkish Baklava", url: "https://www.pexels.com/photo/traditional-turkish-baklava-18543482/", licence: "Pexels License", use: "Fıstık sarması" },
  { group: "photo", key: "sef", author: "Willians Huerta", title: "Chef Garnishing Gourmet Tomato Soup in Kitchen", url: "https://www.pexels.com/photo/chef-garnishing-gourmet-tomato-soup-in-kitchen-36430079/", licence: "Pexels License", use: "Şef bölümü" },
  { group: "photo", key: "bakirci", author: "İrfan Simsar", title: "Traditional Coppersmith Craftsmanship in Gaziantep", url: "https://www.pexels.com/photo/34480631/", licence: "Pexels License", use: "Şef bölümü, kazıma" },
  { group: "photo", key: "cekic", author: "Rüveyda Akkaya", title: "Artisan Crafting Metal Plate with Hammer", url: "https://www.pexels.com/photo/artisan-crafting-metal-plate-with-hammer-39184450/", licence: "Pexels License", use: "Menü sayfası" },
  { group: "photo", key: "ev", author: "İrfan Simsar", title: "Historic Ottoman Architecture in Gaziantep", url: "https://www.pexels.com/photo/historic-ottoman-architecture-in-gaziantep-38698119/", licence: "Pexels License", use: "Ev, avlu" },
  { group: "photo", key: "kubbe", author: "Gökay Nafiz Gürdal", title: "Ancient Stone Archway in Historic Building", url: "https://www.pexels.com/photo/ancient-stone-archway-in-historic-building-33743439/", licence: "Pexels License", use: "Özel oda" },
  { group: "photo", key: "kiler", author: "Buğra", title: "Brown Cellar Interior with a Window and an Open Door", url: "https://www.pexels.com/photo/brown-cellar-interior-with-a-window-and-an-open-door-14350482/", licence: "Pexels License", use: "Salon" },
  { group: "photo", key: "ocak", author: "Cemrecan Yurtman", title: "Grilling Over Glowing Coals in Diyarbakır", url: "https://www.pexels.com/photo/grilling-over-glowing-coals-in-diyarbakir-29132437/", licence: "Pexels License", use: "Şefin tezgâhı" },
  { group: "photo", key: "fistik", author: "Ebubekir", title: "Pistachios are a good source of protein", url: "https://www.pexels.com/photo/pistachios-are-a-good-source-of-protein-27532710/", licence: "Pexels License", use: "Menü sayfası, kaynaklar" },
  { group: "photo", key: "mum", author: "Thirdman", title: "Photograph of Lit Candles", url: "https://www.pexels.com/photo/photograph-of-lit-candles-7956569/", licence: "Pexels License", use: "Rezervasyon onayı" },
  { group: "photo", key: "servis", author: "Arthur Swiffen", title: "Man Hand Holding Meat on Plate", url: "https://www.pexels.com/photo/man-hand-holding-meat-on-plate-17346296/", licence: "Pexels License", use: "Özel davet" },
  { group: "render", author: "Kalemkâr konsepti (kendi üretimimiz)", title: "Kazımalı bakır sini ve tezgâh tepsisi", url: "", licence: "Kendi çalışmamız", use: "Sini, tepsi, favicon" },
  { group: "hdri", author: "Poly Haven", title: "Studio Small 09", url: "https://polyhaven.com/a/studio_small_09", licence: "CC0", use: "Sini render ışığı (yalnız yapımda)" },
  { group: "font", author: "Bastien Sozeau (Noir Blanc Rouge)", title: "Young Serif", url: "https://fonts.google.com/specimen/Young+Serif", licence: "SIL Open Font License 1.1", use: "Başlıklar, kazıma yazı" },
  { group: "font", author: "Sindre Bremnes, Frode Helland (Monokrom)", title: "Geologica", url: "https://fonts.google.com/specimen/Geologica", licence: "SIL Open Font License 1.1", use: "Gövde ve arayüz" },
];
