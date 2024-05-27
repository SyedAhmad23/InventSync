import * as yup from "yup";

export const CustomerFormSchema = yup.object().shape({
  customer_name: yup.string().required("customer_name is required"),
  phone: yup.string().required("phone is required"),
  email: yup.string(),
  // address: yup.string(),
});

export type CustomerFormValues = yup.InferType<typeof CustomerFormSchema>;
