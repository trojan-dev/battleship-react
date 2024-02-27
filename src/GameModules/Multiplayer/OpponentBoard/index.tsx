import { useEffect, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Bombed from "../../../assets/bombed.svg";
import BombedSmoke from "../../../assets/bombed-smoke.svg";
import Canon from "../../../assets/canon.svg";
import CellMiss from "../../../assets/cell-miss.png";
import { calculateCellStyle } from "../../../helper/SIZES";
import "./style.css";

function OpponentBoard(props: any) {
  const navigate = useNavigate();
  const [opponentSunkShips, setOpponentSunkShips] = useState<any>([]);

  // Opponent's ship cell status
  const [opponentCellStatus, setOpponentCellStatus] = useState<any>(
    [...Array(100).keys()].map(() => "EMPTY")
  );

  const checkIfOpponentShipSank = (ship: string, opponentShips: any) => {
    if (!opponentShips[ship].length) {
      toast.success(`Opponent's ${ship} has been sunk. Bravo!`, {
        duration: 1500,
      });
      setOpponentSunkShips((prev: any) => [...prev, ship]);
    }
  };

  useEffect(() => {
    if (opponentSunkShips.length === 5) {
      toast.success(`You are victorious!`);
      if (props.gamePayload) {
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
              userID: props.gamePayload?.players[1]?._id,
              endResult: "loser",
              score: props.currentScore.opponent,
            },
          ],
          players: [props.gamePayload.players[0], props.gamePayload.players[1]],
        };

        props.sendEndGameStats(newPayload);

        navigate(
          `/multiplayer?exit=true&data=${btoa(JSON.stringify(newPayload))}`
        );
        window.location.reload();
      } else {
        navigate(`/multiplayer?exit=true`);
      }
    }
  }, [opponentSunkShips]);

  function checkWhichShipGotHit(currentCoordinates: any, cell: any): string {
    for (let ship in currentCoordinates) {
      if (currentCoordinates[ship].includes(cell)) {
        return ship;
      }
    }
    return "";
  }

  function fireMissle(cell: number) {
    const currentOpponentCoordinates = Object.values(
      props.opponentPlacedShips
    ).flat(1);
    if (currentOpponentCoordinates.includes(cell)) {
      // Find which ship got hit
      const hitShip = checkWhichShipGotHit(props.opponentPlacedShips, cell);
      // Update opponent's board status locally using state
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "HIT" }));
      // Convey the missile strike to opponent and send them updated ship placements
      const newOpponentShipsPlacement = { ...props.opponentPlacedShips };
      const newArr = newOpponentShipsPlacement[hitShip].filter(
        (el: any) => el !== cell
      );
      newOpponentShipsPlacement[hitShip] = newArr;
      props.setOpponentPlacedShips(newOpponentShipsPlacement);
      checkIfOpponentShipSank(hitShip, newOpponentShipsPlacement);
      toast.success(`Opponent's ${hitShip} has been hit. Good job!`, {
        duration: 1500,
      });
      props.socket.emit("fire-missile", cell, "HIT", newOpponentShipsPlacement);
    } else {
      setOpponentCellStatus((prev: any) => ({ ...prev, [cell]: "MISS" }));
      props.socket.emit(
        "fire-missile",
        cell,
        "MISS",
        props.opponentPlacedShips
      );
    }
    props.setPlayerTurn(false);
    props.setOpponentTurn(true);
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
              props.playerTurn
                ? "pointer-events-auto"
                : "pointer-events-none opacity-60"
            }`}
          >
            <div
              className={`${
                props.startGame ? "relative" : ""
              } border border-[rgb(36,41,42,0.8)] rounded-md aspect-square w-full bg-[rgb(36,41,42,1)]`}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpponentBoard;
