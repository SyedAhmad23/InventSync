import { Schema, model, models } from "mongoose";

const CustomerSchema = new Schema(
  {
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
  },
  { timestamps: true }
);

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
