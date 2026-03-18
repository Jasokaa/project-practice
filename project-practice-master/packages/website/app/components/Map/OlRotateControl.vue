<script lang="ts" setup>
defineProps({
	rotation: {
		type: Number as PropType<number>,
		required: false,
		default: 0,
	},
});
const emit = defineEmits<{
	(event: "update:rotation", value: number): void;
}>();

const root = useTemplateRef("root");

defineExpose({ root });
</script>
<template>
	<div
		ref="root"
		class="w-6 md:w-12 h-auto flex aspect-square absolute top-[0.5rem] right-[2.5rem] p-1 z-10 text-primary-800"
		@click="emit('update:rotation', 0)"
	>
		<img
			:style="`transform: rotate(${rotation * (180 / Math.PI)}deg);`"
			src="~/assets/icons/north-arrow.png"
			alt="North arrow"
		/>
	</div>
</template>
