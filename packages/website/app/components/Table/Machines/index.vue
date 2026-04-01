<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, Trash2 } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type Machine = NonNullable<typeof data.value>["machines"][number];

const columns: TableColumn[] = [
	{
		field: "id",
		label: "ID",
		sort: "number",
	},
	{
		field: "photo",
		label: t("Photo"),
		cell: "photo",
	},
	{
		field: "name",
		label: t("Name"),
		sort: "string",
	},
	{
		field: "code",
		label: t("Code"),
		sort: "string",
	},
	{
		field: "createdAt",
		label: t("Created at"),
		cell: "createdAt",
		sort: "number",
	},
];

const localePath = useLocalePath();
const { $client, $toast } = useNuxtApp();

const props = defineProps({
	farmerId: {
		type: Number as PropType<number>,
		required: false,
	},
});

const options = ref({
	orderBy: [
		{
			field: "id",
			direction: "desc",
		},
	] as OrderBy,
	take: 10,
	skip: 0,
});

const baseUrl = computed(
	() => `/farmers${props.farmerId ? `/${props.farmerId}` : ""}/machines`
);

const queryOptions = computed(() => ({
	...options.value,
	farmer_id: props.farmerId,
}));
const { data, status, refresh, error } =
	$client.machines.list.useQuery(queryOptions);

const deleteMachine = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to delete this sth?", {
			entity: t("Machine"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.machines.delete.mutate(id);
		await delay(100);
		refresh();
		$toast.success(t("Sth deleted", { entity: t("Machine") }));
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : "Failed to delete machine"
		);
		captureException(e, { extra: { id } });
	}
};
</script>
<template>
	<div
		class="relative overflow-x-auto shadow-md sm:rounded-lg text-black dark:text-white"
	>
		<TableBase
			v-model:order="options.orderBy"
			v-model:take="options.take"
			v-model:skip="options.skip"
			:items="data?.machines"
			:columns="columns"
			:row-click-url="localePath(`/farmers/{farmer_id}/machines/{id}/edit`)"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Machines") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Here you can see the list of machines") }}
						</p>
					</div>
					<div>
						<div>
							<NuxtLink :to="localePath(`${baseUrl}/create`)">
								<AppButtonBase variant="primary" :icon-start="FilePlus2">
									{{ t("Create new") }}
								</AppButtonBase>
							</NuxtLink>
						</div>
					</div>
				</div>
			</template>
			<template #actions="{ item }: { item: Machine }">
				<div class="flex items-center space-x-2">
					<NuxtLink :to="localePath(`${baseUrl}/${item.id}/edit`)">
						<AppButtonBase
							variant="primary"
							variant-type="transparent"
							:icon="Pencil"
							icon-size="small"
						/>
					</NuxtLink>
					<AppButtonBase
						variant="danger"
						variant-type="transparent"
						:icon="Trash2"
						icon-size="small"
						@click="deleteMachine(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: Machine }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
			<template #photo="{ item }: { item: Machine }">
				<AppPhotoMachine
					:machine="item"
					:alt="item.name"
					class="w-16 md:w-32 max-w-full max-h-full"
				/>
			</template>
		</TableBase>
	</div>
</template>
