---
title: 基于winston的分类日志存储
description: 基于winston的分类日志存储
editLink: false
---

# {{ $frontmatter.title }}

实现如下功能：

1. 实现日志服务`logger.service.ts` , 能够全局调用
2. 日志分类存储, 如`logs/http/2025-04-21.log` 存储 api 请求相关的日志

## 方案分析

第一眼感觉这个似乎没啥好写的，每个日志分类创建一个`service`，如`HttpService`,`UserService`,每个`service`包含一个自定义个`logger`， 再注册到全局即可。但仔细想想，每个`logger`的参数配置都是一样，只是要写入到不同的文件夹而已。所以有以下 2 中方案：

1. 每个`service` 包含一个独立的`logger`（多个logger实例，多个transport）
2. 所有`service`公用一个`logger`，通过`transport`来实现日志过滤（1个logger实例，多个transport）

很明显，在业务模块（日志分类）不算多的情况下，方案 2 比较合理，能明显减少代码冗余和文件句柄。

## 依赖安装

```bash
pnpm add winston nest-winston winston-daily-rotate-file
```

## 接口设计

```ts
// logger.constants.ts
// 定义允许的日志分类

export const LOG_CATEGORIES_CONSTANTS = ["http", "user"] as const satisfies readonly string[];
```

```ts
// logger.types.ts
import type { LOG_CATEGORIES_CONSTANTS } from "src/common/constants/logger.constants";
// 日志名称
export type LogName = (typeof LOG_CATEGORIES_CONSTANTS)[number];
// 日志类型
export type LogLevel = "info" | "warn" | "error" | "debug";
// 自定义metadata参数
export interface IBaseLogMetadata {
	category: LogName;
	level: LogLevel;
	[key: string]: unknown;
}

export interface IBaseLogger {
	/**
	 * 输出日志
	 * @param message 日志标题
	 * @param params 日志内容
	 * @param metadata
	 */
	log(message: string, params?: object | string, metadata?: Omit<IBaseLogMetadata, "category">): void;
	/**
	 * 错误日志
	 * @param message 日志标题
	 * @param params 日志内容 Error or Object
	 * @param metadata
	 */
	error(message: string, params?: object, metadata?: Omit<IBaseLogMetadata, "category">): void;
	warn(message: string, params?: object, metadata?: Omit<IBaseLogMetadata, "category">): void;
	debug(message: string, params?: object, metadata?: Omit<IBaseLogMetadata, "category">): void;
}

export type LogNameMap = {
	[K in LogName]: IBaseLogger;
};

export type LoggerToken<T extends keyof LogNameMap> = `Logger:${Capitalize<T>}`;
```

## logger.service.ts

最基础的 `loggerService`, 提供一个 `Logger` 和 `.log`,`.error` 方法

```ts
import { Injectable, Scope } from "@nestjs/common";
import { IBaseLogMetadata, LogName } from "src/common/types";
import { createLogger, transports, format, Logger, Logform } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

const defaultLogMetaData: IBaseLogMetadata = {
	category: "http",
	level: "info",
};

// 这里过滤transport，
const filterTransportByCategory = (category: LogName) => {
	return format((info: Logform.TransformableInfo) => {
		if (info.category && info.category !== category) return false;
		return info;
	})();
};

function printfMessagePayload(info: Logform.TransformableInfo) {
	const { timestamp, level, message, ...metadata } = info;
	// 确保时间戳在日志的最前面，并且处理 metadata（如 params）
	let logMessage = `${timestamp as string} [${level}] : ${message as string}`;
	// 如果有 metadata（附加的对象），将它们格式化为 JSON
	if (Object.keys(metadata).length > 0) {
		if (metadata.message !== "message") {
			logMessage += ` | ${JSON.stringify(metadata, null, 2)}`;
		}
	}
	return logMessage;
}
// 单例模式，整个应用生命周期的组件共享一个LoggerService实例
@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
	private logger: Logger;
	private transportsMap = new Map<string, DailyRotateFile.DailyRotateFileTransportOptions>();

	constructor() {
		this.logger = createLogger({
			level: "info",
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 设置时间戳格式
				format.printf((info) => {
					return printfMessagePayload(info);
				})
			),
			transports: [
				// 控制台输出
				new transports.Console({
					format: format.combine(
						format.colorize(), // 颜色化输出
						format.simple() // 简单格式
					),
				}),
			],
		});
	}

	// 动态添加transport
	private ensureTransport(category: LogName): void {
		if (!this.transportsMap.has(category)) {
			const transport = new DailyRotateFile({
				filename: `logs/${category}/%DATE%.log`,
				datePattern: "YYYY-MM-DD", // 设置日期格式
				maxFiles: "7d", // 保留最近 7 天的日志文件
				level: "info", // 日志级别为 info
				format: format.combine(
					filterTransportByCategory(category),
					format.timestamp({
						format: "YYYY-MM-DD HH:mm:ss",
					}),
					format.printf((info: Logform.TransformableInfo) => {
						return printfMessagePayload(info);
					})
				),
			});
			this.logger.add(transport);
			this.transportsMap.set(category, transport);
		}
	}
	log(message: string, params: object | string = {}, metadata: IBaseLogMetadata = defaultLogMetaData) {
		const logMethod = metadata.level || "info";
		this.ensureTransport(metadata.category);
		if (typeof params === "object") {
			// 如果 params 对象存在，则将日志以自定义格式输出
			const logMessage = {
				message,
				...params,
			};
			this.logger[logMethod](logMessage);
		} else {
			this.logger[logMethod](message + " " + params);
		}
	}
	error(message: string, err: Error | object = {}, metadata: IBaseLogMetadata = defaultLogMetaData) {
		this.log(
			message,
			{
				message: err instanceof Error ? err?.message : message,
				stack: err instanceof Error ? err?.stack : "",
				...err,
			},
			{
				...metadata,
				level: "error",
			}
		);
	}
}
```

## logger.factory.ts

用于创建不同的 loggerService

```bash
import { Injectable } from '@nestjs/common';
import {
  LogName,
  IBaseLogger,
  IBaseLogMetadata,
} from 'src/common/types';
import { LoggerService } from './logger.service';

export type BaseLoggerFactory = (
  category: LogName,
) => new (logger: LoggerService) => IBaseLogger;

export const CreateLogger: BaseLoggerFactory = (category: LogName) => {
  @Injectable()
  class BaseLogger implements IBaseLogger {
    constructor(private readonly logger: LoggerService) {}

    private createMetadata(
      metadata: Omit<IBaseLogMetadata, 'category'>,
    ): IBaseLogMetadata {
      return { category, ...metadata };
    }

    log(
      message: string,
      info: object | string = {},
      metadata: Omit<IBaseLogMetadata, 'category'>,
    ) {
      let params = info;
      if (typeof info === 'object') {
        if (info instanceof Error) {
          params = {
            ...info,
            message: info.message,
            stack: info.stack,
          };
        } else {
          params = info;
        }
      }
      this.logger.log(message, params, this.createMetadata(metadata));
    }

    error(
      message: string,
      err: Error | object = {},
      metadata: Omit<IBaseLogMetadata, 'category'>,
    ) {
      this.logger.error(message, err, this.createMetadata(metadata));
    }
    warn(
      message: string,
      params: object,
      metadata: Omit<IBaseLogMetadata, 'category'>,
    ): void {
      this.logger.log(message, params, this.createMetadata(metadata));
    }
    debug(
      message: string,
      params: object,
      metadata: Omit<IBaseLogMetadata, 'category'>,
    ): void {
      this.logger.log(message, params, this.createMetadata(metadata));
    }
  }

  return BaseLogger;
};

```

## logger.module.ts

提供 logger providers，注册到全局

```ts
// src/logger/global-logger.module.ts
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { CreateLogger } from "./logger.factory";
import { LOGGER_CONSTANTS } from "src/common/constants/logger.constants";
import { LoggerToken } from "src/common/types";
import { generateLoggerToken } from "src/common/utils/logger.utils";

@Module({})
export class LoggerModule {
	static forRoot(): DynamicModule {
		// 动态生成所有分类的 Provider
		const providers: Provider[] = LOGGER_CONSTANTS.ALLOWED_CATEGORIES.map((category) => {
			const token: LoggerToken<typeof category> = generateLoggerToken(category);
			return {
				provide: token, // 生成唯一 Token，如 "HttpLogger"
				useFactory: (logger: LoggerService) => {
					const LoggerClass = CreateLogger(category);
					return new LoggerClass(logger);
				},
				inject: [LoggerService],
			};
		});

		return {
			module: LoggerModule,
			imports: [],
			providers: [LoggerService, ...providers],
			exports: [LoggerService, ...providers],
			global: true, // 标记为全局模块
		};
	}
}
```

## 工具函数 `logger.utils.ts`

```ts
import { FastifyRequest } from "fastify";
import { LOGGER_CONSTANTS } from "../constants/logger.constants";
import { getRequestContextStore } from "../stores/request-context.store";
import { ApiBadResponse, ApiOkResponse, LogNameMap } from "../types";

export const generateLoggerToken = <T extends keyof LogNameMap>(category: T): `Logger:${Capitalize<T>}` => {
	return `Logger:${category[0].toUpperCase() + category.slice(1)}` as `Logger:${Capitalize<T>}`;
};

/**
 * 敏感词过滤
 * @param obj
 * @returns
 */
function filterSensitive(obj: Record<string, any>): Record<string, any> {
	if (!obj) return {};
	return Object.keys(obj).reduce((acc, key) => {
		if (key in LOGGER_CONSTANTS.SENSITIVE_KEYS) {
			acc[key] = "******";
		} else {
			acc[key] = obj[key] as string;
		}
		return acc;
	}, {});
}

/**
 * 格式化 request 到日志
 * @param request
 * @returns
 */
export function formatRequest(request: FastifyRequest) {
	const { method, url, headers, body, query } = request;
	const store = getRequestContextStore();
	const request_id = store?.get("request_id") as string;
	return {
		method,
		url,
		headers: filterSensitive(headers),
		query: filterSensitive(query as Record<string, any>),
		body: filterSensitive(body as Record<string, any>),
		request_id,
		ip: store?.get("ip") as string,
	};
}

/**
 * 格式化 response 到日志
 * @param response
 * @returns
 */
export function formatResponse(response: ApiOkResponse | ApiBadResponse) {
	return response;
}
```

## 全局装饰器 @InjectLogger

```ts
// logger.decorator.ts
import { Inject } from "@nestjs/common";
import { LogNameMap } from "../types";
import { generateLoggerToken } from "../utils/logger.utils";

export const InjectLogger = <T extends keyof LogNameMap>(category: T) => Inject(generateLoggerToken(category));
```

## 在 app.module.ts 中注册全局 LoggerModule

```ts
@Module({
    import: [
        //...
        LoggerModule.forRoot()
        //...
    ]
})
```

## 使用

需要新增日志类型，需要下在`LOG_CATEGORIES_CONSTANTS`中新增即可。

如在`user.service.ts` 中使用日志 service

```ts
@Injectable()
export class UserService {
	constructor(
		@InjectLogger("user")
		private readonly userLogger: LoggerNameMap["user"]
	) {}

	someMethod() {
		this.userLogger.log("message", { foo: "foo" });
	}
}
```

## 注意事项

使用`app.use`注册的全局 class，无法自动注入 loggerService， 需要改为在`app.module.ts`中使用`provide`的方式注册，如：

```ts
@Module({
    //...
    providers: [
        AppService,
        {
        provide: APP_GUARD,
        useClass: jwtAuthGuard,
        },
        {
        provide: APP_FILTER,
        useClass: GlobalErrorExceptionFilter,
        },
        {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
        },
        {
        provide: APP_INTERCEPTOR,
        useClass: TransformInterceptor,
        },
        {
        provide: APP_PIPE,
        useClass: ValidationPipe,
        },
        RedisService,
    ],
    //..
})
```
