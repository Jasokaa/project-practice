<script setup lang="ts">
import { LayoutGrid, Search, ShoppingCart } from "lucide-vue-next";

const config = useRuntimeConfig();
const cartStore = useCartStore();
</script>

<template>
<header
	class="h-16 w-full flex flex-col justify-center sticky top-0 bg-candyYellow-200 shadow-sm border-b border-candyYellow-300 z-50"
>

<nav class="px-4 lg:px-6">

<div class="h-full flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

<!-- Logo -->

<NuxtLink to="/" class="flex items-center" aria-label="Home page">

<div class="mr-3 h-8 w-8 bg-candyPink-500 rounded-full flex items-center justify-center">
<span class="text-white font-bold text-lg">🍬</span>
</div>

<span class="hidden 2xs:block self-center md:text-xl font-bold text-gray-900 text-lg">
{{ config.public.STORE_NAME }}
</span>

</NuxtLink>


<!-- Desktop menu -->

<div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">

<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">

<li>
<NuxtLink
to="/catalog"
class="flex flex-row items-center gap-2 py-2 pr-4 pl-3 text-gray-800 hover:text-candyPink-500 lg:p-0 transition-colors"
active-class="text-candyPink-500 font-semibold"
>
<LayoutGrid />
Catalog
</NuxtLink>
</li>

<li>
<NuxtLink
to="/order-status"
class="flex flex-row items-center gap-2 py-2 pr-4 pl-3 text-gray-800 hover:text-candyPink-500 lg:p-0 transition-colors"
active-class="text-candyPink-500 font-semibold"
>
<Search />
Track order
</NuxtLink>
</li>

<li>
<NuxtLink
to="/cart"
class="flex flex-row items-center gap-2 py-2 pr-4 pl-3 text-gray-800 hover:text-candyPink-500 lg:p-0 transition-colors"
active-class="text-candyPink-500 font-semibold"
>

<div class="relative">

<ShoppingCart />

<span
v-if="cartStore.itemCount > 0"
class="absolute -top-3 -right-3 bg-candyPink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
>

{{ cartStore.itemCount > 99 ? "99+" : cartStore.itemCount }}

</span>

</div>

Cart

</NuxtLink>
</li>

</ul>

</div>


<!-- Mobile icons -->

<div class="flex items-center space-x-4 lg:hidden">

<NuxtLink
to="/catalog"
class="relative p-2 text-gray-800 hover:text-candyPink-500 transition-colors"
aria-label="Catalog"
>
<LayoutGrid class="w-6 h-6" />
</NuxtLink>

<NuxtLink
to="/order-status"
class="relative p-2 text-gray-800 hover:text-candyPink-500 transition-colors"
aria-label="Order status"
>
<Search class="w-6 h-6" />
</NuxtLink>

<NuxtLink
to="/cart"
class="relative p-2 text-gray-800 hover:text-candyPink-500 transition-colors"
aria-label="Cart"
>

<ShoppingCart class="w-6 h-6" />

<span
v-if="cartStore.itemCount > 0"
class="absolute -top-1 -right-1 bg-candyPink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
>

{{ cartStore.itemCount > 99 ? "99+" : cartStore.itemCount }}

</span>

</NuxtLink>

</div>

</div>

</nav>

</header>
</template>
