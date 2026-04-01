<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { Pencil, Trash2 } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";
import { CompanyFarmerPermissionTypeLabels } from "prismaclient/enums";
import { TRPCClientError } from "@trpc/client";

const { t } = useI18n();

type CompanyFarmer = NonNullable<typeof data.value>["companyFarmers"][number];

const columns: TableColumn[] = [
	{
		field: "id",
		label: "ID",
		sort: "number",
	},
	{
		field: "Company.name",
		label: t("Company name"),
		sort: "string",
	},
	{
		field: "Permissions",
		label: t("Permissions"),
		cell: "permissions",
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
	companyId: {
		type: Number,
		required: false,
		default: null,
	},
	farmerId: {
		type: Number,
		required: false,
		default: null,
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

const queryOptions = computed(() => ({
	...options.value,
	company_id: props.companyId ?? undefined,
	farmer_id: props.farmerId ?? undefined,
}));
const { data, status, refresh, error } =
	$client.companiesFarmers.list.useQuery(queryOptions);

const unlinkCompany = async (id: number) => {
	const confirmed = confirm("Are you sure you want to unlink this company?");
	if (!confirmed) return;
	try {
		await $client.companiesFarmers.delete.mutate(id);
		await delay(100);
		refresh();
		$toast.success("Company unlinked");
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : t("Failed to unlink company")
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
			:items="data?.companyFarmers"
			:columns="columns"
			:row-click-url="localePath(`/farmers/{farmer_id}/companies/{id}/edit`)"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Connected companies") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Companies that have access to this farmer") }}
						</p>
					</div>
					<div></div>
				</div>
			</template>
			<template #permissions="{ item }: { item: CompanyFarmer }">
				<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
					{{
						item.Permissions.map(
							(p) => CompanyFarmerPermissionTypeLabels[p.permission]
						).join(", ")
					}}
				</span>
			</template>
			<template #actions="{ item }: { item: CompanyFarmer }">
				<div class="flex items-center space-x-2">
					<NuxtLink
						:to="
							localePath(`/farmers/${item.farmer_id}/companies/${item.id}/edit`)
						"
					>
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
						@click="unlinkCompany(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: CompanyFarmer }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
			<template #state-empty>
				<p class="w-full p-2 text-center text-gray-500 dark:text-gray-400">
					{{ t("No companies yet") }}
					<br />
					{{ t("Tip: provide farmer email to company to get invitation!") }}
				</p>
			</template>
		</TableBase>
	</div>
</template>
