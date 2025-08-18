import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Phone {
  phoneCode: string;
  phoneNumber: string;
}

interface PhoneFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

// Common country codes
const countryCodes = [
  { code: '855', country: 'Cambodia', flag: '🇰🇭' },
  { code: '66', country: 'Thailand', flag: '🇹🇭' },
  { code: '84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '86', country: 'China', flag: '🇨🇳' },
  { code: '82', country: 'South Korea', flag: '🇰🇷' },
  { code: '81', country: 'Japan', flag: '🇯🇵' },
  { code: '65', country: 'Singapore', flag: '🇸🇬' },
];

export function PhoneField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter phone number",
  disabled = false,
}: PhoneFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const phoneValue = field.value as Phone || { phoneCode: '855', phoneNumber: '' };
        
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex gap-2">
              <Select
                value={phoneValue.phoneCode}
                onValueChange={(code) => {
                  field.onChange({
                    ...phoneValue,
                    phoneCode: code,
                  });
                }}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="+855" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} +{country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <FormControl>
                <Input
                  type="tel"
                  placeholder={placeholder}
                  value={phoneValue.phoneNumber}
                  onChange={(e) => {
                    field.onChange({
                      ...phoneValue,
                      phoneNumber: e.target.value,
                    });
                  }}
                  disabled={disabled}
                  className="flex-1"
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}