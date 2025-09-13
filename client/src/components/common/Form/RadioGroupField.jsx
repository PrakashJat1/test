import React from "react";
import { useFormContext } from "react-hook-form";

const RadioGroupField = ({ name, label, options = [], ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-start">
        <label htmlFor={name}>{label}</label>
      </div>
      {options.map((option) => (
        <div key={option.value} className="form-check form-check-inline d-flex justify-content-start">
          <input
            type="radio"
            id={`${name}_${option.value}`}
            value={option.value}
            {...register(name)}
            className="form-check-input"
            {...rest}
          />
          <label
            htmlFor={`${name}_${option.value}`}
            className="form-check-label"
          >
            {option.label}
          </label>
        </div>
      ))}
      {errors[name] && (
        <div className="text-danger">{errors[name].message}</div>
      )}
    </div>
  );
};

export default RadioGroupField;
