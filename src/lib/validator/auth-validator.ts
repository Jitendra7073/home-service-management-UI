import * as yup from "yup";

const email = yup
  .string()
  .required("Email is required")
  .test("email-format", function (value) {
    if (!value) return false;

    if (!value.includes("@")) {
      return this.createError({ message: "Email must contain @" });
    }

    if (value.split("@").length !== 2) {
      return this.createError({ message: "Email must contain only one @" });
    }

    const [local, domain] = value.split("@");

    if (!local) {
      return this.createError({ message: "Email username is missing" });
    }

    if (!domain) {
      return this.createError({ message: "Email domain is missing" });
    }

    if (!domain.includes(".")) {
      return this.createError({
        message: "Email domain must contain a dot (.)",
      });
    }

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
      return this.createError({ message: "Email contains invalid characters" });
    }

    if (!/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(domain)) {
      return this.createError({ message: "Email domain is invalid" });
    }

    return true;
  });

const password = yup
  .string()
  .required("Password is required")
  .test("password-strength", function (value) {
    if (!value) return false;

    if (value.length < 8) {
      return this.createError({
        message: "Password must be at least 8 characters long",
      });
    }

    if (!/[A-Z]/.test(value)) {
      return this.createError({
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(value)) {
      return this.createError({
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!/[0-9]/.test(value)) {
      return this.createError({
        message: "Password must contain at least one number",
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(value)) {
      return this.createError({
        message: "Password must contain at least one special character",
      });
    }

    if (/\s/.test(value)) {
      return this.createError({
        message: "Password must not contain spaces",
      });
    }

    return true;
  });

export const registrationSchema = yup.object().shape({
  role: yup.string().oneOf(["customer", "provider"]).required(),
  name: yup.string().min(3).required("Full name is required"),
  email: email,
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .required("Mobile number required"),
  password: password,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const loginSchema = yup.object({
  email: email,
  password: password,
});

export const forgotPasswordSchema = yup.object({
  email: email,
}); 

export const resetPasswordSchema = yup.object({
  newPassword: password,

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});
