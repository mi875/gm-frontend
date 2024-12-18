"use client";

import { fetchSpaceData } from "@/components/api/methos";
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
        <div className="w-full h-full flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <div>
          <div>
            <Heading>{spaceData.space_name}</Heading>
          </div>
          {/* <p>{spaceData.id}</p>
          <p>{spaceData.time_of_born}</p> */}
          <div>
            <p>{spaceData.id}</p>
            <p>{spaceData.time_of_born}</p>
          </div>
        </div>
      )}
    </div>
  );
}
