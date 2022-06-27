import adapter from '@sveltejs/adapter-netlify';

export default {
  kit: {
    adapter: adapter(),
		vite: {
			server: {
				fs: {
					allow: ['static']
				}
			}
		}
  }
};