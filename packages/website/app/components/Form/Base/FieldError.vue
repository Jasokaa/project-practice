<script lang="ts" setup>
import type { ZodIssue } from "zod";

const { t } = useI18n();

const props = defineProps({
	error: {
		type: [String, Object] as PropType<ZodIssue | string | null>,
		required: false,
		default: null,
	},
});

const errorMessage = computed(() => {
	if (!props.error) return null;
	if (typeof props.error === "string") return props.error;
	return zodI18n(props.error, t);
});
</script>
<template>
	<span v-if="errorMessage" style="color: red">
		{{ errorMessage }}
	</span>
</template>
