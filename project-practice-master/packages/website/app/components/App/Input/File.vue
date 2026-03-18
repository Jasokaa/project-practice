<script setup lang="ts">
const props = defineProps({
	id: {
		type: String,
		default: "dropzone-file",
	},
	showPreview: {
		type: Boolean,
		default: false,
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
const files = ref<FileList | null>(null);

const fileNamesLabel = computed(() => {
	if (files.value?.length) {
		return (
			(files.value.length > 1
				? `${files.value.length} files selected`
				: files.value[0].name
			).substring(0, 20) + "..."
		);
	}
	return "No file selected";
});

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
	<div class="text-black dark:text-white">
		<label
			class="h-8 flex flex-row cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg"
			:for="id"
		>
			<div
				class="w-fit flex items-center px-3 rounded-s-lg text-white bg-gray-800 dark:bg-gray-600"
			>
				<span>Browse...</span>
			</div>
			<div
				class="w-full flex items-center px-2 rounded-e-lg gray-50 dark:bg-gray-700"
			>
				<span>{{ fileNamesLabel }}</span>
			</div>
		</label>
		<input
			:id
			ref="file-input-ref"
			class="hidden"
			type="file"
			:accept
			@change="changeHandler"
		/>
	</div>
</template>
