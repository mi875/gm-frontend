import { postMemberAdmin } from "@/components/api/methos";
import { Member } from "@/components/types/member";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Cookies } from "next-client-cookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AdminBadge } from "../admin-badge";

export function getColumns(
    cookieStore: Cookies,
    router: AppRouterInstance,
    spaceId: string,
    fetchMembers: () => Promise<void>
): ColumnDef<Member>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "admin",
            header: "Admin",
            cell: ({ row }) => {
                const { original } = row;
                return <AdminBadge isAdmin={original.admin} />;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const { original } = row;
                const toggleMemberAdmin = async () => {
                    await postMemberAdmin(
                        cookieStore,
                        router,
                        spaceId,
                        original.email
                    );
                    await fetchMembers();
                };

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={toggleMemberAdmin}>
                                管理者権限の切り替え
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:text-red-600">
                                削除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
