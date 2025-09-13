import React from "react";
import { useFormContext } from "react-hook-form";

const SelectField = ({
  name,
  label,
  options = [],
  onChange,
  defaultValue,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-start">
        <label htmlFor={name}>{label}</label>
      </div>
      <select
        id={name}
        defaultValue={defaultValue}
        {...register(name)}
        className={`form-select ${errors[name] ? "is-invalid" : ""}`}
        {...rest}
        onChange={(e) => {
          register(name).onChange(e);
          onChange?.(e.target.value);
        }}
      >
        <option value="">--- Select ---</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </div>
  );
};

export default SelectField;
