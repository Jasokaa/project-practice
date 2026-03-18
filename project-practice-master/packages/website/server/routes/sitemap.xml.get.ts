import { defineEventHandler, type H3Event } from "h3";
import { products } from "../trpc/routers/products";

const getText = (args: {
	url: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}) => {
	return `<url>

      <loc>${args.url}</loc>${
		args.lastmod
			? `

      <lastmod>${args.lastmod.split("T")[0]}</lastmod>`
			: ""
	}

      <changefreq>${args.changefreq}</changefreq>

      <priority>${args.priority}</priority>

   </url>`;
};

export default defineEventHandler((event: H3Event) => {
	const config = useRuntimeConfig();

	let xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

   `;

	xml += getText({
		url: `${config.public.APP_URL}/`,
		lastmod: new Date().toISOString(),
		changefreq: "daily",
		priority: "1.0",
	});

	xml += getText({
		url: `${config.public.APP_URL}/catalog`,
		lastmod: new Date().toISOString(),
		changefreq: "daily",
		priority: "0.9",
	});

	xml += getText({
		url: `${config.public.APP_URL}/order-status`,
		lastmod: new Date().toISOString(),
		changefreq: "daily",
		priority: "0.7",
	});

	xml += getText({
		url: `${config.public.APP_URL}/delivery-faq`,
		lastmod: new Date().toISOString(),
		changefreq: "weekly",
		priority: "0.6",
	});

	for (const product of products) {
		xml += getText({
			url: `${config.public.APP_URL}/product/${product.id}`,
			lastmod: product.lastCollectionDate ?? undefined,
			changefreq: "daily",
			priority: "0.8",
		});
		xml += "\n   ";
	}

	xml += `

</urlset>`;

	return xml;
});
