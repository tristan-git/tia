import React, { useCallback, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";

type SelectProps = {
  form: any;
  name: string;

  formLabel?: any;
  placeholder?: string;
  selectGroup: any;
};

const SelectFORM = ({ form, name, formLabel, placeholder, selectGroup }: SelectProps) => {
  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel?.text ?? ""}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder ?? ""} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectGroup?.groups.map(({ selectLabelText, values }: any, indexSelectGroup: number) => (
                <SelectGroup key={`SelectGroupKey-${indexSelectGroup}`}>
                  <SelectLabel>{selectLabelText ?? ""}</SelectLabel>

                  {values?.map(({ value, text }: any, indexItem: number) => (
                    <SelectItem value={value} key={`SelectGroupKey-${indexItem}`}>
                      {text}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {/* <FormDescription>
            You can manage email addresses in your <Link href="/examples/forms">email settings</Link>.
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFORM;
