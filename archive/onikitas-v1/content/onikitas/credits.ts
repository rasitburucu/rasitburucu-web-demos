// Photo credits. All photos are from Unsplash (Unsplash License), downloaded
// from the Unsplash CDN and resized locally by scripts/process-images.mjs.
// Keys match the file prefixes in public/onikitas/img/.

export type Credit = {
  key: string;
  photographer: string;
  username: string;
  url: string;
};

export const credits: Credit[] = [
  { key: "hero-house", photographer: "Pixasquare", username: "pixasquare", url: "https://unsplash.com/photos/4ojhpgKpS68" },
  { key: "bay-villa", photographer: "Dimitris Kiriakakis", username: "dimeloper", url: "https://unsplash.com/photos/G11WbaShKZ8" },
  { key: "bay-pool", photographer: "Dimitris Kiriakakis", username: "dimeloper", url: "https://unsplash.com/photos/otbAIT2PTmU" },
  { key: "pool-edge", photographer: "雙 film", username: "film002", url: "https://unsplash.com/photos/8hWJ1lAASVY" },
  { key: "view-sunset", photographer: "Christopher Farrugia", username: "chrisfarr_", url: "https://unsplash.com/photos/B1BZ_Bz-I8c" },
  { key: "view-night", photographer: "Igor Savelev", username: "isavelev", url: "https://unsplash.com/photos/NTxY14-otBk" },
  { key: "view-morning", photographer: "Nabih El Boustani", username: "nounouis", url: "https://unsplash.com/photos/ekpJ4wqf2io" },
  { key: "stone-wall", photographer: "Detlef Hansmann", username: "dwhansmann", url: "https://unsplash.com/photos/REeNAOEQXMs" },
  { key: "tree-shadow", photographer: "Akira", username: "akira_b", url: "https://unsplash.com/photos/HeLGgUTzIhM" },
  { key: "lime-plaster", photographer: "Eszter Sólyom", username: "e_solyom", url: "https://unsplash.com/photos/wDaWqcolhWU" },
  { key: "stair", photographer: "Alesia Kazantceva", username: "alesiaskaz", url: "https://unsplash.com/photos/0B7ijYKaKcE" },
  { key: "arch-hall", photographer: "Jan Antonin Kolar", username: "jankolar", url: "https://unsplash.com/photos/sgmwebTwjKs" },
  { key: "niche", photographer: "mk. s", username: "mk__s", url: "https://unsplash.com/photos/ovekwgP3oig" },
  { key: "olive", photographer: "Vasilis Caravitis", username: "epicuros", url: "https://unsplash.com/photos/6gFxye8SVoY" },
  { key: "hill-sea", photographer: "Georgii Eletskikh", username: "elegeo", url: "https://unsplash.com/photos/Pum5oqs35VE" },
  { key: "oak", photographer: "simon", username: "simon_berger", url: "https://unsplash.com/photos/JH_R66BihvA" },
  { key: "travertine", photographer: "Lena Laurentez", username: "lana_laurentez", url: "https://unsplash.com/photos/UGm1ZwVxmZc" },
  { key: "columns", photographer: "Paolo Chiabrando", username: "chiabra", url: "https://unsplash.com/photos/uezooiynnt8" },
];
