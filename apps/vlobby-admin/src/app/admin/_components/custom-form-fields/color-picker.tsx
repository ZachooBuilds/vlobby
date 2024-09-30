"use client";

import React from "react";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";

const colors = [
  { name: "Primary", hex: "#1847ED" },
  { name: "Vibrant Blue", hex: "#00A3FF" },
  { name: "Teal", hex: "#00D1C1" },
  { name: "Navy", hex: "#0C2B9E" },
  { name: "Royal Purple", hex: "#6A0DAD" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Coral", hex: "#FF6B6B" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Amber", hex: "#FFBF00" },
  { name: "Deep Red", hex: "#C41E3A" },
];

interface ColorPickerProps {
  name: string;
  label?: string;
}

export function ColorPicker({ name, label = "Color" }: ColorPickerProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {field.value ? (
                    <>
                      <div
                        className="mr-2 h-4 w-4 rounded-full"
                        style={{ backgroundColor: field.value as string }}
                      />
                      {colors.find((color) => color.hex === field.value)
                        ?.name ?? field.value}
                    </>
                  ) : (
                    <span>Select color</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <div className="grid grid-cols-5 gap-2 p-2">
                  {colors.map((color) => (
                    <Button
                      key={color.hex}
                      className="h-8 w-8 rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => field.onChange(color.hex)}
                      title={color.name}
                    >
                      <span className="sr-only">{color.name}</span>
                      {field.value === color.hex && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
