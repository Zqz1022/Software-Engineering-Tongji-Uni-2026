export interface paths {
    "/auth/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前环境的登录能力 */
        get: operations["getLoginOptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/csrf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 获取绑定当前会话的 CSRF token
         * @description 浏览器保存响应中的 SESSION Cookie，并在写请求中回传 Cookie 和指定的 CSRF 请求头。
         */
        get: operations["getCsrfToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前普通账号资料 */
        get: operations["getCurrentUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 注销当前会话 */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/dev/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 使用固定开发身份建立普通用户会话
         * @description 仅 dev/test 环境可用；prod 不注册该接口。不能选择管理角色或自定义账号。
         */
        post: operations["createDevelopmentSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/boards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 读取已启用的校园板块
         * @description 要求有效会话和正常账号状态，按 sort_order 与 id 排序。框架只提供板块列表，不代表帖子故事已完成。
         */
        get: operations["listBoards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LoginOptions: {
            devLoginEnabled: boolean;
        };
        Csrf: {
            /** @enum {string} */
            headerName: "X-CSRF-TOKEN";
            token: string;
        };
        User: {
            /** Format: int64 */
            id: number;
            displayName: string;
            /** @enum {string} */
            status: "ACTIVE" | "RESTRICTED";
        };
        Board: {
            /** Format: int64 */
            id: number;
            code: string;
            name: string;
            description: string;
        };
        BoardList: {
            items: components["schemas"]["Board"][];
        };
        ApiError: {
            code: string;
            message: string;
            status: number;
        };
    };
    responses: {
        /** @description 未登录或会话失效 */
        Unauthenticated: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ApiError"];
            };
        };
        /** @description CSRF 校验失败、账号受限或权限不足 */
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ApiError"];
            };
        };
    };
    parameters: {
        /** @description 由 /auth/csrf 返回的 token；登录或注销后重新获取。 */
        CsrfHeader: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getLoginOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 登录能力 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginOptions"];
                };
            };
        };
    };
    getCsrfToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSRF 请求头名称与 token */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Csrf"];
                };
            };
        };
    };
    getCurrentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 有效且未受限的当前账号 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            401: components["responses"]["Unauthenticated"];
            403: components["responses"]["Forbidden"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header: {
                /** @description 由 /auth/csrf 返回的 token；登录或注销后重新获取。 */
                "X-CSRF-TOKEN": components["parameters"]["CsrfHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 当前会话已失效 */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["Forbidden"];
        };
    };
    createDevelopmentSession: {
        parameters: {
            query?: never;
            header: {
                /** @description 由 /auth/csrf 返回的 token；登录或注销后重新获取。 */
                "X-CSRF-TOKEN": components["parameters"]["CsrfHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: int64 */
                    userId: number;
                };
            };
        };
        responses: {
            /** @description 会话已创建并更换会话标识 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            /** @description 开发身份不合法 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
            403: components["responses"]["Forbidden"];
            /** @description 当前环境未启用开发登录 */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiError"];
                };
            };
        };
    };
    listBoards: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 板块列表 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BoardList"];
                };
            };
            401: components["responses"]["Unauthenticated"];
            403: components["responses"]["Forbidden"];
        };
    };
}
