import { useCallback, useEffect, useState } from "react";
import { FormState } from "../types/types";

export function useField<T>(
    form: FormState<T>,
    key: keyof T
) {
    const { setFieldValue, registerField, validateField, setFieldTouched, errors, touched, schema } = form;
    const { initialValue, validators: fieldMode } = schema[key]!;
    const [localValue, setLocalValue] = useState<typeof initialValue>(initialValue);
    const mode = fieldMode ?? form.validationMode;

    // Registra il campo nel form globale
    useEffect(() => {
        registerField(key);
        setFieldValue(key, localValue as T[keyof T]);
    }, [key, localValue, registerField, setFieldValue]);

    // Funzione per gestire il cambio di valore
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value as unknown as T[keyof T]; // Assicurati di gestire correttamente il tipo
        setLocalValue(value);
        setFieldValue(key, value); // Imposta il valore nel form globale
        if (mode === "onChange") validate(); // Esegui la validazione se in modalità "onChange"
    };

    // Funzione per gestire il blur
    const onBlur = () => {
        setFieldTouched(key, true);
        if (mode === "onBlur") validate(); // Esegui la validazione se in modalità "onBlur"
    };

    // Validazione
    const validate = useCallback(() => {
        return validateField(key);
    }, [form, name]);

    // Monitoraggio dei cambiamenti
    useEffect(() => {
        console.log(`${name} field changed:`, localValue);
    }, [localValue, name]); // Si attiva ogni volta che `localValue` cambia

    return {
        value: localValue,
        error: errors[key],
        touched: touched[key],
        onChange,
        onBlur,
    };
}
