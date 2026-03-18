import type { CreateOrderInput, CreateOrderResponse, OrderStatusResponse } from "~~/shared/orders";

type StoredOrder = {
	orderCode: string;
	phoneNormalized: string;
	recipientFirstName: string;
	deliveryMethod: OrderStatusResponse["deliveryMethod"];
	total: number;
	currency: OrderStatusResponse["currency"];
	items: OrderStatusResponse["items"];
	events: OrderStatusResponse["events"];
};

const mockOrders: StoredOrder[] = [
	{
		orderCode: "JL-2026-0001",
		phoneNormalized: "380501234567",
		recipientFirstName: "Olena",
		deliveryMethod: "NOVA_POSHTA",
		total: 880,
		currency: "UAH",
		items: [
			{ name: "Classic Gummy Bears", quantity: 2, unit: "100g", lineTotal: 240 },
			{ name: "Candy Party Mix", quantity: 2, unit: "100g", lineTotal: 320 },
			{ name: "Mini Candy Box", quantity: 1, unit: "pack", lineTotal: 320 },
		],
		events: [
			{ state: "RECEIVED", at: "2026-03-01T09:12:00.000Z" },
			{ state: "CONFIRMED", at: "2026-03-01T09:28:00.000Z" },
			{ state: "PACKING", at: "2026-03-01T10:05:00.000Z" },
			{ state: "SHIPPED", at: "2026-03-01T15:40:00.000Z", note: "TTN 2045098814" },
			{ state: "DELIVERED", at: "2026-03-03T11:32:00.000Z" },
		],
	},
	{
		orderCode: "JL-2026-0002",
		phoneNormalized: "380671112233",
		recipientFirstName: "Maksym",
		deliveryMethod: "UKRPOSHTA",
		total: 280,
		currency: "UAH",
		items: [{ name: "Sour Rainbow Strips", quantity: 2, unit: "100g", lineTotal: 280 }],
		events: [
			{ state: "RECEIVED", at: "2026-03-02T08:20:00.000Z" },
			{ state: "CONFIRMED", at: "2026-03-02T08:44:00.000Z" },
			{
				state: "CANCELED",
				at: "2026-03-02T09:03:00.000Z",
				note: "Canceled by customer request",
			},
		],
	},
	{
		orderCode: "JL-2026-0003",
		phoneNormalized: "380931234500",
		recipientFirstName: "Iryna",
		deliveryMethod: "NOVA_POSHTA",
		total: 440,
		currency: "UAH",
		items: [
			{ name: "Fruit Jelly Hearts", quantity: 1, unit: "100g", lineTotal: 150 },
			{ name: "Sour Gummy Bears", quantity: 2, unit: "100g", lineTotal: 290 },
		],
		events: [
			{ state: "RECEIVED", at: "2026-03-05T12:10:00.000Z" },
			{ state: "CONFIRMED", at: "2026-03-05T12:38:00.000Z" },
			{ state: "PACKING", at: "2026-03-05T13:10:00.000Z" },
			{ state: "SHIPPED", at: "2026-03-05T17:55:00.000Z", note: "TTN 2045099901" },
		],
	},
];

export const normalizeOrderCode = (value: string) =>
	value.trim().toUpperCase();

export const normalizePhone = (value: string) => {
	const digits = value.replace(/\D/g, "");

	if (digits.length === 12 && digits.startsWith("380")) {
		return digits;
	}

	if (digits.length === 10 && digits.startsWith("0")) {
		return `38${digits}`;
	}

	if (digits.length === 9) {
		return `380${digits}`;
	}

	return digits;
};

const maskPhone = (phoneNormalized: string) => {
	if (!phoneNormalized) return "Hidden";

	const prefix = phoneNormalized.slice(0, 3);
	const suffix = phoneNormalized.slice(-2);

	return `+${prefix}******${suffix}`;
};

export const findOrderStatus = (params: {
	orderCode: string;
	phone: string;
}): OrderStatusResponse | null => {
	const normalizedCode = normalizeOrderCode(params.orderCode);
	const normalizedPhone = normalizePhone(params.phone);

	const order = mockOrders.find(
		(entry) =>
			entry.orderCode === normalizedCode &&
			entry.phoneNormalized === normalizedPhone
	);

	if (!order) return null;

	const events = [...order.events].sort(
		(a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
	);

	return {
		orderCode: order.orderCode,
		recipientFirstName: order.recipientFirstName,
		maskedPhone: maskPhone(order.phoneNormalized),
		deliveryMethod: order.deliveryMethod,
		total: order.total,
		currency: order.currency,
		currentState: events[events.length - 1]?.state ?? "RECEIVED",
		items: order.items,
		events,
	};
};

let orderCounter = mockOrders.length;

const generateOrderCode = (): string => {
	orderCounter++;
	const year = new Date().getFullYear();
	const seq = String(orderCounter).padStart(4, "0");
	return `JL-${year}-${seq}`;
};

export const createOrder = (input: CreateOrderInput): CreateOrderResponse => {
	const orderCode = generateOrderCode();
	const normalizedPhone = normalizePhone(input.phone);
	const now = new Date().toISOString();

	const items = input.items.map((item) => ({
		name: item.name,
		quantity: item.quantity,
		unit: item.unit,
		lineTotal: item.price * item.quantity,
	}));

	const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

	const newOrder: StoredOrder = {
		orderCode,
		phoneNormalized: normalizedPhone,
		recipientFirstName: input.firstName,
		deliveryMethod: input.deliveryMethod,
		total,
		currency: "UAH",
		items,
		events: [{ state: "RECEIVED", at: now }],
	};

	mockOrders.push(newOrder);

	return {
		orderCode,
		total,
		currency: "UAH",
	};
};
