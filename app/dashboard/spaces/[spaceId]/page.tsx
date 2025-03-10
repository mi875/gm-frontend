"use client";

import {
    fetchGoodsData,
    fetchMembersData,
    fetchSpaceData,
} from "@/components/api/methos";
import GoodsTable from "@/components/app/goods-table";
import { HistoryDrawer } from "@/components/app/history-drawer";
import { SettingsPopup } from "@/components/app/settings-popup";
import { GoodData } from "@/components/types/good";
import { Member } from "@/components/types/member";
import { SpaceData } from "@/components/types/space";
import { Heading } from "@/components/ui/heading";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SpacePage({
    params: { spaceId },
}: {
    params: { spaceId: string };
}) {
    const cookieStore = useCookies();
    const router = useRouter();
    const [spaceData, setSpaceData] = useState<SpaceData | undefined>(
        undefined
    );
    const [goodsData, setGoodsData] = useState<GoodData[] | undefined>(
        undefined
    );
    const [membersData, setMembersData] = useState<Member[] | undefined>(
        undefined
    );

    const fetchSpace = async () => {
        fetchSpaceData(cookieStore, router, spaceId).then((data) => {
            setSpaceData(data);
        });
    };
    const fetchGoods = async () => {
        fetchGoodsData(cookieStore, router, spaceId).then((data) => {
            setGoodsData(data);
        });
    };
    const fetchMembers = async () => {
        fetchMembersData(cookieStore, router, spaceId).then((data) => {
            setMembersData(data);
        });
    };

    useEffect(() => {
        // const fetchSpaces = async () => {
        //   fetchSpacesData(cookieStore, router).then((data) => {
        //     console.log(data);
        //     setSpacesData(data);
        //   });
        // };
        fetchGoods();
        fetchSpace();
        fetchMembers();
    }, []);

    return (
        <div>
            {spaceData === undefined ||
            goodsData === undefined ||
            membersData === undefined ? (
                <div className="w-full h-full flex justify-center items-center">
                    Loading...
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center">
                        <Heading>{spaceData.space_name}</Heading>
                        <div className="flex items-center space-x-2">
                            <HistoryDrawer spaceId={spaceId} />
                            <SettingsPopup spaceId={spaceId} />
                        </div>
                    </div>
                    {/* <p>{spaceData.id}</p>
          <p>{spaceData.time_of_born}</p> */}
                    {/* <div>
            <p>{spaceData.id}</p>
            <p>{spaceData.time_of_born}</p>
          </div> */}
                    <GoodsTable
                        cookieStore={cookieStore}
                        useRouter={router}
                        spaceId={spaceId}
                        fetchGoods={fetchGoods}
                        data={goodsData}
                        membersData={membersData}
                    />
                </div>
            )}
        </div>
    );
}
