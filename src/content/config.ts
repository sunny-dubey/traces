import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        date: z.coerce.date(),
        readTime: z.number().optional(),
        tags: z.array(z.string()).optional().default([]),
        public: z.union([z.boolean(), z.string()]).optional().default(true),
        og_image: z.string().optional(),
    }),
});

export const collections = { blog };
