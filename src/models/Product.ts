import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    unitCode: { type: String, required: true },
    buyingPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    sku: { type: String, required: true },
    suppliers: [{ type: Schema.Types.ObjectId, ref: "Supplier" }],
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
