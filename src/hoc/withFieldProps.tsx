import React from "react";
import { useField } from "../hooks/useField";
import { useForm } from "../hooks/useForm";
import { FieldConfig } from "../types/types";

export function withFieldProps<T extends string>(
  Component: React.ComponentType<any>,
  form: ReturnType<typeof useForm>,
  config: FieldConfig<T>
) {
  const props = useField<T>(form, config);
  return <Component {...props} />;
}
