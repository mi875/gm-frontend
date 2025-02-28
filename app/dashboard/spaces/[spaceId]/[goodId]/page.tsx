"use client"

import { fetchGoodData } from "@/components/api/methos";
import { GoodData } from "@/components/types/good";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
            data && setGoodData(data);
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
                    <p>{goodData.good_name}</p>
                    <p>{goodData.add_email}</p>
                    <p>{goodData.good_id}</p>
                </div>
            )}
        </div>
    );
}