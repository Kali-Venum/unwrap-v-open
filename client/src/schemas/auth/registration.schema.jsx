import * as Yup from "yup";

export const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name."),
  lastName: Yup.string().required("Please enter your last name."),
  email: Yup.string()
    .email("Invalid email.")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});
