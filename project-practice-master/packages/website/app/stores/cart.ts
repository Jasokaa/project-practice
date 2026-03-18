export interface CartItem {
	id: string;
	name: string;
	price: number;
	unit: string;
	quantity: number;
	image: string;
	variety: string;
}

export const useCartStore = defineStore("cart", () => {
	const { $toast } = useNuxtApp();

	const items = ref<CartItem[]>([]);
	const isLoading = ref(false);
	const cartCookie = useCookie<CartItem[]>("cart", {
		default: () => [],
	});

	// Load cart from cookies on hydration
	const loadCart = () => {
		items.value = cartCookie.value || [];
	};

	// Save cart to cookies
	const saveCart = () => {
		cartCookie.value = items.value;
	};

	// Add item to cart
	const addItem = (product: any, quantity = 1) => {
		const existingItem = items.value.find((item) => item.id === product.id);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			items.value.push({
				id: product.id,
				name: product.name,
				price: product.price,
				unit: product.unit,
				quantity,
				image: product.images[0],
				variety: product.variety,
			});
		}

		saveCart();

		$toast.success(`${product.name} added to cart`);
	};

	// Remove item from cart
	const removeItem = (productId: string) => {
		const index = items.value.findIndex((item) => item.id === productId);
		if (index > -1) {
			items.value.splice(index, 1);
			saveCart();
		}
	};

	// Update item quantity
	const updateQuantity = (productId: string, quantity: number) => {
		const item = items.value.find((item) => item.id === productId);
		if (item) {
			if (quantity <= 0) {
				removeItem(productId);
			} else {
				item.quantity = quantity;
				saveCart();
			}
		}
	};

	// Clear cart
	const clearCart = () => {
		items.value = [];
		saveCart();
	};

	// Computed properties
	const itemCount = computed(() => {
		return items.value?.length || 0;
	});

	const totalPrice = computed(() => {
		return items.value.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	});

	const isEmpty = computed(() => items.value.length === 0);

	// Get item by id
	const getItem = (productId: string) => {
		return items.value.find((item) => item.id === productId);
	};

	// Get cart summary for order message
	const getOrderSummary = () => {
		if (isEmpty.value) return "";

		const itemsList = items.value
			.map(
				(item) =>
					`${item.name} (${item.variety}) - ${item.quantity} ${item.unit} = ${item.price * item.quantity} ₴`
			)
			.join("\n");

		return `Hello! I would like to order:\n\n${itemsList}\n\nTotal: ${totalPrice.value} ₴`;
	};

	loadCart();

	return {
		items: readonly(items),
		isLoading: readonly(isLoading),
		itemCount,
		totalPrice,
		isEmpty,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		getItem,
		getOrderSummary,
		loadCart,
	};
});