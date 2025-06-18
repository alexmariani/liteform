
export type FieldConfig<T> = {
    initialValue?: T;
    validators?: Validator<T>[];
};

export type FieldState<T> = {
    value: T;
    touched: boolean;
    error: string | null;
};


export type Validator<T> = (value: T) => string | null;


type RegisteredFieldProps =
    | {
        name: string;
        checked: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
        onBlur: () => void;
    }
    | {
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
        onBlur: () => void;
    };

export interface FormState<TValues> {
    values: Partial<TValues>;
    errors: Partial<Record<keyof TValues, string>>;
    touched: Partial<Record<keyof TValues, boolean>>;
    isSubmitted: boolean;
    validationMode: "onSubmit" | "onBlur" | "onChange";
    schema: Partial<Record<keyof TValues, FieldConfig<TValues[keyof TValues]>>>;
    registerField: <K extends keyof TValues>(name: K) => RegisteredFieldProps;
    setFieldValue: <K extends keyof TValues>(name: K, value: TValues[K]) => void;
    setFormValue: (body: TValues) => void;
    setFieldTouched: <K extends keyof TValues>(name: K, touched: boolean) => void;
    validateField: (name: keyof TValues) => string | null;
    handleSubmit: (onValid: (data: TValues) => void, onInvalid?: (errors: any) => void) => void;
    validateAll: () => Partial<Record<keyof TValues, string>>
    resetForm: () => void;
}
