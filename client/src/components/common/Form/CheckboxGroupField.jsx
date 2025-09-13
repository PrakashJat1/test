import React from "react";
import { useFormContext } from "react-hook-form";

const CheckboxGroupField = ({ name, label, options = [] }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <label className="form-label d-block">{label}</label>
      {options.map((opt) => (
        <div className="form-check" key={opt.value}>
          <input
            type="checkbox"
            id={`${name}_${opt.value}`}
            value={opt.value}
            {...register(name)}
            className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
          />
          <label htmlFor={`${name}_${opt.value}`} className="form-check-label">
            {opt.label}
          </label>
        </div>
      ))}
      {errors[name] && (
        <div className="invalid-feedback d-block">{errors[name].message}</div>
      )}
    </div>
  );
};

export default CheckboxGroupField;
