/// <reference types="vite/client" />
import type { App } from "vue";
/**
 * 批量注册全局组件
 * @param app App
 */
export function registerGlobalComponents(app: App) {
	const components = import.meta.glob("./**/index.vue", { eager: true });
	for (const path in components) {
		const component = (components[path] as { default: { name: string } }).default;
		// 写了组件name且以base开头,则自动挂载到全局组件
		if (
			component.name &&
			(component.name.toLocaleLowerCase().startsWith("base") || component.name.toLocaleLowerCase().startsWith("svg"))
		) {
            console.log(`component.name`,component.name)
			app.component(component.name, component);
		}
	}
}
