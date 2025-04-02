import { FC, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

const labels = [
  "Stripe",
  "Onboarding",
  "Common components",
  "Confetti 🎉",
  "Out of scope",
  "Test in prod"
];

const Game: FC = () => {
  const [isJumping, setIsJumping] = useState<boolean>(false);
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
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 2000);
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [isJumping, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (dinoRef.current && cactusRef.current) {
        const dinoBox = dinoRef.current.getBoundingClientRect();
        const cactusBox = cactusRef.current.getBoundingClientRect();

        if (
          dinoBox.right > cactusBox.left &&
          dinoBox.left < cactusBox.right &&
          dinoBox.bottom > cactusBox.top
        ) {
          setGameOver(true);
        }

        if (cactusBox.right > window.innerWidth) {
          setCactusLabel(getRandomLabel());
        }
      }
    }, 50);

    return () => {
      clearInterval(interval);
    }
  }, [gameOver]);

  const getRandomLabel = () => {
    const randomIndex = Math.floor(Math.random() * labels.length);
    return labels[randomIndex];
  };

  return (
    <div className="wrapper">
      <h1 className="game-title">Unlisted cycle runner</h1>
      <div className="game-container">
        {gameOver && (
          <div className="game-over">
            Well, you'll finish it on cooldown
            <button onClick={restartGame} className="restart-button">Restart</button>
          </div>
        )}
        <motion.div
          ref={dinoRef}
          className="dino"
          animate={{ y: isJumping ? -150 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
        {!gameOver && <div ref={cactusRef} className="cactus" >
            <div className="text">{cactusLabel}</div>
        </div>}
      </div>
    </div>
  );
};

export default Game;
