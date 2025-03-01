"use client";

import { cn } from "@/lib/utils";
import { BrowserView, MobileView } from "react-device-detect";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { MemberTable } from "./member-table";
import { Member } from "@/components/types/member";
import { fetchMembersData } from "@/components/api/methos";
import { useEffect, useState } from "react";
import { Cookies, useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { getColumns } from "./columns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function SettingsPopup({ spaceId }: { spaceId: string }) {
    const cookieStore = useCookies();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [membersData, setMembersData] = useState<Member[] | undefined>(
        undefined
    );

    const fetchMembers = async () => {
        fetchMembersData(cookieStore, router, spaceId).then((data) => {
            if (data) {
                setMembersData(data);
            }
        });
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <>
            <BrowserView>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Settings />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="">
                        <DialogHeader>
                            <DialogTitle>スペースの設定</DialogTitle>
                            <DialogDescription>
                                スペースの設定を変更します。
                            </DialogDescription>
                        </DialogHeader>
                        <ProfileForm
                            members={membersData ? membersData : []}
                            spaceId={spaceId}
                            cookieStore={cookieStore}
                            useRouter={router}
                            fetchMembers={() => fetchMembers()}
                        />
                    </DialogContent>
                </Dialog>
            </BrowserView>
            <MobileView>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Settings />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>スペースの設定</DrawerTitle>
                            <DrawerDescription>
                                スペースの設定を変更します。
                            </DrawerDescription>
                        </DrawerHeader>
                        <ProfileForm
                            className="px-4"
                            members={membersData ? membersData : []}
                            spaceId={spaceId}
                            cookieStore={cookieStore}
                            useRouter={router}
                            fetchMembers={() => fetchMembers()}
                        />
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </MobileView>
        </>
    );
}

function ProfileForm({
    className,
    members,
    spaceId,
    cookieStore,
    useRouter,
    fetchMembers,
}: React.ComponentProps<"form"> & {
    members: Member[];
    spaceId: string;
    cookieStore: Cookies;
    useRouter: AppRouterInstance;
    fetchMembers: () => Promise<void>;
}) {
    const columns = getColumns(cookieStore, useRouter, spaceId, fetchMembers);
    return (
        <form className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-4">
                <Label htmlFor="Members">メンバー</Label>
                <MemberTable columns={columns} data={members} />
            </div>
            <div className="grid gap-4">
                <Label htmlFor="username">ルーム名</Label>
            </div>
            <div className="grid gap-4">
                <Label htmlFor="username">ルームの削除</Label>
                <Button variant="destructive" className="w-full">
                    削除
                </Button>
            </div>
        </form>
    );
}
