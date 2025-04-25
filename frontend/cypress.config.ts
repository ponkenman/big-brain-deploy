import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
