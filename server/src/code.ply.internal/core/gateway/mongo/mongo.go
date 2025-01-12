package mongo

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type (
	Gateway interface {
		FindOne(context.Context, interface{}, interface{}) error
		Find(context.Context, interface{}, interface{}) error
		Upsert(context.Context, interface{}, interface{}) error
		DeleteOne(context.Context, interface{}) error
	}
	gateway struct {
		Url        string
		Collection string
		Database   string
	}
	Params struct {
		Url        string
		Collection string
		Database   string
	}
)

func New(ctx context.Context, p Params) (Gateway, error) {
	return &gateway{
		Url:        p.Url,
		Collection: p.Collection,
		Database:   p.Database,
	}, nil
}

func (g *gateway) FindOne(ctx context.Context, filter interface{}, result interface{}) error {
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(g.Url))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	return client.
		Database(g.Database).
		Collection(g.Collection).
		FindOne(ctx, filter).
		Decode(result)
}

func (g *gateway) Find(ctx context.Context, filter interface{}, result interface{}) error {
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(g.Url))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	cursor, err := client.
		Database(g.Database).
		Collection(g.Collection).
		Find(ctx, filter)
	if err != nil {
		return err
	}

	return cursor.All(ctx, result)
}

func (g *gateway) Upsert(ctx context.Context, filter interface{}, update interface{}) error {
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(g.Url))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	updateDocument := bson.M{
		"$set": update,
	}

	_, err = client.
		Database(g.Database).
		Collection(g.Collection).
		UpdateOne(ctx, filter, updateDocument, options.Update().SetUpsert(true))

	return err
}

func (g *gateway) DeleteOne(ctx context.Context, filter interface{}) error {
	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(g.Url))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	_, err = client.
		Database(g.Database).
		Collection(g.Collection).
		DeleteOne(ctx, filter)

	return err
}
