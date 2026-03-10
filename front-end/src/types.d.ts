declare module "*.css?url" {
	const href: string;
	export default href;
}

declare module "*.png" {
	const src: string;
	export default src;
}
