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
      { id: "1", name: "Hallelujah - Jeff Buckley", url: "https://www.youtube.com/watch?v=y8AWFf7EAc4" },
      { id: "2", name: "Vienna - Billy Joel", url: "https://www.youtube.com/watch?v=wccRif2DaGs" },
      { id: "3", name: "Joy - Time for Three", url: "https://www.youtube.com/watch?v=c5YqMggpdE8" },
      { id: "4", name: "Forget Her - Jeff Buckley", url: "https://www.youtube.com/watch?v=HO0svGjVEP8" },
      { id: "5", name: "Sweet Child o' Mine - Guns N' Roses", url: "https://www.youtube.com/watch?v=1w7OgIMMRc4" },
      { id: "6", name: "November Rain - Guns N' Roses", url: "https://www.youtube.com/watch?v=8SbUC-UaAxE" },
      { id: "7", name: "She Used to Be Mine - Sara Bareilles", url: "https://www.youtube.com/watch?v=53GIADHxVzM" },
      { id: "8", name: "Gravity - Sara Bareilles", url: "https://www.youtube.com/watch?v=rEXhAMtbaec" },
      { id: "9", name: "Take Me to Church - Hozier", url: "https://www.youtube.com/watch?v=PVjiKRfKpPI" },
      { id: "10", name: "Iris - Goo Goo Dolls", url: "https://www.youtube.com/watch?v=NdYWuo9OFAw" },
      { id: "11", name: "Come Downstairs and Say Hello - Guster", url: "https://www.youtube.com/watch?v=LhJrQ444spg" },
      { id: "12", name: "She's Always a Woman - Billy Joel", url: "https://www.youtube.com/watch?v=Cx3QmqV2pHg" },
      { id: "13", name: "Could Have Been Me - The Struts", url: "https://www.youtube.com/watch?v=ARhk9K_mviE" },
      { id: "14", name: "Under Pressure - Queen & David Bowie", url: "https://www.youtube.com/watch?v=a01QQZyl-_I" },
      { id: "15", name: "Am I Dreaming - Metro Boomin", url: "https://www.youtube.com/watch?v=7aUZtDaxS60" },
      { id: "16", name: "Rolling in the Deep - Adele", url: "https://www.youtube.com/watch?v=rYEDA3JcQqw" }
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
      { id: "1", name: "\"Shia LaBeouf\" Live - Rob Cantor", url: "https://www.youtube.com/watch?v=o0u4M6vppCI" },
      { id: "2", name: "Kawhi Trade Game of Zones", url: "https://www.youtube.com/watch?v=cTU8iRdwfGc" },
      { id: "3", name: "The Broccoli Tree: A Parable", url: "https://youtu.be/ESyJop31cmY?si=dVQvONjm4rlarbvQ" }
    ]
  },
  {
    id: 'articles',
    title: "Articles",
    createdAt: "February 20, 2024 10:11 PM",
    items: [
      { id: "1", name: "Looking for Alice -henrik karlsson", url: "https://www.henrikkarlsson.xyz/p/looking-for-alice"},
      { id: "2", name: "The Haves and the Have Yachts", url: "https://www.newyorker.com/magazine/2022/07/25/the-haves-and-the-have-yachts" },
      { id: "3", name: "Notes on Nigeria/El Salvador - Matt Lakeman ", url: "https://mattlakeman.org/2023/05/09/notes-on-nigeria/" },
      { id: "4", name: "The Copenhagen interpretation of ethics", url: "https://forum.effectivealtruism.org/posts/QXpxioWSQcNuNnNTy/the-copenhagen-interpretation-of-ethics" }
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
      { id: "1", name: "North Cape By Moonlight" },
      { id: "2", name: "Among the Sierra Nevada" }
    ]
  },
  {
    id: 'random',
    title: "Just random shit",
    createdAt: "February 21, 2025 9:42 PM",
    items: [
    ]
  }
];