import { createContext, useContext } from "react";
import { FormState } from "../types/types";

// Rendi generico il tipo del context
export const FormContext = createContext<FormState<any> | null>(null);

export function FormProvider<T>({
  children,
  form,
}: {
  children: React.ReactNode;
  form: FormState<T>;
}) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

// Rendi generico il hook così il tipo del form si propaga
export function useFormContext<T>() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used inside FormProvider");
  return ctx as FormState<T>;
}
