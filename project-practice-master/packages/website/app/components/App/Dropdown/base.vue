<script setup lang="ts">
const props = defineProps({
	align: {
		type: String as PropType<"left" | "center" | "right">,
		default: "right",
	},
	fullWidth: {
		type: Boolean,
		default: false,
	},
});

const opened = ref(false);

const alignmentClass = computed(() => ({
	"left-0": props.align === "left" && !props.fullWidth,
	"left-1/2 -translate-x-1/2": props.align === "center" && !props.fullWidth,
	"right-0": props.align === "right" && !props.fullWidth,
	"md:left-0": props.align === "left" && props.fullWidth,
	"md:left-1/2 md:-translate-x-1/2":
		props.align === "center" && props.fullWidth,
	"md:right-0": props.align === "right" && props.fullWidth,
	"start-0 md:start-auto": props.fullWidth,
	"start-auto": !props.fullWidth,
	"origin-top-left": props.align === "left",
	"origin-top": props.align === "center",
	"origin-top-right": props.align === "right",
}));
</script>
<template>
	<div :class="fullWidth ? 'md:relative' : 'relative'">
		<slot v-bind="{ toggle: () => (opened = !opened), state: opened }"></slot>
		<div
			v-if="opened"
			class="w-screen h-[100dvh] block fixed l-0 t-0 inset-0"
			@click="opened = false"
		></div>
		<Transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95"
		>
			<div
				v-if="opened"
				:class="[
					'w-screen md:w-unset max-w-screen  absolute mt-1 z-50 flex items-start justify-end',
					alignmentClass,
				]"
				@click="opened = false"
			>
				<slot
					name="modal"
					v-bind="{ toggle: () => (opened = !opened), state: opened }"
				></slot>
			</div>
		</Transition>
	</div>
</template>
