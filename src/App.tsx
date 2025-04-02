import { FC, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import battleHamster from "./hamster-1.svg";
import constructionHamster from "./hamster-2.svg";
import spaceHamster from "./hamster-3.svg";
import "./App.css";

const labels = [
  "Stripe integration",
  "Onboarding",
  "Common components",
  "Confetti 🎉",
  "Out of scope",
  "Test in prod",
  "15 out of 10 ppl sick",
  "4:00 AM coding"
];

const characters = [battleHamster, constructionHamster, spaceHamster];

const Game: FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [isJumping, setIsJumping] = useState(false);

  const [gameStart, setGameStart] = useState(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [cactusLabel, setCactusLabel] = useState("");

  const dinoRef = useRef<HTMLDivElement | null>(null);
  const cactusRef = useRef<HTMLDivElement | null>(null);

  const restartGame = () => {
    setGameOver(false);
    setIsJumping(false);
  };

  useEffect(() => {
    const handleSpacebar = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isJumping && !gameOver) {
        setIsJumping(true)

        setTimeout(() => {
          setIsJumping(false)
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [gameOver, isJumping]);

  useEffect(() => {
    if (gameOver) return;

    let animationFrameId: number;

    const checkCollision = () => {
      if (dinoRef.current && cactusRef.current) {
        const dinoBox = dinoRef.current.getBoundingClientRect();
        const cactusBox = cactusRef.current.getBoundingClientRect();

        if (
          dinoBox.right > cactusBox.left &&
          dinoBox.left < cactusBox.right &&
          dinoBox.bottom > cactusBox.top
        ) {
          setGameOver(true);
          return;
        }

        if (cactusBox.right >= window.innerWidth) {
          setCactusLabel(getRandomLabel());
        }
      }

      animationFrameId = requestAnimationFrame(checkCollision);
    };

    checkCollision();

    return () => cancelAnimationFrame(animationFrameId);

  }, [gameOver]);

  const getRandomLabel = () => {
    const randomIndex = Math.floor(Math.random() * labels.length);
    return labels[randomIndex];
  };

  return (
    <div className="wrapper">
      <h1 className="game-title">Unlisted cycle runner</h1>
      {(gameStart || gameOver) && (
        <div className="character-selection">
          <h2>Choose your hamster</h2>
          <div className="characters">
            {characters.map((char) => (
              <img
                key={char}
                src={char}
                alt="character"
                className={char === selectedCharacter ? "selected" : ""}
                onClick={() => setSelectedCharacter(char)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="game-container">
        {gameOver && (
          <div className="game-over">
            Well, you'll finish it on cooldown
            <button onClick={restartGame} className="restart-button">Restart</button>
          </div>
        )}
        {gameStart && (
          <div className="game-over">
            <button onClick={() => setGameStart(false)} className="restart-button">Start</button>
          </div>
        )}
        <motion.div
          ref={dinoRef}
          className="dino"
          style={{ backgroundImage: `url(${selectedCharacter})` }}
          animate={{ y: isJumping ? -150 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
        {!gameStart && !gameOver && <div ref={cactusRef} className="cactus">{cactusLabel}</div>}
      </div>
    </div>
  );
};

export default Game;
