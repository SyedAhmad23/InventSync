import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  items: string[];
  placeholder: string;
  defaultValue?: string;
  onSelect: (selectedItem: string) => void;
};

export function CustomSelect({ items, placeholder, defaultValue, onSelect }: Props) {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || "");

  React.useEffect(() => {
    setSelectedValue(defaultValue || "");
  }, [defaultValue]);

  const handleSelect = (selectedItem: string) => {
    setSelectedValue(selectedItem);
    onSelect(selectedItem);
  };

  return (
    <Select onValueChange={handleSelect} defaultValue={defaultValue}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>{selectedValue}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item} value={item} className="capitalize">
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}