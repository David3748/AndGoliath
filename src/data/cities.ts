// Personal reviews and scores preserved from the original Cities page.
export interface City {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  region: 'us' | 'europe';
  nearHome: boolean;
  review: string;
  rating: number;
}

export const cities: City[] = [
  {
    "id": "ellicott-city",
    "name": "Ellicott City",
    "location": "Maryland, USA",
    "latitude": 39.2673,
    "longitude": -76.7983,
    "region": "us",
    "nearHome": true,
    "review": "Does it feel like the default because it's my home or because it's such a typical suburb?",
    "rating": 1.5
  },
  {
    "id": "college-park",
    "name": "College Park",
    "location": "Maryland, USA",
    "latitude": 38.9897,
    "longitude": -76.9378,
    "region": "us",
    "nearHome": true,
    "review": "Most things you'd want in a college town and many you wouldn't. Stunningly unexceptional in many ways.",
    "rating": 2.0
  },
  {
    "id": "washington-dc",
    "name": "Washington DC",
    "location": "District of Columbia, USA",
    "latitude": 38.9072,
    "longitude": -77.0369,
    "region": "us",
    "nearHome": true,
    "review": "Good metro, great museums and politics. So much politics.",
    "rating": 3.0
  },
  {
    "id": "baltimore",
    "name": "Baltimore",
    "location": "Maryland, USA",
    "latitude": 39.2904,
    "longitude": -76.6122,
    "region": "us",
    "nearHome": true,
    "review": "An underrated city purely because it's rated so badly.",
    "rating": 2.0
  },
  {
    "id": "nyc",
    "name": "NYC",
    "location": "New York, USA",
    "latitude": 40.7128,
    "longitude": -74.006,
    "region": "us",
    "nearHome": false,
    "review": "Great and terrible. A city of extremes. The only thing I love more than New York City is the idea of New York City.",
    "rating": 5.0
  },
  {
    "id": "boston",
    "name": "Boston",
    "location": "Massachusetts, USA",
    "latitude": 42.3601,
    "longitude": -71.0589,
    "region": "us",
    "nearHome": false,
    "review": "In some ways the most European of American cities.",
    "rating": 3.5
  },
  {
    "id": "sf",
    "name": "SF",
    "location": "California, USA",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "region": "us",
    "nearHome": false,
    "review": "We discovered heaven on earth and we put Silicon Valley there. It feels ironic that the part of the country that encompasses the greatest nature in the smallest area has the people least dedicated to the natural.",
    "rating": 3.5
  },
  {
    "id": "chicago",
    "name": "Chicago",
    "location": "Illinois, USA",
    "latitude": 41.8781,
    "longitude": -87.6298,
    "region": "us",
    "nearHome": false,
    "review": "Excellent in the summer. Bike by the lake if you can. I have not heard good things about the winter.",
    "rating": 3.6
  },
  {
    "id": "copenhagen",
    "name": "Copenhagen",
    "location": "Denmark",
    "latitude": 55.6761,
    "longitude": 12.5683,
    "region": "europe",
    "nearHome": false,
    "review": "An almost perfectly designed city. The best cafes I've ever been to. Ruinously expensive. Makes you appreciate the Sun.",
    "rating": 4.0
  },
  {
    "id": "bergen",
    "name": "Bergen",
    "location": "Norway",
    "latitude": 60.3913,
    "longitude": 5.3221,
    "region": "europe",
    "nearHome": false,
    "review": "Miraculously its own weather event. Sadly that weather is fog. Fjords are incredible.",
    "rating": 3.0
  },
  {
    "id": "budapest",
    "name": "Budapest",
    "location": "Hungary",
    "latitude": 47.4979,
    "longitude": 19.0402,
    "region": "europe",
    "nearHome": false,
    "review": "Extremely touristy, does it fine. Prague is better in most important ways at many of the same things.",
    "rating": 2.5
  },
  {
    "id": "vienna",
    "name": "Vienna",
    "location": "Austria",
    "latitude": 48.2082,
    "longitude": 16.3738,
    "region": "europe",
    "nearHome": false,
    "review": "I had Paris syndrome here. Good city, not great. Overly touristy music.",
    "rating": 3.0
  },
  {
    "id": "prague",
    "name": "Prague",
    "location": "Czechia",
    "latitude": 50.0755,
    "longitude": 14.4378,
    "region": "europe",
    "nearHome": false,
    "review": "My favorite city in central Europe. It's how I imagine a European city should be.",
    "rating": 4.0
  },
  {
    "id": "madrid",
    "name": "Madrid",
    "location": "Spain",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "region": "europe",
    "nearHome": false,
    "review": "One of the world's greatest places to do nothing. This is a compliment.",
    "rating": 4.0
  },
  {
    "id": "london",
    "name": "London",
    "location": "United Kingdom",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "region": "europe",
    "nearHome": false,
    "review": "There's so much going on. I love it so much. Easily the European city I could see myself in long-term.",
    "rating": 4.5
  },
  {
    "id": "florence",
    "name": "Florence",
    "location": "Italy",
    "latitude": 43.7696,
    "longitude": 11.2558,
    "region": "europe",
    "nearHome": false,
    "review": "It's a tourist trap and I don't even care, the trap was so good.",
    "rating": 4.0
  },
  {
    "id": "rome",
    "name": "Rome",
    "location": "Italy",
    "latitude": 41.9028,
    "longitude": 12.4964,
    "region": "europe",
    "nearHome": false,
    "review": "A series of monuments that used to mean something and now mean a fall from grace. Bonus: the Vatican is quite bad at running a museum.",
    "rating": 1.5
  },
  {
    "id": "milan",
    "name": "Milan",
    "location": "Italy",
    "latitude": 45.4642,
    "longitude": 9.19,
    "region": "europe",
    "nearHome": false,
    "review": "Pretty good city. If you can go on the roof of the cathedral, do so.",
    "rating": 3.0
  },
  {
    "id": "orvieto",
    "name": "Orvieto",
    "location": "Italy",
    "latitude": 42.7185,
    "longitude": 12.1107,
    "region": "europe",
    "nearHome": false,
    "review": "Perfect little Italian town.",
    "rating": 3.2
  }
];
