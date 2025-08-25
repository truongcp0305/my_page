import React, { useState } from "react";

function getRandomDice() {
  return Math.floor(Math.random() * 6) + 1;
}

const MAX_SCORE = 21;

function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  const resetGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage("");
    setHistory([]);
  };

  const checkWinner = (pScore, aScore) => {
    if (pScore > MAX_SCORE && aScore > MAX_SCORE) return "Cả hai đều quá 21! Hòa.";
    if (pScore > MAX_SCORE) return "Bạn quá 21! Máy thắng.";
    if (aScore > MAX_SCORE) return "Máy quá 21! Bạn thắng.";
    if (!playerTurn && (pScore === MAX_SCORE || aScore === MAX_SCORE)) {
      if (pScore === aScore) return "Hòa!";
      if (pScore === MAX_SCORE) return "Bạn thắng!";
      if (aScore === MAX_SCORE) return "Máy thắng!";
    }
    return null;
  };

  const playerRoll = () => {
    if (gameOver) return;
    const dice = getRandomDice();
    const newScore = playerScore + dice;
    setPlayerScore(newScore);
    setHistory([...history, `Bạn lắc được ${dice}`]);
    const winner = checkWinner(newScore, aiScore);
    if (winner) {
      setMessage(winner);
      setGameOver(true);
      return;
    }
    setPlayerTurn(false);
    setTimeout(aiRoll, 1000);
  };

  const aiRoll = () => {
    if (gameOver) return;
    // AI sẽ random dừng hoặc lắc tiếp nếu điểm < 17
    let dice = getRandomDice();
    let newScore = aiScore + dice;
    setAiScore(newScore);
    setHistory(h => [...h, `Máy lắc được ${dice}`]);
    const winner = checkWinner(playerScore, newScore);
    if (winner) {
      setMessage(winner);
      setGameOver(true);
      return;
    }
    // AI random quyết định dừng hoặc lắc tiếp nếu < 17
    if (newScore < 17 && Math.random() > 0.3) {
      setTimeout(aiRoll, 800);
    } else {
      setPlayerTurn(true);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
      <h2>🎲 Dice 21 🎲</h2>
      <div style={{ marginBottom: 16 }}>
        <b>Điểm của bạn:</b> {playerScore}<br />
        <b>Điểm máy:</b> {aiScore}
      </div>
      <div style={{ marginBottom: 16 }}>
        {gameOver ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{message}</div>
        ) : (
          <div>Lượt: <b>{playerTurn ? "Bạn" : "Máy"}</b></div>
        )}
      </div>
      <button onClick={playerRoll} disabled={!playerTurn || gameOver} style={{ marginRight: 8 }}>
        Lắc xúc xắc
      </button>
      <button onClick={resetGame}>Chơi lại</button>
      <div style={{ marginTop: 24, textAlign: "left" }}>
        <b>Lịch sử:</b>
        <ul>
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
