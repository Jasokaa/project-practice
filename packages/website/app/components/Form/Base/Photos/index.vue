<script setup lang="ts">
import { ExternalLink, Trash2 } from "lucide-vue-next";

export type Photo = {
	id: number;
	photo_file_id: number;
	local_preview?: string;
};

const props = defineProps({
	photos: {
		type: Array as PropType<Photo[]>,
		required: true,
	},
});
const emit = defineEmits<{
	(event: "photo-added", photos: FileList): void;
	(event: "photo-removed", index: number): void;
	(event: "focus"): void;
}>();

const addPhoto = (photos: FileList | null) => {
	if (!photos) return;
	emit("photo-added", photos);
};
const removePhoto = (index: number) => {
	emit("photo-removed", index);
};
</script>
<template>
	<div class="flex flex-row flex-wrap items-center gap-2">
		<div
			v-for="(photo, index) of photos"
			class="w-36 flex items-center justify-center relative aspect-square p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
		>
			<img
				:src="
					photo.local_preview ||
					`/api/files/trial-event-photo/${photo.id}/photo.jpeg`
				"
				class="w-full h-auto"
				alt="Photo"
			/>
			<div class="flex flex-row items-end gap-1 absolute top-2 right-2">
				<NuxtLink
					:to="
						photo.local_preview ||
						`/api/files/trial-event-photo/${photo.id}/photo.jpeg`
					"
					target="_blank"
					rel="noopener noreferrer"
				>
					<button
						class="bg-primary-500 text-white rounded-full p-1 hover:bg-primary-600"
						type="button"
					>
						<ExternalLink class="w-4 h-4" />
					</button>
				</NuxtLink>
				<button
					class="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
					type="button"
					@click="removePhoto(index)"
				>
					<Trash2 class="w-4 h-4" />
				</button>
			</div>
		</div>
		<div class="relative w-36 aspect-square">
			<AppInputDropzone
				class="w-full h-full"
				multiple
				stay-empty
				:show-label="false"
				@change="addPhoto"
			/>
		</div>
	</div>
</template>
