import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import type { ProductType } from "~/utils";

export interface Product {
	id: string;
	name: string;
	description: string;
	type: ProductType;
	variety: string | null;
	price: number;
	unit: "100g" | "pack" | "jar";
	stock: number;
	lastCollectionDate: string | null;
	images: string[];
	featured?: boolean;
}

export const products: Product[] = [
	{
		id: "1",
		name: "Classic Gummy Bears",
		description:
			"Soft and chewy gummy bears with a bright fruity taste. A candy classic for everyday snacking, sharing and sweet gift boxes.",
		type: "gummy",
		variety: "Strawberry, Orange, Lemon, Apple",
		price: 120,
		unit: "100g",
		stock: 24,
		lastCollectionDate: "2026-03-01",
		images: ["/images/classic-gummy-bears-1.jpg"],
		featured: true,
	},
	{
		id: "2",
		name: "Sour Rainbow Strips",
		description:
			"Colorful sour candy strips with a soft texture and a bright fruity punch. Sweet, tangy and perfect for people who love intense flavors.",
		type: "sour",
		variety: "Mixed Fruit",
		price: 140,
		unit: "100g",
		stock: 18,
		lastCollectionDate: "2026-03-02",
		images: ["/images/sour-rainbow-strips-1.jpg"],
		featured: true,
	},
	{
		id: "3",
		name: "Peach Rings",
		description:
			"Sweet peach-flavored gummy rings with a soft bite and sugar coating. A juicy candy favorite with a rich fruity taste.",
		type: "rings",
		variety: "Peach",
		price: 145,
		unit: "100g",
		stock: 20,
		lastCollectionDate: "2026-03-02",
		images: ["/images/peach-rings-1.jpg"],
		featured: true,
	},
	{
		id: "4",
		name: "Cola Bottles Gummies",
		description:
			"Chewy cola bottle gummies with a nostalgic fizzy-cola flavor. Great for candy mixes, movie nights and fun gifts.",
		type: "gummy",
		variety: "Cola",
		price: 135,
		unit: "100g",
		stock: 16,
		lastCollectionDate: "2026-03-03",
		images: ["/images/cola-bottles-gummies-1.jpg"],
		featured: true,
	},
	{
		id: "5",
		name: "Gummy Worms Mix",
		description:
			"A playful mix of long gummy worms in bright colors and fruity flavors. Soft, chewy and perfect for parties or candy jars.",
		type: "gummy",
		variety: "Strawberry, Apple, Blue Raspberry, Lemon",
		price: 130,
		unit: "100g",
		stock: 22,
		lastCollectionDate: "2026-03-03",
		images: ["/images/gummy-worms-mix-1.jpg"],
		featured: false,
	},
	{
		id: "6",
		name: "Marshmallow Twist",
		description:
			"Light and fluffy marshmallow twists with a soft vanilla-fruit flavor. A sweet treat for dessert boxes and gentle candy lovers.",
		type: "marshmallow",
		variety: "Vanilla Berry",
		price: 110,
		unit: "100g",
		stock: 14,
		lastCollectionDate: "2026-03-01",
		images: ["/images/marshmallow-twist-1.jpg"],
		featured: false,
	},
	{
		id: "7",
		name: "Fruit Jelly Hearts",
		description:
			"Soft jelly hearts with a glossy texture and fruity filling-style taste. A cute candy option for gifts, parties and sweet mood moments.",
		type: "jelly",
		variety: "Cherry, Strawberry, Raspberry",
		price: 150,
		unit: "100g",
		stock: 12,
		lastCollectionDate: "2026-03-04",
		images: ["/images/fruit-jelly-hearts-1.jpg"],
		featured: false,
	},
	{
		id: "8",
		name: "Sour Gummy Bears",
		description:
			"A tangy version of the classic gummy bear with extra sour sugar coating. Bright, juicy and made for people who like a bold candy taste.",
		type: "sour",
		variety: "Lemon, Apple, Cherry, Orange",
		price: 145,
		unit: "100g",
		stock: 19,
		lastCollectionDate: "2026-03-04",
		images: ["/images/sour-gummy-bears-1.jpg"],
		featured: false,
	},
	{
		id: "9",
		name: "Candy Party Mix",
		description:
			"A colorful mix of gummy bears, worms, rings and jelly candies in one pack. Perfect when you want a little bit of everything.",
		type: "mix",
		variety: "Assorted Flavors",
		price: 160,
		unit: "100g",
		stock: 11,
		lastCollectionDate: "2026-03-05",
		images: ["/images/candy-party-mix-1.jpg"],
		featured: true,
	},
	{
		id: "10",
		name: "Mini Candy Box",
		description:
			"A ready-to-gift candy box with a curated selection of fruity gummies and chewy sweets. A bright sweet surprise for any occasion.",
		type: "gift-box",
		variety: "Assorted Selection",
		price: 320,
		unit: "pack",
		stock: 8,
		lastCollectionDate: "2026-03-05",
		images: ["/images/mini-candy-box-1.jpg"],
		featured: true,
	},
];

export const productsRouter = router({
	getAll: publicProcedure.query(() => {
		return products;
	}),

	getFeatured: publicProcedure.query(() => {
		return products.filter((p) => p.featured);
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ input }) => {
			return products.find((p) => p.id === input.id);
		}),

	getByType: publicProcedure
		.input(
			z.object({
				type: z.enum([
					"gummy",
					"sour",
					"rings",
					"marshmallow",
					"jelly",
					"mix",
					"gift-box",
				]),
			})
		)
		.query(({ input }) => {
			return products.filter((p) => p.type === input.type);
		}),
});