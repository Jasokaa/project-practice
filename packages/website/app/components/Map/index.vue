<script setup lang="ts">
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~~/server/trpc/routers";
import type { GuidanceLine } from "~/stores/modals/guidanceLine";
import type { Field } from "~/stores/modals/field";
import type { FeatureCollection, Position, Geometry } from "geojson";
import type {
	Block,
	MapEngine,
	Obstacle,
	Plot,
	Trial,
	TrialVariant,
} from "prismaclient";
import commonEPSGs from "@/assets/EPSG-common.json";
import dipulLayers from "@/assets/dipul-wms-capabilities.json";
import dgm200Layers from "@/assets/dgm200-wms-capabilities.json";
import type { ApplicationLineBasicWithCoordinates } from "~~/shared/types/entities/ApplicationLine";
import { captureException } from "@sentry/nuxt";

const { t } = useI18n();
const { $client, $user } = useNuxtApp();
const config = useRuntimeConfig();

export type WMS = {
	type: "wms" | "xyz";
	name: string;
	url: string;
	urlLeaflet?: string;
	layers?: string[] | string;
	attribution: string;
	projection?: string;
	extent?: [number, number, number, number];
	visible: boolean;
	zIndex?: number;
	params?: Record<string, any>;
	layerType: "base" | "overlay";
	transparent?: boolean;
	format?: string;
};

const defaultWMSs: WMS[] = [
	{
		type: "xyz",
		name: "Azure",
		attribution: "©️ Azure Maps",
		url: `https://atlas.microsoft.com/map/tile?api-version=2.1&tilesetId=microsoft.imagery&x={x}&y={y}&zoom={z}&subscription-key=${config.public.AZURE_MAPS_SUBSCRIPTION_KEY}`,
		visible: false,
		layerType: "base",
	},
	{
		type: "xyz",
		name: "Open Topo",
		attribution: "©️ Open Topo Map",
		url: `https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png`,
		urlLeaflet: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`,
		visible: false,
		layerType: "base",
	},
	{
		type: "wms",
		name: "GID-DE WMS DGM200",
		attribution: `<a href="https://www.govdata.de/dl-de/by-2-0" target="_blank">© dl-de/by-2-0</a>`,
		url: `https://sgx.geodatenzentrum.de/wms_dgm200`,
		visible: false,
		layers: dgm200Layers
			.map((l) => l.value)
			.filter((e) => ["colormap", "kontur"].includes(e))
			.join(","),
		layerType: "base",
	},
	{
		type: "wms",
		name: "DIPUL",
		attribution: `<a href="https://www.dipul.de/homepage/de/impressum/#CopyrightGeografischeGebieteDE" target="_blank">© Quelle Geodaten: DFS, BKG ${new Date().getFullYear()}</a>`,
		url: "https://uas-betrieb.de/geoservices/dipul/wms",
		layers: dipulLayers.map((l) => l.value).join(","),
		extent: [47, 5, 56, 16],
		visible: false,
		projection: "EPSG:4326",
		zIndex: 50,
		layerType: "overlay",
		transparent: true,
		format: "image/png",
	},
];

const props = defineProps({
	fields: {
		type: Array as PropType<Array<Field>>,
		required: false,
	},
	fieldsWithHeadland: {
		type: Array as PropType<Array<FeatureCollection>>,
		required: false,
	},
	points: {
		type: Array as PropType<Array<FeatureCollection>>,
		required: false,
	},
	blocks: {
		type: Array as PropType<
			Array<
				Block & {
					coords_json: string;
					Plots: Array<Plot & { coords_json: string }>;
				}
			>
		>,
		required: false,
	},
	guidanceLines: {
		type: Array as PropType<Array<GuidanceLine>>,
		required: false,
	},
	applicationLines: {
		type: Array as PropType<Array<ApplicationLineBasicWithCoordinates>>,
		required: false,
	},
	obstacles: {
		type: Array as PropType<Array<Obstacle & { coords_json: string }>>,
		required: false,
	},
	focusField: {
		type: Number as PropType<number | null>,
		default: null,
	},
	epsg: {
		type: Number,
		required: false,
	},
	engine: {
		type: String as PropType<MapEngine | null>,
		default: null,
	},
	topSelects: {
		type: Boolean,
		default: true,
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
	additionalWms: {
		type: Array as PropType<WMS[]>,
		default: null,
	},
	drawn: {
		type: Array as PropType<Array<Geometry>>,
		default: null,
	},
	drawing: {
		type: String as PropType<"LineString" | "Polygon" | "Point">,
		default: null,
	},
	drawSnap: {
		type: Boolean,
		default: true,
	},
	zIndex: {
		type: Number,
		default: 1000,
	},
	noPopup: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits<{
	(
		event: "drawend",
		data: { type: "LineString" | "Polygon" | "Point"; coordinates: Position[] }
	): void;
}>();

const engine = ref<MapEngine>(props.engine ?? "OPENLAYERS");
const userSelectedEPSG = ref<number | null>(props.epsg ?? null);
const epsgData = ref<inferRouterOutputs<AppRouter>["utils"]["EPSG"] | null>(
	null
);
const openlayersRef = useTemplateRef("openlayers");

const user = computed(() => $user.user.value);
const preferences = computed(() => ({
	showEngine: user.value?.show_map_engine_select ?? true,
	showEPSG: user.value?.show_map_engine_select ?? true,
}));
const EPSGs = computed(() => [
	3857,
	...Array.from(
		new Set([
			...(props.fields?.filter((e) => !!e?.srid_utm).map((e) => e.srid_utm) ??
				[]),
			...(props.geojson?.features
				.map((e) => e.properties?.srid_utm)
				.filter((e) => e)
				.map((e) => parseInt(e)) ?? []),
		])
	),
]);
const epsg = computed(
	() => props.epsg ?? userSelectedEPSG.value ?? EPSGs.value[0] ?? 3857
);
const userSelectedEPSGComputed = computed({
	get: () => epsg.value,
	set: (val: number | null) => {
		userSelectedEPSG.value = val;
	},
});
const WMSs = computed(() => {
	const wms = defaultWMSs.concat(props.additionalWms ?? []);
	return wms.map((wms, index) => ({
		...wms,
		enabled: wms.enabled ?? index === 0,
	}));
});

const proj4String = computed(() => epsgData.value?.proj4 ?? null);

watch(EPSGs, (newVal) => {
	if (newVal && !newVal.includes(userSelectedEPSG.value)) {
		userSelectedEPSG.value = null;
	}
});

watch(
	epsg,
	(newVal) => {
		if (!newVal) {
			epsgData.value = null;
			return;
		}

		if (commonEPSGs[newVal.toString() as keyof typeof commonEPSGs]) {
			epsgData.value =
				commonEPSGs[newVal.toString() as keyof typeof commonEPSGs];
			return;
		}

		$client.utils.EPSG.query(newVal)
			.then((data) => {
				epsgData.value = data;
			})
			.catch((e) => {
				console.error(e);
				captureException(e, { extra: { epsg: newVal } });
			});
	},
	{ immediate: true }
);

const print = async (
	filename: string,
	trial: Trial & { TrialVariants: TrialVariant[] }
) => {
	if (engine.value === "OPENLAYERS") {
		await openlayersRef.value?.print(filename, trial);
	} else if (engine.value === "LEAFLET") {
		throw new Error("Not implemented");
	}
};

defineExpose({
	print,
});
</script>
<template>
	<div class="h-full w-full flex flex-col relative">
		<div
			v-if="topSelects && (preferences.showEngine || preferences.showEPSG)"
			class="flex flex-row items-center gap-2 p-2 absolute bottom-7 right-0 text-black dark:text-white bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-s-md"
			:style="{
				'z-index': zIndex + 1,
			}"
		>
			<template v-if="preferences.showEngine">
				{{ t("Engine") }}:
				<AppSelectNative
					v-model="engine"
					:options="[
						{ label: 'OpenLayers', value: 'OPENLAYERS' },
						{ label: 'Leaflet', value: 'LEAFLET' },
						{ label: 'MapLibre', value: 'MAPLIBRE' },
					]"
					required
					:show-empty="false"
					width="w-fit"
				/>
			</template>
			<template v-if="preferences.showEPSG">
				EPSG:
				<AppSelectNative
					v-model="userSelectedEPSGComputed"
					:options="EPSGs.map((e) => ({ label: e, value: e }))"
					required
					:show-empty="false"
					width="w-fit"
				/>
			</template>
		</div>
		<div
			v-if="proj4String || engine === 'LEAFLET'"
			class="grow w-full overflow-hidden"
			:style="{
				'z-index': zIndex,
			}"
		>
			<ClientOnly>
				<LazyMapOpenLayers
					v-if="engine === 'OPENLAYERS'"
					ref="openlayers"
					:epsg
					:proj4-string
					:fields
					:fields-with-headland
					:obstacles
					:blocks
					:points
					:guidance-lines
					:application-lines
					:focus-field
					:ruler
					:markers
					:drawn
					:drawing
					:draw-snap
					:geojson
					:wmss="WMSs"
					:z-index
					:no-popup
					@drawend="emit('drawend', $event)"
				/>
				<LazyMapLibre
					v-if="engine === 'MAPLIBRE'"
					ref="maplibre"
					:epsg
					:proj4-string
					:fields
					:fields-with-headland
					:obstacles
					:blocks
					:points
					:guidance-lines
					:application-lines
					:focus-field
					:ruler
					:markers
					:drawn
					:drawing
					:draw-snap
					:geojson
					:wmss="WMSs"
					:z-index
					@drawend="emit('drawend', $event)"
				/>
				<LazyMapLeaflet
					v-else-if="engine === 'LEAFLET'"
					:fields
					:fields-with-headland
					:obstacles
					:blocks
					:points
					:guidance-lines
					:application-lines
					:focus-field
					:ruler
					:markers
					:drawn
					:drawing
					:geojson
					:wmss="WMSs"
					:z-index
					@drawend="emit('drawend', $event)"
				/>
			</ClientOnly>
		</div>
		<AppLoaderBlock v-else />
	</div>
</template>
