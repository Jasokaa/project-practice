<template>
	<div
		v-if="datageo"
		class="w-full h-full relative"
		:class="{
			'pointer-events-none': !controls,
		}"
	>
		<LMap
			ref="map"
			:zoom
			:min-zoom="2"
			:max-zoom="16"
			:use-global-leaflet="false"
			:options="{
				zoomControl: controls,
				attributionControl: controls,
			}"
			:style="{
				'z-index': zIndex,
			}"
			@ready="refreshMapBounds"
		>
			<LTileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
				layer-type="base"
				name="OpenStreetMap"
			/>
			<template v-if="controls">
				<LControlLayers position="topright"></LControlLayers>
				<LTileLayer
					:url="`https://atlas.microsoft.com/map/tile?api-version=2.1&tilesetId=microsoft.imagery&x={x}&y={y}&zoom={z}&subscription-key=${config.public.AZURE_MAPS_SUBSCRIPTION_KEY}`"
					attribution='&copy; <a href="https://www.microsoft.com/en-us/maps/choose-your-bing-maps-api">Microsoft</a>'
					layer-type="base"
					name="Azure (Bing) aerial map"
					:visible="false"
				/>
				<LTileLayer
					url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
					layer-type="base"
					name="OpenTopoMap"
					:visible="false"
				/>
			</template>
			<LGeoJson
				v-if="shouldShowGeo"
				:geojson="datageo"
				:options="geojsonOptions"
				@click="
					emit(
						'elementClicked',
						$event?.propagatedFrom?.feature?.properties?.id
					)
				"
			/>
		</LMap>
	</div>
	<div v-else></div>
</template>
<script setup lang="ts">
import type { FeatureCollection } from "geojson";
import { bbox } from "@turf/turf";
import type { PropType } from "vue";

// https://github.com/vue-leaflet/vue-leaflet/issues/100#issuecomment-786312796
const config = useRuntimeConfig();

const props = defineProps({
	geojson: {
		type: Object as PropType<FeatureCollection | null>,
		required: false,
	},
	tooltip: {
		type: Boolean,
		default: false,
	},
	controls: {
		type: Boolean,
		default: false,
	},
	zIndex: {
		type: Number,
		default: 0,
	},
});
const emit = defineEmits<{
	(event: "elementClicked", id: number): void;
}>();

const map = useTemplateRef("map");
const shouldShowGeo = ref(false);
const zoom = ref(14);

const datageo = computed(
	() =>
		({
			type: "FeatureCollection",
			features: props.geojson?.features?.filter((e) => !!e) ?? [],
		} satisfies FeatureCollection)
);

const bboxCords = computed(() => bbox(datageo.value));

const applyControls = (newVal: boolean) => {
	if (newVal) {
		map.value?.leafletObject?.dragging.enable();
		map.value?.leafletObject?.touchZoom.enable();
		map.value?.leafletObject?.doubleClickZoom.enable();
		map.value?.leafletObject?.scrollWheelZoom.enable();
		map.value?.leafletObject?.boxZoom.enable();
		map.value?.leafletObject?.keyboard.enable();
		if (map.value?.leafletObject?.tap) map.value.leafletObject.tap.enable();
		// document.getElementById("map")?.style.cursor = "grab";
	} else {
		map.value?.leafletObject?.dragging.disable();
		map.value?.leafletObject?.touchZoom.disable();
		map.value?.leafletObject?.doubleClickZoom.disable();
		map.value?.leafletObject?.scrollWheelZoom.disable();
		map.value?.leafletObject?.boxZoom.disable();
		map.value?.leafletObject?.keyboard.disable();
		if (map.value?.leafletObject?.tap) map.value.leafletObject.tap.disable();
		// document.getElementById("map").style.cursor = "default";
	}
};
watch(() => props.controls, applyControls, {
	immediate: true,
});

const refreshMapBounds = () => {
	applyControls(props.controls);
	shouldShowGeo.value = true;
	if (datageo.value.features.length)
		map.value?.leafletObject?.fitBounds([
			[bboxCords.value[1], bboxCords.value[0]],
			[bboxCords.value[3], bboxCords.value[2]],
		]);
};
watch(datageo, refreshMapBounds, { immediate: true });
const geojsonOptions = {
	onEachFeature: leafletOnEachFeature({
		popupEnabled: props.tooltip,
		tooltipEnabled: props.tooltip,
	}),
};
</script>
<style lang="scss" scoped>
.pointer-events-none * {
	pointer-events: none;
}
</style>
