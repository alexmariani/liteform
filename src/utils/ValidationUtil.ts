const validators = {
    minLength: (min: number) => (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        if (value.length >= min) return null;
        return `Il campo deve contenere almeno ${min} caratteri`;
    },

    maxLength: (max: number) => (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        if (value.length <= max) return null;
        return `Il campo non deve avere più di ${max} caratteri`;
    },

    email: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) ? null : "Il campo deve essere un'email valida";
    },

    pec: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) ? null : "Il campo deve essere una PEC valida";
    },

    cap: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^\d{5}$/;
        return regex.test(value) ? null : "Il campo deve essere un CAP valido (5 cifre)";
    },

    cellulare: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^(\+39)?3\d{8,9}$/;
        return regex.test(value) ? null : "Il campo deve essere un numero di cellulare valido";
    },

    codiceFiscale: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^[A-Z0-9]{16}$/i;
        return regex.test(value) ? null : "Il campo deve essere un codice fiscale valido (16 caratteri alfanumerici)";
    },

    partitaIva: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const regex = /^\d{11}$/;
        return regex.test(value) ? null : "Il campo deve essere una partita IVA valida (11 cifre)";
    },

    cfOrPiva: (value: unknown): string | null => {
        if (typeof value !== "string" || value.trim() === "") return "Il campo è obbligatorio";
        const cfRegex = /^[A-Z0-9]{16}$/i;
        const pivaRegex = /^\d{11}$/;
        return (cfRegex.test(value) || pivaRegex.test(value))
            ? null
            : "Il campo deve essere un codice fiscale (16 caratteri) o una partita IVA (11 cifre) valida";
    },

    min: (min: number) => (value: unknown) => {
        if (!value) {
            return "Il campo è obbligatorio";
        }
        const currentValue = +value;
        if (currentValue < min) {
            return "Il valore deve essere maggiore o uguale a " + min;
        }
        return null;
    },

    max: (max: number) => (value: unknown) => {
        if (!value) {
            return "Il campo è obbligatorio";
        }
        const currentValue = +value;
        if (currentValue > max) {
            return "Il valore deve essere minore o uguale a " + max;
        }
        return null;
    }


};


export default validators;
