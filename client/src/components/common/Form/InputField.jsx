import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const InputField = ({
  name,
  label,
  type = "text",
  defaultValue,  
  placeholder,
  autoComplete = "false",
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Show/hide password toggle state
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-3 position-relative">
      <div className="d-flex justify-content-start">
        <label htmlFor={name}>{label}</label>
      </div>

      <div className="input-group">
        <input
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          placeholder={placeholder}
          id={name}
          {...register(name)}
          type={inputType}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        )}
      </div>

      {errors[name] && (
        <div className="invalid-feedback d-block">{errors[name].message}</div>
      )}
    </div>
  );
};

export default InputField;
