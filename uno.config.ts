import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(), // optional: allows attribute mode
        presetIcons(),       // optional: allows `<i-heroicons-home>` style icons
    ],
    theme : {
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            black: '850',
            extraBlack: '900',
        },
    },

// @ts-ignore
    preflight: false, // prevent base styles from overwriting your CSS
});
