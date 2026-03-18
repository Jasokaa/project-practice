const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const formatDate = (dateString: string) => {
	if (!dateString) return "";
	if (dateString.length === 4 && !isNaN(Number(dateString))) {
		return `${dateString}`;
	}
	if (
		dateString.length === 7 &&
		!isNaN(Number(dateString.replace("-", "")))
	) {
		const [year, month] = dateString.split("-").map(Number) as [
			number,
			number
		];
		return `${monthNames[month - 1]} ${year}`;
	}
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

export const getStockStatus = (stock: number) => {
	if (stock > 10) return { text: "In stock", class: "text-green-600" };
	if (stock > 0)
		return { text: "Low stock", class: "text-orange-600" };
	return { text: "Out of stock", class: "text-red-600" };
};

export type ProductType =
	| "all"
	| "gummy"
	| "sour"
	| "rings"
	| "marshmallow"
	| "jelly"
	| "mix"
	| "gift-box";

export const productTypes: { value: ProductType; label: string }[] = [
	{ value: "all", label: "All candies" },
	{ value: "gummy", label: "Gummy" },
	{ value: "sour", label: "Sour" },
	{ value: "rings", label: "Rings" },
	{ value: "marshmallow", label: "Marshmallow" },
	{ value: "jelly", label: "Jelly" },
	{ value: "mix", label: "Mixes" },
	{ value: "gift-box", label: "Gift boxes" },
];