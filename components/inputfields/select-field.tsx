import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  _id: string;
  id?: string;
  name: string | { en: string; kh?: string; ch?: string };
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  data: { data: SelectOption[] } | undefined;
  isError: boolean;
  loadingText?: string;
  errorText?: string;
  disabled?: boolean;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  data,
  isError,
  loadingText = "Loading...",
  errorText = "Error loading data",
  disabled = false,
}: SelectFieldProps<T>) {
  const getDisplayName = (nameObj: SelectOption['name']): string => {
    if (typeof nameObj === 'string') return nameObj;
    return nameObj.en || Object.values(nameObj)[0] || '';
  };

  const getItemValue = (item: SelectOption): string => {
    return item._id || item.id || '';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!data || isError || disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !data
                      ? loadingText
                      : isError
                      ? errorText
                      : placeholder
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.data?.map((item: SelectOption, index: number) => (
                <SelectItem
                  key={`${name}-${getItemValue(item)}-${index}`}
                  value={getItemValue(item)}
                >
                  {getDisplayName(item.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}