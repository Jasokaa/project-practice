<script setup lang="ts">
import { Upload } from "lucide-vue-next";

const { t } = useI18n();

const props = defineProps({
	loading: {
		type: Boolean,
		default: false,
	},
	entity: {
		type: Object as PropType<{
			id: number;
			Photo?: Object | null;
			name?: string | null;
			first_name?: string | null;
			last_name?: string | null;
		} | null>,
		required: false,
	},
	photo: {
		type: String as PropType<string | null>,
		default: null,
	},
});
const emit = defineEmits<{
	(event: "change", files: FileList | null): void;
	(event: "focus"): void;
}>();

const changeHandler = (files: FileList | null) => {
	emit("change", files);
};
</script>
<template>
	<div class="flex flex-row items-center">
		<div class="w-20 mr-4 flex-shrink-0">
			<slot v-bind="{ entity, photo }" />
		</div>
		<div class="flex flex-col w-full">
			<div class="flex flex-col">
				<AppInputFile
					id="avatar-file-input"
					accept="image/*"
					clearable
					@change="changeHandler"
				/>
				<span class="mt-1 text-xs text-black dark:text-white">
					PNG, JPG or GIF (MAX. 800x400px)
				</span>
			</div>
			<div class="flex flex-row mt-2 gap-2">
				<AppButtonBase
					type="button"
					variant="secondary"
					size="small"
					:disabled="!photo && !entity?.Photo"
					@click="emit('change', null)"
				>
					{{ t("Delete") }}
				</AppButtonBase>
			</div>
		</div>
	</div>
</template>
