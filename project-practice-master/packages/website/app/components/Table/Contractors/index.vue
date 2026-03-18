<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, Trash2 } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type Contractor = NonNullable<typeof data.value>["contractors"][number];

const columns: TableColumn[] = [
	{
		field: "id",
		label: "ID",
		sort: "number",
	},
	{
		field: "User.first_name",
		label: t("First name"),
		sort: "string",
	},
	{
		field: "User.last_name",
		label: t("Last name"),
		sort: "string",
	},
	{
		field: "User.email",
		label: t("Email"),
		sort: "string",
	},
	{
		field: "User.mobile_number",
		label: t("Number"),
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
		type: Number,
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
	() => `/farmers${props.farmerId ? `/${props.farmerId}` : ""}/contractors`
);

const queryOptions = computed(() => ({
	...options.value,
	farmer_id: props.farmerId,
}));
const { data, status, refresh, error } =
	$client.contractors.list.useQuery(queryOptions);

const deleteContractor = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to delete this sth?", {
			entity: t("Contractor"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.contractors.delete.mutate(id);
		await delay(100);
		refresh();
		$toast.success(t("Sth deleted", { entity: t("Contractor") }));
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : "Failed to delete contractor"
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
			:items="data?.contractors"
			:columns="columns"
			:row-click-url="localePath(`/farmers/{farmer_id}/contractors/{id}/edit`)"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Contractors") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Here you can see the list of contractors") }}
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
			<template #actions="{ item }: { item: Contractor }">
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
						@click="deleteContractor(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: Contractor }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
		</TableBase>
	</div>
</template>
