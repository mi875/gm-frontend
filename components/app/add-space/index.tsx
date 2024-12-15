import { PostSpace } from "@/components/api/methos";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Cookies, useCookies } from "next-client-cookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const FormSchema = z.object({
  space_name: z.string().min(1, {
    message: "スペース名は1文字以上である必要があります",
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
  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(false); // ローディング状態
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true); // ローディング開始
    try {
      await PostSpace(values.space_name, cookieStore, useRouter);
      fetchSpaces(); // データ更新
      form.reset(); // フォームをリセット
    } catch (error) {
      console.error("Error creating space:", error);
    } finally {
      setLoading(false); // ローディング終了
    }
  }

  return (
    <SidebarMenu>
      <Dialog>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground base flex justify-center items-center"
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
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Plus /> 新しくスペースを作成
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem>
                <UserRoundPlus /> スペースIDで参加
              </DropdownMenuItem>
            </DropdownMenuContent>

            <DialogContent>
              <AlertDialogHeader>
                <DialogTitle>新しくスペースを作成</DialogTitle>
                <DialogDescription>
                  スペースの詳細を入力してください。
                </DialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4"
                  >
                    <FormField
                      control={form.control}
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
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading} // ローディング中は無効化
                      >
                        {loading ? "作成中..." : "作成"}
                      </Button>
                    </DialogClose>
                  </form>
                </Form>
              </AlertDialogHeader>
            </DialogContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </Dialog>
    </SidebarMenu>
  );
}
