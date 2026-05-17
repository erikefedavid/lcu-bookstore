import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cached connection for serverless environment
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (MONGODB_URI) {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB Atlas cloud database connected successfully via Mongoose.');
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } else {
    // Return null to signify mock mode is active
    return null;
  }
}

// Robust File-based Mock Database for server-side fallback
const MOCK_DB_PATH = path.join(process.cwd(), 'src', 'lib', 'mockdb.json');

const INITIAL_BOOKS = [
  {
    _id: 'm1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. This volume delivers the principles, patterns, and practices of writing clean, high-performance academic and professional code.'
  },
  {
    _id: 'm2',
    title: 'Introduction to Algorithms (Fourth Edition)',
    author: 'Thomas H. Cormen',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600',
    description: 'This book provides a comprehensive and rigorous introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of university scholars.'
  },
  {
    _id: 'm3',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: false,
    cover_image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems in academic engineering and scalable cloud architectures.'
  },
  {
    _id: 'm4',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'Andrew Hunt',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--what do you do to make software that is robust, clean, and institutionally maintainable.'
  },
  {
    _id: 'm5',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    category_id: 'c3',
    category_name: 'Mathematics',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    description: 'A classic university textbook focused on mathematical logic, set theory, combinatorics, graph theory, and computational structures designed for advanced undergraduate study.'
  },
  {
    _id: 'm6',
    title: 'Applied Cryptography & Network Security',
    author: 'Bruce Schneier',
    category_id: 'c4',
    category_name: 'Cybersecurity',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    description: 'This textbook provides programmers and security professionals with a comprehensive, practical guide to the modern cryptographic protocols, algorithms, and security practices utilized globally.'
  }
];

const INITIAL_CATEGORIES = [
  { _id: 'c1', name: 'Software Engineering' },
  { _id: 'c2', name: 'Computer Science' },
  { _id: 'c3', name: 'Mathematics' },
  { _id: 'c4', name: 'Cybersecurity' }
];

export function getMockDB() {
  // Ensure the directory exists
  const dir = path.dirname(MOCK_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // If the file does not exist, or if we want to enforce high-quality seeds
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const defaultDB = { books: INITIAL_BOOKS, categories: INITIAL_CATEGORIES };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf-8');
    return defaultDB;
  }

  try {
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Check if the mock books are using old amazon image URLs, and update them to premium Unsplash URLs
    if (parsed.books && parsed.books.length > 0 && parsed.books[0].cover_image.includes('amazon')) {
      parsed.books = INITIAL_BOOKS;
      parsed.categories = INITIAL_CATEGORIES;
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading mock DB file:', error);
    return { books: INITIAL_BOOKS, categories: INITIAL_CATEGORIES };
  }
}

export function saveMockDB(data: any) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to mock DB file:', error);
  }
}
