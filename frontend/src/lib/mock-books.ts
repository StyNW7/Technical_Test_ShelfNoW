// Mock book data matching the schema
export type Book = {
  id: string
  title: string
  author: string
  description: string
  isbn?: string
  price: number
  stock: number
  imageUrl?: string
  category: string
  publisher?: string
  publishedAt?: Date
  language: string
  pages?: number
  isActive: boolean
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "A dazzling novel about all the choices that go into a life lived. Nora Seed finds herself in the Midnight Library, where she can explore the different lives she might have lived.",
    isbn: "978-0525559474",
    price: 28.99,
    stock: 15,
    imageUrl: "/the-midnight-library-book-cover.jpg",
    category: "Fiction",
    publisher: "Viking",
    language: "English",
    pages: 304,
    isActive: true,
    publishedAt: new Date("2020-08-13"),
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "Transform your life with tiny changes. An easy and proven way to build good habits, break bad ones, and master tiny behaviors that lead to remarkable results.",
    isbn: "978-0735211292",
    price: 32.5,
    stock: 22,
    imageUrl: "/atomic-habits-book-cover.jpg",
    category: "Self-Help",
    publisher: "Avery",
    language: "English",
    pages: 320,
    isActive: true,
    publishedAt: new Date("2018-10-16"),
  },
  {
    id: "3",
    title: "Piranesi",
    author: "Susanna Clarke",
    description:
      "A captivating mystery about a man with no memory living in a mysterious house of halls and stairs. Winner of the Hugo Award for Best Novel.",
    isbn: "978-0063031325",
    price: 27.99,
    stock: 8,
    imageUrl: "/piranesi-book-cover.jpg",
    category: "Fiction",
    publisher: "Bloomsbury",
    language: "English",
    pages: 272,
    isActive: true,
    publishedAt: new Date("2020-09-15"),
  },
  {
    id: "4",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Master your money with psychology. Nineteen short stories exploring the strange ways people think about money and make financial decisions.",
    isbn: "978-0857197689",
    price: 30.0,
    stock: 18,
    imageUrl: "/psychology-of-money-book.jpg",
    category: "Finance",
    publisher: "Harriman House",
    language: "English",
    pages: 400,
    isActive: true,
    publishedAt: new Date("2020-09-17"),
  },
  {
    id: "5",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description:
      "Aging Hollywood icon Evelyn Hugo finally tells her story. A captivating tale of ambition, love, and reinvention in Golden Age Hollywood.",
    isbn: "978-1492228142",
    price: 29.99,
    stock: 25,
    imageUrl: "/seven-husbands-evelyn-hugo.jpg",
    category: "Fiction",
    publisher: "Atria Books",
    language: "English",
    pages: 400,
    isActive: true,
    publishedAt: new Date("2017-06-13"),
  },
  {
    id: "6",
    title: "Educated",
    author: "Tara Westover",
    description:
      "A memoir about a young woman who leaves her survivalist family to pursue education. A powerful story of transformation and self-discovery.",
    isbn: "978-0399590504",
    price: 31.99,
    stock: 12,
    imageUrl: "/educated-memoir-book.jpg",
    category: "Biography",
    publisher: "Scribner",
    language: "English",
    pages: 352,
    isActive: true,
    publishedAt: new Date("2018-02-20"),
  },
  {
    id: "7",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description:
      "A novel about an Artificial Friend named Klara, and her deep desire to understand human relationships and to see the sun.",
    isbn: "978-0571334666",
    price: 26.99,
    stock: 5,
    imageUrl: "/klara-and-the-sun-book.jpg",
    category: "Science Fiction",
    publisher: "Faber and Faber",
    language: "English",
    pages: 320,
    isActive: true,
    publishedAt: new Date("2021-03-02"),
  },
  {
    id: "8",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    description:
      "A stunning novel about a girl who makes a deal with darkness and spends 300 years leaving her mark on the world before meeting someone who remembers her.",
    isbn: "978-0765387561",
    price: 28.99,
    stock: 20,
    imageUrl: "/invisible-life-addie-larue.jpg",
    category: "Fantasy",
    publisher: "Tor",
    language: "English",
    pages: 448,
    isActive: true,
    publishedAt: new Date("2020-10-06"),
  },
  {
    id: "9",
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    description:
      "A collection of essays exploring botanical wisdom and the gift economy. A beautiful meditation on how plants and nature offer us guidance.",
    isbn: "978-1553592525",
    price: 29.95,
    stock: 14,
    imageUrl: "/braiding-sweetgrass-book.jpg",
    category: "Nature",
    publisher: "Milkweed Editions",
    language: "English",
    pages: 386,
    isActive: true,
    publishedAt: new Date("2013-09-03"),
  },
  {
    id: "10",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description:
      "A lone astronaut must save Earth from extinction. An thrilling sci-fi adventure about problem-solving, friendship, and humanity.",
    isbn: "978-0593135204",
    price: 30.99,
    stock: 17,
    imageUrl: "/project-hail-mary-book.jpg",
    category: "Science Fiction",
    publisher: "Ballantine Books",
    language: "English",
    pages: 476,
    isActive: true,
    publishedAt: new Date("2021-05-04"),
  },
  {
    id: "11",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    description:
      "A dragon rider academy fantasy with romance, action, and plot twists. A young woman discovers her place in a war-torn world.",
    isbn: "978-1649374417",
    price: 30.0,
    stock: 9,
    imageUrl: "/fourth-wing-book.jpg",
    category: "Fantasy",
    publisher: "Entangled Publishing",
    language: "English",
    pages: 640,
    isActive: true,
    publishedAt: new Date("2023-01-31"),
  },
  {
    id: "12",
    title: "The Housemaid",
    author: "Fred Mwamwenda",
    description:
      "A psychological thriller about a housekeeper who begins to suspect something sinister in the elegant home where she works.",
    isbn: "978-0062934123",
    price: 27.99,
    stock: 11,
    imageUrl: "/housemaid-thriller-book.jpg",
    category: "Thriller",
    publisher: "Berkley",
    language: "English",
    pages: 320,
    isActive: true,
    publishedAt: new Date("2022-02-01"),
  },
]

export const categories = [
  "All",
  "Fiction",
  "Self-Help",
  "Finance",
  "Biography",
  "Science Fiction",
  "Fantasy",
  "Thriller",
  "Nature",
]
