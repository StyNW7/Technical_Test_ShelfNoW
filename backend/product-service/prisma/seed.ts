import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding product data...');

  const products = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A classic novel of the Jazz Age",
      isbn: "9780743273565",
      price: 12.99,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      category: "Fiction",
      publisher: "Scribner",
      publishedAt: new Date("1925-04-10"),
      language: "English",
      pages: 180,
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A gripping tale of racial injustice and childhood innocence",
      isbn: "9780061120084",
      price: 14.99,
      stock: 35,
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      category: "Fiction",
      publisher: "J.B. Lippincott & Co.",
      publishedAt: new Date("1960-07-11"),
      language: "English",
      pages: 281,
    },
    {
      title: "1984",
      author: "George Orwell",
      description: "A dystopian social science fiction novel",
      isbn: "9780451524935",
      price: 11.99,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
      category: "Science Fiction",
      publisher: "Secker & Warburg",
      publishedAt: new Date("1949-06-08"),
      language: "English",
      pages: 328,
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "A romantic novel of manners",
      isbn: "9780141439518",
      price: 10.99,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      category: "Romance",
      publisher: "T. Egerton",
      publishedAt: new Date("1813-01-28"),
      language: "English",
      pages: 432,
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "A fantasy novel about Bilbo Baggins' adventure",
      isbn: "9780547928227",
      price: 16.99,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
      category: "Fantasy",
      publisher: "George Allen & Unwin",
      publishedAt: new Date("1937-09-21"),
      language: "English",
      pages: 310,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { isbn: product.isbn },
      update: {},
      create: product,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });