import * as yup from "yup";

export const ProductFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string(),
  quantity: yup.string().required("Quantity is required"),
  buyingPrice: yup.number().required("Buying price is required"),
  sellPrice: yup.number().required("Selling price is required"),
  category: yup.string().required("Category is required"),
  suppliers: yup.string().required("Supplier is required"),
  unitCode: yup.string().required("Unit code is required"),
  image: yup.string().nullable(),
  sku: yup.string().required("sku is required"),
});

export type ProductFormValues = yup.InferType<typeof ProductFormSchema>;
