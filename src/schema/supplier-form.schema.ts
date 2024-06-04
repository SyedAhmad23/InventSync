import * as yup from "yup";

export const SupplierFormSchema = yup.object().shape({
  name: yup.string().required("*Name is required"),
  contact_person: yup.string().required("*contact person is required"),
  email: yup.string().required("*email is required"),
  phone: yup.string().required("*phone is required"),
  address: yup.string().required("*address is required"),
});

export type SupplierFormValues = yup.InferType<typeof SupplierFormSchema>;
