<script setup lang="ts">
import FlagUK from "@/assets/icons/flags/uk.svg";
import FlagUS from "@/assets/icons/flags/us.svg";
import FlagDE from "@/assets/icons/flags/de.svg";
import FlagCH from "@/assets/icons/flags/ch.svg";
import FlagFR from "@/assets/icons/flags/fr.svg";
import FlagES from "@/assets/icons/flags/es.svg";
import FlagBR from "@/assets/icons/flags/br.svg";
import FlagUA from "@/assets/icons/flags/ua.svg";
import FlagPL from "@/assets/icons/flags/pl.svg";
import FlagNL from "@/assets/icons/flags/nl.svg";
import FlagDK from "@/assets/icons/flags/dk.svg";
import FlagSE from "@/assets/icons/flags/se.svg";
import FlagFI from "@/assets/icons/flags/fi.svg";

const locales = [
	{ locale: "en-UK", name: "English (United Kingdom)", flag: FlagUK },
	{ locale: "en-US", name: "English (United States)", flag: FlagUS },
	{ locale: "de-DE", name: "Deutsch (Deutschland)", flag: FlagDE },
	{ locale: "de-CH", name: "Deutsch (Schweiz)", flag: FlagCH },
	{ locale: "fr-FR", name: "Français (France)", flag: FlagFR },
	{ locale: "es-ES", name: "Español (España)", flag: FlagES },
	{ locale: "pt-BR", name: "Português (Brasil)", flag: FlagBR },
	// { locale: "uk-UA", name: "Українська", flag: FlagUA },
	// { locale: "pl-PL", name: "Polski", flag: FlagPL },
	// { locale: "nl-NL", name: "Nederlands", flag: FlagNL },
	// { locale: "da-DK", name: "Dansk", flag: FlagDK },
	// { locale: "sv-SE", name: "Svenska", flag: FlagSE },
	// { locale: "fi-FI", name: "Suomi", flag: FlagFI },
];

const { locale, setLocale } = useI18n();

const currentLocale = computed(() => {
	return locales.find((l) => l.locale === locale.value);
});
</script>
<template>
	<AppDropdownBase>
		<template #default="{ toggle, state }">
			<button
				v-if="currentLocale"
				type="button"
				title="Change language"
				aria-label="Change language"
				class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:hover:text-white dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"
				@click="toggle"
			>
				<div class="h-5 w-5 rounded-full overflow-hidden">
					<component :is="currentLocale.flag" />
				</div>
			</button>
		</template>
		<template #modal="{ toggle }">
			<div
				class="z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
				id="language-dropdown"
			>
				<ul class="py-1" role="none">
					<li v-for="locale in locales">
						<button
							class="w-full flex flex-row items-start py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600"
							role="menuitem"
							type="button"
							:aria-label="`Switch to ${locale.name}`"
							@click="
								setLocale(locale.locale);
								toggle();
							"
						>
							<div class="inline-flex items-center">
								<component
									:is="locale.flag"
									class="h-3.5 w-3.5 shrink-0 rounded-full mr-2"
								/>
								{{ locale.name }}
							</div>
						</button>
					</li>
				</ul>
			</div>
		</template>
	</AppDropdownBase>
</template>
