<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
	<footer class="bg-candyPink-600 text-white py-12">
		<div class="max-w-screen-xl mx-auto px-4">
			<div class="grid md:grid-cols-4 gap-8">
				<!-- Brand -->
				<div class="col-span-2 md:col-span-1">
					<div class="flex items-center mb-4">
						<div
							class="mr-3 h-8 w-8 bg-candyYellow-400 rounded-full flex items-center justify-center"
						>
							<span class="text-candyPink-800 font-bold text-lg">🍬</span>
						</div>
						<span class="text-xl font-bold">
							{{ config.public.STORE_NAME }}
						</span>
					</div>
					<p class="text-candyYellow-50 text-sm leading-relaxed">
						Colorful gummy candies, chewy sweets and fruity jelly treats
						for every mood. Sweet little bites that make every day better.
					</p>
				</div>

				<!-- Contact Info -->
				<div>
					<h3 class="text-lg font-semibold mb-4 text-candyYellow-200">
						Contact
					</h3>
					<div class="space-y-3 text-sm">
						<div class="flex items-center">
							<span class="mr-2"> 📍 </span>
							<span class="text-candyYellow-50">
								{{ config.public.STORE_LOCATION.region }}
							</span>
						</div>
						<div class="flex items-center">
							<span class="mr-2"> 📞 </span>
							<a
								:href="`tel:${config.public.CONTACT.phone}`"
								class="text-candyYellow-50 hover:text-white transition-colors"
							>
								{{ config.public.CONTACT.phone }}
							</a>
						</div>
						<div class="flex items-center">
							<span class="mr-2">
								<AppIconTelegram class="w-5 h-5" />
							</span>
							<a
								:href="`https://t.me/${config.public.CONTACT.telegram.replace('@','')}`"
								target="_blank"
								class="text-candyYellow-50 hover:text-white transition-colors"
							>
								{{ config.public.CONTACT.telegram }}
							</a>
						</div>
					</div>
				</div>

				<!-- Quick Links -->
				<div>
					<h3 class="text-lg font-semibold mb-4 text-candyYellow-200">
						Quick Links
					</h3>
					<div class="space-y-2 text-sm">
						<NuxtLink
							to="/"
							class="block text-candyYellow-50 hover:text-white transition-colors"
						>
							Home
						</NuxtLink>
						<NuxtLink
							to="/catalog"
							class="block text-candyYellow-50 hover:text-white transition-colors"
						>
							Catalog
						</NuxtLink>
						<NuxtLink
							to="/order-status"
							class="block text-candyYellow-50 hover:text-white transition-colors"
						>
							Order status
						</NuxtLink>
						<NuxtLink
							to="/delivery-faq"
							class="block text-candyYellow-50 hover:text-white transition-colors"
						>
							Delivery & FAQ
						</NuxtLink>
						<a
							:href="`tel:${config.public.CONTACT.phone}`"
							class="block text-candyYellow-50 hover:text-white transition-colors"
						>
							Order now
						</a>
					</div>
				</div>

				<!-- Social Media -->
				<div>
					<h3 class="text-lg font-semibold mb-4 text-candyYellow-200">
						Social Media
					</h3>
					<div class="flex space-x-4">
						<a
							:href="`https://t.me/${config.public.CONTACT.telegram.replace('@','')}`"
							target="_blank"
							class="bg-candyYellow-100 hover:bg-candyYellow-300 p-3 rounded-lg transition-colors"
							title="Telegram"
						>
							<AppIconTelegram class="w-5 h-5" />
						</a>
						<a
							:href="config.public.CONTACT.facebook"
							target="_blank"
							class="bg-candyYellow-100 hover:bg-candyYellow-300 p-3 rounded-lg transition-colors"
							title="Facebook"
						>
							<AppIconFacebook class="w-5 h-5" />
						</a>
						<a
							:href="`https://wa.me/${config.public.CONTACT.whatsapp.replace(/\D/g,'')}`"
							target="_blank"
							class="bg-candyYellow-100 hover:bg-candyYellow-300 p-3 rounded-lg transition-colors"
							title="WhatsApp"
						>
							<AppIconWhatsApp class="w-5 h-5 text-candyGreen-600" />
						</a>
					</div>
				</div>
			</div>

			<!-- Delivery Info -->
			<div class="mt-8 pt-8 border-t border-candyPink-300">
				<div class="grid md:grid-cols-2 gap-6 text-sm">
					<div>
						<h4 class="font-semibold text-candyYellow-200 mb-2">
							Delivery
						</h4>
						<p class="text-candyYellow-50">
							📦 Delivery across Ukraine via Nova Poshta or Ukrposhta
							(carrier rates apply)<br />
							🎁 Free delivery for orders over 1000 UAH
						</p>
					</div>
					<div>
						<h4 class="font-semibold text-candyYellow-200 mb-2">
							Support
						</h4>
						<p class="text-candyYellow-50">
							💬 Message us for help with your order<br />
							📞 We are happy to answer your questions every day from 8:00 to 21:00
						</p>
					</div>
				</div>
			</div>

			<!-- Copyright -->
			<div class="mt-8 pt-8 border-t border-candyPink-300 text-center">
				<p class="text-candyYellow-50 text-sm">
					© 2025 {{ config.public.STORE_NAME }}. All rights reserved.
				</p>
				<p class="text-candyYellow-100 text-xs mt-2">
					Simply Jellylicious 🍬
				</p>
			</div>
		</div>
	</footer>
</template>
