import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../../assets/RotateIcon";

const SHIP_DIMENSIONS_HORIZONTAL: any = {
  CARRIER: "w-[195px] ship",
  BATTLESHIP: "w-[150px] ship",
  CRUISER: "w-[120px] ship",
  DESTROYER: "w-[120px] ship",
  SUBMARINE: "w-[75px] submarine",
};
const SHIP_DIMENSIONS_VERTICAL: any = {
  CARRIER: "h-[195px] vertical-ship",
  BATTLESHIP: "h-[150px] vertical-ship",
  CRUISER: "h-[120px] vertical-ship",
  DESTROYER: "h-[120px] vertical-ship",
  SUBMARINE: "h-[75px] submarine",
};

function ShipComponent({
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

  const rotateShip = (rotation: string, isHorizontal: boolean) => {
    setIsHorizontal((prev: any) => ({
      ...prev,
      [shipType]: isHorizontal,
    }));
    setShipOrientation((prev: any) => ({
      ...prev,
      [shipType]: rotation,
    }));
  };

  if (isHorizontal[shipType]) {
    return (
      <div className="flex items-center p-1 gap-1">
        <div
          id={shipType}
          ref={setNodeRef}
          style={style}
          {...listeners}
          data-ship={shipType}
          className={`border flex items-center gap-2 p-1 rounded-md cursor-move  ${SHIP_DIMENSIONS_HORIZONTAL[shipType]}`}
        >
          <div className="bg-white w-[65%] rounded-lg h-[12px]"></div>
        </div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip("vertical", false)}>
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex gap-2 items-center gap-1">
        <div
          id={shipType}
          data-ship={shipType}
          className={`cursor-move border p-1 rounded-md ${SHIP_DIMENSIONS_VERTICAL[shipType]}`}
          ref={setNodeRef}
          style={style}
          {...listeners}
        >
          <div className="bg-white h-[80%] rounded-lg w-[12px]"></div>
        </div>
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip("horizontal", true)}>
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  }
}
export default ShipComponent;
