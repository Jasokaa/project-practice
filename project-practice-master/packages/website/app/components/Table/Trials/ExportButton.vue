<script setup lang="ts">
import { Download, ChevronUp, ChevronDown } from "lucide-vue-next";
import { stringify } from "qs";

const fileExts = {
	geopackage: "gpkg",
	geojson: "geojson",
	isoxml: "isoxml",
	kmz: "kmz",
	shapefile: "zip",
};
type FileFormat = keyof typeof fileExts;
const FormatOptions: { label: string; value: FileFormat }[] = [
	{
		label: "GeoJSON",
		value: "geojson",
	},
	{
		label: "Geopackage",
		value: "geopackage",
	},
	{
		label: "ISOXML",
		value: "isoxml",
	},
	{
		label: "KMZ",
		value: "kmz",
	},
	{
		label: "Shapefile",
		value: "shapefile",
	},
];

const { t } = useI18n();

const props = defineProps({
	selected: {
		type: Array as PropType<{ id: number }[]>,
		required: true,
	},
});

const format = ref<FileFormat>("geojson");
const options = reactive({
	sowingLines: true,
	events: false,
	fields: false,
	guidanceLines: false,
});

const exportOptions: {
	label: string;
	value: keyof typeof options;
	id: string;
}[] = [
	{ label: "Sowing lines", value: "sowingLines", id: "export-sowing-lines" },
	{
		label: "Guidance lines",
		value: "guidanceLines",
		id: "export-guidance-lines",
	},
	{ label: "Fields", value: "fields", id: "export-fields" },
	{ label: "Events", value: "events", id: "export-events" },
];

const disabled = computed(() => !props.selected?.length);

const link = computed(
	() =>
		`/api/trials/export/${format.value}?ids=${JSON.stringify(
			props.selected.map((e) => e.id)
		)}&${stringify(options)}`
);
</script>
<template>
	<AppDropdownBase>
		<template #default="{ toggle, state }">
			<AppButtonBase
				variant="primary"
				variant-type="transparent"
				type="button"
				:title="disabled ? 'Select at least one trial first' : null"
				:disabled
				:icon-start="Download"
				:icon-end="state ? ChevronUp : ChevronDown"
				@click="() => (disabled ? null : toggle())"
			>
				{{ t("Export") }}
			</AppButtonBase>
		</template>
		<template #modal="{ toggle }">
			<div
				class="w-fit overflow-hidden z-50 my-1 p-3 text-base list-none bg-white shadow-lg dark:bg-gray-700 rounded-md"
				@click.stop
			>
				<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
					Include
				</h6>
				<div class="flex flex-col gap-2 mt-3">
					<FormBaseFormRow v-for="option in exportOptions" :key="option.id">
						<AppInputCheckbox v-model="options[option.value]" :id="option.id">
							{{ t(option.label) }}
						</AppInputCheckbox>
					</FormBaseFormRow>
					<FormBaseFormRow :label="t('File format')">
						<AppInputRadioGroup
							v-model="format"
							id="export-file-format"
							:options="FormatOptions"
							required
						/>
					</FormBaseFormRow>
				</div>
				<NuxtLink :to="link" download target="_blank" @click="toggle">
					<AppButtonBase
						variant="primary"
						:icon-start="Download"
						class="w-full mt-3"
					>
						{{ t("Download") }}
					</AppButtonBase>
				</NuxtLink>
			</div>
		</template>
	</AppDropdownBase>
</template>
