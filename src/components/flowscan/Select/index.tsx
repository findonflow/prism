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
  const { initialValue, options = [], onChange } = props;
  const { value, overlayText } = props;
  const [_value, setValue] = useState<string>(initialValue);

  useEffect(() => {
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
    <select
      value={_value}
      onChange={({ target }) => handleChange(target.value)}
      className={clsx(
        "select bg-prism-level-3 border-border border-solid border-1 px-3",
        "[&:focus]:outline-prism-text-muted",
        "[&:after]:absolute [&:after]:border-border [&:after]:border-1 [&:after]:border-solid [&:after]:w-full [&:after]:h-full [&:after]:top-0 [&:after]:left-0 [&:after]:rounded-md [&:after]:pointer-events-none",
        className
      )}
    >
      <div className="absolute border-border border-1 border-solid w-full h-full top-0 left-0 rounded-md pointer-events-none" />
      {options.map((option) => (
        <option className="hover:bg-prism-interactive" key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
