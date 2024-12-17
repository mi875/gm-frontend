import { AddMember, PostSpace } from "@/components/api/methos";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserRoundPlus } from "lucide-react";
import { Cookies } from "next-client-cookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import jwt from "jsonwebtoken";

const FormSchemaNewSpace = z.object({
  space_name: z.string().min(1, {
    message: "スペース名は1文字以上である必要があります",
  }),
});
const FormSchemaSpaceID = z.object({
  space_id: z.string().min(1, {
    message:
      "スペースIDはxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxの形である必要があります",
  }),
});
export default function AddSpace({
  cookieStore,
  useRouter,
  fetchSpaces,
}: {
  cookieStore: Cookies;
  useRouter: AppRouterInstance;
  fetchSpaces: () => Promise<void>;
}) {
  const [isCreateDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [isJoinDrawerOpen, setJoinDrawerOpen] = useState(false);

  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(false);
  const formNewSpace = useForm<z.infer<typeof FormSchemaNewSpace>>({
    resolver: zodResolver(FormSchemaNewSpace),
  });
  const formSpaceID = useForm<z.infer<typeof FormSchemaSpaceID>>({
    resolver: zodResolver(FormSchemaSpaceID),
  });

  async function onSubmitNewSpace(values: z.infer<typeof FormSchemaNewSpace>) {
    setLoading(true);
    try {
      await PostSpace(values.space_name, cookieStore, useRouter);
      fetchSpaces();
      formNewSpace.reset();
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitSpaceID(values: z.infer<typeof FormSchemaSpaceID>) {
    setLoading(true);
    const token = cookieStore.get("token");
    if (token === undefined) {
      return;
    }
    const decoded = jwt.decode(token) as { email?: string };
    const email = decoded?.email || "";
    try {
      await AddMember(
        values.space_id,
        email,
        cookieStore,
        useRouter
      );
      fetchSpaces();
      formSpaceID.reset();
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="flex justify-center items-center"
            >
              <Plus className="size-4" />
              スペースを追加する
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>スペースを追加</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* 新しくスペースを作成 */}
            <DropdownMenuItem
              onSelect={() => setCreateDrawerOpen(true)} // Drawer1を開く
            >
              <Plus className="mr-2" /> 新しくスペースを作成
            </DropdownMenuItem>

            {/* スペースIDで参加 */}
            <DropdownMenuItem
              onSelect={() => setJoinDrawerOpen(true)} // Drawer2を開く
            >
              <UserRoundPlus className="mr-2" /> スペースIDで参加
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Drawer 1: 新しくスペースを作成 */}
      <Drawer open={isCreateDrawerOpen} onOpenChange={setCreateDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>新しくスペースを作成</DrawerTitle>
              <DrawerDescription>
                スペースの詳細を入力してください。
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <Form {...formNewSpace}>
                <form
                  onSubmit={formNewSpace.handleSubmit(onSubmitNewSpace)}
                  className="space-y-4"
                >
                  <FormField
                    control={formNewSpace.control}
                    name="space_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>スペース名</FormLabel>
                        <FormControl>
                          <Input
                            id="space_name"
                            type="text"
                            placeholder="スペース名を入力"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button
                        type="submit"
                        className="w-full m-0"
                        disabled={loading} // ローディング中は無効化
                      >
                        {loading ? "作成中..." : "作成"}
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer 2: スペースIDで参加 */}
      <Drawer open={isJoinDrawerOpen} onOpenChange={setJoinDrawerOpen}>
        <DrawerContent>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>スペースIDで参加</DrawerTitle>
                <DrawerDescription>
                  スペースIDを入力してください。
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <Form {...formSpaceID}>
                  <form
                    onSubmit={formSpaceID.handleSubmit(onSubmitSpaceID)}
                    className="space-y-4"
                  >
                    <FormField
                      control={formSpaceID.control}
                      name="space_id"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel>スペースID</FormLabel>
                          <FormControl>
                            <Input
                              id="id"
                              type="text"
                              placeholder="スペースIDを入力"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button
                          type="submit"
                          className="w-full m-0"
                          disabled={loading} // ローディング中は無効化
                        >
                          {loading ? "参加中..." : "参加"}
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </Form>
              </div>
            </div>
          </DrawerContent>
        </DrawerContent>
      </Drawer>
    </SidebarMenu>
  );
}
