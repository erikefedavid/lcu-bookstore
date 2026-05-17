import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category_id: mongoose.Types.ObjectId | string;
  category_name: string;
  description?: string;
  cover_image?: string;
  availability: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  category_name: { type: String, required: true },
  description: { type: String },
  cover_image: { type: String },
  availability: { type: Boolean, default: true, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default models.Book || model<IBook>('Book', BookSchema);
