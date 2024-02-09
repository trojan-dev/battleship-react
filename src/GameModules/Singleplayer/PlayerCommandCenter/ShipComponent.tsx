import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../../assets/RotateIcon";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
}: any) {
  const { shipType, length, H, V } = ship;
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

  const rotateShip = (isHorizontal: boolean) => {
    setIsHorizontal((prev: any) => ({
      ...prev,
      [shipType]: isHorizontal,
    }));
  };

  if (isHorizontal[shipType]) {
    return (
      <div className="flex items-center gap-1">
        <H
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={style}
          {...listeners}
        />
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip(false)}>
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1">
        <V
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={style}
          {...listeners}
        />
        {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip(true)}>
            <RotateIcon />
          </button>
        ) : null}
      </div>
    );
  }
}
export default ShipComponent;
