export interface FavoriteItem {
  id: string;
  name: string;
  url?: string;
  description?: string;
}

export interface FavoriteCategory {
  id: string;
  title: string;
  createdAt: string;
  items: FavoriteItem[];
}

export const favorites: FavoriteCategory[] = [
  {
    id: 'fiction',
    title: "Fiction",
    createdAt: "September 1, 2023 10:10 PM",
    items: [
      { id: "1", name: "HPMOR" },
      { id: "2", name: "Name of The Wind" },
      { id: "3", name: "Wintersteel" },
      { id: "4", name: "Licanius Trilogy" },
      { id: "5", name: "A Memory of Light" },
      { id: "6", name: "Worm" },
      { id: "7", name: "Wheel of time" }
    ]
  },
  {
    id: 'non-fiction',
    title: "Non-Fiction",
    createdAt: "September 1, 2023 10:10 PM",
    items: [
      { id: "1", name: "The Years of Lyndon Johnson(series)" },
      { id: "2", name: "Replacing Guilt" },
      { id: "3", name: "Strangers Drowning" }
    ]
  },
  {
    id: 'songs-artists',
    title: "Songs/Artists",
    createdAt: "September 1, 2023 10:10 PM",
    items: [
      { id: "1", name: "Hallelujah - Buckley" },
      { id: "2", name: "Vienna - Joel" },
      { id: "3", name: "Joy /vertigo- time for three" },
      { id: "4", name: "Forget Her - Buckley" },
      { id: "5", name: "Sweet child o' mine /November Rain- Guns n Roses" },
      { id: "6", name: "She used to be mine/Gravity- Sara bareilles" },
      { id: "7", name: "Take me to Church - Hozier" },
      { id: "8", name: "Iris - goo goo dolls" },
      { id: "9", name: "Come Downstairs and Say Hello - Guster" },
      { id: "10", name: "She's always a women - Billy Joel" },
      { id: "11", name: "Could have been me - The Struts" },
      { id: "12", name: "Under Pressure - Queen/ Bowie" },
      { id: "13", name: "Am I Dreaming Metro Booming" },
      { id: "14", name: "Rolling in the Deep - Adele" }
    ]
  },
  {
    id: 'movies',
    title: "Movies",
    createdAt: "September 1, 2023 10:10 PM",
    items: [
      { id: "1", name: "The Shawshank Redemption" },
      { id: "2", name: "Godfather Part 2" },
      { id: "3", name: "Across the Spider Verse" },
      { id: "4", name: "Dune 2" },
      { id: "5", name: "Into the Spider Verse" },
      { id: "6", name: "A Man Called Otto" }
    ]
  },
  {
    id: 'tv-shows',
    title: "TV Shows",
    createdAt: "September 1, 2023 10:17 PM",
    items: [
      { id: "1", name: "The Wire" },
      { id: "2", name: "Arcane" },
      { id: "3", name: "The Good Place" },
      { id: "4", name: "Sherlock" },
      { id: "5", name: "Looking For Alaska" },
      { id: "6", name: "Severance" },
      { id: "7", name: "Ted Lasso" }
    ]
  },
  {
    id: 'words',
    title: "Words",
    createdAt: "October 9, 2023 2:30 PM",
    items: [
      { id: "1", name: "Defenestration" },
      { id: "2", name: "Hallelujah" },
      { id: "3", name: "chutzpah" },
      { id: "4", name: "Tetragrammaton" }
    ]
  },
  {
    id: 'videos',
    title: "Videos",
    createdAt: "November 18, 2023 8:02 PM",
    items: [
      { id: "1", name: "\"Shia LaBeouf\" Live - Rob Cantor" },
      { id: "2", name: "Kawhi Trade Game of Zones" },
      { id: "3", name: "The Broccoli Tree: A Parable" }
    ]
  },
  {
    id: 'articles',
    title: "Articles",
    createdAt: "February 20, 2024 10:11 PM",
    items: [
      { id: "1", name: "Looking for Alice -henrik karlsson" },
      { id: "2", name: "The Haves and the Have Yachts" },
      { id: "3", name: "Notes on Nigeria/El Salvador - Matt Lakeman " },
      { id: "4", name: "The Copenhagen interpretation of ethics" }
    ]
  },
  {
    id: 'poems',
    title: "Poems",
    createdAt: "April 13, 2024 5:24 PM",
    items: [
      { id: "1", name: "Mountain Dew Commercial Disguised as a Love Poem" },
      { id: "2", name: "Those Dying Then" },
      { id: "3", name: "Do Not Go Gentle Into That Good Night" },
      { id: "4", name: "Best Witchcraft is Geometry - Emily Dickinson" },
      { id: "5", name: "I took my Power in my Hand - Emily Dickinson" },
      { id: "6", name: "Silence is all we dread - Emily Dickinson" },
      { id: "7", name: "Paradise is that old mansion - Emily Dickinson" }
    ]
  },
  {
    id: 'paintings',
    title: "Paintings",
    createdAt: "December 8, 2024 12:26 AM",
    items: [
      { id: "1", name: "Starry Night - Van Gogh" },
      { id: "2", name: "The Persistence of Memory - Salvador Dalí" },
      { id: "3", name: "The Scream - Edvard Munch" }
    ]
  },
  {
    id: 'random',
    title: "Just random shit",
    createdAt: "February 21, 2025 9:42 PM",
    items: [
      { id: "1", name: "North Cape By Moonlight" },
      { id: "2", name: "Among the Sierra Nevada" }
    ]
  }
];