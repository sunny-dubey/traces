// Articles module
const Articles = (() => {
    const ARTICLES_PATH = 'articles';
    const CACHE_KEY = 'articles_list';

    // DOM elements
    const elements = {
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        articles: document.getElementById('articles'),
        empty: document.getElementById('empty')
    };

    // Fetch article list from manifest
    async function fetchList() {
        const response = await fetch(`${ARTICLES_PATH}/manifest.json`);
        if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.status}`);
        const manifest = await response.json();
        return manifest.articles;
    }

    // Fetch single article content
    async function fetchContent(filename) {
        const response = await fetch(`${ARTICLES_PATH}/${filename}`);
        if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`);
        return response.text();
    }

    // Create article card element
    function createCard(article, index) {
        const card = document.createElement('a');
        card.href = `article.html?slug=${article.slug}`;
        card.className = 'article-card fade-in';
        card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        card.setAttribute('role', 'listitem');

        const tagsHtml = article.tags?.length
            ? `<div class="article-tags">${article.tags.map(tag => `<span role="listitem">${tag}</span>`).join('')}</div>`
            : '';

        const metaParts = [];
        if (article.date) metaParts.push(article.date);
        if (article.readTime) metaParts.push(`<span class="read-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>${article.readTime} min</span>`);
        const metaHtml = metaParts.length
            ? `<div class="article-meta">${metaParts.join(' · ')}</div>`
            : '';

        card.innerHTML = `
            ${tagsHtml}
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            ${metaHtml}
        `;

        return card;
    }

    // Show loading state
    function showLoading() {
        elements.loading.classList.remove('hidden');
        elements.error.classList.add('hidden');
        elements.articles.classList.add('hidden');
        elements.empty.classList.add('hidden');
    }

    // Show error state
    function showError() {
        elements.loading.classList.add('hidden');
        elements.error.classList.remove('hidden');
        elements.articles.classList.add('hidden');
        elements.empty.classList.add('hidden');
    }

    // Render articles
    function render(articles) {
        elements.loading.classList.add('hidden');
        elements.error.classList.add('hidden');

        const publicArticles = articles
            .filter(a => a.isPublic !== 'false' && a.isPublic !== false)
            .sort((a, b) => {
                if (!a.rawDate) return 1;
                if (!b.rawDate) return -1;
                return new Date(b.rawDate) - new Date(a.rawDate);
            });

        if (publicArticles.length === 0) {
            elements.empty.classList.remove('hidden');
            elements.articles.classList.add('hidden');
            return;
        }

        elements.articles.classList.remove('hidden');
        elements.articles.innerHTML = '';
        publicArticles.forEach((article, index) => {
            elements.articles.appendChild(createCard(article, index));
        });
    }

    // Initialize
    async function init() {
        showLoading();

        // Check cache first
        const cached = Utils.Cache.get(CACHE_KEY);
        if (cached) {
            render(cached);
            return;
        }

        try {
            const filenames = await fetchList();
            const articles = await Promise.all(
                filenames.map(async (filename) => {
                    const content = await fetchContent(filename);
                    const { frontmatter } = Utils.parseFrontmatter(content);

                    return {
                        slug: filename.replace('.md', ''),
                        title: frontmatter.title || 'Untitled',
                        excerpt: frontmatter.excerpt || '',
                        rawDate: frontmatter.date || null,
                        date: Utils.formatDateShort(frontmatter.date),
                        readTime: frontmatter.readTime || null,
                        tags: frontmatter.Tags || frontmatter.tags || [],
                        isPublic: frontmatter.public
                    };
                })
            );

            // Cache for 30 minutes
            Utils.Cache.set(CACHE_KEY, articles, 30);
            render(articles);
        } catch (error) {
            console.error('Error loading articles:', error);
            showError();
        }
    }

    return { init };
})();
