import { cn } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleHelp, Phone } from "lucide-react";

type PhoneInputProps = {
  register: any;
  errors: any;
  label: string;
  name: string;
  toolTipText?: string;
  unit?: string;
  placeholder?: string;
  icon?: any;
};

export default function PhoneInput({
  register,
  errors,
  label,
  name,
  toolTipText,
  unit,
  icon,
  placeholder,
}: PhoneInputProps) {
  const Icon = icon || Phone;
  
  return (
    <div>
      <div className="flex space-x-2 items-center">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        {toolTipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <CircleHelp className="w-4 h-4 text-slate-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toolTipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="mt-2">
        <div className="relative rounded-md ">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="text-slate-300 w-4 h-4" />
            </div>
          )}
          <input
            id={name}
            type="tel"
            inputMode="numeric"
            {...register(`${name}`, { 
              required: true,
              pattern: {
                value: /^[0-9]+$/,
                message: "You can enter only phone numbers"
              },
            
              maxLength: {
                value: 10,
                message: "Phone number must not exceed 10 digits"
              }
            })}
            className={cn(
              "block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-sm",
              (errors[`${name}`] && "focus:ring-red-500 pl-8") ||
                (Icon && "pl-8")
            )}
            placeholder={placeholder || label}
            onKeyPress={(e) => {
              // Allow only digits (0-9), backspace, and tab
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
          />
          {unit && (
            <p className="bg-white py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center">
              {unit}
            </p>
          )}
        </div>
        {errors[`${name}`]?.type === "required" && (
          <span className="text-xs text-red-600">{label} is required</span>
        )}
        {errors[`${name}`]?.type === "pattern" && (
          <span className="text-xs text-red-600">You can enter only phone numbers</span>
        )}
        {errors[`${name}`]?.type === "maxLength" && (
          <span className="text-xs text-red-600">Phone number must not exceed 10 digits</span>
        )}
      </div>
    </div>
  );
}