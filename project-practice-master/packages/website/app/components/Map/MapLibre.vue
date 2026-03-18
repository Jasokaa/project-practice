<script setup lang="ts">
import type { Feature, FeatureCollection, Point } from "geojson";
import type { LineLayerSpecification, StyleSpecification } from "maplibre-gl";
import type { WMS } from "./index.vue";
import { bbox, centerOfMass } from "@turf/turf";

const style2: StyleSpecification = {
	version: 8,
	glyphs: "/fonts/{fontstack}/{range}.pbf",
	sources: {
		osm: {
			type: "raster",
			tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
			tileSize: 256,
			attribution: "&copy; OpenStreetMap Contributors",
			maxzoom: 19,
		},
	},
	layers: [
		{
			id: "osm",
			type: "raster",
			source: "osm", // This must match the source key above
		},
	],
};

const localePath = useLocalePath();
const map = useMglMap();

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
});

// let isInitialZoomAnimation = true;
const isInitialZoomAnimation = ref(true);
const zoom = ref(14);
const bboxCords = ref<[[number, number], [number, number]]>([
	[0, 0],
	[0, 0],
]);

const zoomAllowsBoundaries = computed(
	() => zoom.value >= props.minZoomForFields || !props.markers
);

const datageo = computed(() => {
	if (!props.geojson) return null;
	return {
		type: "FeatureCollection",
		features: props.geojson.features
			.filter(
				(e) => e.geometry.type !== "Point" || e.properties?.persistentLabel
			)
			.map((e) => ({
				...e,
				properties: {
					...e.properties,
					stroke: e.properties?.stroke || "#00000000",
					background: e.properties?.background || "#00000000",
				},
			})),
	};
});
const datageoPoints = computed(() => {
	if (!props.geojson?.features?.length) return [];
	return props.geojson.features
		.filter((e) => e.geometry.type === "Point")
		.map((e) => ({
			...e,
			geometry: {
				...e.geometry,
				coordinates: [...e.geometry.coordinates] as [number, number],
			},
		})) as Feature<Point>[];
});
const markers = computed(() => {
	if (!props.markers) return [];

	const markers = [];

	if (props.geojson?.features?.length) {
		props.geojson.features.forEach((feature) => {
			if (
				feature.properties?.type === "field" &&
				!markers.some((m) => m.field.id === feature.properties?.id)
			) {
				markers.push({
					field: { ...feature.properties },
					coordinates: centerOfMass(feature).geometry.coordinates as [
						number,
						number
					],
				});
			}
		});
	}

	return markers;
});
const markersGeojson = computed(() => {
	if (!markers.value?.length)
		return {
			type: "FeatureCollection",
			features: [],
		};
	return {
		type: "FeatureCollection",
		features: markers.value.map(
			(marker) =>
				({
					type: "Feature",
					properties: {
						id: marker.field.id,
						name: marker.field.name,
						popupContent: `Name:${marker.field.name || "-no name-"}<br>Number:${
							marker.field.number || "-no number-"
						}<br><a href="${localePath(
							`/fields/${marker.field.id}/edit`
						)}">Edit</a>`,
						LABEL: marker.field.name,
					},
					geometry: {
						type: "Point",
						coordinates: marker.coordinates,
					},
				} as Feature<Point>)
		),
	};
});
const persistentLabels = computed(
	() =>
		({
			type: "FeatureCollection",
			features:
				props.geojson?.features
					?.filter((f) => f.properties?.persistentLabel)
					.map((f) => {
						if (!f.properties?.persistentLabel) return null;
						return {
							type: "Feature",
							properties: {
								label: f.properties?.label,
							},
							geometry: {
								type: "Point",
								coordinates: centerOfMass(f).geometry.coordinates,
							},
						};
					})
					.filter((e) => !!e) ?? [],
		} as FeatureCollection)
);

watch(
	datageo,
	(newValue) => {
		if (!newValue?.features?.length) return;
		const newBounds = bbox(newValue);
		bboxCords.value = [
			[newBounds[0], newBounds[1]],
			[newBounds[2], newBounds[3]],
		];
	},
	{ immediate: true, deep: true }
);
const fitBounds = () => {
	if (map.map && bboxCords.value?.[0]?.[0] !== Infinity) {
		map.map.fitBounds(bboxCords.value, {
			padding: 80,
			linear: isInitialZoomAnimation.value ? undefined : true,
			animate: !isInitialZoomAnimation.value,
			duration: isInitialZoomAnimation.value ? 0 : 200,
		});
		isInitialZoomAnimation.value = false;
	}
};
watch(bboxCords, fitBounds, {
	immediate: true,
	deep: true,
});

const mapLoaded = () => {
	fitBounds();

	return;

	// inspect a cluster on click
	map.map.on("click", "clusters", async (e) => {
		const features = map.map.queryRenderedFeatures(e.point, {
			layers: ["clusters"],
		});
		const clusterId = features[0].properties.cluster_id;
		const zoom = await map.map
			.getSource("markers")
			.getClusterExpansionZoom(clusterId);
		map.map.easeTo({
			center: features[0].geometry.coordinates,
			zoom,
		});
	});
};
</script>
<template>
	<div class="w-full h-full">
		<MglMap
			:map-style="style2"
			:center="[10.447683, 51.163375]"
			:zoom="9"
			@map:zoom="zoom = map.map.getZoom()"
			@map:load="mapLoaded"
		>
			<MglAttributionControl />
			<MglNavigationControl />
			<MglScaleControl />
			<MglGeoJsonSource
				v-if="zoomAllowsBoundaries && datageo?.features?.length"
				source-id="geojson-source"
				:data="datageo"
			>
				<MglLineLayer
					layer-id="geojson-source"
					:paint="{
						'line-color': ['get', 'stroke'],
						'line-width': 2,
					} as LineLayerSpecification['paint']
					"
					:layout="{
					'line-join': 'round',
					'line-cap' : 'round'
				} as LineLayerSpecification['layout']
				"
					@mouseenter="console.log"
				/>
				<MglFillLayer
					layer-id="geojson-source-fill"
					:paint="{
						'fill-color': ['get', 'background'],
						'fill-opacity': 0.5,
					}"
					:layout="{
						'fill-sort-key': ['get', 'zIndex'],
					}"
					@mouseenter="console.log"
				/>
			</MglGeoJsonSource>

			<MglGeoJsonSource
				v-if="markersGeojson?.features?.length"
				source-id="markers"
				:data="markersGeojson"
				:cluster="true"
				:cluster-max-zoom="14"
				:cluster-radius="50"
			>
				<MglCircleLayer
					layer-id="markers-clusters"
					source-id="markers"
					:filter="['has', 'point_count']"
					:paint="{
						'circle-color': [
							'step',
							['get', 'point_count'],
							'#51bbd6',
							5,
							'#f1f075',
							20,
							'#f28cb1',
						],
						'circle-radius': [
							'step',
							['get', 'point_count'],
							20,
							100,
							30,
							750,
							40,
						],
					}"
				/>
				<MglSymbolLayer
					layer-id="markers-cluster-count"
					source-id="markers"
					:filter="['has', 'point_count']"
					:layout="{
						'text-field': '{point_count_abbreviated}',
						'text-font': ['Open Sans Regular'],
						'text-size': 12,
					}"
				/>
				<MglSymbolLayer
					layer-id="markers-unclustered-point"
					source-id="markers"
					:filter="['!', ['has', 'point_count']]"
					:layout="{
						'text-field': '{LABEL}',
						'text-font': ['Open Sans Regular'],
						'text-size': 12,
					}"
				/>
			</MglGeoJsonSource>

			<MglGeoJsonSource
				source-id="persistent-labels-source"
				:data="persistentLabels"
			>
				<MglSymbolLayer
					layer-id="persistent-labels"
					source-id="persistent-labels-source"
					:layout="{
						'text-field': ['get', 'label'],
						'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
						'text-radial-offset': 0.5,
						'text-justify': 'auto',
						'icon-image': ['concat', ['get', 'icon'], '_15'],
						'text-font': ['Open Sans Regular'],
					}"
				/>
			</MglGeoJsonSource>

			<!-- <mgl-marker :coordinates="bboxCords[0]" color="#cc0000" :scale="0.5" />
			<mgl-marker :coordinates="bboxCords[1]" color="#cc0000" :scale="0.5" /> -->
		</MglMap>
	</div>
</template>
