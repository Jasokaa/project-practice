<script setup lang="ts">
import { BellRing } from "lucide-vue-next";
import type { Notification } from "../../../Layout/Header/Dashboard/Notifications.vue";
import { PersonTrialRoleLabels } from "prismaclient/enums";
import { formatTimeAgo } from "@/utils";

const props = defineProps({
	notification: {
		type: Object as PropType<Notification>,
		required: true,
	},
});

const formattedDateTime = computed(() => {
	return formatTimeAgo(props.notification.createdAt);
});

const exactDateTime = computed(() => {
	const date = new Date(props.notification.createdAt);
	return date.toLocaleString("de-DE") + " (Your local time)";
});

const name = computed(() => {
	return props.notification.Sender
		? `${props.notification.Sender.first_name} ${props.notification.Sender.last_name}`.trim()
		: "System";
});

const link = computed(() => {
	switch (props.notification.Type?.name) {
		case "TRIAL_RESPONSIBLE_ADDED_TO_TRIAL":
			return `/trials/${props.notification.TrialResponsible?.Trial?.id}/edit`;
		default:
			return "#";
	}
});
</script>
<template>
	<NuxtLink
		:to="link"
		class="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
	>
		<div class="flex-shrink-0">
			<PersonAvatar :person="notification.Sender" class="w-10 h-10" />
			<div
				class="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700"
			>
				<BellRing class="w-3 h-3 text-white" />
			</div>
		</div>
		<div class="pl-3 w-full">
			<div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
				<template
					v-if="notification.Type?.name === 'TRIAL_RESPONSIBLE_ADDED_TO_TRIAL'"
				>
					<span class="font-semibold text-gray-900 dark:text-white">
						{{ name }}
					</span>
					added you as
					<span class="font-semibold text-gray-900 dark:text-white">
						{{
							notification.TrialResponsible?.role
								? PersonTrialRoleLabels[notification.TrialResponsible?.role]
								: "Unknown"
						}}
					</span>
					to the trial
					<span class="font-semibold text-gray-900 dark:text-white">
						{{ notification.TrialResponsible?.Trial?.title }}
					</span>
				</template>
			</div>
			<div
				class="text-xs font-medium text-primary-600 dark:text-primary-500"
				:title="exactDateTime"
			>
				{{ formattedDateTime }}
			</div>
		</div>
	</NuxtLink>
</template>
