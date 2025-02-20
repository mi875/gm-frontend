"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  BrowserView,
  MobileView,
} from "react-device-detect";
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
import { UserData } from "@/components/types/user";
import { MemberTable } from "./member-table";
import { columns } from "./columns";


const userTableData:UserData[] =[
    {
        name: "John Doe",
        id: "1",
        email: "john@example.com"},
    {
        name: "Jane Doe",
        id: "2",
        email: "aatest@example.com"
    }
];

export function SettingsPopup() {
  const [open, setOpen] = React.useState(false);

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
            <ProfileForm />
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
            <ProfileForm className="px-4" />
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

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      
      <div className="grid gap-2">
        <Label htmlFor="Members">メンバー</Label>
        <MemberTable columns={columns} data={userTableData} />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="username">ルームの削除</Label>
        <Button variant="destructive" className="w-min">削除</Button>
      </div>
    </form>
  );
}
