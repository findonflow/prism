/*--------------------------------------------------------------------------------------------------------------------*/
import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export function SearchBar(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  const { value, onChange, placeholder } = props;
  const { className } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={cn(
        "text-prism-text-muted relative flex w-full flex-row items-center self-stretch overflow-hidden has-focus:text-white",
        className,
      )}
    >
      <Search className="absolute left-3 z-10 h-4 w-4 opacity-50" />
      <Input
        ref={inputRef}
        type="text"
        className={cn("text-main h-full border-1 px-4 pl-8 text-lg outline-0 min-h-[40px] bg-prism-level-1")}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        /*        onFocus={(e) => e.currentTarget.select()}*/
      />
    </div>
  );
}
