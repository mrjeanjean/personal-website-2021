const { resolve } = require('path');

export default {
    base: '',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                error: resolve(__dirname, '404.html')
            }
        }
    }
}
