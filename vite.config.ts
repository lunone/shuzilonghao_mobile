import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    },
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // 忽略 Sass @import 警告
                if (warning.message.includes('Sass @import rules are deprecated')) {
                    return;
                }
                warn(warning);
            }
        }
    }
});
