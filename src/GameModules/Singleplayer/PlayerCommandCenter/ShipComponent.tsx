import { useDraggable } from "@dnd-kit/core";
import RotateIcon from "../../../assets/RotateIcon";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
  playerShipsOrientation,
  setPlayerShipsOrientation,
  startGame,
}: any) {
  const { shipType, length, H, V, hDimensions, vDimensions } = ship;
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
    setPlayerShipsOrientation((prev: any) => ({
      ...prev,
      [shipType]: isHorizontal ? "H" : "V",
    }));
  };

  if (isHorizontal[shipType]) {
    return (
      <div
        ref={setNodeRef}
        id={shipType}
        data-ship={shipType}
        style={{
          ...style,
          width: `${hDimensions.shipWidth}px`,
          height: `${hDimensions.shipHeight}px`,
        }}
        {...listeners}
      >
        <img className="h-auto w-full" src={H} alt="" />
      </div>
    );
  } else {
    return (
      <>
        <button onClick={() => rotateShip(true)}>Rotate</button>
        <div
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${vDimensions.shipWidth}px`,
            height: `${vDimensions.shipHeight}px`,
            display: "flex",
          }}
          {...listeners}
        >
          <img src={V} className="w-auto flex-grow-1" alt="" />
        </div>
      </>
    );
  }
}
export default ShipComponent;

{
  /* {active?.id !== shipType &&
        !playerShipsCoordinates[shipType]?.length ? (
          <button onClick={() => rotateShip(true)}>
            <RotateIcon />
          </button>
        ) : null} */
}
