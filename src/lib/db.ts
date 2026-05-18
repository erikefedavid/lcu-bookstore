import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Book from '@/models/Book';
import Category from '@/models/Category';

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

      cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
        console.log('MongoDB Atlas cloud database connected successfully via Mongoose.');
        
        // Auto-seed empty cloud database with premium LCU academic data
        try {
          const categoryCount = await Category.countDocuments();
          if (categoryCount === 0) {
            console.log('Fresh MongoDB instance detected. Seeding LCU bookstore assets...');
            
            // 1. Seed categories
            const seededCategories = [];
            for (const cat of INITIAL_CATEGORIES) {
              const newCat = await Category.create({
                name: cat.name
              });
              seededCategories.push(newCat);
            }
            
            // 2. Seed books mapping to the newly created Category ObjectIds
            for (const book of INITIAL_BOOKS) {
              const matchedCat = seededCategories.find(c => c.name === book.category_name);
              if (matchedCat) {
                await Book.create({
                  title: book.title,
                  author: book.author,
                  category_id: matchedCat._id,
                  category_name: matchedCat.name,
                  description: book.description,
                  cover_image: book.cover_image,
                  availability: book.availability
                });
              }
            }
            console.log('Auto-seeding of LCU database completed successfully!');
          }
        } catch (seedError) {
          console.error('Error during auto-seeding LCU cloud database:', seedError);
        }

        return mongooseInstance;
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
  // --- SOFTWARE ENGINEERING ---
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
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems in academic engineering and scalable cloud architectures.'
  },
  {
    _id: 'm3',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'Andrew Hunt',
    category_id: 'c1',
    category_name: 'Software Engineering',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--what do you do to make software that is robust, clean, and institutionally maintainable.'
  },

  // --- COMPUTER SCIENCE ---
  {
    _id: 'm4',
    title: 'Introduction to Algorithms (Fourth Edition)',
    author: 'Thomas H. Cormen',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600',
    description: 'This book provides a comprehensive and rigorous introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of university scholars.'
  },
  {
    _id: 'm5',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    description: 'The long-anticipated revision of this industry-standard text offers the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence and machine learning in modern academic institutions.'
  },
  {
    _id: 'm6',
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James F. Kurose',
    category_id: 'c2',
    category_name: 'Computer Science',
    availability: false,
    cover_image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    description: 'Building on the successful top-down approach of previous editions, this textbook focuses on internet protocols and software-defined networks, presenting complex networking concepts in an accessible, logical manner.'
  },

  // --- LAW & JURISPRUDENCE ---
  {
    _id: 'm7',
    title: 'The Nigerian Legal System (Second Edition)',
    author: 'Obilade A. O.',
    category_id: 'c3',
    category_name: 'Law & Jurisprudence',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    description: 'An essential textbook providing a comprehensive analysis of the historical background, sources of law, judicial system structure, and administration of justice within the Nigerian legal framework.'
  },
  {
    _id: 'm8',
    title: 'Constitutional Law of Nigeria',
    author: 'Professor B. O. Nwabueze',
    category_id: 'c3',
    category_name: 'Law & Jurisprudence',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1589391886645-1514df239327?auto=format&fit=crop&q=80&w=600',
    description: 'A masterpiece study on the constitutional structure, human rights provisions, separation of powers, and regulatory frameworks governing federalism in the Federal Republic of Nigeria.'
  },

  // --- ACCOUNTING & FINANCE ---
  {
    _id: 'm9',
    title: 'Financial Accounting & Reporting Standards',
    author: 'Jerry J. Weygandt',
    category_id: 'c4',
    category_name: 'Accounting & Finance',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    description: 'This textbook guides university scholars through foundational financial accounting principles, ledger structures, balancing techniques, and international financial reporting standards (IFRS) compliance.'
  },
  {
    _id: 'm10',
    title: 'Principles of Auditing and Assurance Services',
    author: 'William F. Messier',
    category_id: 'c4',
    category_name: 'Accounting & Finance',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    description: 'A comprehensive study of auditor responsibilities, corporate control checking protocols, fraud detection, and regulatory audits under modern global financial regulations.'
  },

  // --- MASS COMMUNICATION ---
  {
    _id: 'm11',
    title: 'Introduction to Mass Communication: Media Literacy',
    author: 'Stanley J. Baran',
    category_id: 'c5',
    category_name: 'Mass Communication',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=600',
    description: 'Encouraging university scholars to keep their media literacy sharp, this textbook explores the historical evolution and modern digital formats of journalism, advertising, and global media networks.'
  },
  {
    _id: 'm12',
    title: 'Broadcast Journalism: Techniques of Radio and TV News',
    author: 'Peter Stewart & Ray Alexander',
    category_id: 'c5',
    category_name: 'Mass Communication',
    availability: true,
    cover_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600',
    description: 'An industry-grade practical guide to modern broadcast news editing, scriptwriting, voice presentation, interview methods, and digital editing tools used in university newsrooms.'
  }
];

const INITIAL_CATEGORIES = [
  { _id: 'c1', name: 'Software Engineering' },
  { _id: 'c2', name: 'Computer Science' },
  { _id: 'c3', name: 'Law & Jurisprudence' },
  { _id: 'c4', name: 'Accounting & Finance' },
  { _id: 'c5', name: 'Mass Communication' }
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
    
    // Check if the mock books are using old amazon image URLs, or if we want to enforce the expanded 12-book catalog
    if (parsed.books && parsed.books.length < 12) {
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
