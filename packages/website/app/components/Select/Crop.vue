<template>
	<select
		v-model="value"
		id="crop"
		name="crop"
		class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
	>
		<option :value="null" :disabled="false">{{ t("Not selected") }}</option>
		<option v-for="crop in crops" :key="crop.id" :value="crop.id">
			{{ crop.name }} - {{ crop.code }} - {{ crop.eppo_code }}
		</option>
	</select>
</template>
<script setup lang="ts">
const { $client } = useNuxtApp();
const { t } = useI18n();

const value = defineModel<number | null>();

const { data: crops } = $client.crops.selectOptions.useQuery();
</script>
