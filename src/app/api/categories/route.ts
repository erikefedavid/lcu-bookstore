import { NextRequest, NextResponse } from 'next/server';
import { connectDB, getMockDB, saveMockDB } from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
  try {
    const isCloud = await connectDB();

    if (isCloud) {
      const categories = await Category.find().sort({ name: 1 });
      return NextResponse.json({ success: true, documents: categories });
    } else {
      const db = getMockDB();
      return NextResponse.json({ success: true, documents: db.categories });
    }
  } catch (error: any) {
    console.error('API GET Categories error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isCloud = await connectDB();

    if (isCloud) {
      const newCategory = new Category({
        name: body.name,
        created_at: new Date()
      });
      await newCategory.save();
      return NextResponse.json({ success: true, document: newCategory });
    } else {
      const db = getMockDB();
      const newCategory = {
        _id: 'c_' + Date.now(),
        name: body.name
      };
      db.categories.push(newCategory);
      saveMockDB(db);
      return NextResponse.json({ success: true, document: newCategory });
    }
  } catch (error: any) {
    console.error('API POST Category error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
