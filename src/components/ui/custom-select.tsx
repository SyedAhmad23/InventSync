import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  items: string[];
  placeholder: string;
};

export function CustomSelect({ items, placeholder }: Props) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item} className="capitalize">
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
