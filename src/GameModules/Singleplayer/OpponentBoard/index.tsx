import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./style.css";
import Bombed from "../../../assets/Bombed";
import BoardCell from "../../../assets/Cell";
import CellMiss from "../../../assets/CellMiss";
import BotFace from "../../../assets/BotFace.svg";

const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";

function OpponentBoard(props: any) {
  const navigate = useNavigate();
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  // Opponent's ship cell status
  const [opponentCellStatus, setOpponentCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  useEffect(() => {
    generateOpponentShips();
  }, []);

  useEffect(() => {
    if (currentHitShip) {
      if (!shipCoordinatesArr[currentHitShip].length) {
        toast.success(`You sank opponent's ${currentHitShip}`);
        const newShipCoordinates = { ...shipCoordinatesArr };
        delete newShipCoordinates[currentHitShip];
        setShipCoordinates(newShipCoordinates);
        setSankShips((prev: any) => [...prev, currentHitShip]);
        setCurrentHitShip(null);
        props.setCurrentScore((prev: any) => ({
          ...prev,
          player: prev.player + 1,
        }));
      }
    }
  }, [shipCoordinatesArr]);

  useEffect(() => {
    if (sankShips.length === 5) {
      toast.success("You won!");
      if (props.gamePayload) {
        const { mode } = props.gamePayload;
        const newPayload = {
          ...props.gamePayload,
          status: "completed",
          gameUrl: window.location.host,
          result: [
            {
              userID: props.gamePayload?.players[0]?._id,
              endResult: "winner",
            },
          ],
          players: [props.gamePayload.players[0]],
        };
        if (mode !== 0) {
          sendEndGameStats(newPayload);
        }
        navigate(
          `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
        );
        window.location.reload();
      } else {
        navigate(`/singleplayer/?exit=true`);
      }
    }
  }, [sankShips]);

  async function sendEndGameStats(payload: Response) {
    try {
      const response = await fetch(
        `http://65.2.34.81:3000/sdk/conclude/${DUMMY_ROOM_ID}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const output = await response.json();
      return output;
    } catch (error) {
      console.error(error);
    }
  }

  function generateOpponentShips() {
    const placement: any = {
      BATTLESHIP: [0, 1, 2, 3, 4],
      CARRIER: [31, 32, 33, 34],
      CRUISER: [25, 26, 27],
      DESTROYER: [55, 65, 75],
      SUBMARINE: [98, 99],
    };
    setShipCoordinates(placement);
    setAllPlacedCoordinates(Object.values(placement).flat(Infinity));
  }

  function checkWhichShipGotHit(currentCoordinates: any, cell: any): string {
    for (let ship in currentCoordinates) {
      if (currentCoordinates[ship].includes(cell)) {
        return ship;
      }
    }
    return "";
  }

  function fireMissle(cell: number) {
    if (allPlacedCoordinates.includes(cell)) {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "HIT" }));
      const hitShip = checkWhichShipGotHit(shipCoordinatesArr, cell);
      toast.success(`You hit ${hitShip}`);
      setCurrentHitShip(hitShip);
      const newArr = shipCoordinatesArr[hitShip].filter(
        (el: any) => el !== cell
      );
      setShipCoordinates((prev: any) => ({ ...prev, [hitShip]: newArr }));
    } else {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "MISS" }));
    }
    props.setPlayerReady(false);
    props.setOpponentReady(true);
  }

  return (
    <div className="relative h-full flex flex-col items-center transition-opacity delay-500">
      <div
        className={`${
          !props.startGame ? "pointer-events-none" : "pointer-events-auto"
        } grid board grid-cols-[repeat(10,30px)] relative`}
      >
        {[...Array(100).keys()].map((block: number | any) => (
          <div
            onClick={() => fireMissle(block)}
            className={`flex justify-center items-center ${
              props.playerReady
                ? "pointer-events-auto"
                : "pointer-events-none opacity-40"
            }`}
          >
            <BoardCell boardType="opponent">
              {opponentCellStatus[block] === "EMPTY" ? "" : ""}
              {opponentCellStatus[block] === "MISS" ? <CellMiss /> : ""}
              {opponentCellStatus[block] === "HIT" ? <Bombed /> : ""}
            </BoardCell>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;
