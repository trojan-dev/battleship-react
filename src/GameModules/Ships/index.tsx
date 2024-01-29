import { useDraggable } from "@dnd-kit/core";

function DraggableShip({
  ship,
  playerShipsCoordinates,
  setShipOrientation,
  isHorizontal,
  setIsHorizontal,
}: any) {
  const { shipType, length } = ship;
  const { active, listeners, setNodeRef, transform } = useDraggable({
    id: shipType,
    data: {
      length,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  if (isHorizontal[shipType]) {
    return (
      <div className="flex items-center p-1">
        <div
          id={shipType}
          data-ship={shipType}
          className={`border p-2 rounded-md bg-red-100 cursor-move  ${
            shipType === "BATTLESHIP"
              ? "w-[145px]"
              : shipType === "CARRIER"
              ? "w-[115px]"
              : shipType === "CRUISER"
              ? "w-[85px]"
              : shipType === "DESTROYER"
              ? "w-[85px]"
              : "w-[55px]"
          }`}
          ref={setNodeRef}
          style={style}
          {...listeners}
        ></div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button
            onClick={() => {
              console.log("sad");
              setIsHorizontal((prev: any) => ({ ...prev, [shipType]: false }));
              setShipOrientation((prev: any) => ({
                ...prev,
                [shipType]: "vertical",
              }));
            }}
          >
            Rotate
          </button>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex gap-2 items-center">
        <div
          id={shipType}
          data-ship={shipType}
          className={`cursor-move border p-2 rounded-md bg-red-100 ${
            shipType === "BATTLESHIP"
              ? "h-[145px]"
              : shipType === "CARRIER"
              ? "h-[115px]"
              : shipType === "CRUISER"
              ? "h-[85px]"
              : shipType === "DESTROYER"
              ? "h-[85px]"
              : "h-[55px]"
          }`}
          ref={setNodeRef}
          style={style}
          {...listeners}
        ></div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button
            onClick={() => {
              setIsHorizontal((prev: any) => ({ ...prev, [shipType]: true }));
              setShipOrientation((prev: any) => ({
                ...prev,
                [shipType]: "vertical",
              }));
            }}
          >
            Rotate
          </button>
        ) : null}
      </div>
    );
  }
}
export default DraggableShip;
