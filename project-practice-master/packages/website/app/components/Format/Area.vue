<script setup lang="ts">
import { roundNumber } from "~/utils";
import { convertArea } from "~/utils/converts/area";
import { AreaUnitLabels } from "prismaclient/enums";

const { $user } = useNuxtApp();

const props = defineProps({
	value: {
		type: Number,
		required: false,
		default: null,
	},
});

const user = computed(() => $user.user.value);

const preferredAreaUnit = computed(
	() => user.value?.preferred_area_unit ?? "HECTARE"
);

const value = computed(() =>
	props.value
		? roundNumber(
				convertArea(props.value, "SQUARE_METRE", preferredAreaUnit.value)
		  )
		: null
);
const label = computed(() => AreaUnitLabels[preferredAreaUnit.value]);
</script>
<template>
	<span>{{ value }} {{ label }}</span>
</template>
