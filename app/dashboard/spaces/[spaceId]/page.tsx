"use client";

import { fetchGoodsData, fetchSpaceData } from "@/components/api/methos";
import GoodsTable from "@/components/app/goods-table";
import { SettingsPopup } from "@/components/app/settings-popup";
import { GoodData } from "@/components/types/good";
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
  const [spaceData, setSpaceData] = useState<SpaceData | undefined>(undefined);
  const [goodsData, setGoodsData] = useState<GoodData[] | undefined>(undefined);
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

  useEffect(() => {
    // const fetchSpaces = async () => {
    //   fetchSpacesData(cookieStore, router).then((data) => {
    //     console.log(data);
    //     setSpacesData(data);
    //   });
    // };
    fetchGoods();
    fetchSpace();
  }, []);

  return (
    <div>
      {spaceData === undefined || goodsData === undefined ? (
        <div className="w-full h-full flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <Heading>{spaceData.space_name}</Heading>
            <SettingsPopup/>
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
          />
        </div>
      )}
    </div>
  );
}
