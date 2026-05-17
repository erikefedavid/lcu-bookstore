import { NextRequest, NextResponse } from 'next/server';
import { connectDB, getMockDB, saveMockDB } from '@/lib/db';
import Book from '@/models/Book';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';

  try {
    const isCloud = await connectDB();

    if (isCloud) {
      // Live Cloud MongoDB Query
      const filter: any = {};
      
      if (categoryId) {
        filter.category_id = categoryId;
      }
      
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { category_name: { $regex: q, $options: 'i' } }
        ];
      }

      const books = await Book.find(filter).sort({ created_at: -1 });
      return NextResponse.json({ success: true, documents: books });
    } else {
      // Local Server-Side JSON database fallback
      const db = getMockDB();
      let books = db.books;

      if (categoryId) {
        books = books.filter((b: any) => b.category_id === categoryId);
      }

      if (q) {
        const query = q.toLowerCase();
        books = books.filter((b: any) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.category_name.toLowerCase().includes(query)
        );
      }

      return NextResponse.json({ success: true, documents: books });
    }
  } catch (error: any) {
    console.error('API GET Books error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isCloud = await connectDB();

    if (isCloud) {
      // Cloud Mongoose Insert
      const newBook = new Book({
        ...body,
        created_at: new Date(),
        updated_at: new Date()
      });
      await newBook.save();
      return NextResponse.json({ success: true, document: newBook });
    } else {
      // Local Server-Side JSON Insert
      const db = getMockDB();
      const newBook = {
        _id: 'm_' + Date.now(),
        ...body
      };
      db.books.push(newBook);
      saveMockDB(db);
      return NextResponse.json({ success: true, document: newBook });
    }
  } catch (error: any) {
    console.error('API POST Book error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
