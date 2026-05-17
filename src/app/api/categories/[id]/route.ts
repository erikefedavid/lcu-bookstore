import { NextRequest, NextResponse } from 'next/server';
import { connectDB, getMockDB, saveMockDB } from '@/lib/db';
import Category from '@/models/Category';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const isCloud = await connectDB();

    if (isCloud) {
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, document: deletedCategory });
    } else {
      const db = getMockDB();
      const initialLength = db.categories.length;
      db.categories = db.categories.filter((c: any) => c._id !== id);
      if (db.categories.length === initialLength) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
      }
      saveMockDB(db);
      return NextResponse.json({ success: true, message: 'Deleted successfully' });
    }
  } catch (error: any) {
    console.error('API DELETE Category error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
