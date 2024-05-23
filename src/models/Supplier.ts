import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;
