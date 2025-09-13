// components/common/TextAreaField.jsx
import React from "react";
import { useFormContext } from "react-hook-form";

const TextAreaField = ({ name, label, rows = 4, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-start">
        <label htmlFor={name}>{label}</label>
      </div>
      <textarea
        id={name}
        rows={rows}
        {...register(name)}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        {...rest}
      ></textarea>
      {errors[name] && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </div>
  );
};

export default TextAreaField;
