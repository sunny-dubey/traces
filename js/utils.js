// Shared utilities module
const Utils = (() => {
    // Parse YAML frontmatter from markdown content
    function parseFrontmatter(content) {
        const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const match = normalized.match(/^-{2,3}[ \t]*\n([\s\S]*?)\n-{2,3}[ \t]*\n/);

        if (!match) return { frontmatter: {}, body: normalized };

        const frontmatterStr = match[1];
        const body = normalized.slice(match[0].length);
        const frontmatter = {};

        let currentKey = null;
        let currentArray = null;

        for (const line of frontmatterStr.split('\n')) {
            if (line.match(/^[\s\t]+-\s*/)) {
                const value = line.replace(/^[\s\t]+-\s*/, '').trim();
                if (currentArray && currentKey) currentArray.push(value);
                continue;
            }

            const keyValueMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
            if (keyValueMatch) {
                const [, key, value] = keyValueMatch;
                if (value.trim() === '') {
                    currentKey = key;
                    currentArray = [];
                    frontmatter[key] = currentArray;
                } else {
                    frontmatter[key] = value.trim();
                    currentKey = null;
                    currentArray = null;
                }
            }
        }

        return { frontmatter, body };
    }

    // Format date - short format (Jan 11, 2026)
    function formatDateShort(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format date - long format (January 11, 2026)
    function formatDateLong(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Cache utilities
    const Cache = {
        set(key, data, ttlMinutes = 30) {
            const item = {
                data,
                expiry: Date.now() + (ttlMinutes * 60 * 1000)
            };
            try {
                localStorage.setItem(key, JSON.stringify(item));
            } catch (e) {
                console.warn('Cache write failed:', e);
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                if (!item) return null;

                const parsed = JSON.parse(item);
                if (Date.now() > parsed.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                return parsed.data;
            } catch (e) {
                return null;
            }
        },

        clear(key) {
            localStorage.removeItem(key);
        }
    };

    return {
        parseFrontmatter,
        formatDateShort,
        formatDateLong,
        Cache
    };
})();
