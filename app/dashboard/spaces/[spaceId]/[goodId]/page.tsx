"use client";

import {
    fetchBorrowUsersData,
    fetchGoodData,
    postGoodStatus,
} from "@/components/api/methos";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatusBadge } from "@/components/app/status-badge";
import { BorrowUserData } from "@/components/types/borrowuser";

export default function GoodPage({
    params: { spaceId, goodId },
}: {
    params: { spaceId: string; goodId: string };
}) {
    const cookieStore = useCookies();
    const router = useRouter();
    const [goodData, setGoodData] = useState<GoodData | undefined>(undefined);
    const [borrowUsersData, setBorrowUsersData] = useState<
        BorrowUserData[] | undefined
    >(undefined);
    const [selectedBorrowUserData, setSelectedBorrowUserData] = useState<
        BorrowUserData | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGood = async () => {
        fetchGoodData(cookieStore, router, spaceId, goodId).then((data) => {
            if (data) {
                setGoodData(data);
            }
        });
    };

    const fetchBorrowUsers = async () => {
        fetchBorrowUsersData(cookieStore, router, spaceId, goodId).then(
            (data) => {
                if (data) {
                    setBorrowUsersData(data);
                }
            }
        );
    };

    const toggleGoodStatus = async () => {
        if (goodData !== undefined) {
            setIsLoading(true);
            await postGoodStatus(
                cookieStore,
                router,
                spaceId,
                goodId,
                selectedBorrowUserData ? selectedBorrowUserData.email : "",
                goodData.status
            );
            await fetchGood();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGood();
        fetchBorrowUsers();
    }, []);

    return (
        <div>
            {goodData === undefined || borrowUsersData === undefined ? (
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
                                    <StatusBadge goodData={goodData} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>{goodData.description}</p>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full">
                                    <RadioGroup
                                        defaultValue="comfortable"
                                        className="p-4"
                                        onValueChange={(value) => {
                                            setSelectedBorrowUserData(
                                                borrowUsersData.find(
                                                    (member) =>
                                                        member.email == value
                                                )
                                            );
                                        }}
                                    >
                                        {!goodData.status &&
                                            borrowUsersData.map((member) => {
                                                return (
                                                    <div
                                                        key={member.email}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <RadioGroupItem
                                                            value={member.email}
                                                            id={`r${member.email}`}
                                                        />
                                                        <Label
                                                            htmlFor={`r${member.email}`}
                                                        >
                                                            {member.name}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                    </RadioGroup>
                                    {goodData.can_borrow &&
                                    goodData.status === true ? (
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                toggleGoodStatus();
                                            }}
                                            disabled={isLoading}
                                        >
                                            返却
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={
                                                selectedBorrowUserData ===
                                                undefined
                                                    ? true
                                                    : false || isLoading
                                            }
                                            className="w-full"
                                            onClick={() => {
                                                toggleGoodStatus();
                                            }}
                                        >
                                            貸し出す
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                        <Link href={`/dashboard/spaces/${spaceId}`}>
                            <Button variant={"secondary"} className="w-fit">
                                スペースに戻る
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
