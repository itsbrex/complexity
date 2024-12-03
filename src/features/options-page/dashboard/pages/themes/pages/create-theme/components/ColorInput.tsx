import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ColorInputProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
  description: string;
  disabled?: boolean;
};

export function ColorInput({
  value,
  onChange,
  label,
  description,
  disabled,
}: ColorInputProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith("#")) {
      newValue = `#${newValue}`;
    }

    onChange(newValue);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase());
  };

  const inputValue = value ?? "";

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="tw-flex tw-gap-2">
          <Input
            disabled={disabled}
            type="color"
            className="tw-h-10 tw-w-14"
            value={value || "#000000"}
            tabIndex={-1}
            onChange={handleColorChange}
          />
          <Input
            type="text"
            disabled={disabled}
            className="tw-font-mono"
            placeholder="#000000"
            value={inputValue}
            maxLength={7}
            onChange={handleTextChange}
          />
        </div>
      </FormControl>
      <FormDescription>{description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
