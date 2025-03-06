"use client";

import { GoodData } from "@/components/types/good";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { postGood } from "@/components/api/methos";
import { Cookies } from "next-client-cookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "../status-badge";
import { Member } from "@/components/types/member";
import { Checkbox } from "@/components/ui/checkbox";

const columns: ColumnDef<GoodData>[] = [
    {
        accessorKey: "good_name",
        header: "名前",
        cell: ({ row }) => {
            const { original } = row;
            return <p className="font-bold text-lg">{original.good_name}</p>;
        },
    },
    {
        accessorKey: "status",
        header: "状態",
        cell: ({ row }) => {
            const { original } = row;
            return <StatusBadge goodData={original} />;
        },
    },
    {
        accessorKey: "description",
        header: "説明",
        cell: ({ row }) => {
            const { original } = row;
            return (
                <p className="px-2 text-neutral-600 dark:text-neutral-400">
                    {original.description}
                </p>
            );
        },
    },
];

const FormSchemaNewGood = z.object({
    good_name: z.string().min(1, {
        message: "物品名は1文字以上である必要があります",
    }),
    description: z.string().min(1, {
        message: "説明は1文字以上である必要があります",
    }),
    borrow_user_emails: z
        .array(z.string().email())
        .refine((value) => value.length > 0, {
            message: "少なくとも1つのメールを選択してください。",
        }),
});

export default function GoodsTable({
    cookieStore,
    useRouter,
    spaceId,
    data,
    membersData,
    fetchGoods,
}: {
    cookieStore: Cookies;
    useRouter: AppRouterInstance;
    spaceId: string;
    data: GoodData[];
    fetchGoods: () => Promise<void>;
    membersData: Member[];
}) {
    const formNewGood = useForm<z.infer<typeof FormSchemaNewGood>>({
        resolver: zodResolver(FormSchemaNewGood),
    });
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmitNewGood(values: z.infer<typeof FormSchemaNewGood>) {
        setLoading(true);
        try {
            await postGood(
                spaceId,
                values.good_name,
                values.description,
                values.borrow_user_emails.join(","),
                cookieStore,
                useRouter
            );
            fetchGoods();
            formNewGood.reset();
        } catch (error) {
            console.error("Error creating space:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
            <div className="fixed bottom-4 right-4">
                <Button onClick={() => setIsOpen(true)}>
                    <div className="flex items-center">
                        <Plus />
                        物品の追加
                    </div>
                </Button>
            </div>

            {/* Drawer */}
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>新しく物品を追加</DrawerTitle>
                            <DrawerDescription>
                                物品の詳細を入力してください。
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                            <Form {...formNewGood}>
                                <form
                                    onSubmit={formNewGood.handleSubmit(
                                        onSubmitNewGood
                                    )}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={formNewGood.control}
                                        name="good_name"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>物品名</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="good_name"
                                                        type="text"
                                                        placeholder="物品名を入力"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formNewGood.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>説明</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="説明を入力"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formNewGood.control}
                                        name="borrow_user_emails"
                                        render={() => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel className="my-2">
                                                    貸し出し先
                                                </FormLabel>
                                                {membersData.map((member) => (
                                                    <FormField
                                                        key={member.email}
                                                        control={
                                                            formNewGood.control
                                                        }
                                                        name="borrow_user_emails"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        id={
                                                                            member.email
                                                                        }
                                                                        checked={
                                                                            field.value?.includes(
                                                                                member.email
                                                                            ) ||
                                                                            false
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...(field.value ||
                                                                                              []),
                                                                                          member.email,
                                                                                      ]
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value.filter(
                                                                                          (
                                                                                              email
                                                                                          ) =>
                                                                                              email !==
                                                                                              member.email
                                                                                      )
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    htmlFor={
                                                                        member.email
                                                                    }
                                                                >
                                                                    {
                                                                        member.name
                                                                    }
                                                                </FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <div className="grid gap-4">
                                                <Button
                                                    type="button"
                                                    className="w-full m-0"
                                                >
                                                    キャンセル
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="w-full m-0"
                                                    disabled={loading} // ローディング中は無効化
                                                >
                                                    {loading
                                                        ? "作成中..."
                                                        : "作成"}
                                                </Button>
                                            </div>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
