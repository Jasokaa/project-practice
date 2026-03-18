<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, Trash2, Eye } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type CompanyFarmer = NonNullable<typeof data.value>["companyFarmers"][number];

const columns: TableColumn[] = [
	{
		field: "Farmer.id",
		label: "ID",
		sort: "number",
	},
	{
		field: "Farmer.name",
		label: t("Name"),
		sort: "string",
	},
	{
		field: "Farmer.tax_number",
		label: t("Tax number"),
		sort: "string",
	},
	{
		field: "Farmer.company_name",
		label: t("Company name"),
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
	companyId: {
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
}));
const { data, status, refresh, error } =
	$client.companiesFarmers.list.useQuery(queryOptions);

const deleteFarmer = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to unlink this sth?", {
			entity: t("Farmer"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.companiesFarmers.delete.mutate(id);
		await delay(100);
		refresh();
		$toast.success(
			t("Sth unlinked", {
				entity: t("Farmer"),
			})
		);
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError
				? e.message
				: "An error occurred while unlinking the farmer"
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
			:row-click-url="
				localePath(`/companies/${props.companyId}/farmers/{id}/edit`)
			"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Farmers") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Here you can see the list of farmers") }}
						</p>
					</div>
					<div>
						<div class="flex flex-row gap-2">
							<NuxtLink
								:to="
									localePath(
										`/companies/${props.companyId}/farmers-invitations/create`
									)
								"
								class="flex"
							>
								<AppButtonBase variant="primary" :icon-start="FilePlus2">
									{{ t("Invite") }}
								</AppButtonBase>
							</NuxtLink>
						</div>
					</div>
				</div>
			</template>
			<template #actions="{ item }: { item: CompanyFarmer }">
				<div class="flex items-center space-x-2">
					<NuxtLink
						:to="
							localePath(
								`/companies/${props.companyId}/farmers/${item.id}/edit`
							)
						"
					>
						<AppButtonBase
							variant="primary"
							variant-type="transparent"
							:icon="Eye"
							icon-size="small"
						/>
					</NuxtLink>
					<AppButtonBase
						variant="danger"
						variant-type="transparent"
						:icon="Trash2"
						icon-size="small"
						@click="deleteFarmer(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: CompanyFarmer }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
		</TableBase>
	</div>
</template>
