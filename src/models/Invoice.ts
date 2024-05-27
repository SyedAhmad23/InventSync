import { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    date: { type: Date, required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        availableQty: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unitCode: { type: String, required: true },
        rate: { type: Number, required: true },
        discount: { type: Number, required: true, default: 0 },
        discount_type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },
        total: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    totalPaid: { type: Number, required: true, default: 0 },
    return_amount: { type: Number, required: true },
    grand_total: { type: Number, required: true },
    total_discount: { type: Number, required: true, default: 0 },
    invoiceNumber: { type: Number, unique: true },
  },
  { timestamps: true }
);

const Invoice = models.Invoice || model("Invoice", InvoiceSchema);

export default Invoice;
