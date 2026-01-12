// Article page module
const Article = (() => {
    const ARTICLES_PATH = 'articles';

    // DOM elements
    const elements = {
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        content: document.getElementById('article-content'),
        title: document.getElementById('article-title'),
        excerpt: document.getElementById('article-excerpt'),
        date: document.getElementById('date-text'),
        tags: document.getElementById('article-tags'),
        body: document.getElementById('article-body')
    };

    // Get slug from URL
    function getSlugFromURL() {
        return new URLSearchParams(window.location.search).get('slug');
    }

    // Fetch article content
    async function fetchContent(slug) {
        // Check cache first
        const cacheKey = `article_${slug}`;
        const cached = Utils.Cache.get(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${ARTICLES_PATH}/${slug}.md`);
        if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`);

        const content = await response.text();
        Utils.Cache.set(cacheKey, content, 30); // Cache for 30 minutes
        return content;
    }

    // Configure marked options
    function configureMarked() {
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false
        });
    }

    // Show loading state
    function showLoading() {
        elements.loading.classList.remove('hidden');
        elements.error.classList.add('hidden');
        elements.content.classList.add('hidden');
    }

    // Show error state
    function showError() {
        elements.loading.classList.add('hidden');
        elements.error.classList.remove('hidden');
        elements.content.classList.add('hidden');
    }

    // Update SEO meta tags
    function updateMeta(frontmatter) {
        const title = frontmatter.title || 'Article';
        const excerpt = frontmatter.excerpt || '';
        const ogImage = frontmatter.og_image || 'images/og/default.jpg';
        const baseUrl = 'https://traces.sunnydubey.in';
        const fullImageUrl = `${baseUrl}/${ogImage}`;

        // Update page title
        document.title = `${title} | Blog`;

        // Update or create meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = excerpt;

        // Update Open Graph tags
        updateOGTag('og:title', title);
        updateOGTag('og:description', excerpt);
        updateOGTag('og:type', 'article');
        updateOGTag('og:url', window.location.href);
        updateOGTag('og:image', fullImageUrl);
        updateOGTag('og:image:width', '1200');
        updateOGTag('og:image:height', '630');

        // Update Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', excerpt);
        updateMetaTag('twitter:image', fullImageUrl);
    }

    function updateOGTag(property, content) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    function updateMetaTag(name, content) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    // Render article
    function render(content, slug) {
        elements.loading.classList.add('hidden');
        elements.error.classList.add('hidden');
        elements.content.classList.remove('hidden');

        const { frontmatter, body } = Utils.parseFrontmatter(content);

        // Update SEO
        updateMeta(frontmatter);

        // Title
        elements.title.textContent = frontmatter.title || 'Untitled';

        // Excerpt
        if (frontmatter.excerpt) {
            elements.excerpt.textContent = frontmatter.excerpt;
            elements.excerpt.classList.remove('hidden');
        } else {
            elements.excerpt.classList.add('hidden');
        }

        // Date and read time
        const metaParts = [];
        if (frontmatter.date) metaParts.push(Utils.formatDateLong(frontmatter.date));
        if (frontmatter.readTime) metaParts.push(`${frontmatter.readTime} min read`);
        elements.date.textContent = metaParts.join(' · ');

        // Tags
        const tags = frontmatter.Tags || frontmatter.tags || [];
        if (tags.length > 0) {
            elements.tags.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
            elements.tags.classList.remove('hidden');
        } else {
            elements.tags.classList.add('hidden');
        }

        // Body
        elements.body.innerHTML = marked.parse(body);

        // Setup share buttons
        setupShareButton(slug, frontmatter.title || 'Check out this article');
    }

    // Setup share buttons functionality
    function setupShareButton(slug, title) {
        const shareBtn = document.getElementById('share-btn');
        const twitterBtn = document.getElementById('share-twitter');
        const shareUrl = `https://traces.sunnydubey.in/${slug}.html`;

        // Copy link button
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    const span = shareBtn.querySelector('span');
                    const originalText = span.textContent;
                    span.textContent = 'Copied!';
                    setTimeout(() => {
                        span.textContent = originalText;
                    }, 2000);
                } catch (err) {
                    prompt('Copy this link:', shareUrl);
                }
            });
        }

        // Twitter/X share button
        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => {
                const tweetText = encodeURIComponent(title);
                const tweetUrl = encodeURIComponent(shareUrl);
                window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank', 'width=550,height=420');
            });
        }
    }

    // Initialize
    async function init() {
        const slug = getSlugFromURL();

        if (!slug) {
            window.location.href = 'index.html';
            return;
        }

        showLoading();
        configureMarked();

        try {
            const content = await fetchContent(slug);
            render(content, slug);
        } catch (error) {
            console.error('Error loading article:', error);
            showError();
        }
    }

    return { init };
})();

// Start the app
Article.init();
