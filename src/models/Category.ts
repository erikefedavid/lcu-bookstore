import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  created_at?: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
});

export default models.Category || model<ICategory>('Category', CategorySchema);
