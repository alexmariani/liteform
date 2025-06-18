


import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({
            entryRoot: 'src',
            outDir: 'dist/types',
            insertTypesEntry: true,
        })
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'LiteForm',
            formats: ['es', 'cjs'],
            fileName: (format) => `lite-form.${format}.js`
        },
        rollupOptions: {
            external: ['react'],
        }
    }
});
