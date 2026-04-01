<script setup lang="ts">
import { Download, ChevronUp, ChevronDown } from "lucide-vue-next";

const fileExts = {
	geopackage: "gpkg",
	geojson: "geojson",
	isoxml: "isoxml",
	kmz: "kmz",
	shapefile: "zip",
};
type FileFormat = keyof typeof fileExts;
const options: { label: string; value: FileFormat }[] = [
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

const copyOptions = reactive({
	guidanceLines: true,
	obstacles: true,
});

const disabled = computed(() => !props.selected?.length);

const link = computed(
	() =>
		`/api/fields/export/${format.value}?ids=${JSON.stringify(
			props.selected.map((e) => e.id)
		)}`
);
</script>
<template>
	<AppDropdownBase>
		<template #default="{ toggle, state }">
			<AppButtonBase
				variant="primary"
				variant-type="transparent"
				type="button"
				:title="disabled ? 'Select at least one field first' : null"
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
					<FormBaseFormRow>
						<AppInputCheckbox
							v-model="copyOptions.guidanceLines"
							id="export-guidance-lines"
						>
							{{ t("Guidance lines") }}
						</AppInputCheckbox>
					</FormBaseFormRow>
					<FormBaseFormRow>
						<AppInputCheckbox
							v-model="copyOptions.obstacles"
							id="export-obstacles"
						>
							{{ t("Obstacles") }}
						</AppInputCheckbox>
					</FormBaseFormRow>
					<FormBaseFormRow :label="t('File format')">
						<AppInputRadioGroup
							v-model="format"
							id="export-file-format"
							:options="options"
							:required="true"
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
