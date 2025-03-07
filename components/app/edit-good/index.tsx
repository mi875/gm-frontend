"use client";

import { GoodData } from "@/components/types/good";
import { BrowserView, MobileView } from "react-device-detect";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { EditGoodForm } from "./edit-good-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Cookies } from "next-client-cookies";
import { BorrowUserData } from "@/components/types/borrowuser";

export function EditGood({
    goodData,
    spaceId,
    cookieStore,
    router,
    fetchGood,
    borrowUsersData
}: {
    goodData: GoodData;
    spaceId: string;
    cookieStore: Cookies;
    router: AppRouterInstance;
    fetchGood: () => Promise<void>;
    borrowUsersData: BorrowUserData[];
}) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <BrowserView>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="">
                        <DialogHeader>
                            <DialogTitle>物品の編集</DialogTitle>
                            <DialogDescription>
                                {`物品「${goodData.good_name}」の情報をを変更します。`}
                            </DialogDescription>
                        </DialogHeader>
                        <EditGoodForm
                            goodData={goodData}
                            spaceId={spaceId}
                            cookieStore={cookieStore}
                            router={router}
                            setIsOpen={setOpen}
                            fetchGood={fetchGood}
                            borrowUsersData={borrowUsersData}
                        />
                    </DialogContent>
                </Dialog>
            </BrowserView>
            <MobileView>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>物品の編集</DrawerTitle>
                            <DrawerDescription>
                            {`物品「${goodData.good_name}」の情報をを変更します。`}
                            </DrawerDescription>
                        </DrawerHeader>
                        <EditGoodForm
                            goodData={goodData}
                            spaceId={spaceId}
                            cookieStore={cookieStore}
                            router={router}
                            borrowUsersData={borrowUsersData}
                            setIsOpen={setOpen}
                            fetchGood={fetchGood}
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
