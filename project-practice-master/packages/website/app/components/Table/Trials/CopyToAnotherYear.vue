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
	guidanceLines: true,
	obstacles: true,
	blocks: true,
	applicationLines: true,
	responsibles: true,
});
const copying = ref(false);

const disabled = computed(() => !props.selected?.length);

watch(
	() => copyOptions.guidanceLines,
	(newValue) => {
		if (!newValue) {
			copyOptions.blocks = false;
		}
	}
);

const applySelectedTrials = async () => {
	if (!props.selected?.length) {
		$toast.error(t("Please select a trial"));
		return;
	}
	copying.value = true;
	try {
		const resp = await $client.trials.copy.mutate({
			ids: props.selected.map((e) => e.id),
			options: {
				...copyOptions,
				year: year.value,
			},
		});
		if (resp) {
			$toast.success(t("Trials copied"));
		}
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : t("Failed to copy trials")
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
					<FormBaseFormRow :label="`${t('Field')} (${t('if missing')})`">
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
								{{ t("Obstacles") }}
							</AppInputCheckbox>
						</FormBaseFormRow>
					</FormBaseFormRow>
					<FormBaseFormRow :label="t('Trial')">
						<FormBaseFormRow>
							<AppInputCheckbox
								v-model="copyOptions.blocks"
								id="copy-blocks"
								:disabled="!copyOptions.guidanceLines"
							>
								{{ t("Copy blocks") }}
							</AppInputCheckbox>
						</FormBaseFormRow>
						<FormBaseFormRow>
							<AppInputCheckbox
								v-model="copyOptions.applicationLines"
								id="copy-application-lines"
							>
								{{ t("Copy application lines") }}
							</AppInputCheckbox>
						</FormBaseFormRow>
						<FormBaseFormRow>
							<AppInputCheckbox
								v-model="copyOptions.responsibles"
								id="copy-responsibles"
							>
								{{ t("Copy responsibles") }}
							</AppInputCheckbox>
						</FormBaseFormRow>
					</FormBaseFormRow>
				</div>
				<AppButtonBase
					variant="primary"
					:icon-start="Copy"
					@click="applySelectedTrials"
					:loading="copying"
					class="w-full mt-3"
				>
					{{ t("Copy") }}
				</AppButtonBase>
			</div>
		</template>
	</AppDropdownBase>
</template>
