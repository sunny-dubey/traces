import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://traces.sunnydubey.in',
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark-dimmed',
            },
            wrap: true,
        },
    },
    build: {
        format: 'directory',
    },
});
