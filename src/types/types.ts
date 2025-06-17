
export type FieldConfig<T> = {
    name: string;
    initialValue?: T;
    validators?: Validator<T>[];
};

export type FieldState<T> = {
    value: T;
    touched: boolean;
    error: string | null;
};


export type Validator<T> = (value: T) => string | null;

export interface FormState<TValues> {
    values: Partial<TValues>;
    errors: Partial<Record<keyof TValues, string>>;
    touched: Partial<Record<keyof TValues, boolean>>;
    isSubmitted: boolean;
    validationMode: "onSubmit" | "onBlur" | "onChange";
    schema: Partial<Record<keyof TValues, Validator<TValues[keyof TValues]>[]>>;
    registerField: <K extends keyof TValues>(name: K, validators: Validator<TValues[K]>[]) => void;
    setFieldValue: <K extends keyof TValues>(name: K, value: TValues[K]) => void;
    setFormValue: (body: TValues) => void;
    setFieldTouched: <K extends keyof TValues>(name: K, touched: boolean) => void;
    validateField: (name: keyof TValues) => string | null;
    handleSubmit: (onValid: (data: TValues) => void, onInvalid?: (errors: any) => void) => void;
    validateAll: () => Partial<Record<keyof TValues, string>>
    resetForm: () => void;
}
