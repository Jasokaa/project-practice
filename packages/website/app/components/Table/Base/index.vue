<script setup lang="ts">
import throttle from "lodash/throttle";
import {
	ArrowDownAZ,
	ArrowUpAZ,
	ArrowUp01,
	ArrowDown01,
	ArrowUpDown,
	RotateCw,
} from "lucide-vue-next";
import type { OrderBy, TableColumn } from "~~/shared/types";

const slots = useSlots();
const { t } = useI18n();

const props = defineProps({
	items: {
		type: Array as PropType<any[]>,
		required: false,
		default: [],
	},
	columns: {
		type: Array as PropType<TableColumn[]>,
		required: true,
	},
	rowClickUrl: {
		type: String as PropType<string | null>,
		required: false,
		default: null,
	},
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
	take: {
		type: Number,
		required: true,
	},
	total: {
		type: Number,
		required: false,
		default: 0,
	},
	selectable: {
		type: Boolean,
		required: false,
		default: false,
	},
	error: {
		type: [Object, String] as PropType<any>,
		required: false,
		default: null,
	},
	pageable: {
		type: Boolean,
		required: false,
		default: false,
	},
});
const emit = defineEmits<{
	(e: "refresh"): void;
	(e: "needMore"): void;
}>();
const order = defineModel<OrderBy>("order");
const take = defineModel<number>("take");
const skip = defineModel<number>("skip");
const selected = defineModel<{ id: number }[]>("selected");

const items = computed(() =>
	props.loading
		? Array.from({ length: props.take }, (_, i) => ({}))
		: (props.items ?? []).map((e) => ({
				...e,
				selected: selected.value?.some((s) => s.id === e.id) ?? false,
		  }))
);
const areAllSelected = computed(
	() =>
		!!props.items?.every((item) =>
			selected.value?.some((s) => s.id === item.id)
		) && !!props.items?.length
);

const handleSelectAllChange = (value: boolean) => {
	if (value) {
		if (!selected.value) {
			selected.value = [...props.items];
		} else {
			selected.value.push(
				...props.items.filter(
					(e) => !selected.value?.some((s) => s.id === e.id)
				)
			);
		}
	} else {
		selected.value =
			selected.value?.filter(
				(s) => !props.items.some((item) => item.id === s.id)
			) ?? [];
	}
};
const handleSelectChange = (
	obj: NonNullable<typeof selected.value>[number],
	value: boolean
) => {
	if (value) {
		if (!selected.value) {
			selected.value = [obj];
		} else {
			selected.value.push(obj);
		}
	} else {
		selected.value = selected.value?.filter((s) => s.id !== obj.id) ?? [];
	}
};

const changeSortHandler = (field: string) => {
	order.value = [
		{
			field: field,
			direction: order.value?.[0]?.direction === "asc" ? "desc" : "asc",
		},
	];
};

const getNestedValue = (obj: Record<string, any>, path: string) => {
	const keys = path.split(".");
	return keys.reduce((acc, key) => acc?.[key], obj);
};

let lastScroll = 0;

const askMore = throttle(
	() => {
		emit("needMore");
	},
	500,
	{ trailing: false }
);

const needMore = () => {
	if (
		props.items?.length &&
		(!props.total || props.items?.length < props.total)
	) {
		askMore();
	}
};

const onScroll = (e: Event) => {
	const target = e.currentTarget as HTMLElement | null;
	if (!target) return;
	const shouldLoadMore =
		target.scrollHeight - target.clientHeight / 2 <=
		target.scrollTop + target.clientHeight;
	if (lastScroll < target.scrollTop) {
		if (shouldLoadMore) {
			needMore();
		}
	}
	lastScroll = target.scrollTop;
};
</script>
<template>
	<div class="h-full w-full">
		<div
			v-if="!error"
			class="h-full w-full flex flex-col relative border rounded-lg overflow-hidden dark:border-gray-700"
		>
			<div
				class="left-0 w-full p-4 text-lg font-semibold text-left bg-white dark:bg-gray-800 border-b dark:border-gray-700"
			>
				<slot name="caption"></slot>
			</div>

			<div class="flex flex-grow overflow-x-auto" @scroll.passive="onScroll">
				<table
					class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
				>
					<thead
						class="h-11 border-b sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
						<tr>
							<th
								v-if="selectable"
								scope="col"
								class="w-12 px-3 cursor-pointer"
							>
								<div class="flex items-center">
									<AppInputCheckbox
										id="select-all"
										:key="`select-all-${areAllSelected}`"
										:value="areAllSelected"
										@change="handleSelectAllChange"
									/>
								</div>
							</th>
							<th
								v-for="column in columns"
								:key="column.label"
								scope="col"
								class="px-6 py-3 cursor-pointer"
								@click="column.sort ? changeSortHandler(column.field) : null"
							>
								<div class="flex items-center">
									{{ column.label }}
									<span v-if="!column.sort" class="w-3 h-3 ms-1.5" />
									<ArrowUpDown
										v-else-if="!order?.some((o) => o.field === column.field)"
										class="w-3 h-3 ms-1.5"
									/>
									<ArrowDown01
										v-else-if="
											column.sort === 'number' &&
											order?.find((o) => o.field === column.field)
												?.direction === 'asc'
										"
										class="w-3 h-3 ms-1.5"
									/>
									<ArrowUp01
										v-else-if="
											column.sort === 'number' &&
											order?.find((o) => o.field === column.field)
												?.direction === 'desc'
										"
										class="w-3 h-3 ms-1.5"
									/>
									<ArrowDownAZ
										v-else-if="
											column.sort === 'string' &&
											order?.find((o) => o.field === column.field)
												?.direction === 'asc'
										"
										class="w-3 h-3 ms-1.5"
									/>
									<ArrowUpAZ
										v-else-if="
											column.sort === 'string' &&
											order?.find((o) => o.field === column.field)
												?.direction === 'desc'
										"
										class="w-3 h-3 ms-1.5"
									/>
								</div>
							</th>
							<th v-if="slots.actions" scope="col" class="px-6 py-3">
								{{ t("Actions") }}
							</th>
						</tr>
					</thead>

					<tbody
						class="overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700"
					>
						<template v-if="items?.length">
							<template
								v-for="(item, index) in items"
								:key="`${item.id}-${item.selected}-${index}`"
							>
								<tr
									v-if="item.id"
									class="h-14 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<th
										v-if="selectable"
										scope="col"
										class="w-12 px-3 cursor-pointer"
									>
										<div class="flex items-center">
											<AppInputCheckbox
												:id="`select-${item.id}`"
												:value="item.selected"
												@change="handleSelectChange(item, $event)"
											/>
										</div>
									</th>
									<template v-for="column in columns">
										<td v-if="column.cell">
											<NuxtLink
												v-if="!column.customCellClick || rowClickUrl"
												:to="
													rowClickUrl
														? replaceTemplateVariables(rowClickUrl, item)
														: undefined
												"
												class="w-full h-full flex items-center p-4"
											>
												<slot :name="column.cell" v-bind="{ item }"></slot>
											</NuxtLink>

											<slot v-else :name="column.cell" v-bind="{ item }"></slot>
										</td>
										<td v-else class="">
											<NuxtLink
												v-if="!column.customCellClick || rowClickUrl"
												:to="
													rowClickUrl
														?.replaceAll('{id}', item.id)
														.replaceAll('{farmer_id}', item.farmer_id)
												"
												class="w-full h-full flex items-center px-6 py-4"
											>
												{{ getNestedValue(item, column.field) }}
											</NuxtLink>
											<template v-else>
												{{ getNestedValue(item, column.field) }}
											</template>
										</td>
									</template>
									<td v-if="slots.actions" class="px-3">
										<slot name="actions" v-bind="{ item }"></slot>
									</td>
								</tr>
								<tr
									v-else
									class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 h-14"
								>
									<td v-if="selectable" class="w-12 px-3">
										<div
											class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
										></div>
									</td>
									<td
										v-for="column in columns"
										:key="column.label"
										class="px-6 py-4"
									>
										<div
											class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
										></div>
									</td>
									<td v-if="slots.actions" class="px-6 py-4">
										<div
											class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
										></div>
									</td>
								</tr>
							</template>
						</template>
						<template v-else>
							<tr class="min-h-14">
								<td :colspan="columns.length + 1 + (selectable ? 1 : 0)">
									<slot name="state-empty">
										<TableBaseEmptyState />
									</slot>
								</td>
							</tr>
						</template>
					</tbody>
					<tfoot class="h-auto block"></tfoot>
				</table>
			</div>

			<div
				v-if="pageable"
				class="w-full block bg-white dark:bg-gray-800 border-t dark:border-gray-700"
			>
				<div class="w-full block">
					<div class="w-full block">
						<div
							:colspan="columns.length + (slots.actions ? 1 : 0)"
							class="w-full block"
						>
							<TableBasePager
								:itemsPerPage="take"
								:totalItemsCount="total"
								:currentPage="Math.round(skip / take) + 1"
								@update-current-page="skip = ($event - 1) * (take ?? 0)"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			v-else
			class="p-5 flex flex-col justify-center items-center text-red-500 dark:text-red-400"
		>
			{{ error }}
			<button
				:disabled="loading"
				class="flex items-center justify-center w-48 mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-700 dark:bg-primary-800 rounded-md hover:bg-primary-800 dark:hover:bg-primary-700"
				@click="emit('refresh')"
			>
				<RotateCw :size="12" class="mr-2" />
				{{ t("Refresh") }}
			</button>
		</div>
	</div>
</template>
