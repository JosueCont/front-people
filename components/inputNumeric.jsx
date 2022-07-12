import { Input } from "antd";
import { useEffect } from "react";
import { useState } from "react";

const NumericInput = ({
  valueItem,
  initValue = 0,
  placeholder = "Monto",
  ...props
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (initValue) setValue(initValue);
  }, [initValue]);

  return (
    <Input
      value={value}
      onChange={(e) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d{0,2})?$/;

        if (reg.test(inputValue) || inputValue === "") {
          setValue(inputValue);
          valueItem(inputValue);
        }
      }}
      placeholder={placeholder}
      maxLength={25}
      onBlur={(e) => {
        const { value: blurValue } = e.target;
        if (blurValue === "" || Number(blurValue) === 0) {
          setValue(1);
          valueItem(1);
        }
      }}
    />
  );
};

export default NumericInput;
