<script setup lang="ts">
const slots = useSlots();

const props = defineProps({
	value: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		required: true,
	},
	width: {
		type: [Number, String],
		default: 96,
	},
	height: {
		type: [Number, String],
		default: "[80vh]",
	},
	noPadding: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits<{
	(event: "close"): void;
}>();

const active = defineModel<boolean>({ default: false });

const opened = computed(() => active.value || props.value);

const close = () => {
	active.value = false;
	emit("close");
};
</script>
<template>
	<Transition
		enter-active-class="transition-transform duration-200 [&>.inner]:transition-transform [&>.inner]:duration-300"
		enter-from-class="opacity-0 [&>.inner]:scale-95"
		enter-to-class="opacity-100 [&>.inner]:scale-100"
		leave-active-class="transition-transform duration-150 [&>.inner]:transition-transform [&>.inner]:duration-200"
		leave-from-class="opacity-100 [&>.inner]:scale-100"
		leave-to-class="opacity-0 [&>.inner]:scale-95"
		mode="default"
	>
		<div
			v-if="opened"
			class="flex items-center justify-center p-2 fixed inset-0 z-[1600] bg-black bg-opacity-50"
			@click="close"
		>
			<div
				class="inner"
				:class="{
					'h-fit w-full md:w-fit relative overflow-y-auto pb-4 bg-white rounded-lg shadow dark:bg-gray-800 overflow-x-visible overscroll-contain': true,
					'px-4': !noPadding,
				}"
				@click.stop
			>
				<slot
					v-if="slots.header"
					name="header"
					v-bind="{ label }"
					@close="close"
				></slot>
				<AppModalHeaderBase v-else :label @close="close" />
				<slot></slot>
			</div>
		</div>
	</Transition>
</template>
