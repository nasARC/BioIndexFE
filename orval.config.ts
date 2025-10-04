import { defineConfig } from 'orval';

export default defineConfig({
  evo: {
    output: {
      mode: 'split',
      target: 'lib/api/',
      mock: false, // enable/disable test mock generation
      client: 'axios',
      prettier: true, // recommended if you use prettier
      clean: true, // recreate the whole folder (avoid outdated files)
    },
    input: {  
      // use your own Swagger url: http://server:port/context-path/v3/api-docs
      target: 'http://188.132.237.73:8000/v3/api-docs',
    },
  },
});