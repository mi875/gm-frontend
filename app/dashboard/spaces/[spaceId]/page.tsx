export default function SpacePage({
    params: { spaceId },
  }: {
    params: { spaceId: string };
  }){

    return (
        <div>
          <h1>Space {spaceId}</h1>
        </div>
      );
  }