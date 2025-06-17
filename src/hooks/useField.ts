import { useState, useEffect, useCallback } from "react";
import { useForm } from "./useForm";
import { FieldConfig } from "../types/types";

export function useField<T extends string>(
    form: ReturnType<typeof useForm>,
    config: FieldConfig<T> & { validationMode?: "onSubmit" | "onBlur" | "onChange" }
) {
    const { name, initialValue, validationMode: fieldMode } = config;
    const [localValue, setLocalValue] = useState<T>(initialValue ?? ("" as unknown as T));
    const { setFieldValue, registerField, validateField, setFieldTouched, errors, touched } = form;
    const mode = fieldMode ?? form.validationMode;

    // Registra il campo nel form globale
    useEffect(() => {
        registerField(name);
        setFieldValue(name, localValue);
    }, [name, localValue, registerField, setFieldValue]);

    // Funzione per gestire il cambio di valore
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value as unknown as T; // Assicurati di gestire correttamente il tipo
        setLocalValue(value);
        setFieldValue(name, value); // Imposta il valore nel form globale
        if (mode === "onChange") validate(); // Esegui la validazione se in modalità "onChange"
    };

    // Funzione per gestire il blur
    const onBlur = () => {
        setFieldTouched(name, true);
        if (mode === "onBlur") validate(); // Esegui la validazione se in modalità "onBlur"
    };

    // Validazione
    const validate = useCallback(() => {
        return validateField(name);
    }, [form, name]);

    // Monitoraggio dei cambiamenti
    useEffect(() => {
        console.log(`${name} field changed:`, localValue);
    }, [localValue, name]); // Si attiva ogni volta che `localValue` cambia

    return {
        value: localValue,
        error: errors[name],
        touched: touched[name],
        onChange,
        onBlur,
    };
}
