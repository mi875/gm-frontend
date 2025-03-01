"use client";

import { fetchGoodData } from "@/components/api/methos";
import { GoodData } from "@/components/types/good";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GoodPage({
    params: { spaceId, goodId },
}: {
    params: { spaceId: string; goodId: string };
}) {
    const cookieStore = useCookies();
    const router = useRouter();
    const [goodData, setGoodData] = useState<GoodData | undefined>(undefined);
    const fetchGood = async () => {
        fetchGoodData(cookieStore, router, spaceId, goodId).then((data) => {
            if (data) {
                setGoodData(data);
            }
        });
    };
    useEffect(() => {
        fetchGood();
    }, []);
    return (
        <div>
            {goodData === undefined ? (
                <div className="w-full h-full flex justify-center items-center">
                    Loading...
                </div>
            ) : (
                <div>
                    <div className="w-full max-w-[720px] mx-auto grid gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{goodData.good_name}</CardTitle>
                                <div className="pt-2">
                                    {goodData.can_borrow &&
                                    goodData.status === true ? (
                                        <Badge
                                            variant="default"
                                            className="w-fit bg-red-500"
                                        >
                                            貸出中
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="default"
                                            className="w-fit bg-emerald-500"
                                        >
                                            貸出可
                                        </Badge>
                                    )}
                                </div>

                                {/* <CardDescription>Card Description</CardDescription> */}
                            </CardHeader>
                            <CardContent>
                                <p>{goodData.description}</p>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full">
                                    <RadioGroup
                                        defaultValue="comfortable"
                                        className="p-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="default"
                                                id="r1"
                                            />
                                            <Label htmlFor="r1">Default</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="comfortable"
                                                id="r2"
                                            />
                                            <Label htmlFor="r2">
                                                Comfortable
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="compact"
                                                id="r3"
                                            />
                                            <Label htmlFor="r3">Compact</Label>
                                        </div>
                                    </RadioGroup>
                                    <Button className="w-full">貸し出す</Button>
                                </div>
                            </CardFooter>
                        </Card>
                        <Link href={`/dashboard/spaces/${spaceId}`}>
                            <Button variant={"secondary"} className="w-fit">
                                スペースに戻る
                            </Button>
                        </Link>
                    </div>
                    {/* <p>{goodData.good_name}</p>
                    <p>{goodData.description}</p>
                    <p>{goodData.add_email}</p> */}
                </div>
            )}
        </div>
    );
}
