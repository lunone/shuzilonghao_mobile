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
    define: {
        API_BASE_URL: JSON.stringify(
            process.env.NODE_ENV === 'production'
                ? 'https://app.airlonghao.com/sz'
                : 'http://127.0.0.1:7004'
        )
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
            scss: {
                silenceDeprecations: ['global-builtin', 'import', 'color-functions', 'legacy-js-api']
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
                // 忽略 Sass 全局内置函数弃用警告
                if (warning.message.includes('Global built-in functions are deprecated')) {
                    return;
                }
                // 忽略 nth() 函数弃用警告
                if (warning.message.includes('Use list.nth instead')) {
                    return;
                }
                // 忽略 unquote() 函数弃用警告
                if (warning.message.includes('Use string.unquote instead')) {
                    return;
                }
                // 忽略 repetitive deprecation warnings
                if (warning.message.includes('repetitive deprecation warnings omitted')) {
                    return;
                }
                // 忽略 legacy JS API 弃用警告
                if (warning.message.includes('The legacy JS API is deprecated')) {
                    return;
                }
                // 忽略 legacy-js-api 警告
                if (warning.message.includes('legacy-js-api')) {
                    return;
                }
                warn(warning);
            }
        }
    }
});
