<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, RotateCcw, Trash2 } from "lucide-vue-next";
import { CompanyFarmerPermissionTypeLabels } from "prismaclient/enums";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type CompanyFarmerInvitation = NonNullable<
	typeof data.value
>["companyFarmerInvitations"][number];

const columns: TableColumn[] = [
	{
		field: "id",
		label: "ID",
		sort: "number",
	},
	{
		field: "email",
		label: t("Farmer email"),
		sort: "string",
	},
	{
		field: "status",
		label: t("Status"),
		sort: "string",
	},
	{
		field: "permissions",
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
	$client.companiesFarmers.listCompanyInvitations.useQuery(queryOptions);

const deleteInvitation = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to delete this sth?", {
			entity: t("Invitation"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.companiesFarmers.deleteInvitation.mutate(id);
		await delay(100);
		refresh();
		$toast.success(
			t("Sth deleted", {
				entity: t("Invitation"),
			})
		);
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : "Failed to delete invitation"
		);
		captureException(e, { extra: { id } });
	}
};
const resendInvitation = async (id: number) => {
	try {
		await $client.companiesFarmers.resendInvitation.mutate(id);
		await delay(100);
		refresh();
		$toast.success("Invitation resent successfully");
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError ? e.message : "Failed to resend invitation"
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
			:items="data?.companyFarmerInvitations"
			:columns="columns"
			:row-click-url="
				localePath(
					`/companies/${props.companyId}/farmers-invitations/{id}/edit`
				)
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
						<span>{{ t("Farmers invitations") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Farmers invited to this company") }}
						</p>
					</div>
					<div>
						<div>
							<NuxtLink
								:to="
									localePath(
										`/companies/${props.companyId}/farmers-invitations/create`
									)
								"
								class="flex"
							>
								<AppButtonBase variant="primary" :icon-start="FilePlus2">
									{{ t("Create new") }}
								</AppButtonBase>
							</NuxtLink>
						</div>
					</div>
				</div>
			</template>
			<template #actions="{ item }: { item: CompanyFarmerInvitation }">
				<div class="flex items-center space-x-2">
					<AppButtonBase
						v-if="item.status === 'DECLINED'"
						variant="primary"
						variant-type="transparent"
						:icon="RotateCcw"
						icon-size="small"
						title="Resend invitation"
						@click="resendInvitation(item.id)"
					/>
					<NuxtLink
						v-if="item.status !== 'ACCEPTED'"
						:to="
							localePath(
								`/companies/${companyId}/farmers-invitations/${item.id}/edit`
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
						v-if="item.status !== 'ACCEPTED'"
						variant="danger"
						variant-type="transparent"
						:icon="Trash2"
						icon-size="small"
						@click="deleteInvitation(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: CompanyFarmerInvitation }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
			<template #permissions="{ item }: { item: CompanyFarmerInvitation }">
				{{
					item.permissions
						.map((p) => CompanyFarmerPermissionTypeLabels[p])
						.join(", ")
				}}
			</template>
		</TableBase>
	</div>
</template>
