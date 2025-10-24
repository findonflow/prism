/* --------------------------------------------------------------------------------------------- */
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

/* --------------------------------------------------------------------------------------------- */
export interface SelectProps {
  initialValue: string;
  options: Array<string>;
  onChange: (data: string) => void;
  width?: string;
  className?: string;
  value?: string;
  overlay?: boolean;
  children?: ReactNode;
  overlayText?: string;
}
/* --------------------------------------------------------------------------------------------- */

export default function Select(props: SelectProps) {
  const { className = "" } = props;
  const {
    initialValue,
    options = [],
    onChange,
    width,
    overlay,
    children,
  } = props;
  const { value, overlayText } = props;
  const [_value, setValue] = useState<string>(initialValue);
  const [open, setOpen] = useState(false);

  const borderRadius = open ? "rounded-[2px_2px_0_0]" : "rounded-[2px]";
  const rotate = open ? "rotate-180" : "rotate-0";

  useEffect(() => {
    console.log(value, initialValue, _value);
    if (value) {
      setValue(value);
    } else {
      setValue(initialValue);
    }
  }, [value, initialValue]);

  function handleChange(newValue: string) {
    setValue(newValue);
    onChange(newValue);
  }

  return (
    <div className={clsx(className)}>
      <select
        onChange={({ target }) => handleChange(target.value)}
        className="select bg-background border-border border-px border-solid p-2 [&:focus]:outline-none"
      >
        <div className="absolute border-border border-1 border-solid w-full h-full top-0 left-0 rounded-md pointer-events-none" />
        {options.map((option) => (
          <option
            className="hover:bg-gray-200"
            key={option}
            value={option}
            selected={option === _value}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
