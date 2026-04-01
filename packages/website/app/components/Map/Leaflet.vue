<script setup lang="ts">
import type {
	Feature,
	FeatureCollection,
	MultiPolygon,
	Point,
	Position,
} from "geojson";
import { bbox, centerOfMass } from "@turf/turf";
import L from "leaflet";
import "~/libs/Leaflet.Measure/src/leaflet.measure";
globalThis.L = L;
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";
import "vue-leaflet-markercluster/dist/style.css";
import { WMS } from "./index.vue";

// https://github.com/vue-leaflet/vue-leaflet/issues/100#issuecomment-786312796
const localePath = useLocalePath();

const props = defineProps({
	tooltip: {
		type: Boolean,
		default: true,
	},
	focusField: {
		type: Number as PropType<number | null>,
		default: null,
	},
	minZoomForFields: {
		type: Number,
		default: 13,
	},
	points: {
		type: Array as PropType<Array<Feature>>,
		required: false,
	},
	ruler: {
		type: Boolean,
		default: true,
	},
	markers: {
		type: Boolean,
		default: true,
	},
	geojson: {
		type: Object as PropType<FeatureCollection | null>,
		default: null,
	},
	wmss: {
		type: Array as PropType<WMS[]>,
		default: [],
	},
	zIndex: {
		type: Number,
		default: 1,
	},
});
const emit = defineEmits<{
	(e: "elementClicked", id: number): void;
}>();

const map = useTemplateRef("map");
const isMapReady = ref(false);
const zoom = ref(14);
const bboxCords = ref<[[number, number], [number, number]]>([
	[0, 0],
	[0, 0],
]);

const zoomAllowsBoundaries = computed(
	() => zoom.value >= props.minZoomForFields || !props.markers
);

const datageoMixed = computed(
	() =>
		({
			type: "FeatureCollection",
			features: [...(props.geojson?.features ?? []), ...(props.points ?? [])],
		} as FeatureCollection)
);
const datageo = computed(() => {
	if (!datageoMixed.value) return null;
	return {
		type: "FeatureCollection",
		features: datageoMixed.value.features.filter(
			(e) => e.geometry.type !== "Point" || e.properties?.persistentLabel
		),
	} satisfies FeatureCollection<Point | MultiPolygon>;
});
const geometriesLayers = computed(() => {
	const layers = new Map<number, Feature[]>();

	datageo.value.features.forEach((feature) => {
		if (
			feature.geometry.type === "Point" &&
			!feature.properties?.persistentLabel
		) {
			return;
		}
		const zIndex = feature.properties?.zIndex ?? 1;
		if (!layers.has(zIndex)) {
			layers.set(zIndex, []);
		}
		layers.get(zIndex)?.push(feature);
	});

	return Array.from(layers.entries()).sort((a, b) => a[0] - b[0]);
});
const datageoPoints = computed(() => {
	if (!datageoMixed.value?.features?.length) return [];
	return datageoMixed.value.features
		.filter((e) => e.geometry.type === "Point")
		.map((e) => ({
			...e,
			geometry: {
				...e.geometry,
				coordinates: [...e.geometry.coordinates].reverse() as [number, number],
			},
		})) as Feature<Point>[];
});
const markers = computed(() => {
	if (!props.markers) return [];

	const markers: {
		field: { id: number; name: string; number?: string; [key: string]: any };
		coordinates: [number, number];
	}[] = [];
	// const markers =
	// 	props.fields
	// 		?.filter((field) => field?.centroid_json)
	// 		.map((field) => ({
	// 			field: { ...field },
	// 			coordinates: JSON.parse(field.centroid_json).coordinates.reverse() as [
	// 				number,
	// 				number
	// 			],
	// 		})) ?? [];

	if (props.geojson?.features?.length) {
		props.geojson.features.forEach((feature) => {
			if (
				feature.properties?.type === "field" &&
				!markers.some((m) => m.field.id === feature.properties?.id)
			) {
				markers.push({
					field: { ...feature.properties },
					coordinates: centerOfMass(feature).geometry.coordinates.reverse() as [
						number,
						number
					],
				});
			}
		});
	}

	return markers;
});
const persistentLabels = computed(
	() =>
		datageo.value?.features
			?.filter((f) => f.properties?.persistentLabel)
			.map((f) => {
				if (!f.properties?.persistentLabel) return null;
				return {
					position: centerOfMass(f).geometry.coordinates,
					label: f.properties?.label,
				};
			})
			.filter((e) => !!e) ?? []
);

watch(
	datageo,
	(newValue) => {
		if (!newValue?.features?.length) return;
		const newBounds = bbox({
			type: "FeatureCollection",
			features: newValue.features.filter(
				(f) => f.properties?.includeInCentroid !== false
			),
		});
		bboxCords.value = [
			[newBounds[1], newBounds[0]],
			[newBounds[3], newBounds[2]],
		];

		if (bboxCords.value?.[0]?.[0] !== Infinity) {
			map.value?.leafletObject?.fitBounds(bboxCords.value);
		}
	},
	{ immediate: true, deep: true }
);
watch(
	() => props.focusField,
	(newValue) => {
		console.log("focusField watch");
		return;
		if (newValue === null) {
			if (!datageo.value) return;
			const newBounds = bbox(datageo.value);
			bboxCords.value = [
				[newBounds[1], newBounds[0]],
				[newBounds[3], newBounds[2]],
			];
			if (bboxCords.value?.[0]?.[0] !== Infinity) {
				map.value?.leafletObject?.fitBounds(bboxCords.value);
			}
		} else if (typeof newValue === "number") {
			const field = props.fields?.find((field) => field.id === newValue);
			if (!field) {
				return;
			}
			const newBounds = bbox({
				type: "FeatureCollection",
				features: [
					{
						type: "Feature",
						properties: {
							id: field.id,
							name: field.name,
							popupContent: `Name:${field.name || "-no name-"}<br>Number:${
								field.number || "-no number-"
							}<br><a href="${localePath(
								`/fields/${field.id}/edit`
							)}">Edit</a>`,
							LABEL: field.name,
						},
						geometry: JSON.parse(field.coords_json) as {
							coordinates: Position[][][];
							type: "MultiPolygon";
						},
					},
				],
			});
			bboxCords.value = [
				[newBounds[1], newBounds[0]],
				[newBounds[3], newBounds[2]],
			];
			if (bboxCords.value?.[0]?.[0] !== Infinity) {
				map.value?.leafletObject?.fitBounds(bboxCords.value);
			}
		} else {
			console.warn("Invalid focusField value", newValue);
		}
	}
);

function onMapReady() {
	isMapReady.value = true;
	if (datageo.value?.features?.length && bboxCords.value?.[0]?.[0] !== Infinity)
		map.value?.leafletObject?.fitBounds(bboxCords.value);

	if (props.ruler) {
		L.control
			.measure({
				position: "topleft",
			})
			.addTo(map.value?.leafletObject);
	}
}

const geojsonOptions = { onEachFeature: leafletOnEachFeature(props.tooltip) };
</script>
<template>
	<div class="w-full h-full">
		<LMap
			ref="map"
			:center="[51.163375, 10.447683]"
			:zoom="14"
			:use-global-leaflet="true"
			:style="{
				'z-index': zIndex,
			}"
			@ready="onMapReady"
			@update:zoom="zoom = $event"
		>
			<LControlLayers position="topright"></LControlLayers>
			<LControlScale :imperial="false" />
			<!-- TODO: internationalize -->
			<LTileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
				layer-type="base"
				name="OpenStreetMap"
			/>
			<template v-for="wms in wmss" :key="wms.name">
				<LTileLayer
					v-if="wms.type === 'xyz'"
					:name="wms.name"
					:layer-type="wms.layerType"
					:url="wms.urlLeaflet || wms.url"
					:attribution="wms.attribution"
					:visible="wms.visible"
				/>
				<LWmsTileLayer
					v-if="wms.type === 'wms'"
					:name="wms.name"
					:layer-type="wms.layerType"
					:url="wms.urlLeaflet || wms.url"
					:attribution="wms.attribution"
					:layers="wms.layers"
					:params="wms.params"
					:extent="wms.extent"
					:visible="wms.visible"
					:transparent="wms.transparent"
					:format="wms.format"
				/>
			</template>

			<template v-if="isMapReady">
				<LMarker
					v-for="label in persistentLabels"
					:key="label.position.join('-')"
					:lat-lng="label.position.reverse()"
				>
					<LIcon class-name="leaflet-persistent-label">
						<!-- p-2 bg-white rounded-lg shadow-md -->
						<div>
							{{ label.label }}
						</div>
					</LIcon>
				</LMarker>
			</template>

			<LMarkerClusterGroup v-if="!zoomAllowsBoundaries">
				<LMarker
					v-for="marker in markers"
					:key="marker.field.id"
					:lat-lng="marker.coordinates"
				>
					<LPopup>
						<div>
							<h2>{{ marker.field.name }}</h2>
							<p>{{ marker.field.number }}</p>
							<NuxtLink :to="localePath(`/fields/${marker.field.id}/edit`)">
								Edit
							</NuxtLink>
						</div>
					</LPopup>
				</LMarker>
			</LMarkerClusterGroup>

			<LCircle
				v-for="point in datageoPoints"
				:lat-lng="point.geometry.coordinates"
				:radius="1"
				color="red"
			/>

			<template v-if="zoomAllowsBoundaries">
				<LGeoJson
					v-for="[zIndex, geojson] in geometriesLayers"
					:geojson
					:options="geojsonOptions"
					@click="
						emit(
							'elementClicked',
							$event?.propagatedFrom?.feature?.properties?.id
						)
					"
				/>
			</template>
		</LMap>
	</div>
</template>
<style>
@import "@/libs/Leaflet.Measure/src/leaflet.measure.css";

.leaflet-persistent-label {
	text-align: center;
	width: auto !important;
	height: auto !important;
	margin: 0 !important;
}
</style>
