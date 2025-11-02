/*--------------------------------------------------------------------------------------------------------------------*/
import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/*--------------------------------------------------------------------------------------------------------------------*/
export function SearchBar(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const { value, onChange, placeholder } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="relative flex w-full flex-row items-center overflow-hidden">
      <Search className="absolute left-3 h-4 w-4 text-prism-text-muted z-10" />
      <Input
        ref={inputRef}
        type="text"
        className="py-3 !pl-9 text-main"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={true}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
