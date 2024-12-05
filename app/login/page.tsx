"use client"
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
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>
            メールとパスワードを入力してログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">メール</Label>
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">パスワード</Label>
                {/* <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                    パスワードを忘れた場合
                </Link> */}
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
                ログイン
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            アカウント登録はお済ですか?
            <br />
            <Link href="#" className="underline">
                アカウント登録
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
