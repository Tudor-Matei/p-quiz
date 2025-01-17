import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../css/forms.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IUserData, IUserDataContext, UserDataContext } from "../../utils/UserDataContext";
import isEmailValid from "../../utils/emailRegex";
import checkIfFormIsValid from "../../utils/isFormValid";
import { IFormStateTypeError } from "./FormStateType";

export default function Signup() {
  const isLoggedIn = useRedirectOnAuth("/dashboard", true);
  const { setUserData } = useContext<IUserDataContext>(UserDataContext);

  const formik = useFormik({
    initialValues: { fname: "", lname: "", email: "", password: "", role: "click me to select your role" },
    validate: ({ fname, lname, email, password, role }) => {
      const errors: IFormStateTypeError = {};
      if (fname.trim() === "") errors.fname = "The first name is missing.";
      else if (fname.length <= 1) errors.fname = "I don't think first names can be 1 letter long. 🤔";

      if (lname.trim() === "") errors.lname = "The last name is missing.";
      else if (lname.length <= 1) errors.lname = "I don't think last names can be 1 letter long. 🤔";

      if (email.trim().length === 0) errors.email = "The e-mail is missing.";
      else if (!isEmailValid(email)) errors.email = "Invalid e-mail format.";

      if (password.trim().length == 0) errors.password = "The password is missing.";
      else if (password.length < 8) errors.password = "Password is too small.";

      if (role === "click me to select your role") errors.role = "You have not chosen a role yet.";
      return errors;
    },
    onSubmit: (values) => {
      type Response = { error: string | null; data?: IUserData };
      fetch("http://localhost/p-quiz/php/signup.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then((response) => response.json())
        .then(({ error, data }: Response) => {
          if (error !== null && data === undefined) {
            alert(error);
            formik.setSubmitting(false);
            return;
          }

          localStorage.setItem("data", JSON.stringify(data));
          setUserData(data as IUserData);
          location.pathname = "/dashboard";
        });
    },
  });

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);
  return isLoggedIn ? null : (
    <section className="form-container">
      <form action="POST" onSubmit={formik.handleSubmit}>
        <h1 className="main-title form-title" data-text="create an account">
          create an account
        </h1>
        <div>
          <label htmlFor="fname">
            First Name{" "}
            {formik.touched.fname && formik.errors.fname && (
              <span className="invalid-field-indicator">{formik.errors.fname}</span>
            )}
          </label>
          <input
            {...formik.getFieldProps("fname")}
            className={formik.touched.fname && formik.errors.fname ? "input--error" : ""}
            required
            type="text"
            name="fname"
            placeholder="type your first name here..."
          />
        </div>
        <div>
          <label htmlFor="lname">
            Last Name{" "}
            {formik.touched.lname && formik.errors.lname && (
              <span className="invalid-field-indicator">{formik.errors.lname}</span>
            )}
          </label>
          <input
            {...formik.getFieldProps("lname")}
            className={formik.touched.lname && formik.errors.lname ? "input--error" : ""}
            type="text"
            required
            name="lname"
            placeholder="type your last name here..."
          />
        </div>
        <div>
          <label htmlFor="email">
            E-mail{" "}
            {formik.touched.email && formik.errors.email && (
              <span className="invalid-field-indicator">{formik.errors.email}</span>
            )}
          </label>
          <input
            {...formik.getFieldProps("email")}
            className={formik.touched.email && formik.errors.email ? "input--error" : ""}
            type="email"
            name="email"
            required
            placeholder="type your e-mail here..."
          />
        </div>
        <div>
          <label htmlFor="password">
            Password{" "}
            {formik.touched.password && formik.errors.password && (
              <span className="invalid-field-indicator">{formik.errors.password}</span>
            )}
          </label>
          <input
            {...formik.getFieldProps("password")}
            className={formik.touched.password && formik.errors.password ? "input--error" : ""}
            type="password"
            name="password"
            required
            placeholder="type your password here..."
          />
        </div>
        {formik.touched.role && formik.errors.role && (
          <span className="invalid-field-indicator">{formik.errors.role}</span>
        )}
        <select {...formik.getFieldProps("role")} name="role">
          <option disabled> click me to select your role </option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <div className="form__buttons">
          <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
            {isFormValid ? "Submit" : "Not yet..."}
          </button>
          <Link to="/signin">
            <button type="button" className="default-button">
              I already have an account 🤦‍♂️
            </button>
          </Link>
        </div>
      </form>
    </section>
  );
}
