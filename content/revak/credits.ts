// Every third-party asset in the Revak Okulları concept, with source and licence.
// Photos: Pexels licence (free to use, no attribution required; credited anyway).
// Licence confirmed from each photo's Pexels structured data (license: pexels.com/license)
// on 2026-09-28. Unsplash candidates from the moodboard were not used: their pages
// sit behind a bot check, so their licence could not be verified.
// Originals are graded and resized by scripts/process-revak-images.mjs.
// The arcade renders (keys revak, revakWide, the walk's arch faces, the OG card) are
// our own: modelled and rendered in Blender by scripts/revak-blender/revak_scene.py.

export type Credit = { group: "photo" | "font"; key?: string; author: string; title: string; url: string; licence: string; use: string };

export const credits: Credit[] = [
  { group: "photo", key: "anaokulu", author: "Kaboompics", title: "Child Sitting with Toy Blocks", url: "https://www.pexels.com/photo/child-sitting-with-toy-blocks-7269710/", licence: "Pexels License", use: "Anaokulu kemeri" },
  { group: "photo", key: "ilkokul", author: "Pixabay", title: "White Graphing Notebook", url: "https://www.pexels.com/photo/white-graphing-notebook-207756/", licence: "Pexels License", use: "İlkokul kemeri" },
  { group: "photo", key: "ortaokul", author: "Gustavo Fring", title: "Close-up of Lab Worker Looking at Specimen under Microscope", url: "https://www.pexels.com/photo/close-up-of-lab-worker-looking-at-specimen-under-microscope-8770717/", licence: "Pexels License", use: "Ortaokul kemeri" },
  { group: "photo", key: "lise", author: "George Pak", title: "Boy and a Girl Walking Up an Outdoor Staircase", url: "https://www.pexels.com/photo/boy-and-a-girl-walking-up-an-outdoor-staircase-7973028/", licence: "Pexels License", use: "Lise kemeri" },
  { group: "photo", key: "writing", author: "Ryutaro Tsukata", title: "Man writing with pen on paper", url: "https://www.pexels.com/photo/man-writing-with-pen-on-paper-6249385/", licence: "Pexels License", use: "Eğitim yaklaşımı" },
  { group: "photo", key: "music", author: "cottonbro studio", title: "Woman Playing Cello", url: "https://www.pexels.com/photo/woman-playing-cello-7095838/", licence: "Pexels License", use: "Oda orkestrası, sahne ve müzik" },
  { group: "photo", key: "robotics", author: "Chengxin Zhao", title: "Close-up of a Person Connecting Electronic Components", url: "https://www.pexels.com/photo/close-up-of-a-person-connecting-electronic-components-15470540/", licence: "Pexels License", use: "Robotik" },
  { group: "photo", key: "debate", author: "Pixabay", title: "Black and Gray Microphone", url: "https://www.pexels.com/photo/black-and-gray-microphone-164829/", licence: "Pexels License", use: "Münazara" },
  { group: "photo", key: "ceramics", author: "igovar igovar", title: "Close-up of a Person Forming the Clay on a Pottery Wheel", url: "https://www.pexels.com/photo/close-up-of-a-person-forming-the-clay-on-a-pottery-wheel-18486386/", licence: "Pexels License", use: "Seramik atölyesi" },
  { group: "photo", key: "stage", author: "Tima Miroshnichenko", title: "Red Chairs in the Cinema", url: "https://www.pexels.com/photo/red-chairs-in-the-cinema-7991381/", licence: "Pexels License", use: "Tiyatro" },
  { group: "photo", key: "library", author: "Ayşe İpek", title: "Books in the Library", url: "https://www.pexels.com/photo/books-in-the-library-13278839/", licence: "Pexels License", use: "Kütüphane" },
  { group: "photo", key: "pool", author: "Kindel Media", title: "Olympic Swimming Pool with Blue Lane Lines", url: "https://www.pexels.com/photo/olympic-swimming-pool-with-blue-lane-lines-8688149/", licence: "Pexels License", use: "Havuz" },
  { group: "photo", key: "court", author: "Mathias Reding", title: "Sports ground with basketball hoop", url: "https://www.pexels.com/photo/sports-ground-with-basketball-hoop-5331954/", licence: "Pexels License", use: "Basketbol" },
  { group: "photo", key: "chess", author: "Vlada Karpovich", title: "Man in Black Jacket Playing Chess", url: "https://www.pexels.com/photo/man-in-black-jacket-playing-chess-6202994/", licence: "Pexels License", use: "Satranç" },
  { group: "photo", key: "kabul", author: "Serhat HAYTAOĞLU", title: "Arched Antique Colonnade", url: "https://www.pexels.com/photo/arched-antique-colonnade-17113072/", licence: "Pexels License", use: "Kabul sayfası" },
  { group: "photo", key: "lab", author: "Jiri Ikonomidis", title: "Flasks in a Lab", url: "https://www.pexels.com/photo/flasks-in-a-lab-15509862/", licence: "Pexels License", use: "Fen laboratuvarları" },
  { group: "photo", key: "dining", author: "Henry Wagner", title: "Sunlit Empty Cafeteria with Wooden Benches", url: "https://www.pexels.com/photo/sunlit-empty-cafeteria-with-wooden-benches-34316837/", licence: "Pexels License", use: "Yemekhane" },
  { group: "photo", key: "garden", author: "Candid Flaneur", title: "Serene Garden Pathway with Lush Greenery", url: "https://www.pexels.com/photo/serene-garden-pathway-with-lush-greenery-32416206/", licence: "Pexels License", use: "Bahçeler" },
  { group: "photo", key: "classroom", author: "Rajiv Salunkhe", title: "Game of Shadows!", url: "https://www.pexels.com/photo/game-of-shadows-27916160/", licence: "Pexels License", use: "Sınıf" },
  { group: "photo", key: "corridor", author: "Hoàng Xuân", title: "Sunlit School Corridor with Shadows", url: "https://www.pexels.com/photo/sunlit-school-corridor-with-shadows-29636314/", licence: "Pexels License", use: "Koridor" },
  { group: "font", author: "Astigmatic (Brian J. Bonislawsky)", title: "Marcellus", url: "https://fonts.google.com/specimen/Marcellus", licence: "SIL Open Font License 1.1", use: "Başlıklar" },
  { group: "font", author: "Alfredo Marco Pradil", title: "Hanken Grotesk", url: "https://fonts.google.com/specimen/Hanken+Grotesk", licence: "SIL Open Font License 1.1", use: "Metin ve arayüz" },
];
