<script setup lang="ts">
import {
	ChevronLeft,
	ChevronsLeft,
	ChevronRight,
	ChevronsRight,
} from "lucide-vue-next";

const { t } = useI18n();

const props = defineProps({
	itemsPerPage: {
		type: Number,
		required: true,
	},
	totalItemsCount: {
		type: Number,
		required: true,
	},
	currentPage: {
		type: Number,
		required: true,
	},
	pages: {
		type: Number,
		default: 7,
	},
	quickPrev: {
		type: Boolean,
		default: true,
	},
	quickNext: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits<{
	(eventName: "update-current-page", data: number): void;
}>();

const hasPrevMore = ref(false);
const hasNextMore = ref(false);
const quickStep = ref(0);

const totalPages = computed(() => {
	return Math.ceil(props.totalItemsCount / props.itemsPerPage);
});

const pages = computed(() => {
	const pagerCount = props.pages;
	const halfPagerCount = (pagerCount - 1) / 2;

	const currentPage = Number(props.currentPage);
	const pageCount = Number(totalPages.value);

	let showPrevMore = false;
	let showNextMore = false;

	if (pageCount > pagerCount) {
		if (currentPage > pagerCount - halfPagerCount) {
			showPrevMore = true;
		}

		if (currentPage < pageCount - halfPagerCount) {
			showNextMore = true;
		}
	}

	const array = [];

	if (showPrevMore && !showNextMore) {
		const startPage = pageCount - (pagerCount - 2);
		for (let i = startPage; i < pageCount; i++) {
			array.push(i);
		}
	} else if (!showPrevMore && showNextMore) {
		for (let _i = 2; _i < pagerCount; _i++) {
			array.push(_i);
		}
	} else if (showPrevMore && showNextMore) {
		const offset = Math.floor(pagerCount / 2) - 1;
		for (let _i2 = currentPage - offset; _i2 <= currentPage + offset; _i2++) {
			array.push(_i2);
		}
	} else {
		for (let _i3 = 2; _i3 < pageCount; _i3++) {
			array.push(_i3);
		}
	}

	hasPrevMore.value = showPrevMore;
	hasNextMore.value = showNextMore;
	quickStep.value = props.pages - 4;

	const pages = [1, ...array];
	if (pages[pages.length - 1] !== pageCount && pageCount > 1) {
		pages.push(pageCount);
	}
	return pages;
});

const goToPage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		emit("update-current-page", page);
	}
};
</script>
<template>
	<div class="w-full relative">
		<nav
			class="w-full flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
			aria-label="Table navigation"
		>
			<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
				{{ t("Showing") }}
				<span class="font-semibold text-gray-900 dark:text-white">
					{{ itemsPerPage * (currentPage - 1) + 1 }}
					-
					{{
						itemsPerPage * currentPage > totalItemsCount
							? totalItemsCount
							: itemsPerPage * currentPage
					}}
				</span>
				{{ t("of") }}
				<span class="font-semibold text-gray-900 dark:text-white">
					{{ totalItemsCount }}
				</span>
			</span>
			<ul class="inline-flex items-stretch -space-x-px">
				<li>
					<button
						:disabled="currentPage === 1"
						class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						@click="goToPage(currentPage - 1)"
					>
						<span class="sr-only">Previous</span>
						<ChevronLeft class="w-5 h-5" />
					</button>
				</li>
				<li v-if="quickPrev && hasPrevMore">
					<button
						class="flex items-center justify-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						@click="goToPage(currentPage - quickStep)"
					>
						<span class="sr-only">-{{ quickStep }}</span>
						<ChevronsLeft class="w-5 h-5" />
					</button>
				</li>
				<li v-for="pageNumber in pages" :key="pageNumber">
					<button
						v-if="currentPage !== pageNumber"
						class="flex leading-5 items-center justify-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						@click="goToPage(pageNumber)"
					>
						{{ pageNumber }}
					</button>
					<button
						v-else
						class="z-10 leading-5 flex items-center justify-center px-3 py-2 text-sm border text-primary-700 bg-primary-50 border-primary-400 hover:bg-primary-200 hover:text-primary-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						@click="goToPage(pageNumber)"
					>
						{{ pageNumber }}
					</button>
				</li>
				<li v-if="quickNext && hasNextMore">
					<button
						class="flex items-center justify-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						@click="goToPage(currentPage + quickStep)"
					>
						<span class="sr-only">+{{ quickStep }}</span>
						<ChevronsRight class="w-5 h-5" />
					</button>
				</li>
				<li>
					<button
						:disabled="currentPage === totalPages"
						class="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						@click="goToPage(currentPage + 1)"
					>
						<span class="sr-only">Next</span>
						<ChevronRight class="w-5 h-5" />
					</button>
				</li>
			</ul>
		</nav>
	</div>
</template>
<style scoped>
.pagination__container {
	border-bottom: 1px solid #ededed;
	border-radius: 2px;
}

.pagination__items {
	display: flex;
	justify-content: center;
}

.pagination__item {
	margin-right: 10px;
	padding: 6px 12px;
	line-height: 1.42857143;
	text-decoration: none;
	color: #337ab7;
	border: none;
	background-color: #f0f4f8;
	cursor: pointer;
}

.selected__item {
	color: #23527c;
	background-color: #eee;
}

.disabled__item {
	color: #23527c;
	background-color: #eee;
}
</style>
