export const ORDER_STATES = [
	"RECEIVED",
	"CONFIRMED",
	"PACKING",
	"SHIPPED",
	"DELIVERED",
	"CANCELED",
] as const;

export type OrderState = (typeof ORDER_STATES)[number];

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
	RECEIVED: "Order received",
	CONFIRMED: "Order confirmed",
	PACKING: "Packing",
	SHIPPED: "Shipped",
	DELIVERED: "Delivered",
	CANCELED: "Canceled",
};

export const FINAL_ORDER_STATES: OrderState[] = ["DELIVERED", "CANCELED"];

export type DeliveryMethod = "NOVA_POSHTA" | "UKRPOSHTA" | "PICKUP";

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
	NOVA_POSHTA: "Nova Poshta",
	UKRPOSHTA: "Ukrposhta",
	PICKUP: "Store pickup",
};

export type OrderStatusEvent = {
	state: OrderState;
	at: string;
	note?: string;
};

export type OrderStatusItem = {
	name: string;
	quantity: number;
	unit: string;
	lineTotal: number;
};

export type OrderStatusResponse = {
	orderCode: string;
	recipientFirstName: string;
	maskedPhone: string;
	deliveryMethod: DeliveryMethod;
	total: number;
	currency: "UAH";
	currentState: OrderState;
	events: OrderStatusEvent[];
	items: OrderStatusItem[];
};

export type CreateOrderItem = {
	productId: string;
	name: string;
	quantity: number;
	unit: string;
	price: number;
};

export type CreateOrderInput = {
	firstName: string;
	phone: string;
	deliveryMethod: DeliveryMethod;
	deliveryAddress: string;
	items: CreateOrderItem[];
};

export type CreateOrderResponse = {
	orderCode: string;
	total: number;
	currency: "UAH";
};
