<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { Copy, ChevronUp, ChevronDown } from "lucide-vue-next";

const { $client, $toast } = useNuxtApp();
const { t } = useI18n();
const yearStore = useYearStore();

const props = defineProps({
	selected: {
		type: Array as PropType<{ id: number; _count: { Trials: number } }[]>,
		required: true,
	},
});

const year = ref(yearStore.year + 1);
const copyOptions = reactive({
	crop: true,
	guidanceLines: true,
	obstacles: true,
});
const copying = ref(false);

const disabled = computed(() => !props.selected?.length);

const applySelectedFields = async () => {
	if (!props.selected?.length) {
		$toast.error(t("Please select a field"));
		return;
	}
	copying.value = true;
	try {
		const resp = await $client.fields.copy.mutate({
			ids: props.selected.map((e) => e.id),
			options: {
				...copyOptions,
				year: year.value,
			},
		});
		if (resp) {
			$toast.success(t("Fields copied"));
		}
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : t("Failed to copy fields")
		);
		captureException(e, {
			extra: {
				selected: props.selected,
				year: year.value,
				copyOptions,
			},
		});
	} finally {
		copying.value = false;
	}
};
</script>
<template>
	<AppDropdownBase>
		<template #default="{ toggle, state }">
			<AppButtonBase
				variant="primary"
				variant-type="transparent"
				:icon-start="Copy"
				:icon-end="state ? ChevronUp : ChevronDown"
				:disabled
				@click="() => (disabled ? null : toggle())"
			>
				{{ t("Copy to another year") }}
			</AppButtonBase>
		</template>
		<template #modal="{ toggle }">
			<div
				class="w-fit overflow-hidden z-50 my-1 p-3 text-base list-none bg-white shadow-lg dark:bg-gray-700 rounded-md"
				@click.stop
			>
				<FormBaseFormRow :label="t('To year')">
					<SelectYear v-model="year" />
				</FormBaseFormRow>
				<div class="flex flex-col gap-2 mt-3">
					<FormBaseFormRow>
						<AppInputCheckbox v-model="copyOptions.crop" id="copy-crop">
							{{ t("Copy crop") }}
						</AppInputCheckbox>
					</FormBaseFormRow>
					<FormBaseFormRow>
						<AppInputCheckbox
							v-model="copyOptions.guidanceLines"
							id="copy-guidance-lines"
						>
							{{ t("Copy guidance lines") }}
						</AppInputCheckbox>
					</FormBaseFormRow>
					<FormBaseFormRow>
						<AppInputCheckbox
							v-model="copyOptions.obstacles"
							id="copy-obstacles"
						>
							{{ t("Copy obstacles") }}
						</AppInputCheckbox>
					</FormBaseFormRow>
				</div>
				<AppButtonBase
					variant="primary"
					:icon-start="Copy"
					@click="applySelectedFields"
					:loading="copying"
					class="w-full mt-3"
				>
					{{ t("Copy") }}
				</AppButtonBase>
			</div>
		</template>
	</AppDropdownBase>
</template>
