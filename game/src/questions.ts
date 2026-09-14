export interface Question {
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
}

export interface Zone {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  icon?: string;
  badge: string;
  questions: readonly Question[];
}

const q = (prompt: string, options: string[], answer: number, explanation: string): Question =>
  ({ prompt, options, answer, explanation });

export const zones: readonly Zone[] = [
  {
    id: 'knowledge', name: 'General Knowledge', subtitle: 'A little curiosity goes a long way.',
    image: 'islands/island-knowledge.png', icon: 'props/book.png', badge: 'Curious Explorer',
    questions: [
      q('Which city is the capital of India?', ['Mumbai', 'New Delhi', 'Jaipur', 'Kolkata'], 1, 'New Delhi is the capital of India.'),
      q('How many colours are traditionally named in a rainbow?', ['Five', 'Six', 'Seven', 'Eight'], 2, 'The seven colours are red, orange, yellow, green, blue, indigo, and violet.'),
      q('Which is the largest ocean on Earth?', ['Indian Ocean', 'Atlantic Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3, 'The Pacific is the largest and deepest ocean on Earth.'),
      q('Which animal is known as the ship of the desert?', ['Camel', 'Elephant', 'Horse', 'Giraffe'], 0, 'Camels are well adapted to desert travel and can go a long time without drinking.'),
      q('In which Indian state is Anand located?', ['Rajasthan', 'Gujarat', 'Maharashtra', 'Punjab'], 1, 'Anand is in Gujarat. It is also home to Charotar Education Society.'),
      q('How many sides does a hexagon have?', ['Five', 'Eight', 'Six', 'Seven'], 2, 'A hexagon is a polygon with six sides.'),
    ],
  },
  {
    id: 'science', name: 'Science Zone', subtitle: 'Big discoveries start with small questions.',
    image: 'islands/island-science.png', icon: 'props/microscope.png', badge: 'Science Adventurer',
    questions: [
      q('Which gas do plants absorb during photosynthesis?', ['Oxygen', 'Carbon dioxide', 'Helium', 'Hydrogen'], 1, 'Plants use carbon dioxide, water, and sunlight to make their food.'),
      q('Which planet is known as the Red Planet?', ['Venus', 'Jupiter', 'Mars', 'Mercury'], 2, 'Iron minerals on the surface of Mars give it a reddish colour.'),
      q('What force keeps us on the ground?', ['Magnetism', 'Friction', 'Electricity', 'Gravity'], 3, 'Gravity pulls objects toward Earth.'),
      q('Which part of a plant usually takes in water from the soil?', ['Flower', 'Leaf', 'Roots', 'Fruit'], 2, 'Roots absorb water and minerals from the soil.'),
      q('What is water called in its solid form?', ['Steam', 'Ice', 'Mist', 'Rain'], 1, 'When liquid water freezes, it becomes solid ice.'),
      q('Which organ pumps blood around your body?', ['Heart', 'Lungs', 'Brain', 'Stomach'], 0, 'Your heart is a muscle that pumps blood through your blood vessels.'),
    ],
  },
  {
    id: 'world', name: 'Global News', subtitle: 'Know your world. Think like a global citizen.',
    image: 'islands/island-world.png', icon: 'props/globe.png', badge: 'World Citizen',
    questions: [
      q('What should you do before sharing a surprising news story?', ['Share immediately', 'Check reliable sources', 'Read only the headline', 'Count the likes'], 1, 'Check the source, date, and other reliable reports before sharing a story.'),
      q('Which organisation is commonly abbreviated as UN?', ['United Nations', 'Universal Nature', 'Union Network', 'United Neighbours'], 0, 'The United Nations brings countries together to cooperate on global issues.'),
      q('Which continent is home to Kenya?', ['Europe', 'Asia', 'Africa', 'South America'], 2, 'Kenya is a country in East Africa.'),
      q('What does a weather forecast describe?', ['Ancient history', 'Expected weather', 'Sports results', 'Population totals'], 1, 'A weather forecast predicts weather conditions for a place and time.'),
      q('Which is an example of an opinion?', ['A week has seven days', 'Earth orbits the Sun', 'This is the best game', 'A triangle has three sides'], 2, 'Calling something the best expresses a personal judgement, rather than a verifiable fact.'),
      q('What does a newspaper correction do?', ['Adds a puzzle', 'Fixes an error in a report', 'Predicts the future', 'Changes the weather'], 1, 'A correction tells readers when published information was wrong and provides the accurate information.'),
    ],
  },
  {
    id: 'brain', name: 'Brain Zone', subtitle: 'Give your problem-solving powers a workout.',
    image: 'islands/island-brain.png', badge: 'Puzzle Pathfinder',
    questions: [
      q('What comes next: 2, 4, 8, 16, …?', ['18', '24', '30', '32'], 3, 'Each number is doubled, so 16 × 2 = 32.'),
      q('Which one does not belong?', ['Square', 'Triangle', 'Circle', 'Banana'], 3, 'A banana is a fruit; the other three are geometric shapes.'),
      q('If today is Tuesday, what day is it the day after tomorrow?', ['Wednesday', 'Thursday', 'Friday', 'Sunday'], 1, 'Tomorrow is Wednesday, so the day after tomorrow is Thursday.'),
      q('A basket has 3 red and 2 blue balls. How many balls are there?', ['One', 'Five', 'Six', 'Three'], 1, 'Add the two groups: 3 + 2 = 5.'),
      q('What comes next: A, C, E, G, …?', ['H', 'J', 'I', 'K'], 2, 'The sequence skips one letter each time. After G, skip H to reach I.'),
      q('All roses are flowers. Which statement must be true?', ['All flowers are roses', 'A rose is a flower', 'No roses are flowers', 'All flowers are red'], 1, 'Every rose belongs to the group of flowers, but not every flower is a rose.'),
    ],
  },
  {
    id: 'challenges', name: 'Challenges', subtitle: 'Brave the volcano and conquer a number challenge.',
    image: 'islands/island-maths.png', badge: 'Number Ninja',
    questions: [
      q('What is 7 × 8?', ['48', '54', '56', '64'], 2, 'Seven groups of eight make 56.'),
      q('What is half of 50?', ['20', '25', '30', '15'], 1, '50 divided into two equal parts gives 25 in each part.'),
      q('What is the perimeter of a square with sides of 4 cm?', ['8 cm', '12 cm', '16 cm', '20 cm'], 2, 'Add all four sides: 4 + 4 + 4 + 4 = 16 cm.'),
      q('Which fraction is equal to one half?', ['2/4', '1/3', '3/4', '2/3'], 0, 'Two out of four equal parts is the same amount as one out of two.'),
      q('You have ₹100 and spend ₹35. How much is left?', ['₹55', '₹75', '₹65', '₹60'], 2, 'Subtract the amount spent: 100 − 35 = 65.'),
      q('How many minutes are in two hours?', ['60', '90', '100', '120'], 3, 'Each hour has 60 minutes, so two hours have 120 minutes.'),
    ],
  },
  {
    id: 'discovery', name: 'Discovery Zone', subtitle: 'Explore the wonders of the natural world.',
    image: 'islands/island-discovery.png', badge: 'Nature Navigator',
    questions: [
      q('What does a caterpillar become after its pupa stage?', ['A frog', 'A butterfly or moth', 'A beetle', 'A spider'], 1, 'Caterpillars are the larval stage of butterflies and moths.'),
      q('Which resource is renewable?', ['Coal', 'Oil', 'Sunlight', 'Natural gas'], 2, 'Sunlight is naturally replenished, unlike fossil fuels.'),
      q('Which animal is a mammal?', ['Shark', 'Dolphin', 'Crocodile', 'Octopus'], 1, 'Dolphins breathe air and feed their young milk, which makes them mammals.'),
      q('What tool helps you see distant stars and planets?', ['Microscope', 'Thermometer', 'Telescope', 'Compass'], 2, 'Telescopes collect light to help us observe distant objects in space.'),
      q('What is the process of liquid water becoming water vapour?', ['Freezing', 'Condensation', 'Evaporation', 'Melting'], 2, 'Evaporation changes liquid water into water vapour.'),
      q('Which habit helps save water?', ['Leaving taps running', 'Fixing a dripping tap', 'Taking longer showers', 'Washing one item at a time'], 1, 'Fixing leaks prevents water from being wasted every day.'),
    ],
  },
  {
    id: 'tech', name: 'Tech Zone', subtitle: 'Unlock the ideas behind the digital world.',
    image: 'islands/island-tech.png', icon: 'props/computer.png', badge: 'Digital Trailblazer',
    questions: [
      q('Which password is the strongest example?', ['123456', 'password', 'yourname', 'River!Cloud7!Mango'], 3, 'Long, unique passwords are harder to guess. Never use a public example as your actual password.'),
      q('What is an algorithm?', ['A computer screen', 'A set of steps to solve a problem', 'An internet cable', 'A type of battery'], 1, 'An algorithm is a clear sequence of instructions for completing a task.'),
      q('Which device is mainly used to type text?', ['Monitor', 'Speaker', 'Keyboard', 'Printer'], 2, 'A keyboard is an input device for typing letters, numbers, and commands.'),
      q('What should you do if a stranger online asks for your address?', ['Send it', 'Post it publicly', 'Tell a trusted adult', 'Ask for a reward'], 2, 'Keep personal details private and ask a trusted adult for help.'),
      q('What does saving a file do?', ['Stores your work', 'Deletes your work', 'Turns off the screen', 'Prints a page'], 0, 'Saving stores your work so you can open and use it later.'),
      q('Which numbers are used in the binary number system?', ['1 and 2', '0 and 1', '2 and 3', '0 and 9'], 1, 'Binary uses two digits, 0 and 1, to represent information.'),
    ],
  },
];
