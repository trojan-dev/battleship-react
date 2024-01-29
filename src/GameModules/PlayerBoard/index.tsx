import { useState, useEffect } from "preact/hooks";
import { useDroppable } from "@dnd-kit/core";
import DraggableShip from "../Ships";

const SHIPS = [
  {
    shipType: "BATTLESHIP",
    length: 5,
  },
  {
    shipType: "CARRIER",
    length: 4,
  },
  {
    shipType: "CRUISER",
    length: 3,
  },
  {
    shipType: "DESTROYER",
    length: 3,
  },
  {
    shipType: "SUBMARINE",
    length: 2,
  },
];

function PlayerBoard(props: any) {
  const [isHorizontal, setIsHorizontal] = useState({
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  });
  return (
    <div className="flex flex-col relative">
      <div className="grid grid-cols-[repeat(10,30px)] auto-rows-[30px] relative">
        {[...Array(100).keys()].map((cell) => (
          <DroppableCell
            cellStatus={props.cellStatus}
            placedShips={props.placedShips}
            playerShipsCoordinates={props.playerShipsCoordinates}
            id={cell}
          />
        ))}
      </div>
      <div className={`flex flex-col max-w-[300px] gap-1 my-5`}>
        <DraggableShip
          isHorizontal={isHorizontal}
          playerShipsCoordinates={props.playerShipsCoordinates}
          setShipOrientation={props.setShipOrientation}
          setIsHorizontal={setIsHorizontal}
          ship={SHIPS[0]}
        />
        <DraggableShip
          isHorizontal={isHorizontal}
          playerShipsCoordinates={props.playerShipsCoordinates}
          setShipOrientation={props.setShipOrientation}
          setIsHorizontal={setIsHorizontal}
          ship={SHIPS[1]}
        />
        <DraggableShip
          isHorizontal={isHorizontal}
          playerShipsCoordinates={props.playerShipsCoordinates}
          setShipOrientation={props.setShipOrientation}
          setIsHorizontal={setIsHorizontal}
          ship={SHIPS[2]}
        />
        <DraggableShip
          isHorizontal={isHorizontal}
          playerShipsCoordinates={props.playerShipsCoordinates}
          setShipOrientation={props.setShipOrientation}
          setIsHorizontal={setIsHorizontal}
          ship={SHIPS[3]}
        />
        <DraggableShip
          isHorizontal={isHorizontal}
          playerShipsCoordinates={props.playerShipsCoordinates}
          setShipOrientation={props.setShipOrientation}
          setIsHorizontal={setIsHorizontal}
          ship={SHIPS[4]}
        />
      </div>
    </div>
  );
}

function DroppableCell({
  id,
  placedShips,
  cellStatus,
  playerShipsCoordinates,
}: {
  id: number;
  placedShips: any;
  cellStatus: any;
  playerShipsCoordinates: any;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="border border-white flex justify-center items-center relative z-2 p-2"
    >
      {cellStatus[id] && !placedShips.includes(id) ? (
        "X"
      ) : cellStatus[id] && placedShips.includes(id) ? (
        <div className="w-3 h-3 rounded-full bg-red-600 relative z-10"></div>
      ) : (
        ""
      )}
    </div>
  );
}

export default PlayerBoard;
