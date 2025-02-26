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
      { id: "1", name: "Harry Potter and the Methods of Rationality" },
      { id: "2", name: "Name of The Wind" },
      { id: "3", name: "Red Rising Saga" },
      { id: "4", name: "Licanius Trilogy" },
      { id: "5", name: "Worm" },
      { id: "6", name: "The Wheel of Time" },
      { id: "7", name: "East of Eden" },
    ]
  },
  {
    id: 'non-fiction',
    title: "Non-Fiction",
    createdAt: "September 1, 2023 10:10 PM",
    items: [
      { id: "1", name: "The Years of Lyndon Johnson(series)" },
      { id: "2", name: "Replacing Guilt" },
      { id: "3", name: "Strangers Drowning" },
      { id: "4", name: "The Myth of Sisyphus" },
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
      { id: "13", name: "Under Pressure - Queen & David Bowie", url: "https://www.youtube.com/watch?v=a01QQZyl-_I" },
      { id: "14", name: "Am I Dreaming - Metro Boomin", url: "https://www.youtube.com/watch?v=7aUZtDaxS60" },
      { id: "15", name: "Rolling in the Deep - Adele", url: "https://www.youtube.com/watch?v=rYEDA3JcQqw" },
      { id: "16", name: "Fast Car - Tracy Chapman", url: "https://www.youtube.com/watch?v=yvGfVdx-gNo" },
      { id: "17", name: "Paul Revere- Noah Kahan", url: "https://www.youtube.com/watch?v=4NJ-q6myFFI" },
      {id: "18", name: "What Could Have Been - Sting", url:"https://www.youtube.com/watch?v=liPu1_aPH5k"},
      {id: "19", name: "Forget Her - Jeff Buckley", url: "https://www.youtube.com/watch?v=K4J6xYIyC3Q"},
      {id: "20", name: "Seventeen - Heathers", url: "https://www.youtube.com/watch?v=9h80Sr15n4M"},
      {id: "21", name: "Vertigo - Time for Three", url: "https://www.youtube.com/watch?v=oIxNzElm1K4"},
      
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
      { id: "7", name: "Ted Lasso" },
      {id: "8", name: "Pantheon" }
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
      { id: "3", name: "The Broccoli Tree: A Parable", url: "https://youtu.be/ESyJop31cmY?si=dVQvONjm4rlarbvQ" },
      {id: "4", name:"William Belden Noble Lecture Series: John Green", url:"https://youtube.com/live/EQ3DakqVrvo?feature=share"},
      {id: "5", name: "THE IMPOSSIBLE HAS HAPPENED", url: "https://www.youtube.com/watch?v=OVFsq9FQBlc"}
    ]
  },
  {
    id: 'articles',
    title: "Articles",
    createdAt: "February 20, 2024 10:11 PM",
    items: [
      { id: "1", name: "Looking for Alice -henrik karlsson", url: "https://www.henrikkarlsson.xyz/p/looking-for-alice"},
      { id: "2", name: "The Haves and the Have Yachts", url: "https://www.newyorker.com/magazine/2022/07/25/the-haves-and-the-have-yachts" },
      { id: "3", name: "Notes on Nigeria- Matt Lakeman ", url: "https://mattlakeman.org/2023/05/09/notes-on-nigeria/" },
      { id: "4", name: "The Copenhagen Interpretation of Ethics", url: "https://forum.effectivealtruism.org/posts/QXpxioWSQcNuNnNTy/the-copenhagen-interpretation-of-ethics" },
      { id: "5", name: "Does My Son Know You?", url: "https://www.theringer.com/2022/3/3/22956353/fatherhood-cancer-jonathan-tjarks" },
      {id: "6", name: "…And I Show You How Deep The Rabbit Hole Goes", url: "https://slatestarcodex.com/2015/06/02/and-i-show-you-how-deep-the-rabbit-hole-goes/" }
    ]
  },
  {
    id: 'poems',
    title: "Poems",
    createdAt: "April 13, 2024 5:24 PM",
    items: [
      { id: "1", name: "Mountain Dew Commercial Disguised as a Love Poem", url: "https://onbeing.org/poetry/mountain-dew-commercial-disguised-as-a-love-poem/" },
      { id: "2", name: "Those Dying Then", url: "https://hellopoetry.com/poem/3762/thosedying-then/" },
      { id: "3", name: "Do Not Go Gentle Into That Good Night", url: "https://www.poetryfoundation.org/poems/46569/do-not-go-gentle-into-that-good-night" },
      { id: "4", name: "Best Witchcraft is Geometry - Emily Dickinson", url: "https://hellopoetry.com/poem/2433/best-witchcraft-is-geometry/" },
      { id: "5", name: "I took my Power in my Hand - Emily Dickinson", url: "https://hellopoetry.com/poem/2973/i-took-my-power-in-my-hand/" },
      { id: "6", name: "Silence is all we dread - Emily Dickinson", url: "https://hellopoetry.com/poem/3531/silence-is-all-we-dread/" },
      { id: "7", name: "Paradise is that old mansion - Emily Dickinson", url: "https://hellopoetry.com/poem/3407/paradise-is-that-old-mansion/" }
    ]
  },
  {
    id: 'paintings',
    title: "Paintings",
    createdAt: "December 8, 2024 12:26 AM",
    items: [
      { id: "1", name: "North Cape By Moonlight", url: "https://www.metmuseum.org/art/collection/search/441379" },
      { id: "2", name: "Among the Sierra Nevada", url: "https://americanart.si.edu/artwork/among-sierra-nevada-california-2059" }
    ]
  },
  {
    id: 'random',
    title: "Just random shit",
    createdAt: "February 21, 2025 9:42 PM",
    items: [
      {id: "1", name: "weather"},
      {id: "2", name: "getting lost"},
      {id: "3", name: "Mosh Pits"},
      {id: "4", name: "Weird conversation starters"}
    ]
  }
];