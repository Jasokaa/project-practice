<script setup lang="ts">
import { ChevronLeft, RotateCw } from "lucide-vue-next";
import type { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "~~/server/trpc/routers";

const { t } = useI18n();

defineProps({
	error: {
		type: [String, Object, null] as PropType<
			string | Error | null | TRPCClientError<AppRouter> | any
		>,
		required: false,
		default: null,
	},
	status: {
		type: String as PropType<"idle" | "pending" | "success" | "error">,
	},
	refresh: {
		type: Function as PropType<() => void | Promise<void>>,
		required: false,
	},
});
</script>
<template>
	<div class="w-full flex flex-col items-center justify-center space-y-4 pt-12">
		<div class="text-red-600 text-xl">
			<h2 v-if="error">{{ error }}</h2>
			<h2 v-else>{{ t("Requested entity not found") }}</h2>
		</div>

		<AppButtonBase
			v-if="refresh && error && error.data?.code !== 'BAD_REQUEST'"
			:disabled="status === 'idle'"
			variant="primary"
			:icon="RotateCw"
			type="button"
			@click="refresh"
		>
			{{ t("Refresh") }}
		</AppButtonBase>
		<NuxtLinkLocale v-else to="/dashboard">
			<AppButtonBase
				variant="primary"
				:icon-start="ChevronLeft"
				:disabled="status === 'idle'"
				type="button"
				@click="refresh"
			>
				{{ t("Back to dashboard") }}
			</AppButtonBase>
		</NuxtLinkLocale>
	</div>
</template>
