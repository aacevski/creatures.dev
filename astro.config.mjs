import { h, s } from 'hastscript'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import netlify from '@astrojs/netlify/functions'
import solidJs from '@astrojs/solid-js'
import mdx from '@astrojs/mdx'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkReadingTime from './src/utils/remark-reading-time'

// https://astro.build/config
export default defineConfig({
  site: 'https://creatures.dev',
  integrations: [tailwind(), sitemap(), solidJs(), mdx()],
  output: 'hybrid',
  adapter: netlify(),
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            class: 'font-heading',
            ariaHidden: true,
            tabIndex: -1,
          },
        },
      ],
    ],
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
  },
  experimental: {
    assets: true,
  },
  vite: {
    plugins: [rawFonts(['.ttf'])],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
})
export function rawFonts(ext) {
  return {
    name: 'vite-plugin-raw-fonts',
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id)
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        }
      }
    },
  }
}
