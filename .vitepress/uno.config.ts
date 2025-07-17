import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from "unocss";
import * as sass from "sass";
import postcss from "postcss";
import chalk from "chalk";
import path from "node:path";

const cssVarsRes = sass.compile(path.resolve(__dirname, "./theme/color.module.scss"));
const cssVarsString = cssVarsRes.css.toString();

const colorTheme = {};
postcss.parse(cssVarsString).walkDecls((decl) => {
	if (decl && decl.parent) {
		const row: any = decl.parent as any;
		if (row.selector === ":export") {
			// 转换成短横线，避免和unocss变量规则冲突
			const variableName = decl.prop.replace("--", "").replaceAll("-", "_");
			// const variableValue = decl.value;

			//为了方便全局调控，这里转换为css变量，同时失去了unocss的颜色规则
			// 如color - primary / 60 将失效，你可以使用 color - primary_60 来使用css变量。
			// 为了颜色使用的规范化，不建议使用太过于宽泛的unocss颜色规则，请使用css变量来预设颜色，包括透明度等，方便全局调控
			const variableValue = `var(--${variableName.replaceAll("_", "-")})`;
			colorTheme[variableName] = variableValue;
		}
	}
});

console.log(`unocss color themes : `, colorTheme);

console.log(
	chalk.red(`使用颜色时请务必查看 ${chalk.yellow("styles/variable.scss")} , 新增颜色请在此文件按规则创建颜色`)
);

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			prefix: ["i-"],
			extraProperties: {
				"display": "inline-block",
				"vertical-align": "middle",
			},
			collections: {
				solar: () =>
					import("@iconify-json/solar/icons.json", {
						with: { type: "json" },
					}).then((i) => i.default as any),
			},
			customizations: {
				iconCustomizer(collection, icon, props) {
					props.width = "1em";
					props.height = "1em";
				},
			},
		}),
	],
	theme: {
		colors: {
			...colorTheme,
		},
	},

	rules: [
		["bg-primary-gradient", { background: "linear-gradient(90deg, #D9ABE7 1%, #65BAF9 100%)" }],
		[
			"text-primary-gradient",
			{
				"background-image": "linear-gradient(to right, #D9ABE7 0%, #65BAF9 100%)",
				"background-clip": "text",
				"-webkit-background-clip": "text",
				"-webkit-text-fill-color": "transparent",
			},
		],
		[
			"absolute-center",
			{
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
			},
		],
		[
			"a-left-center",
			{
				left: "50%",
				transform: "translateX(-50%)",
			},
		],
		[
			/^text-ellipsis-(\d+)$/,
			([, lines]) => ({
				"overflow": "hidden",
				"display": "-webkit-box",
				"-webkit-line-clamp": lines,
				"-webkit-box-orient": "vertical",
				"text-overflow": "ellipsis",
				"word-break": "break-all",
			}),
		],
		[
			"text-ellipsis",
			{
				"overflow": "hidden",
				"display": "-webkit-box",
				"-webkit-line-clamp": "1",
				"-webkit-box-orient": "vertical",
				"text-overflow": "ellipsis",
				"word-break": "break-all",
			},
		],
		[
			"circle",
			{
				"border-radius": "50%",
			},
		],
	],
	transformers: [transformerDirectives()],
});
