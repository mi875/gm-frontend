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
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { EditGoodForm } from "./edit-good-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Cookies } from "next-client-cookies";
import { BorrowUserData } from "@/components/types/borrowuser";
import { Member } from "@/components/types/member";
import { fetchMembersData, fetchUserData } from "@/components/api/methos";
import { UserData } from "@/components/types/user";

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
    const [membersData, setMembersData] = useState<Member[] | undefined>(undefined)
     const [userData, setUserData] = useState<UserData | undefined>(undefined);

    const fetchMembers = async () => {
        fetchMembersData(cookieStore, router, spaceId).then((data) => {
            setMembersData(data);
        });
    };
    const fetchUser = async () => {
          fetchUserData(cookieStore, router).then((data) => setUserData(data));
        };
    useEffect(() => {
        // const fetchSpaces = async () => {
        //   fetchSpacesData(cookieStore, router).then((data) => {
        //     console.log(data);
        //     setSpacesData(data);
        //   });
        // };
        fetchMembers();
        fetchUser();
    }, []);
    if (!membersData || !userData) {
        return <></>
    }
    if(!membersData.map((member)=>(member.admin)&&(member.email===userData.email)).includes(true)) return <></>;
    
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
                            membersData={membersData}
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
                            membersData={membersData}
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
