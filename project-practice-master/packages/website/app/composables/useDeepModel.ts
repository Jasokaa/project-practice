// Fixes lack of deep reactivity in Vue 3 for model values
// Example issue: https://github.com/vuejs/core/issues/11143
export function useDeepModel<T>(model: Ref<T>) {
	const localValue = ref<T>(model.value);

	watch(
		model,
		(newValue) => {
			localValue.value = newValue;
		},
		{ immediate: true, deep: true }
	);

	watch(
		localValue,
		(newValue) => {
			model.value = newValue;
		},
		{ deep: true }
	);

	return localValue;
}
