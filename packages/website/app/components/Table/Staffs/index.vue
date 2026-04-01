<script setup lang="ts">
import { captureException } from "@sentry/nuxt";
import { TRPCClientError } from "@trpc/client";
import { FilePlus2, Pencil, Trash2 } from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";
import { delay } from "~/utils";

const { t } = useI18n();

type Staff = NonNullable<typeof data.value>["staffs"][number];

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
	() => `/farmers${props.farmerId ? `/${props.farmerId}` : ""}/staffs`
);

const queryOptions = computed(() => ({
	...options.value,
	farmer_id: props.farmerId,
}));
const { data, status, refresh, error } =
	$client.staffs.list.useQuery(queryOptions);

const deleteStaff = async (id: number) => {
	const confirmed = confirm(
		t("Are you sure you want to delete this sth?", {
			entity: t("Staff"),
		})
	);
	if (!confirmed) return;
	try {
		await $client.staffs.delete.mutate(id);
		await delay(100);
		refresh();
		$toast.success(
			t("Sth deleted", {
				entity: t("Staff"),
			})
		);
	} catch (e) {
		console.error(e);
		$toast.error(
			e instanceof TRPCClientError
				? e.message
				: "An error occurred while deleting the staff"
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
			:items="data?.staffs"
			:columns="columns"
			:row-click-url="localePath(`/farmers/{farmer_id}/staffs/{id}/edit`)"
			:loading="status === 'pending'"
			:total="data?.total"
			:error
			pageable
			@refresh="refresh"
		>
			<template #caption>
				<div class="flex flex-row">
					<div class="flex flex-col flex-grow">
						<span>{{ t("Staffs") }}</span>
						<p
							class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"
						>
							{{ t("Here you can see the list of staffs") }}
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
			<template #actions="{ item }: { item: Staff }">
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
						@click="deleteStaff(item.id)"
					/>
				</div>
			</template>
			<template #createdAt="{ item }: { item: Staff }">
				{{ new Date(item.createdAt).toLocaleString("de-DE") }}
			</template>
		</TableBase>
	</div>
</template>
