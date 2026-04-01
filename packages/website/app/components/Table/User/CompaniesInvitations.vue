<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { Check, X } from "lucide-vue-next";
import { EmployeeRoleLabels } from "prismaclient/enums";
import type { OrderBy, TableColumn } from "~~/shared/types";

const { t } = useI18n();

type CompanyFarmerInvitation = NonNullable<
	typeof data.value
>["companyEmployeesInvitations"][number];

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
		field: "status",
		label: t("Status"),
		sort: "string",
	},
	{
		field: "role",
		label: t("Role"),
		sort: "string",
		cell: "role",
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
	userId: {
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

const queryOptions = computed(() => ({
	...options.value,
	user_id: props.userId,
}));
const { data, status, refresh, error } =
	$client.companiesEmployees.listCompanyInvitations.useQuery(queryOptions);

const respondToInvitation = async (id: number, accept: boolean) => {
	try {
		await $client.companiesEmployees.respondToInvitation.mutate({
			id,
			accept,
		});
		await refresh();
		$toast.success(t(accept ? "Invitation accepted" : "Invitation rejected"));
	} catch (e) {
		console.error(e);
		captureException(e);
		$toast.error(
			t(
				e instanceof TRPCClientError
					? e.message
					: "Error while responding to invitation"
			)
		);
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
			:items="data?.companyEmployeesInvitations"
			:columns="columns"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Invitations from companies") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Companies invited you as employee") }}
						</p>
					</div>
					<div></div>
				</div>
			</template>
			<template #actions="{ item }: { item: CompanyFarmerInvitation }">
				<div
					v-if="item.status === 'PENDING'"
					class="flex items-center space-x-2"
				>
					<AppButtonBase
						variant="primary"
						variant-type="transparent"
						:icon="Check"
						icon-size="small"
						@click="respondToInvitation(item.id, true)"
					/>
					<AppButtonBase
						variant="danger"
						variant-type="transparent"
						:icon="X"
						icon-size="small"
						@click="respondToInvitation(item.id, false)"
					/>
				</div>
				<div v-else></div>
			</template>
			<template #createdAt="{ item }: { item: CompanyFarmerInvitation }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
			<template #role="{ item }: { item: CompanyFarmerInvitation }">
				{{ EmployeeRoleLabels[item.role] }}
			</template>
		</TableBase>
	</div>
</template>
