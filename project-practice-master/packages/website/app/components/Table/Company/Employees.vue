<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, Trash2 } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type CompanyFarmer = NonNullable<typeof data.value>["companyEmployees"][number];

const columns: TableColumn[] = [
	{
		field: "user_id",
		label: t("User ID"),
		sort: "number",
	},
	{
		field: "User.first_name",
		label: t("Name"),
		cell: "name",
	},
	{
		field: "User.email",
		label: t("Email"),
		sort: "string",
	},
	{
		field: "role",
		label: t("Role"),
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
		required: true,
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
	company_id: props.companyId,
}));
const { data, status, refresh, error } =
	$client.companiesEmployees.list.useQuery(queryOptions);

const deleteEmployee = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to delete this sth?", {
			entity: t("Employee"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.companiesEmployees.delete.mutate(id);
		$toast.success("Employee deleted");
		await delay(100);
		refresh();
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : "Failed to delete employee"
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
			:items="data?.companyEmployees"
			:columns="columns"
			:row-click-url="
				localePath(`/companies/${props.companyId}/employees/{id}/edit`)
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
						<span>{{ t("Employees") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Here you can see the list of employees") }}
						</p>
					</div>
					<div>
						<div class="flex flex-row gap-2">
							<NuxtLink
								:to="
									localePath(
										`/companies/${props.companyId}/employees-invitations/create`
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
								`/companies/${props.companyId}/employees/${item.id}/edit`
							)
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
						@click="deleteEmployee(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: CompanyFarmer }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
			<template #name="{ item }: { item: CompanyFarmer }">
				{{ `${item.User.first_name} ${item.User.last_name}` }}
			</template>
		</TableBase>
	</div>
</template>
