import React from "react";
import Select from "react-select";
import { useController, useFormContext } from "react-hook-form";

const MultiSelectField = ({
  name,
  label,
  options = [],
  isMulti = true,
  valueKey = "value",
  labelKey = "label",
  placeholder = "Select...",
  isDisabled = false,
}) => {
  const { control } = useFormContext();

  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({ name, control });

  const getOptionLabel = (opt) =>
    typeof opt === "object" ? opt[labelKey] : opt;
  const getOptionValue = (opt) =>
    typeof opt === "object" ? opt[valueKey] : opt;

  const customOptions = options.map((opt) => ({
    value: getOptionValue(opt),
    label: getOptionLabel(opt),
  }));

  const selectedValues = customOptions.filter((opt) =>
    value?.map(String).includes(String(opt.value))
  );

  console.log("value from RHF:", value);
  console.log("customOptions:", customOptions);
  console.log("selectedValues:", selectedValues);

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <Select
        inputRef={ref}
        isMulti={isMulti}
        options={customOptions}
        value={selectedValues}
        onChange={(selected) => {
          const selectedIds = selected?.map((item) => item.value);
          onChange(selectedIds);
        }}
        placeholder={placeholder}
        isDisabled={isDisabled}
      />
      {error && <small className="text-danger">{error.message}</small>}
    </div>
  );
};

export default MultiSelectField;
