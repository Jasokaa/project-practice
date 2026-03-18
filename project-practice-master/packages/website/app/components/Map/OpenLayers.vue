<script setup lang="ts">
import type { FeatureCollection, Position, Geometry, Feature } from "geojson";
import {
	Map as OLMap,
	Layers,
	Sources,
	Geometries,
	Styles,
	Interactions,
	MapControls,
} from "vue3-openlayers";
import { Fill, Style, Stroke } from "ol/style";
import CircleStyle from "ol/style/Circle.js";
import { GeoJSON } from "ol/format";
import type { FeatureLike } from "ol/Feature";
import {
	centroid,
	length as getLength,
	area as getArea,
	bbox,
	centerOfMass,
} from "@turf/turf";
import proj4 from "proj4";
import { getPointResolution, transformExtent } from "ol/proj";
import { parseFlatCoordinates, getScaleFromBbox, shadeColorHEX } from "~/utils";
import { MapFeatureColor } from "~/utils/color";
import { type Map as MapType, type MapBrowserEvent } from "ol";
import { LineString, Polygon, Point } from "ol/geom";
import { type DrawEvent } from "ol/interaction/Draw";
import type { EventsKey } from "ol/events";
import { type Coordinate } from "ol/coordinate";
import { unByKey } from "ol/Observable";
import type { Trial, TrialVariant } from "prismaclient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import northArrowIcon from "~/assets/icons/north-arrow.png";
import type { WMS } from "./index.vue";
import { SelectEvent } from "ol/interaction/Select";

let rulerEventsListener: EventsKey;
let drawingEventsListener: EventsKey;
const rulerContinueLineMsg = "Click to continue drawing the line";
const geoJson = new GeoJSON();

const { t } = useI18n();
const localePath = useLocalePath();

const props = defineProps({
	minZoomForFields: {
		type: Number,
		default: 13,
	},
	controls: {
		type: Boolean,
		default: true,
	},
	epsg: {
		type: Number as PropType<number | null>,
		default: 3857,
	},
	proj4String: {
		type: String as PropType<string | null>,
		required: false,
		default:
			"+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs",
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
		default: 0,
	},
	noPopup: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits<{
	(
		event: "drawend",
		data: {
			type: "LineString" | "Polygon" | "Point";
			coordinates: Position | Position[] | [Position[]];
		}
	): void;
}>();

const selectConditions = inject("ol-selectconditions");

let isInitialZoomAnimation = true;

const mapReady = ref(false);
const epsgOverride = ref<number | null>(null);
const proj4StringOverride = ref<string | null>(null);
const mapRef = useTemplateRef<{ map: MapType } | null>("mapRef");
const view = useTemplateRef("view");
const scaleContolRef = useTemplateRef("scaleContolRef");
const zoom = ref(14);
const currentZoom = ref(zoom.value);
const currentRotation = ref(0);
const currentPointerPosition = ref<[number, number] | null>(null);

const hintText = ref<string | null>(null);
const hintPosition = ref<[number, number] | null>(null);

const tooltipData = ref<{
	id: number;
	type: "field" | "guidance-line";
	label: string;
} | null>(null);
const tooltipPosition = ref<[number, number] | null>(null);

const rulerDrawEnabled = ref(false);
const rulerDrawType = ref<"LineString" | "Polygon">("LineString");
const rulerVectorLayer = useTemplateRef("rulerVectorLayer");
const drawingVectorLayer = useTemplateRef("drawingVectorLayer");
const rulerSketch = ref<Feature | null>(null);
const rulerTooltipCoord = ref<Coordinate | null>(null);
const rulerTooltipText = ref("");
const rulerHelpTooltipCoord = ref<Coordinate | null>(null);
const rulerHelpTooltipText = ref("");
const rulerTooltipsWithAreaOrLength = ref<
	{ coordinate: Coordinate; label: string }[]
>([]);
const drawingSketch = ref<Feature | null>(null);
const drawingTooltipsWithAreaOrLength = ref<
	{ coordinate: Coordinate; label: string }[]
>([]);

const isPrinting = ref(false);
const trialRef = ref<(Trial & { TrialVariants: TrialVariant[] }) | null>(null);
const legendContainerRef = useTemplateRef("legendContainer");

const proj4String = computed(
	() => proj4StringOverride.value ?? props.proj4String
);
const zoomAllowsBoundaries = computed(
	() => currentZoom.value >= props.minZoomForFields || !props.markers
);
const projection = computed(() => `EPSG:${epsgOverride.value ?? props.epsg}`);
const geojson = computed(
	() =>
		({
			type: "FeatureCollection",
			features: [
				...(props.drawn
					?.filter((e) => !!e)
					.map((geometry) => ({
						type: "Feature",
						properties: {},
						geometry,
					})) ?? []),
				...(props.geojson?.features?.filter((e) => !!e) ?? []),
			],
		} as FeatureCollection)
);
const geometriesLayers = computed(() => {
	const layers = new Map<number, Feature[]>();

	geojson.value.features.forEach((feature) => {
		const zIndex = feature.properties?.zIndex ?? 1;
		if (!layers.has(zIndex)) {
			layers.set(zIndex, []);
		}
		layers.get(zIndex)?.push({
			...feature,
			geometry: {
				...feature.geometry,
				coordinates: Array.isArray(feature.geometry.coordinates?.[0]?.[0]?.[0])
					? feature.geometry.coordinates.map((coords) =>
							coords.map((e) =>
								e.map((coord) => proj4(projection.value, coord))
							)
					  )
					: Array.isArray(feature.geometry.coordinates?.[0]?.[0])
					? feature.geometry.coordinates.map((coords) =>
							coords.map((coord) => proj4(projection.value, coord))
					  )
					: Array.isArray(feature.geometry.coordinates?.[0])
					? feature.geometry.coordinates.map((coords) =>
							proj4(projection.value, coords)
					  )
					: proj4(projection.value, feature.geometry.coordinates),
			},
		});
	});

	return Array.from(layers.entries())
		.sort((a, b) => a[0] - b[0])
		.map((e) => [
			e[0],
			geoJson.readFeatures({
				type: "FeatureCollection",
				features: e[1],
			}),
		]);
});
const markers = computed(() => {
	if (!props.markers) return [];
	if (zoomAllowsBoundaries.value) return [];

	const markers: {
		field: { id: number; name: string; number?: string };
		coordinates: [number, number];
	}[] = [];

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
const markersFeatures = computed(() => {
	return geoJson.readFeatures({
		type: "FeatureCollection",
		features: markers.value.map(
			(marker) =>
				({
					type: "Feature",
					properties: {
						id: marker.field.id,
						name: marker.field.name,
						label: marker.field.name,
						type: "field",
						popupContent: props.controls
							? `Name:${marker.field.name || "-no name-"}<br>Number:${
									marker.field.number || "-no number-"
							  }<br><a href="${localePath(
									`/fields/${marker.field.id}/edit`
							  )}">Edit</a>`
							: undefined,
					},
					geometry: {
						type: "Point",
						coordinates: proj4(projection.value, marker.coordinates),
					},
				} satisfies Feature)
		),
	});
});
const persistentLabels = computed(
	() =>
		geojson.value?.features
			?.filter((f) => f.properties?.persistentLabel)
			.map((f) => {
				if (!f.properties?.persistentLabel) return null;
				return {
					position: proj4(
						projection.value,
						centerOfMass(f).geometry.coordinates
					),
					label: f.properties?.label,
				};
			})
			.filter((e) => !!e) ?? []
);
const bboxCords = computed(() => {
	return bbox({
		type: "FeatureCollection",
		features: geojson.value.features.filter(
			(f) => f.properties?.includeInCentroid !== false
		),
	});
});
const center = computed(() => {
	return proj4(projection.value, [10.447683, 51.163375]);
});

const resetView = () => {
	view.value?.fit(
		transformExtent(bboxCords.value, "EPSG:4326", projection.value),
		{
			duration: isInitialZoomAnimation ? 0 : 200,
			padding: [20, 20, 20, 20],
		}
	);
	isInitialZoomAnimation = false;
};
watch(
	bboxCords,
	(newVal, oldVal) => {
		if (
			newVal &&
			newVal[0] !== Infinity &&
			JSON.stringify(newVal) !== JSON.stringify(oldVal)
		) {
			resetView();
		}
	},
	{ immediate: true }
);
watch(view, (newVal) => {
	if (newVal && bboxCords.value[0] !== Infinity) {
		resetView();
	}
});
watch(
	() => props.drawing,
	(newVal) => {
		if (!newVal) {
			drawingSketch.value = null;
			drawingTooltipsWithAreaOrLength.value = [];
			drawingVectorLayer.value?.vectorLayer.getSource()?.clear();
		}
	}
);

const featureHovered = (event: SelectEvent) => {
	const coords = event.selected[0]?.values_.geometry.flatCoordinates as
		| number[]
		| undefined;
	hintText.value =
		event.selected[0]?.values_.LABEL ??
		event.selected[0]?.values_.label ??
		null;
	try {
		hintPosition.value = coords?.length
			? centroid({
					type: "Feature",
					properties: {},
					geometry: {
						type:
							coords.length === 4
								? "LineString"
								: coords.length === 2
								? "Point"
								: "Polygon",
						coordinates:
							coords.length === 4
								? parseFlatCoordinates(coords)
								: coords.length === 2
								? coords
								: [parseFlatCoordinates(coords)],
					},
			  }).geometry.coordinates
			: null;
	} catch (e) {
		console.error("featureHovered", e);
	}
};
const featureClicked = (event: SelectEvent) => {
	if (props.drawing || props.noPopup) {
		return;
	}
	const coords = event.selected[0]?.values_.geometry.flatCoordinates as
		| number[]
		| undefined;
	tooltipData.value = event.selected[0]?.values_.id
		? {
				label: event.selected[0].values_.label,
				id: event.selected[0].values_.id,
				type: event.selected[0].values_.type,
		  }
		: null;
	try {
		tooltipPosition.value = coords?.length
			? centroid({
					type: "Feature",
					properties: {},
					geometry: {
						type:
							coords.length === 4
								? "LineString"
								: coords.length === 2
								? "Point"
								: "Polygon",
						coordinates:
							coords.length === 4
								? parseFlatCoordinates(coords)
								: coords.length === 2
								? coords
								: [parseFlatCoordinates(coords)],
					},
			  }).geometry.coordinates
			: null;
	} catch (e) {
		console.error("featureClicked", e);
	}
};

const overrideStyleFunction = (feature: FeatureLike) => {
	const stroke =
		feature.get("stroke") === null
			? null
			: feature.get("stroke") || MapFeatureColor.field.stroke;

	const background =
		feature.get("background") === null
			? null
			: feature.get("background") || MapFeatureColor.field.background;

	return new Style({
		fill: background
			? new Fill({
					color: background,
					// ||
					// `rgba(${Object.values(hexToRgb(stroke)!).join(", ")}, ${
					// 	feature.getGeometry()?.getType() === "Point"
					// 		? 0.8
					// 		: ["field", "obstacle"].includes(feature.get("type"))
					// 		? 0.2
					// 		: 0.6
					// })`,
			  })
			: undefined,
		stroke: stroke
			? new Stroke({
					color: stroke,
					//  ||
					// `rgba(${Object.values(hexToRgb(shadeColorHEX(stroke, -10))!).join(
					// 	", "
					// )}, ${
					// 	["field", "obstacle"].includes(feature.get("type")) ? 0.4 : 0.7
					// })`,
					width: feature.get("strokeWidth") || 2,
			  })
			: undefined,
		image:
			feature.getGeometry()?.getType() === "Point"
				? new CircleStyle({
						radius: 5,
						fill: new Fill({
							color: stroke,
							//  `rgba(${Object.values(hexToRgb(stroke)!).join(
							// 	", "
							// )}, 0.8)`,
						}),
				  })
				: undefined,
	});
};

// https://vue3openlayers.netlify.app/componentsguide/interactions/draw/#example-2-measure-distance
const rulerDrawStart = (evt: DrawEvent) => {
	rulerSketch.value = evt.feature;
	const geom = rulerSketch.value.getGeometry();

	if (geom instanceof LineString || geom instanceof Polygon) {
		rulerTooltipCoord.value = geom.getLastCoordinate();

		rulerEventsListener = geom.on("change", (evt) => {
			const geom = evt.target;
			if (geom instanceof Polygon) {
				rulerTooltipText.value = formatArea(geom);
				rulerTooltipCoord.value = geom.getInteriorPoint().getCoordinates();
			} else if (geom instanceof LineString) {
				rulerTooltipText.value = formatLength(geom);
				rulerTooltipCoord.value = geom.getLastCoordinate();
			}
		});
	}
};

const rulerDrawEnd = () => {
	const geom = rulerSketch.value?.getGeometry();

	let coordinate = null;
	if (geom instanceof LineString) {
		coordinate = geom.getLastCoordinate();
	} else if (geom instanceof Polygon) {
		coordinate = geom.getInteriorPoint().getCoordinates();
	}

	if (coordinate) {
		rulerTooltipsWithAreaOrLength.value.push({
			coordinate,
			label: geom instanceof LineString ? formatLength(geom) : formatArea(geom),
		});
	}

	// remove drawn sketch
	rulerSketch.value = null;
	// unset tooltip so that a new one can be created
	rulerTooltipCoord.value = null;
	rulerTooltipText.value = "";
	// cleanup listeners
	unByKey(rulerEventsListener);
};

const drawingDrawStart = (evt: DrawEvent) => {
	drawingSketch.value = evt.feature;
	const geom = drawingSketch.value.getGeometry();

	if (geom instanceof LineString || geom instanceof Polygon) {
		rulerTooltipCoord.value = geom.getLastCoordinate();

		drawingEventsListener = geom.on("change", (evt) => {
			const geom = evt.target;
			if (geom instanceof Polygon) {
				rulerTooltipText.value = formatArea(geom);
				rulerTooltipCoord.value = geom.getInteriorPoint().getCoordinates();
			} else if (geom instanceof LineString) {
				rulerTooltipText.value = formatLength(geom);
				rulerTooltipCoord.value = geom.getLastCoordinate();
			}
		});
	}
};

const drawingDrawEnd = () => {
	const geom = drawingSketch.value?.getGeometry();

	let coordinate = null;
	if (geom instanceof LineString) {
		coordinate = geom.getLastCoordinate();
	} else if (geom instanceof Polygon) {
		coordinate = geom.getInteriorPoint().getCoordinates();
	} else if (geom instanceof Point) {
		coordinate = geom.getCoordinates();
	}

	if (coordinate && geom) {
		drawingTooltipsWithAreaOrLength.value.push({
			coordinate,
			label:
				geom instanceof Point
					? "0m"
					: geom instanceof LineString
					? formatLength(geom)
					: formatArea(geom),
		});
		emit("drawend", {
			type: geom.getType() as typeof props.drawing,
			coordinates:
				geom instanceof Point
					? proj4(projection.value, "EPSG:4326", coordinate)
					: geom instanceof Polygon
					? [
							parseFlatCoordinates(geom.getFlatCoordinates()).map((coord) =>
								proj4(projection.value, "EPSG:4326", coord)
							),
					  ]
					: parseFlatCoordinates(geom.getFlatCoordinates()).map((coord) =>
							proj4(projection.value, "EPSG:4326", coord)
					  ),
		});
	}

	// remove drawn sketch
	drawingSketch.value = null;
	// unset tooltip so that a new one can be created
	rulerTooltipCoord.value = null;
	rulerTooltipText.value = "";
	// cleanup listeners
	unByKey(drawingEventsListener);
};

const showHelpInfoOnPointermove = (evt: MapBrowserEvent<PointerEvent>) => {
	if (evt.dragging) {
		return;
	}
	let helpMsg = t(
		!rulerDrawEnabled.value
			? "Click to start drawing"
			: "Click to start measuring"
	);
	const geom = (rulerSketch.value ?? drawingSketch.value)?.getGeometry();
	if (geom instanceof LineString) {
		helpMsg = rulerContinueLineMsg;
	}

	rulerTooltipText.value = helpMsg;
	rulerTooltipCoord.value = evt.coordinate;
};

const formatLength = (line: LineString) => {
	const length = getLength(
		{
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: parseFlatCoordinates(line.getFlatCoordinates()).map(
					(coord) => proj4(projection.value, "EPSG:4326", coord)
				),
			},
			properties: {},
		},
		{ units: "meters" }
	);
	let output = "";
	if (length > 10000) {
		output = Math.round((length / 1000) * 100) / 100 + " " + "km";
	} else {
		output = Math.round(length * 100) / 100 + " " + "m";
	}
	return output;
};
const formatArea = (polygon: Polygon) => {
	const area = getArea({
		type: "Feature",
		geometry: {
			type: "Polygon",
			coordinates: polygon
				.getCoordinates()
				.map((coords) =>
					coords.map((coord) => proj4(projection.value, "EPSG:4326", coord))
				),
		},
		properties: {},
	});
	let output;
	if (area > 1000000 * 10) {
		output = Math.round((area / 1000000) * 100) / 100 + " " + "km²";
	} else {
		output = Math.round(area * 100) / 100 + " " + "m²";
	}
	return output;
};
const changeDrawType = (
	active: boolean,
	drawType: "LineString" | "Polygon"
) => {
	rulerDrawType.value = drawType;
	rulerDrawEnabled.value = active;
	if (!active) {
		rulerSketch.value = null;
		rulerTooltipsWithAreaOrLength.value = [];
		rulerVectorLayer.value?.vectorLayer.getSource()?.clear();
	}
};
const resolutionChanged = (event) => {
	const current = event.target.getZoom();
	if (current) currentZoom.value = current;
};
const rotationChanged = (event) => {
	const current = event.target.getRotation();
	if (current) currentRotation.value = current;
};
const print = async (
	filename = "map.pdf",
	trial: Trial & { TrialVariants: TrialVariant[] }
) => {
	if (!mapRef.value) return;
	const dims = {
		a0: [1189, 841],
		a1: [841, 594],
		a2: [594, 420],
		a3: [420, 297],
		a4: [297, 210],
		a5: [210, 148],
	};
	document.body.style.cursor = "progress";
	const format = "a4";
	const resolution = 150;
	const scale = getScaleFromBbox(bboxCords.value);

	trialRef.value = trial;
	isPrinting.value = true;

	const exportOptions = {
		width: undefined as number | undefined,
		height: undefined as number | undefined,
		useCORS: true,
		ignoreElements: (element) => {
			const className =
				typeof element?.className === "string" ? element.className : "";
			return (
				className.includes("ol-control") &&
				!className.includes("ol-scale") &&
				!className.includes("ol-rotate") &&
				(!className.includes("ol-attribution") ||
					!className.includes("ol-uncollapsible"))
			);
		},
	};

	const dim = dims[format];
	const width = Math.round((dim[0] * resolution) / 25.4);
	const height = Math.round((dim[1] * resolution) / 25.4);
	const viewResolution = mapRef.value.map.getView().getResolution();
	const initialCenter = mapRef.value.map.getView().getCenter();

	if (view.value)
		view.value.fit(
			transformExtent(bboxCords.value, "EPSG:4326", projection.value),
			{
				duration: 0,
				padding: [20, 20, 20, 20],
			}
		);

	const scaleResolution =
		scale /
		getPointResolution(
			mapRef.value.map.getView().getProjection(),
			resolution / 25.4,
			mapRef.value.map.getView().getCenter()
		);

	// Set print size
	if (scaleContolRef.value) scaleContolRef.value.control.setDpi(resolution);
	mapRef.value.map.getTargetElement().style.width = width + "px";
	mapRef.value.map.getTargetElement().style.height = height + "px";
	mapRef.value.map.updateSize();
	mapRef.value.map.getView().setResolution(scaleResolution);
	epsgOverride.value = 3857;
	proj4StringOverride.value =
		"+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs";

	mapRef.value.map.once("rendercomplete", async () => {
		if (!mapRef.value) {
			return;
		}
		exportOptions.width = width;
		exportOptions.height = height;

		try {
			const mapCanvas = await html2canvas(mapRef.value.map.getViewport(), {
				...exportOptions,
				backgroundColor: null,
			});

			const legendCanvas = await html2canvas(legendContainerRef.value, {
				backgroundColor: null,
			});

			const pdf = new jsPDF("landscape", undefined, format);

			// Add map first at full size
			pdf.addImage(
				mapCanvas.toDataURL("image/jpeg"),
				"JPEG",
				0,
				0,
				dim[0],
				dim[1]
			);

			// Add title and date overlay with white background for better readability
			pdf.setFillColor(255, 255, 255);
			pdf.setGState(pdf.GState({ opacity: 0.8 }));

			pdf.setFont("helvetica");
			pdf.setFontSize(16);
			const titleWidth = pdf.getTextWidth(trial.title || "Trial Map");
			pdf.setFontSize(12);
			const dateStr = `Date: ${new Date().toLocaleString("de-DE")}`;
			const dateWidth = pdf.getTextWidth(dateStr);

			pdf.rect(5, 5, Math.max(titleWidth, dateWidth) + 5, 20, "F");

			pdf.setGState(pdf.GState({ opacity: 1 }));
			pdf.setFont("helvetica");
			pdf.setFontSize(16);
			pdf.text(trial.title || "Trial Map", 7, 14);

			pdf.setFontSize(12);
			pdf.text(dateStr, 7, 21);

			// Add legend
			const legendElement = legendContainerRef.value;
			if (legendElement) {
				const actualWidth = (legendElement.offsetWidth * 25.4) / resolution;
				const actualHeight = (legendElement.offsetHeight * 25.4) / resolution;

				pdf.addImage(
					legendCanvas.toDataURL("image/png"),
					"PNG",
					dim[0] - actualWidth - 10,
					dim[1] - actualHeight - 10,
					actualWidth,
					actualHeight
				);
			}

			// Add north arrow
			const margin = 10;
			const northArrowWidth = 15;
			const northArrowHeight = 26.5;

			const rotation = -currentRotation.value * (180 / Math.PI);
			const rotationRad = (rotation * Math.PI) / 180;

			// Calculate position compensation for rotation around bottom
			const offsetX = (northArrowHeight * Math.sin(rotationRad)) / 2;
			const offsetY = (northArrowHeight * (1 - Math.cos(rotationRad))) / 2;

			pdf.addImage(
				northArrowIcon,
				"PNG",
				dim[0] - northArrowWidth - margin + offsetX,
				margin + offsetY,
				northArrowWidth,
				northArrowHeight,
				undefined,
				undefined,
				rotation
			);

			if (trial.trial_question || trial.description) {
				pdf.addPage();
				pdf.setFont("helvetica");

				// Add question
				if (trial.trial_question) {
					pdf.setFontSize(16);
					pdf.text("Question:", 20, 30);
					pdf.setFontSize(12);
					pdf.text(
						pdf.splitTextToSize(trial.trial_question, dim[0] - 40),
						20,
						45
					);
				}

				// Add description
				if (trial.description) {
					pdf.setFontSize(16);
					pdf.text("Description:", 20, trial.trial_question ? 80 : 30);
					pdf.setFontSize(12);
					pdf.text(
						pdf.splitTextToSize(trial.description, dim[0] - 40),
						20,
						trial.trial_question ? 95 : 45
					);
				}
			}

			pdf.save(filename);
		} finally {
			isPrinting.value = false;
			trialRef.value = null;

			if (!mapRef.value) {
				return;
			}
			if (scaleContolRef.value) scaleContolRef.value.control.setDpi();
			mapRef.value.map.getTargetElement().style.width = "100%";
			mapRef.value.map.getTargetElement().style.height = "100%";
			mapRef.value.map.updateSize();
			mapRef.value.map.getView().setResolution(viewResolution);
			mapRef.value.map.getView().setCenter(initialCenter);
			document.body.style.cursor = "auto";

			epsgOverride.value = null;
			proj4StringOverride.value = null;
		}
	});
};

defineExpose({
	print,
});
onMounted(() => {
	mapRef.value?.map.on("pointermove", showHelpInfoOnPointermove);
	mapRef.value?.map.getViewport().addEventListener("mouseout", () => {
		rulerHelpTooltipCoord.value = null;
		rulerHelpTooltipText.value = "";
	});
});
</script>
<template>
	<div style="height: 100%; width: 100%">
		<OLMap.OlMap
			ref="mapRef"
			:loadTilesWhileAnimating="true"
			:loadTilesWhileInteracting="true"
			class="w-full h-full relative"
			:style="{
				'z-index': zIndex,
			}"
			@pointermove="currentPointerPosition = $event.coordinate"
			@rendercomplete="mapReady = true"
		>
			<OLMap.OlView
				ref="view"
				:center
				:zoom="8"
				:projection
				:key="projection"
				@change:resolution="resolutionChanged"
				@change:rotation="rotationChanged"
			/>
			<Layers.OlTileLayer :visible="true">
				<Sources.OlSourceOsm attributions="©️ OpenStreetMaps" />
			</Layers.OlTileLayer>

			<Layers.OlTileLayer
				v-for="wms in wmss"
				:key="wms.name"
				:title="wms.name"
				:visible="wms.visible"
			>
				<Sources.OlSourceXyz
					v-if="wms.type === 'xyz'"
					:attributions="wms.attribution"
					:url="wms.url"
				/>
				<Sources.OlSourceTileWms
					v-else-if="wms.type === 'wms'"
					:attributions="wms.attribution"
					:url="wms.url"
					:layers="wms.layers"
					:params="wms.params"
					:projection="wms.projection"
					:extent="wms.extent"
				/>
			</Layers.OlTileLayer>

			<MapControls.OlLayerswitcherimageControl />
			<MapControls.OlScalelineControl ref="scaleContolRef" />
			<MapOlRotateControl
				ref="rotateControl"
				:rotation="currentRotation"
				@update:rotation="
					(e) => {
						view?.setRotation(e);
						currentRotation = e;
					}
				"
			/>
			<!-- <MapControls.OlRotateControl /> -->
			<OLMap.OlProjectionRegister
				v-if="proj4String"
				:projectionName="projection"
				:projectionDef="proj4String"
			/>
			<Interactions.OlInteractionSelect
				v-if="!(rulerDrawEnabled || !!drawing) && selectConditions"
				:condition="selectConditions?.pointerMove"
				@select="featureHovered"
			>
				<Styles.OlStyle :overrideStyleFunction />
			</Interactions.OlInteractionSelect>
			<OLMap.OlOverlay
				v-if="currentPointerPosition?.length && hintText"
				:position="currentPointerPosition"
				:offset="[0, 30]"
				positioning="top-left"
				:stop-event="false"
			>
				<div class="overlay-content bg">
					{{ hintText }}
				</div>
			</OLMap.OlOverlay>
			<OLMap.OlOverlay
				v-for="(persistentLabel, index) in persistentLabels"
				:key="index"
				:position="persistentLabel.position"
				:stop-event="false"
			>
				<div class="overlay-content">
					{{ persistentLabel.label }}
				</div>
			</OLMap.OlOverlay>
			<Interactions.OlInteractionSelect
				v-if="!(rulerDrawEnabled || !!drawing)"
				:condition="selectConditions.singleClick"
				@select="featureClicked"
			>
			</Interactions.OlInteractionSelect>
			<OLMap.OlOverlay
				v-if="tooltipPosition?.length && tooltipData"
				:position="tooltipPosition"
			>
				<template v-slot="slotProps">
					<div class="overlay-content bg">
						{{ tooltipData.label }}
						<NuxtLink :to="`/fields/${tooltipData?.id}/edit`">
							<AppButtonBase>Edit</AppButtonBase>
						</NuxtLink>
					</div>
				</template>
			</OLMap.OlOverlay>

			<template v-if="zoomAllowsBoundaries && geojson.features.length">
				<Layers.OlVectorLayer
					v-for="[zIndex, features] in geometriesLayers"
					:z-index="zIndex"
					title="Geometries"
				>
					<Sources.OlSourceVector
						:features="features"
						:format="geoJson"
						:projection
					>
						<Interactions.OlInteractionSnap
							v-if="drawing && drawSnap && mapReady"
						/>
					</Sources.OlSourceVector>

					<Styles.OlStyle :overrideStyleFunction />
				</Layers.OlVectorLayer>
			</template>
			<!-- <Layers.OlVectorLayer>
				<Sources.OlSourceVector>
					<OLMap.OlFeature
						v-for="(feature, index) in geoJsonFeatures.features"
						:key="index"
					>
						<Geometries.OlGeomLineString
							v-if="feature.geometry.type === 'LineString'"
							:coordinates="feature.geometry.coordinates"
						/>
						<Geometries.OlGeomPolygon
							v-else-if="feature.geometry.type === 'Polygon'"
							:coordinates="feature.geometry.coordinates"
						/>
						<Geometries.OlGeomMultiPolygon
							v-else-if="feature.geometry.type === 'MultiPolygon'"
							:coordinates="feature.geometry.coordinates"
						/>
						<Styles.OlStyle>
							<Styles.OlStyleStroke
								color="white"
								:width="3"
							></Styles.OlStyleStroke>
							<Styles.OlStyleFill
								color="rgba(255,255,255,0.1)"
							></Styles.OlStyleFill>
						</Styles.OlStyle>
					</OLMap.OlFeature>
				</Sources.OlSourceVector>
			</Layers.OlVectorLayer> -->

			<Layers.OlAnimatedClusterlayer
				:animationDuration="500"
				:distance="40"
				:z-index="5"
				title="Markers"
			>
				<Sources.OlSourceVector
					:features="markersFeatures"
					:format="geoJson"
					:projection
				>
				</Sources.OlSourceVector>
				<Styles.OlStyle>
					<Styles.OlStyleStroke color="red" :width="2" />
					<Styles.OlStyleFill color="rgba(255,255,255,0.1)" />
					<Styles.OlStyleIcon
						src="https://maps.google.com/mapfiles/kml/paddle/red-blank.png"
						:scale="1"
					/>
				</Styles.OlStyle>
			</Layers.OlAnimatedClusterlayer>

			<MapControls.OlControlBar>
				<MapControls.OlToggleControl
					v-if="ruler"
					html="📏"
					className="edit"
					title="LineString"
					:onToggle="(e:boolean) => changeDrawType(e, 'LineString')"
				/>
				<MapControls.OlToggleControl
					v-if="ruler"
					html="📐"
					className="edit"
					title="Polygon"
					:onToggle="(e:boolean) => changeDrawType(e, 'Polygon')"
				/>
			</MapControls.OlControlBar>

			<OLMap.OlOverlay
				v-if="(drawing || rulerDrawEnabled) && rulerTooltipCoord"
				:position="rulerTooltipCoord"
				:offset="[0, -15]"
				positioning="bottom-center"
				:stopEvent="false"
				:insertFirst="false"
			>
				<div class="tooltip tooltip-measure">
					{{ rulerTooltipText }}
				</div>
			</OLMap.OlOverlay>

			<OLMap.OlOverlay
				v-if="(drawing || rulerDrawEnabled) && rulerHelpTooltipCoord"
				:position="rulerHelpTooltipCoord"
				:offset="[0, 15]"
				positioning="top-center"
			>
				<div class="tooltip tooltip-info">
					{{ rulerHelpTooltipText }}
				</div>
			</OLMap.OlOverlay>

			<template v-if="rulerDrawEnabled">
				<OLMap.OlOverlay
					v-for="tooltip in rulerTooltipsWithAreaOrLength"
					:position="tooltip.coordinate"
					:offset="[0, -30]"
					positioning="top-center"
				>
					<div class="ol-tooltip ol-tooltip-static">
						{{ tooltip.label }}
					</div>
				</OLMap.OlOverlay>
			</template>

			<template v-if="drawing">
				<OLMap.OlOverlay
					v-for="tooltip in drawingTooltipsWithAreaOrLength"
					:position="tooltip.coordinate"
					:offset="[0, -30]"
					positioning="top-center"
				>
					<div class="ol-tooltip ol-tooltip-static">
						{{ tooltip.label }}
					</div>
				</OLMap.OlOverlay>
			</template>

			<Layers.OlVectorLayer
				v-if="rulerDrawEnabled"
				ref="rulerVectorLayer"
				:z-index="10"
			>
				<Sources.OlSourceVector>
					<Interactions.OlInteractionDraw
						v-if="rulerDrawEnabled"
						:type="rulerDrawType"
						@drawend="rulerDrawEnd"
						@drawstart="rulerDrawStart"
					/>
				</Sources.OlSourceVector>

				<Styles.OlStyle>
					<Styles.OlStyleStroke color="#ffcc33" :width="2" />
					<Styles.OlStyleFill color="rgba(255, 255, 255, 0.2)" />
					<Styles.OlStyleCircle :radius="7">
						<Styles.OlStyleFill color="#ffcc33" />
					</Styles.OlStyleCircle>
				</Styles.OlStyle>
			</Layers.OlVectorLayer>

			<Layers.OlVectorLayer
				v-if="drawing"
				ref="drawingVectorLayer"
				:z-index="11"
			>
				<Sources.OlSourceVector>
					<Interactions.OlInteractionDraw
						v-if="!rulerDrawEnabled"
						:type="drawing"
						:max-points="
							drawing === 'Point' ? 1 : drawing === 'LineString' ? 2 : undefined
						"
						@drawend="drawingDrawEnd"
						@drawstart="drawingDrawStart"
					/>
				</Sources.OlSourceVector>

				<Styles.OlStyle>
					<Styles.OlStyleStroke color="#ffcc33" :width="2" />
					<Styles.OlStyleFill color="rgba(255, 255, 255, 0.2)" />
					<Styles.OlStyleCircle :radius="7">
						<Styles.OlStyleFill color="#ffcc33" />
					</Styles.OlStyleCircle>
				</Styles.OlStyle>
			</Layers.OlVectorLayer>
		</OLMap.OlMap>
		<!-- Legend -->
		<div
			v-if="isPrinting && trialRef"
			ref="legendContainer"
			class="absolute bottom-5 right-5 bg-white rounded-md border border-gray-200 p-4 max-w-[200px] z-[1000]"
		>
			<div class="font-bold mb-3">Sowing lines</div>
			<div
				v-for="variant in trialRef.TrialVariants"
				:key="variant.id"
				class="flex items-center my-1"
			>
				<div
					class="w-5 h-1 mr-2 rounded-sm"
					:style="{ backgroundColor: variant.color }"
				></div>
				<div>
					{{ variant.label }}
					({{
						geojson.features.filter(
							(f) =>
								f.properties?.type === "sowing-line" &&
								f.properties?.trial_variant_id === variant.id
						).length ?? 0
					}})
				</div>
			</div>
			<div class="font-bold my-3">Trial Variants</div>
			<div
				v-for="variant in trialRef.TrialVariants"
				:key="variant.id"
				class="flex items-center my-1"
			>
				<div
					class="w-5 h-5 mr-2 rounded-sm"
					:style="{ backgroundColor: shadeColorHEX(variant.color, -25) }"
				></div>
				<div>
					{{ variant.label }}
					({{
						geojson.features.filter(
							(f) =>
								f.properties?.type === "plot" &&
								f.properties?.trial_variant_id === variant.id
						).length ?? 0
					}})
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="css">
@import "vue3-openlayers/dist/vue3-openlayers.css";

.overlay-content {
	position: relative;
	top: 0;
	left: 0;
	z-index: 1000;
	transform: translate(-50%, -50%);
	pointer-events: none;
}
.overlay-content.bg {
	padding: 6px;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.marker {
	background-color: transparent;
	padding: 10px;
	border-radius: 25px;
	margin: 5px;
	font-size: 25px;
}

.ol-tooltip {
	position: relative;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	color: white;
	padding: 4px 8px;
	opacity: 0.7;
	white-space: nowrap;
	font-size: 12px;
	cursor: default;
	user-select: none;
}
.ol-tooltip-measure {
	opacity: 1;
	font-weight: bold;
}
.ol-tooltip-static {
	background-color: #ffcc33;
	color: black;
	border: 1px solid white;
}
.ol-tooltip-measure:before,
.ol-tooltip-static:before {
	border-top: 6px solid rgba(0, 0, 0, 0.5);
	border-right: 6px solid transparent;
	border-left: 6px solid transparent;
	content: "";
	position: absolute;
	bottom: -6px;
	margin-left: -7px;
	left: 50%;
}
.ol-tooltip-static:before {
	border-top-color: #ffcc33;
}

.ol-rotate {
	display: none;
}
</style>
