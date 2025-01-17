import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../css/forms.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IUserData, UserDataContext } from "../../utils/UserDataContext";
import isEmailValid from "../../utils/emailRegex";
import checkIfFormIsValid from "../../utils/isFormValid";

export default function Signin() {
  const isLoggedIn = useRedirectOnAuth("/dashboard", true);

  const { setUserData } = useContext(UserDataContext);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: ({ email, password }) => {
      const errors: { email?: string; password?: string } = {};
      if (email.trim().length === 0) errors.email = "The e-mail is missing.";
      else if (!isEmailValid(email)) errors.email = "Invalid e-mail format.";

      if (password.trim().length == 0) errors.password = "The password is missing.";
      else if (password.length < 8) errors.password = "Password is too small.";

      return errors;
    },
    onSubmit: (values) => {
      type Response = { error: string | null; data?: IUserData };
      fetch("http://localhost/p-quiz/php/signin.php", {
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
    <>
      <section className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <h1 className="main-title form-title" data-text="log into your account">
            log into your account
          </h1>
          <div>
            <label htmlFor="email">
              E-mail{" "}
              {formik.touched.email && formik.errors.email ? (
                <span className="invalid-field-indicator">{formik.errors.email}</span>
              ) : (
                ""
              )}
            </label>
            <input
              {...formik.getFieldProps("email")}
              className={formik.touched.email && formik.errors.email ? "input--error" : ""}
              required
              type="email"
              name="email"
              placeholder="type your e-mail here..."
            />
          </div>
          <div>
            <label htmlFor="password">
              Password{" "}
              {formik.touched.password && formik.errors.password ? (
                <span className="invalid-field-indicator">{formik.errors.password}</span>
              ) : (
                ""
              )}
            </label>

            <input
              {...formik.getFieldProps("password")}
              required
              className={formik.touched.password && formik.errors.password ? "input--error" : ""}
              type="password"
              name="password"
              placeholder="type your password here..."
            />
          </div>

          <div className="form__buttons">
            <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
              {isFormValid ? "Submit" : "Not yet"}
            </button>
            <Link to="/signup">
              <button type="button" className="default-button">
                I don't have an account 🤦‍♂️
              </button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
