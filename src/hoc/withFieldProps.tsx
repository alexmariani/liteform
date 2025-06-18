import React from "react";
import { useField } from "../hooks/useField";
import { FormState } from "../types/types";

export function withFieldProps<T extends string>(
  Component: React.ComponentType<any>,
  form: FormState<T>,
  key: keyof T
) {
  const props = useField<T>(form, key);
  return <Component {...props} />;
}
