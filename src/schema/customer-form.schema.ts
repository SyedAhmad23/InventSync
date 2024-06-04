import * as yup from "yup";

export const CustomerFormSchema = yup.object().shape({
  customer_name: yup.string().required("*Customer Name is required"),
  phone: yup.string().required("*phone is required"),
  email: yup.string().notRequired().email("Invalid email"),
});

export type CustomerFormValues = yup.InferType<typeof CustomerFormSchema>;
