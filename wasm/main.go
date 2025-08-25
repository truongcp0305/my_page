//go:build js && wasm
// +build js,wasm

// Simple Go function to be compiled to WASM
package main

import (
	"syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
	a := args[0].Int()
	b := args[1].Int()
	return js.ValueOf(a + b)
}

func registerCallbacks() {
	js.Global().Set("add", js.FuncOf(add))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c
}
