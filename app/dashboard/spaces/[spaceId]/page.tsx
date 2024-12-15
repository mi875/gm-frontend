"use client";

import { fetchSpaceData } from "@/components/api/methos";
import { SpaceData } from "@/components/types/space";
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
  const fetchSpace = async () => {
    fetchSpaceData(cookieStore, router, spaceId).then((data) => {
      setSpaceData(data);
    });
  };

  useEffect(() => {
    // const fetchSpaces = async () => {
    //   fetchSpacesData(cookieStore, router).then((data) => {
    //     console.log(data);
    //     setSpacesData(data);
    //   });
    // };
    fetchSpace();
  }, []);

  return (
    <div>
      {spaceData === undefined ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{spaceData.space_name}</h1>
          <p>{spaceData.id}</p>
          <p>{spaceData.time_of_born}</p>
        </div>
      )}
    </div>
  );
}
