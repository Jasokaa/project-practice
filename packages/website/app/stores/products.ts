export const useProductsStore = defineStore("products", () => {
	const { $products } = useNuxtApp();

	// const productsQuery = $trpc.products.getAll.useQuery();

	const products = computed(() => $products?.value ?? []); //productsQuery.data.value || []);
	const pending = computed(() => false); // productsQuery.status.value === "pending");
	const error = computed(() => null);

	const fetchProducts = async () => {};

	const getProducts = () => products.value;

	const getFeaturedProducts = () => products.value.filter((p) => p.featured);

	const getProductById = (id: string) =>
		products.value.find((p) => p.id === id);

	const getProductsByType = (type: (typeof products.value)[number]["type"]) =>
		products.value.filter((p) => p.type === type);

	return {
		products: readonly(products),
		pending: readonly(pending),
		error: readonly(error),
		fetchProducts,
		getProducts,
		getFeaturedProducts,
		getProductById,
		getProductsByType,
	};
});
