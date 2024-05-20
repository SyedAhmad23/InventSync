import mongoose from "mongoose";

interface Product {
  name: string;
  category: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
}

const productSchema = new mongoose.Schema<Product>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Product =
  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);

export default Product;
