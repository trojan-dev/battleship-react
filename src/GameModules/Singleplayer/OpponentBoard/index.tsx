import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  sendEndGameStats,
  generateContinuousArrayHorizontal,
  generateContinuousArrayVertical,
  checkValidStartIndex,
  wait,
} from "../../../helper/utils";
import Bombed from "../../../assets/bombed.svg";
import BombedSmoke from "../../../assets/bombed-smoke.svg";
import Canon from "../../../assets/canon.svg";
import CellMiss from "../../../assets/cell-miss.png";
import { calculateCellStyle } from "../../../helper/SIZES";
import "./style.css";

function OpponentBoard(props: any) {
  const navigate = useNavigate();
  const [shipCoordinatesArr, setShipCoordinates] = useState<any>({});
  const [allPlacedCoordinates, setAllPlacedCoordinates] = useState<any>([]);
  const [sankShips, setSankShips] = useState<any>([]);
  const [currentHitShip, setCurrentHitShip] = useState<any>(null);
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
        wait(1200).then(() => {
          navigate(
            `/singleplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
          );
          window.location.reload();
        });
      } else {
        navigate(`/singleplayer/?exit=true`);
      }
    }
  }, [sankShips]);

  function generateOpponentShips() {
    const shipPlacements: Array<Array<number>> = [];
    const truckLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < truckLengths.length; i++) {
      let randomStartIndex = Math.floor(Math.random() * (62 - 0 + 1)) + 0;
      const isHorizontal = Math.random() < 0.5;
      const truckLength = truckLengths[i];
      if (isHorizontal) {
        const newRandomStartIndex = checkValidStartIndex(
          randomStartIndex,
          truckLength,
          shipPlacements,
          "HORIZONTAL"
        );
        const newShipPlacement = generateContinuousArrayHorizontal(
          newRandomStartIndex,
          truckLength
        );
        shipPlacements.push(newShipPlacement);
      }
      if (!isHorizontal) {
        const newRandomStartIndex = checkValidStartIndex(
          randomStartIndex,
          truckLength,
          shipPlacements,
          "VERTICAL"
        );
        const newShipPlacement = generateContinuousArrayVertical(
          newRandomStartIndex,
          truckLength
        );
        shipPlacements.push(newShipPlacement);
      }
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
      props.setPlayerReady(true);
      props.setOpponentReady(false);
    } else {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "MISS" }));
      props.setPlayerReady(false);
      props.setOpponentReady(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className={`${calculateCellStyle()}`}>
        {[...Array(63).keys()].map((block: number | any) => (
          <div
            onClick={() => {
              if (opponentCellStatus[block] === "EMPTY") {
                props.setCellAnimationStatus((prev) => ({
                  ...prev,
                  [block]: "ANIMATE",
                }));
                fireMissle(block);
                wait(1500).then(() => {
                  props.setCellAnimationStatus((prev) => ({
                    ...prev,
                    [block]: "EMPTY",
                  }));
                });
              }
            }}
            className={`flex justify-center items-center ${
              props.playerReady
                ? "pointer-events-auto"
                : "pointer-events-none opacity-60"
            }`}
          >
            <div
              className={`${
                props.startGame ? "relative" : ""
              } border border-[rgb(36,41,42,0.5)] rounded-md aspect-square w-full bg-[rgb(36,41,42,1)]`}
            >
              {opponentCellStatus[block] === "MISS" ? (
                <div className="flex justify-center items-center h-full">
                  {props.cellAnimationStatus[block] === "ANIMATE" ? (
                    <img className="missile-drop" src={Canon} alt="" />
                  ) : (
                    <img className="w-[70%]" src={CellMiss} />
                  )}
                </div>
              ) : null}
              {opponentCellStatus[block] === "EMPTY" ? "" : null}
              {opponentCellStatus[block] === "HIT" ? (
                <div>
                  {props.cellAnimationStatus[block] === "ANIMATE" ? (
                    <img className="missile-drop" src={Canon} alt="" />
                  ) : (
                    <>
                      <img
                        width={40}
                        className="bombed absolute top-0"
                        src={Bombed}
                      />
                      <img
                        width={40}
                        className="bombed absolute top-0"
                        src={BombedSmoke}
                      />
                    </>
                  )}
                </div>
              ) : null}
              {/* {opponentSunkShipsCoordinates.includes(block) ? (
                <img
                  width={40}
                  className="bombed absolute top-0"
                  src={BombedSmoke}
                />
              ) : null} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;
