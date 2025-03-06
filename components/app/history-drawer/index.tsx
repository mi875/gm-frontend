"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchHistoriesData } from "@/components/api/methos";
import { HistoryData } from "@/components/types/history";

export const HistoryDrawer = ({ spaceId }: { spaceId: string }) => {
  const [open, setOpen] = useState(false);
  const [historiesData, setHistoriesData] = useState<HistoryData[]>([]);
  const cookieStore = useCookies();
  const router = useRouter();

  const fetchHistories = async () => {
    fetchHistoriesData(cookieStore, router, spaceId).then((data) => {
      if (data) {
        setHistoriesData((data as HistoryData[]).reverse());
      }
    });
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const columns: ColumnDef<HistoryData>[] = [
    {
      accessorKey: "good_name",
      header: "物品名",
    },
    {
      accessorKey: "borrow_user",
      header: "借りた人",
    },
    {
      accessorKey: "when_borrow",
      header: "貸した時間",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.when_borrow
            ? new Date(row.original.when_borrow).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })
            : "日付なし"}
        </div>
      ),
    },
    {
      accessorKey: "when_return",
      header: "返却した時間",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.when_return
            ? new Date(row.original.when_return).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })
            : "日付なし"}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: historiesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return historiesData.length ? (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <History />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="overflow-hidden">
          <div className="mx-auto w-[95%] max-w-xl overflow-x-auto">
            <DrawerHeader className="text-left">
              <DrawerTitle>履歴</DrawerTitle>
              <DrawerDescription>
                スペースの履歴を表示します。
              </DrawerDescription>
            </DrawerHeader>
          </div>
          <div className="mx-auto w-[95%] max-w-xl max-h-[60dvh] overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mx-auto w-[95%] max-w-xl overflow-x-auto">
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
