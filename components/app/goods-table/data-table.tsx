"use client";

import { GoodData } from "@/components/types/good";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathname = usePathname();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody> */}
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    // <TableRow
                    //     key={row.id}
                    //     data-state={row.getIsSelected() && "selected"}
                    //     onClick={() => {
                    //         router.push(pathname+"/"+(row.original as GoodData).good_id)
                    //      }}
                    // >
                    <Card
                        key={row.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 grid gap-2 p-4 items-center overflow-hidden cursor-pointer"
                        onClick={() => {
                            router.push(
                                pathname +
                                    "/" +
                                    (row.original as GoodData).good_id
                            );
                        }}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <div className="overflow-hidden" key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </div>
                        ))}
                    </Card>
                    // </TableRow>
                ))
            ) : (
                <p>物品がありません</p>
            )}
            {/* </TableBody>
            </Table> */}
        </div>
    );
}
