import vt, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(vt);
	return {
		provide: {
			toast: useToast(),
		},
	};
});
