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
    function createCard(article) {
        const card = document.createElement('a');
        card.href = `article.html?slug=${article.slug}`;
        card.className = 'article-card';
        card.setAttribute('role', 'listitem');

        const tagsHtml = article.tags?.length
            ? `<div class="article-tags">${article.tags.map(tag => `<span role="listitem">${tag}</span>`).join('')}</div>`
            : '';

        const metaParts = [];
        if (article.date) metaParts.push(article.date);
        if (article.readTime) metaParts.push(`${article.readTime} min read`);
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
        publicArticles.forEach(article => {
            elements.articles.appendChild(createCard(article));
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
