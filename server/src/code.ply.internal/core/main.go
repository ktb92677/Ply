package main

import (
	"context"
	"log"

	"code.ply.internal/core/config"
	"code.ply.internal/core/handler"
)

func main() {
	ctx := context.Background()

	ctx, _ = config.LoadConfig(ctx)

	gatewayHandler, err := handler.New(ctx, handler.Params{})
	if err != nil {
		log.Fatal(err.Error())
		return
	}
	handler.StartGatewayService(ctx, gatewayHandler)
}
