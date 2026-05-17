import { NextRequest, NextResponse } from 'next/server';
import { connectDB, getMockDB, saveMockDB } from '@/lib/db';
import Book from '@/models/Book';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const isCloud = await connectDB();

    if (isCloud) {
      const book = await Book.findById(id);
      if (!book) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: book });
    } else {
      const db = getMockDB();
      const book = db.books.find((b: any) => b._id === id);
      if (!book) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: book });
    }
  } catch (error: any) {
    console.error('API GET Book By ID error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const isCloud = await connectDB();

    if (isCloud) {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { ...body, updated_at: new Date() },
        { new: true }
      );
      if (!updatedBook) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: updatedBook });
    } else {
      const db = getMockDB();
      const index = db.books.findIndex((b: any) => b._id === id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      db.books[index] = { ...db.books[index], ...body };
      saveMockDB(db);
      return NextResponse.json({ success: true, document: db.books[index] });
    }
  } catch (error: any) {
    console.error('API PUT Book error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const isCloud = await connectDB();

    if (isCloud) {
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: deletedBook });
    } else {
      const db = getMockDB();
      const initialLength = db.books.length;
      db.books = db.books.filter((b: any) => b._id !== id);
      if (db.books.length === initialLength) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
      }
      saveMockDB(db);
      return NextResponse.json({ success: true, message: 'Deleted successfully' });
    }
  } catch (error: any) {
    console.error('API DELETE Book error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
