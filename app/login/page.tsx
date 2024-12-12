"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { loginUser } from "@/components/api/methos";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "パスワードは6文字以上である必要があります",
  }),
});

export default function Login() {
  const router = useRouter();
  const cookieStore = useCookies();
  const searchParams = useSearchParams();
  const afterSignup = searchParams.get("afterSignup") ? 1 : 0;
  const loginError = searchParams.get("loginError") ? 1 : 0;
  const invalidToken = searchParams.get("invalidToken") ? 1 : 0;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const result = await loginUser(values.email, values.password,cookieStore);
    if (result) {
      router.push("/dashboard");
    } else {
      router.push("/login?loginError=1");
    }
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>
            メールとパスワードを入力してログインしてください。
          </CardDescription>
          {afterSignup ? (
            <Alert>
              <Check className="w-4 h-4" />
              <AlertTitle>アカウント登録が完了しました</AlertTitle>
              <AlertDescription>
                メールとパスワードを入力してログインできます
              </AlertDescription>
            </Alert>
          ) : (
            <></>
          )}
          {loginError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>
                メールアドレスまたはパスワードが間違っています
              </AlertDescription>
            </Alert>
          ) : (
            <></>
          )}
           {invalidToken ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>
                セッションが無効になりました。再度ログインしてください
              </AlertDescription>
            </Alert>
          ) : (
            <></>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>メール</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="me@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            アカウント登録はお済ですか?
            <br />
            <Link href="signup" className="underline">
              アカウント登録
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
