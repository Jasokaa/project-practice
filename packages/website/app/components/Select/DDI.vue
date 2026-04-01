<template>
	<AppSelectSingle :options searchable :filter-function />
</template>
<script setup lang="ts">
import DDEntities from "isoxml/dist_es/DDEntities.js";

const options = Object.values(DDEntities).map((definition) => ({
	label: `${definition.name} (${definition.unit}) (${definition.DDI})`,
	value: definition.DDI,
	unit: definition.unit || "",
	scale: definition.bitResolution || 1,
}));

const filterFunction = (
	search: string,
	option: { label: string; value: string | number | null }
) => {
	if (!search) return true;
	let searchLower = search.toLowerCase();

	// ^2 -> ²
	Object.entries(SuperscriptMapping).forEach(([key, value]) => {
		searchLower = searchLower.replaceAll(`^${key}`, value);
	});

	return option.label.toLowerCase().includes(searchLower);
};
</script>
