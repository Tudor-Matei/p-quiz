import { FormikProps } from "formik";
import { ChangeEvent, useCallback } from "react";
import { IOption } from "../../utils/IQuiz";
import { IFormState } from "./FormStateType";

export default function Question({
  type,
  title,
  options,
  formik,
}: {
  type: "single" | "multiple";
  title: string;
  options: IOption[];
  formik: FormikProps<IFormState>;
}) {
  const markOptionAsCorrectHandler = useCallback(
    (optionIndex: number) =>
      type === "multiple"
        ? ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
            formik.values[title][optionIndex].markedAsCorrect = checked;
            formik.setFieldValue(title, formik.values[title]);
            formik.setFieldTouched(title, true);
          }
        : ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
            formik.values[title].forEach((option, currentOptionIndex) => {
              if (currentOptionIndex === optionIndex) return;
              option.markedAsCorrect = false;
            });

            formik.values[title][optionIndex].markedAsCorrect = checked;
            formik.setFieldValue(title, formik.values[title]);
            formik.setFieldTouched(title, true);
          },
    [type, formik, title]
  );

  return (
    <div>
      <h2>
        {title}{" "}
        {formik.touched[title] && formik.errors[title] && (
          <span className="invalid-field-indicator">{formik.errors[title] as string}</span>
        )}
      </h2>
      {options.map((option, optionIndex) => (
        <div key={`${title}-option-${optionIndex}`}>
          <input
            onChange={markOptionAsCorrectHandler(optionIndex)}
            checked={formik.values[title][optionIndex].markedAsCorrect}
            onBlur={formik.handleBlur}
            required={type === "single"}
            type={type === "single" ? "radio" : "checkbox"}
            name={title}
          />
          <label>{option.title}</label>
        </div>
      ))}
    </div>
  );
}
