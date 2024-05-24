import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    contact_person: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
  },
  { timestamps: true }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;
