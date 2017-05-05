import rollupConfig from './rollup.base.config';

const minify = (process.env.ROLLUP_MINIFY === 'true') || false;
const format = process.env.ROLLUP_FORMAT || 'umd';

const config = rollupConfig(format, minify);

export default config;
