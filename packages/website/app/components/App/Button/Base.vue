<script setup lang="ts">
const props = defineProps({
	variant: {
		type: String as PropType<
			"primary" | "secondary" | "danger" | "warning" | "success"
		>,
		default: "primary",
	},
	variantType: {
		type: String as PropType<"normal" | "outline" | "transparent" | "light">,
		default: "normal",
	},
	rounded: {
		type: String as PropType<"none" | "small" | "medium" | "large">,
		default: "medium",
	},
	type: {
		type: String as PropType<"button" | "submit" | "reset">,
		default: "button",
	},
	size: {
		type: String as PropType<"small" | "medium" | "large">,
		default: "medium",
	},
	iconSize: {
		type: String as PropType<"small" | "medium" | "large">,
		default: "medium",
	},
	loading: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: [Object, Function] as PropType<Component | null>,
		default: null,
	},
	iconEnd: {
		type: [Object, Function] as PropType<Component | null>,
		default: null,
	},
	iconStart: {
		type: [Object, Function] as PropType<Component | null>,
		default: null,
	},
});

const iconSizeClass = computed(() => {
	switch (props.iconSize) {
		case "small":
			return "w-4 h-4";
		case "medium":
			return "w-6 h-6";
		case "large":
			return "w-8 h-8";
	}
});

const baseClasses = computed(() => {
	return {
		"base-spinner": props.loading == true,
		"cursor-not-allowed": props.disabled == true,
		"flex flex-row items-center justify-center font-medium text-sm focus:ring-4 focus:outline-none":
			true,

		"rounded-lg": props.rounded === "medium",
		"rounded-full": props.rounded === "large",

		"px-5 py-2.5": !props.icon && props.size == "medium",
		"px-3 py-1.5": !props.icon && props.size == "small",
		"px-7 py-4": !props.icon && props.size == "large",
		"p-2.5": props.icon && props.size == "medium",
		"p-1.5": props.icon && props.size == "small",
		"p-4": props.icon && props.size == "large",
	};
});
const colorClasses = computed(() => {
	switch (props.variant) {
		case "primary": {
			if (props.disabled || props.loading) {
				return `${
					props.variantType === "transparent"
						? "text-gray-400 bg-transparent dark:bg-transparent"
						: "text-white bg-gray-300 dark:bg-gray-700"
				}`;
			}
			switch (props.variantType) {
				case "normal":
					return "text-white bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-800 dark:focus:ring-primary-900";
				case "outline":
					return "text-primary-700 bg-gray-200 border border-primary-700 hover:bg-primary-50 focus:ring-primary-300 dark:bg-gray-700 dark:border-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800";
				case "transparent":
					return "text-primary-700 bg-transparent hover:bg-primary-50 focus:ring-primary-300 dark:text-primary-500 dark:bg-transparent dark:hover:bg-primary-900 dark:focus:ring-primary-800";
				case "light":
					return "text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-primary-300 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-primary-800";
				default:
					break;
			}
			break;
		}
		case "secondary": {
			if (props.disabled || props.loading) {
				return `text-white ${
					props.variantType === "transparent"
						? "bg-transparent dark:bg-transparent"
						: "bg-gray-300 dark:bg-gray-700"
				}`;
			}
			switch (props.variantType) {
				case "outline":
				case "normal":
					return "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600 dark:focus:ring-primary-800";
				case "transparent":
					return "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600 bg-transparent";
				case "light":
					return "text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-primary-300 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-primary-800";
				default:
					break;
			}
			break;
		}
		case "danger": {
			if (props.disabled || props.loading) {
				return `text-gray-500 ${
					props.variantType === "transparent"
						? "bg-transparent dark:bg-transparent"
						: "bg-gray-300 dark:bg-gray-700"
				}`;
			}
			switch (props.variantType) {
				case "normal":
					return "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800";
				case "outline":
					return "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900";
				case "transparent":
					return "text-red-700 bg-transparent hover:bg-red-50 focus:ring-red-300 dark:text-red-500 dark:hover:bg-red-900 dark:focus:ring-red-800";
				case "light":
					return "text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-red-300 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-red-800";
				default:
					break;
			}
			break;
		}
	}
	return "";
});
const classValues = computed(() => {
	return {
		...baseClasses.value,
		[colorClasses.value]: true,
	};
});
</script>
<template>
	<button :type :class="classValues" :disabled="disabled || loading">
		<AppLoaderBase v-if="loading" class="mr-2" />
		<div v-if="iconStart" class="mr-2">
			<component :is="iconStart" class="w-4 h-4" />
		</div>
		<slot></slot>
		<div v-if="icon">
			<component :is="icon" :class="iconSizeClass" />
		</div>
		<div v-if="iconEnd" class="ml-2">
			<component :is="iconEnd" class="w-4 h-4" />
		</div>
	</button>
</template>
