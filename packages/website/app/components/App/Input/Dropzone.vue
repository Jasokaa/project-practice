<script setup lang="ts">
import { Trash2, CloudUpload } from "lucide-vue-next";

const { t } = useI18n();

const props = defineProps({
	id: {
		type: String,
		default: "dropzone-file",
	},
	showPreview: {
		type: Boolean,
		default: false,
	},
	showLabel: {
		type: Boolean,
		default: true,
	},
	clearable: {
		type: Boolean,
		default: false,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	accept: {
		type: String,
		default: "image/*",
	},
	stayEmpty: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits<{
	(event: "change", files: FileList | null): void;
	(event: "focus"): void;
}>();

const inputRef = useTemplateRef("file-input-ref");

const active = ref(false);
const files = ref<FileList | null>(null);

const showDeleteButton = computed(
	() => files.value?.length || props.showPreview
);
const label = computed(() => {
	if (files.value?.length) {
		return files.value.length > 1
			? `${files.value.length} files selected`
			: files.value[0].name;
	}
	return props.accept;
});

const setActive = () => {
	active.value = true;
};
const setInactive = () => {
	active.value = false;
};
const onDrop = (e: DragEvent) => {
	setInactive();
	if (e.dataTransfer?.files) emit("change", e.dataTransfer.files);
};

const changeHandler = () => {
	files.value = inputRef.value?.files ?? null;
	if (!files.value?.length) {
		changeHandler();
		return;
	}
	emit("change", files.value);
	if (props.stayEmpty) {
		clearFiles();
	}
};
const clearFiles = () => {
	if (inputRef.value) {
		inputRef.value.value = "";
	}
	files.value = null;
	emit("change", null);
};
</script>
<template>
	<div class="h-32 flex items-center justify-center w-full relative">
		<label
			v-if="!showPreview"
			:for="id"
			class="h-full w-full p-2.5 cursor-pointer rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
			:data-active="active"
			@dragenter.prevent="setActive"
			@dragover.prevent="setActive"
			@dragleave.prevent="setInactive"
			@drop.prevent="onDrop"
			@focus="emit('focus')"
		>
			<div
				class="flex flex-col items-center justify-center w-full h-full p-6 border-2 border-gray-300 border-dashed rounded-lg"
			>
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<CloudUpload class="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
					<p
						v-if="showLabel"
						class="mb-2 text-sm text-gray-500 dark:text-gray-400"
					>
						<span class="font-semibold">{{ t("Click to upload") }}</span>
						{{ t("or drag and drop") }}
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{{ label }}
					</p>
				</div>
				<input
					ref="file-input-ref"
					:id
					type="file"
					class="hidden"
					:multiple
					:accept
					@change="changeHandler"
				/>
			</div>
		</label>
		<slot v-else></slot>
		<div v-if="showDeleteButton" class="absolute top-2 right-2">
			<AppButtonBase
				type="button"
				variant="danger"
				:icon="Trash2"
				@click="clearFiles"
			/>
		</div>
	</div>
</template>
