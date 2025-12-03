import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  role: yup.string().oneOf(["customer", "provider"]).required(),
  name: yup.string().min(3).required("Full name is required"),
  email: yup.string().email("Enter valid email").required("Email is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .required("Mobile number required"),
  password: yup.string().min(6, "Password must be 6+ characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter valid email")
    .required("Email is required"),

    password: yup.string().min(6, "Password must be 6+ characters").required(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string()
    .min(6, "Password must be at least 6 chars")
    .required("New password is required"),

  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
})