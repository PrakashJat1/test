import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const DropdownNew = ({
  icon = false,
  label = "Select Option",
  options = [],
  onSelect,
}) => {

  return (
    <Dropdown onSelect={onSelect}>
      <Dropdown.Toggle
        variant="light"
        className="orange-dropdown text-white px-4 py-2 rounded"
        style={{
          backgroundColor: "#cf0829ff", 
          border: "none",
        }}
      >
        {icon}{label}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option, idx) => (
          <Dropdown.Item eventKey={option.value} key={idx}>
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownNew;
