import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
import { providePrimeNG } from 'primeng/config';

/**
 * PrimeNG >= 18 không còn file CSS theme (bootstrap4-light-blue/theme.css).
 * Dùng preset Lara (kế thừa từ các theme bootstrap cũ) với màu chủ đạo #3c8dbc của hệ thống.
 */
const AppPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '#eef6fb',
            100: '#d5e8f3',
            200: '#abd1e7',
            300: '#81badb',
            400: '#5ea6cf',
            500: '#3c8dbc',
            600: '#337aa0',
            700: '#256a92',
            800: '#214f68',
            900: '#18394b',
            950: '#0f2430'
        },
        borderRadius: {
            none: '0',
            xs: '2px',
            sm: '3px',
            md: '4px',
            lg: '4px',
            xl: '6px'
        },
        colorScheme: {
            light: {
                formField: {
                    borderColor: '#ced4da',
                    color: '#495057'
                }
            }
        }
    }
});

export const appPrimeNGProviders = providePrimeNG({
    ripple: false,
    theme: {
        preset: AppPreset,
        options: {
            darkModeSelector: false,
            // Đặt PrimeNG vào CSS layer thấp nhất để bootstrap/admin-lte/styles.scss
            // vẫn ghi đè được như khi dùng file theme.css trước đây.
            cssLayer: {
                name: 'primeng',
                order: 'primeng'
            }
        }
    }
});
