/** Full list of conversation starters (used on /writing and Conversation Starters article). */
export const CONVO_STARTER_SECTIONS: { title: string; prompts: string[] }[] = [
  {
    title: 'Deeper prompts',
    prompts: [
      'If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven’t you told them yet?',
      'What would constitute a “perfect” day for you?',
      'If you could wake up tomorrow having gained any one quality or ability, what would it be?',
      'Tell me one story from your life.',
    ],
  },
  {
    title: 'Quick questions',
    prompts: [
      'What’s the greatest thing I probably don’t know about or appreciate?',
      'What’s the last thing you did for the first time?',
      'Where do you imagine yourself in retirement?',
      'Would you rather be a hug dealer or a slug dealer?',
      'Would you rather be in prison for something you did do or something you didn’t do?',
      'If your whole life had to have background music with only one instrument, what kind of instrument would you pick? The music will vary in volume with activity, so it will never do anything like drown out conversation.',
      'If you could change your birthday to be any day of the year, which would you pick?',
      'What do you spend most of your free time on?',
      'What motivates you?',
      'What’s the most unconventional “career” you at least semi-seriously considered at some point in your life?',
      'What’s something you wish people would be more honest about? You can answer once for people you know and once for society in general.',
      'Motivated more by pride or envy?',
    ],
  },
];

export const ALL_CONVO_STARTERS: string[] = CONVO_STARTER_SECTIONS.flatMap((s) => s.prompts);
