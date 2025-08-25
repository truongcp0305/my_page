//go:build js && wasm
// +build js,wasm

// Simple Go function to be compiled to WASM
package main

import (
	"math/rand"
	"syscall/js"
	"time"
)

type GameState struct {
	PlayerScore int
	AIScore     int
	Turn        string // "player" or "ai"
	GameOver    bool
	Message     string
	History     []string
}

var state GameState

func initGame(this js.Value, args []js.Value) interface{} {
	state = GameState{
		PlayerScore: 0,
		AIScore:     0,
		Turn:        "player",
		GameOver:    false,
		Message:     "",
		History:     []string{},
	}
	return nil
}

func rollDice() int {
	return rand.Intn(6) + 1
}

func playerRoll(this js.Value, args []js.Value) interface{} {
	if state.GameOver || state.Turn != "player" {
		return nil
	}
	dice := rollDice()
	state.PlayerScore += dice
	state.History = append(state.History, "Bạn lắc được: "+itoa(dice))
	if state.PlayerScore > 21 {
		state.GameOver = true
		state.Message = "Bạn quá 21 điểm! Máy thắng."
		return nil
	}
	if state.PlayerScore == 21 {
		state.GameOver = true
		state.Message = "Bạn đạt 21 điểm! Bạn thắng!"
		return nil
	}
	state.Turn = "ai"
	aiTurn()
	return nil
}

func aiTurn() {
	for !state.GameOver && state.Turn == "ai" {
		dice := rollDice()
		state.AIScore += dice
		state.History = append(state.History, "Máy lắc được: "+itoa(dice))
		if state.AIScore > 21 {
			state.GameOver = true
			state.Message = "Máy quá 21 điểm! Bạn thắng!"
			return
		}
		if state.AIScore >= 17 {
			if state.AIScore > state.PlayerScore {
				state.GameOver = true
				state.Message = "Máy thắng với " + itoa(state.AIScore) + " điểm!"
				return
			} else if state.AIScore == state.PlayerScore {
				state.GameOver = true
				state.Message = "Hòa điểm!"
				return
			} else {
				state.Turn = "player"
				return
			}
		}
	}
}

func resetGame(this js.Value, args []js.Value) interface{} {
	initGame(js.Value{}, nil)
	return nil
}

func getState(this js.Value, args []js.Value) interface{} {
	arr := js.Global().Get("Array").New(len(state.History))
	for i, v := range state.History {
		arr.SetIndex(i, v)
	}
	return js.ValueOf(map[string]interface{}{
		"playerScore": state.PlayerScore,
		"aiScore":     state.AIScore,
		"turn":        state.Turn,
		"gameOver":    state.GameOver,
		"message":     state.Message,
		"history":     arr,
	})
}

func itoa(i int) string {
	return js.ValueOf(i).String()
}

func registerCallbacks() {
	rand.Seed(time.Now().UnixNano())
	js.Global().Set("dice21", js.ValueOf(map[string]interface{}{
		"init":     js.FuncOf(initGame),
		"roll":     js.FuncOf(playerRoll),
		"reset":    js.FuncOf(resetGame),
		"getState": js.FuncOf(getState),
	}))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c
}
