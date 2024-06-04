import * as yup from "yup";

export const CategoryFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

export type CategoryFormValues = yup.InferType<typeof CategoryFormSchema>;
