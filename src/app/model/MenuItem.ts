import { MenuPermission } from "./MenuPermission";

export interface MenuItem {
    title: string
    url: string
    permissions: MenuPermission[]
}