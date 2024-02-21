import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Bombed from "../../../assets/bombed.svg";
import BombedSmoke from "../../../assets/bombed-smoke.svg";
import CellMiss from "../../../assets/cell-miss.svg";
import { calculateCellStyle } from "../../../helper/SIZES";
import "./style.css";

const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
const shipPlacements: Array<Array<number>> = [];

function OpponentBoard(props: any) {
  const navigate = useNavigate();
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
  const [opponentSunkShipsCoordinates, setOpponentSunkShipsCoordinates] =
    useState<any>([]);
  // Opponent's ship cell status
  const [opponentCellStatus, setOpponentCellStatus] = useState<any>(
    [...Array(63).keys()].map(() => "EMPTY")
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
          gameStatus: "completed",
          gameUrl: window.location.host,
          result: [
            {
              userID: props.gamePayload?.players[0]?._id,
              endResult: "winner",
              score: props.currentScore.player,
            },
            {
              userID: "bot",
              endResult: "loser",
              score: props.currentScore.bot,
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

  function generateContinuousArray(start: number, length: number) {
    return Array.from({ length: length }, (_, index) => start + index);
  }

  function checkValidStartIndex(
    index: number,
    truckLength: number,
    alreadyPlacedCells: Array<Array<number>>
  ) {
    if (
      index % 9 < truckLength &&
      !alreadyPlacedCells.flat(1).includes(index) &&
      !alreadyPlacedCells.flat(1).includes(index + truckLength - 1)
    ) {
      console.log("original", index, alreadyPlacedCells);
      return index;
    }
    return checkValidStartIndex(
      Math.floor(Math.random() * (62 - 0 + 1)) + 0,
      truckLength,
      alreadyPlacedCells
    );
  }

  function generateOpponentShips() {
    const truckLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < truckLengths.length; i++) {
      let randomStartIndex = Math.floor(Math.random() * (62 - 0 + 1)) + 0;
      const truckLength = truckLengths[i];
      const newRandomStartIndex = checkValidStartIndex(
        randomStartIndex,
        truckLength,
        shipPlacements
      );
      const newShipPlacement = generateContinuousArray(
        newRandomStartIndex,
        truckLength
      );
      shipPlacements.push(newShipPlacement);
    }
    const placement: any = {
      CARRIER: shipPlacements[0],
      BATTLESHIP: shipPlacements[1],
      CRUISER: shipPlacements[2],
      DESTROYER: shipPlacements[3],
      SUBMARINE: shipPlacements[4],
    };
    setShipCoordinates(placement);
    setAllPlacedCoordinates(Object.values(placement).flat(Infinity));
  }

  console.log(shipCoordinatesArr);

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
      setOpponentSunkShipsCoordinates((prev: Array<number>) => [...prev, cell]);
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
    <div className="flex flex-col items-center justify-center mt-5">
      <div className={`${calculateCellStyle()}`}>
        {[...Array(63).keys()].map((block: number | any) => (
          <div
            onClick={() => {
              if (opponentCellStatus[block] === "EMPTY") {
                fireMissle(block);
              }
            }}
            className={`flex justify-center items-center ${
              props.playerReady
                ? "pointer-events-auto"
                : "pointer-events-none opacity-40"
            }`}
          >
            <div
              className={`${
                props.startGame ? "relative" : ""
              } rounded-md aspect-square w-full bg-[rgb(36,41,42,0.5)]`}
            >
              {opponentCellStatus[block] === "MISS" ? (
                <img className="" src={CellMiss} />
              ) : null}
              {opponentCellStatus[block] === "EMPTY" ? "" : null}
              {opponentCellStatus[block] === "HIT" ? (
                <img
                  width={40}
                  className="bombed absolute top-0"
                  src={Bombed}
                />
              ) : null}
              {opponentSunkShipsCoordinates.includes(block) ? (
                <img
                  width={40}
                  className="bombed absolute top-0"
                  src={BombedSmoke}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;

{
  /* <div className="canon">
                    <img src={Canon} alt="" />
                  </div> */
}
