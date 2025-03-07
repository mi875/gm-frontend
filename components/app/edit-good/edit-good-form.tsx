import { GoodData } from "@/components/types/good";
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
import { useEffect, useState } from "react";
import { Cookies } from "next-client-cookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { fetchMembersData, updateGood } from "@/components/api/methos";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BorrowUserData } from "@/components/types/borrowuser";
import { Member } from "@/components/types/member";
import { Checkbox } from "@/components/ui/checkbox";

const FormSchemaEditGood = z.object({
    good_name: z
        .string({
            required_error: "物品名は1文字以上である必要があります",
        })
        .min(1, "物品名は1文字以上である必要があります"),
    description: z
        .string({
            required_error: "説明は1文字以上である必要があります",
        })
        .min(1, "説明は1文字以上である必要があります"),
    borrow_user_emails: z
        .array(z.string().email()).nonempty("貸し出し先を選択してください"),
});

export function EditGoodForm({
    goodData,
    spaceId,
    cookieStore,
    router,
    setIsOpen,
    fetchGood,
    borrowUsersData
}: {
    goodData: GoodData;
    spaceId: string;
    cookieStore: Cookies;
    router: AppRouterInstance;
    setIsOpen: (isOpen: boolean) => void;
    fetchGood: () => Promise<void>;
    borrowUsersData: BorrowUserData[];
}) {
    const [loading, setLoading] = useState(false);
    const [membersData, setMembersData] = useState<Member[] | undefined>(undefined)
    const fetchMembers = async () => {
        fetchMembersData(cookieStore, router, spaceId).then((data) => {
            setMembersData(data);
        });
    };

    useEffect(() => {
        // const fetchSpaces = async () => {
        //   fetchSpacesData(cookieStore, router).then((data) => {
        //     console.log(data);
        //     setSpacesData(data);
        //   });
        // };
        fetchMembers();
    }, []);


    async function onSubmitNewGood(values: z.infer<typeof FormSchemaEditGood>) {
        setLoading(true);
        try {
            await updateGood(
                spaceId,
                goodData.good_id,
                values.good_name,
                values.description,
                values.borrow_user_emails.join(","),
                cookieStore,
                router
            );
            fetchGood();
            formEditGood.reset();
        } catch (error) {
            console.error("Error creating space:", error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    }
    const formEditGood = useForm<z.infer<typeof FormSchemaEditGood>>({
        resolver: zodResolver(FormSchemaEditGood),
        defaultValues: {
            good_name: goodData.good_name,
            description: goodData.description,
            borrow_user_emails: borrowUsersData.map((member) => member.email),
        },
    });
    if (!membersData) {
        return <div>Loading...</div>
    }
    return (
        <div className="p-4">
            <Form {...formEditGood}>
                <form
                    onSubmit={formEditGood.handleSubmit(onSubmitNewGood)}
                    className="space-y-4"
                >
                    <FormField
                        control={formEditGood.control}
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
                        control={formEditGood.control}
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
                        control={formEditGood.control}
                        name="borrow_user_emails"
                        render={() => (
                            <FormItem className="grid gap-2">
                                <FormLabel className="my-2">貸し出し先</FormLabel>
                                {membersData.map((member) => (
                                    <FormField
                                        key={member.email}
                                        control={formEditGood.control}
                                        name="borrow_user_emails"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        id={member.email}
                                                        checked={
                                                            field.value?.includes(member.email) ||
                                                            false
                                                        }
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([
                                                                    ...(field.value || []),
                                                                    member.email,
                                                                ])
                                                                : field.onChange(
                                                                    field.value.filter(
                                                                        (email) => email !== member.email
                                                                    )
                                                                );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel htmlFor={member.email}>
                                                    {member.name}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-4">
                        {/* <Button
                            type="button"
                            variant="secondary"
                            className="w-full m-0"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            キャンセル
                        </Button> */}

                        <Button
                            type="submit"
                            className="w-full m-0"
                            disabled={loading} // ローディング中は無効化
                        >
                            {loading ? "変更中..." : "変更"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
