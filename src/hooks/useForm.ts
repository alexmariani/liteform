import { useState, useCallback } from "react";
import { FieldConfig, FormState, Validator } from "../types/types";

type ValidationMode = "onSubmit" | "onBlur" | "onChange";

interface UseFormOptions<T> {
    validationMode?: ValidationMode;
    schema?: Partial<Record<keyof T, FieldConfig<T[keyof T]>>>;
}

export function useForm<T extends Record<string, any>>(options?: UseFormOptions<T>) {
    const {
        validationMode = "onSubmit",
        schema = {} as Partial<Record<keyof T, FieldConfig<T[keyof T]>>>
    } = options ?? {};

    const [values, setValues] = useState<Partial<T>>({});
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const setFieldValue = useCallback(
        <K extends keyof T>(name: K, value: T[K]) => {
            setValues((prev) => ({ ...prev, [name]: value }));

            if (validationMode === "onChange") {
                validateField(name, value);
            }
        },
        [validationMode]
    );

    const setFieldTouched = useCallback(
        <K extends keyof T>(name: K, isTouched: boolean) => {
            setTouched((prev) => ({ ...prev, [name]: isTouched }));

            if (isTouched && validationMode === "onBlur") {
                validateField(name, values[name]);
            }
        },
        [validationMode, values]
    );

    const validateField = useCallback(
        (name: keyof T, value?: T[keyof T]) => {
            const val = value !== undefined ? value : values[name];
            const fieldConfig = schema[name as keyof T];
            const { validators } = fieldConfig!;

            if (!validators || validators.length == 0) {
                return null
            }

            for (const validator of validators) {
                const result = validator(val!);
                if (result) {
                    setErrors((prev) => ({ ...prev, [name]: result }));
                    return result;
                }
            }

            // Rimuovi error se validato correttamente
            setErrors((prev: any) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });

            return null;
        },
        [schema, values]
    );

    const validateAll = useCallback(() => {
        const nextErrors: Partial<Record<keyof T, string>> = {};

        for (const name in schema) {
            const val = values[name as keyof T];

            const fieldConfig = schema[name as keyof T];
            const { validators } = fieldConfig!;

            if (!validators || validators.length == 0) {
                return {};
            }
            for (const validator of validators) {
                const result = validator(val!);
                if (result) {
                    nextErrors[name as keyof T] = result;
                    break;
                }
            }
        }

        setErrors(nextErrors);
        return nextErrors;
    }, [schema, values]);


    // Funzione per gestire il reset del form
    const resetForm = useCallback(() => {
        setValues({});
        setErrors({});
        setTouched({});
    }, []);


    const handleSubmit = useCallback(
        (onValid: (data: T) => void, onInvalid?: (errors: Partial<Record<keyof T, string>>) => void) => {
            return (e: React.FormEvent) => {
                e.preventDefault();
                setIsSubmitted(false);
                const validation = validateAll();
                if (!validation || Object.keys(validation).length === 0) {
                    onValid(values as T);
                } else {
                    onInvalid?.(validation);
                }
                setIsSubmitted(true);
            };
        },
        [values, validateAll]
    );

  


    const registerField = useCallback(
        (name: keyof T) => {
            const value = values[name];

            const isCheckbox = typeof value === "boolean";

            return {
                name: String(name), // React <input> si aspetta string per name
                ...(isCheckbox
                    ? {
                        checked: value,
                    }
                    : {
                        value: value !== undefined && value !== null ? String(value) : "",
                    }),
                onChange: (
                    e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                    >
                ) => {
                    const target = e.target;
                    const val =
                        target.type === "checkbox"
                            ? (target as HTMLInputElement).checked
                            : target.value;

                    setFieldValue(name, val as T[keyof T]);
                },
                onBlur: () => setFieldTouched(name, true),
            };
        },
        [values, setFieldValue, setFieldTouched]
    );




    const setFormValue = useCallback(
        (body: Partial<T>) => {
            const fixNulls = (val: any): any => {
                if (val === null || val === undefined) {
                    return ""; // fallback se tipo ignoto
                }
                if (typeof val === "boolean") return val ?? false;
                if (typeof val === "string" || typeof val === "number") return val ?? "";
                if (Array.isArray(val)) return val ?? [];
                if (typeof val === "object") return val ?? {};
                return val;
            };

            const deepCast = (obj: any): any => {
                if (Array.isArray(obj)) {
                    return obj.map(deepCast);
                }

                if (typeof obj === "object" && obj !== null) {
                    return Object.fromEntries(
                        Object.entries(obj).map(([k, v]) => {
                            if (v === null || v === undefined) {
                                return [k, fixNulls(v)];
                            } else if (typeof v === "object") {
                                return [k, deepCast(v)];
                            } else {
                                return [k, v];
                            }
                        })
                    );
                }

                return obj;
            };

            setValues(deepCast(body));
        },
        []
    );


    return {
        values,
        errors,
        touched,
        isSubmitted,
        setFieldValue,
        setFieldTouched,
        validateField,
        validateAll,
        handleSubmit,
        registerField,
        validationMode,
        setFormValue,
        schema,
        resetForm
    } satisfies FormState<T>;
}
