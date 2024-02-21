import { useDraggable } from "@dnd-kit/core";
import Rotate from "../../assets/rotate.svg";

function ShipComponent({
  ship,
  playerShipsCoordinates,
  isHorizontal,
  setIsHorizontal,
  setPlayerShipsOrientation,
  startGame,
}: any) {
  const { shipType, length, H, V, hDimensions, vDimensions } = ship;
  const { listeners, setNodeRef, transform } = useDraggable({
    id: shipType,
    data: {
      length,
    },
    disabled: startGame,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 22,
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
      <div className="relative">
        <div
          onClick={() => rotateShip(false)}
          ref={setNodeRef}
          {...listeners}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${hDimensions.shipWidth}px`,
            height: `${hDimensions.shipHeight}px`,
            zIndex: startGame ? "0" : "2",
            position: "relative",
          }}
        >
          <img className="h-auto w-full" src={H} alt="" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <div
          onClick={() => rotateShip(true)}
          ref={setNodeRef}
          id={shipType}
          data-ship={shipType}
          style={{
            ...style,
            width: `${vDimensions.shipWidth}px`,
            height: `${vDimensions.shipHeight}px`,
            zIndex: startGame ? "0" : "2",
            position: "absolute",
            left: "2px",
            objectPosition: "0",
          }}
          {...listeners}
        >
          <img
            className="h-full w-full ship-image object-cover"
            src={V}
            alt=""
          />
        </div>
      </div>
    );
  }
}
export default ShipComponent;
