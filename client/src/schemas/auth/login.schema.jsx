import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email.")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});
