package controller

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"code.ply.internal/core/config"
	"code.ply.internal/core/gateway/mongo"
	"code.ply.internal/core/models"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

const uploadDir = "uploads"

type (
	Controller interface {
		// Enrollment
		CreateEnrollment(context.Context, *models.Enrollment) (string, error)
		DeleteEnrollment(context.Context, string) error
		ReadEnrollment(context.Context, string) (*models.Enrollment, error)
		UpdateEnrollment(context.Context, *models.Enrollment) error
		ListEnrollments(context.Context, string) ([]*models.Enrollment, error)

		// Activity
		CreateActivity(context.Context, *models.Activity) (string, error)
		ListActivities(context.Context, string) ([]*models.Activity, error)

		// Location
		CreateLocation(context.Context, *models.Location) (string, error)
		DeleteLocation(context.Context, string) error
		ReadLocation(context.Context, string) (*models.Location, error)
		UpdateLocation(context.Context, *models.Location) error
		ListLocations(context.Context, string) ([]*models.Location, error)

		// Practice
		CreatePractice(context.Context, *models.Practice) (string, error)
		ListPractices(context.Context) ([]*models.Practice, error)
		ReadPractice(context.Context, string) (*models.Practice, error)
		UpdatePractice(context.Context, *models.Practice) error

		// Task
		CreateTask(context.Context, *models.Task) (string, error)
		ListTasks(context.Context, string) ([]*models.Task, error)
		UpdateTask(context.Context, *models.Task) error

		// Provider
		CreateProvider(context.Context, *models.Provider) (string, error)
		DeleteProvider(context.Context, string) error
		ReadProvider(context.Context, string) (*models.Provider, error)
		UpdateProvider(context.Context, *models.Provider) error
		ListProviders(context.Context, string) ([]*models.Provider, error)

		// Document
		UploadDocument(context.Context, string, string, io.Reader) (string, error)
		GetDocument(context.Context, string) (*models.Document, error)
		ListDocuments(context.Context, string) ([]*models.Document, error)
		DeleteDocument(context.Context, string) error
	}

	controller struct {
		activityCollection   mongo.Gateway
		enrollmentCollection mongo.Gateway
		locationCollection   mongo.Gateway
		practiceCollection   mongo.Gateway
		providerCollection   mongo.Gateway
		taskCollection       mongo.Gateway
		documentCollection   mongo.Gateway
	}

	Params struct {
	}
)

func New(ctx context.Context, p Params) (Controller, error) {
	cfg := config.GetConfigFromContext(ctx)

	activityCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.ActivityCollection,
		Database:   cfg.Mongo.Database,
	})

	enrollmentCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.EnrollmentCollection,
		Database:   cfg.Mongo.Database,
	})

	locationCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.LocationCollection,
		Database:   cfg.Mongo.Database,
	})

	practiceCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.PracticeCollection,
		Database:   cfg.Mongo.Database,
	})

	providerCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.ProviderCollection,
		Database:   cfg.Mongo.Database,
	})

	taskCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.TaskCollection,
		Database:   cfg.Mongo.Database,
	})

	documentCollection, _ := mongo.New(ctx, mongo.Params{
		Url:        cfg.Mongo.Url,
		Collection: cfg.Mongo.DocumentCollection,
		Database:   cfg.Mongo.Database,
	})

	return &controller{
		activityCollection:   activityCollection,
		enrollmentCollection: enrollmentCollection,
		locationCollection:   locationCollection,
		practiceCollection:   practiceCollection,
		providerCollection:   providerCollection,
		taskCollection:       taskCollection,
		documentCollection:   documentCollection,
	}, nil
}

func (c *controller) CreateEnrollment(ctx context.Context, enrollment *models.Enrollment) (string, error) {
	enrollment.EnrollmentId = uuid.New().String()
	err := c.enrollmentCollection.Upsert(ctx, bson.M{"enrollmentid": enrollment.EnrollmentId}, enrollment)
	if err != nil {
		return "", err
	}

	// always create an activity when creating an enrollment
	activity := &models.Activity{
		EnrollmentId: enrollment.EnrollmentId,
		Message:      "Enrollment created",
	}
	_, err = c.CreateActivity(ctx, activity)
	if err != nil {
		return "", err
	}

	return enrollment.EnrollmentId, nil
}

func (c *controller) DeleteEnrollment(ctx context.Context, enrollmentId string) error {
	return c.enrollmentCollection.DeleteOne(ctx, bson.M{"enrollmentid": enrollmentId})
}

func (c *controller) ReadEnrollment(ctx context.Context, enrollmentId string) (*models.Enrollment, error) {
	enrollment := &models.Enrollment{}
	err := c.enrollmentCollection.FindOne(ctx, bson.M{"enrollmentid": enrollmentId}, enrollment)
	if err != nil {
		return nil, err
	}
	return enrollment, nil
}

func (c *controller) UpdateEnrollment(ctx context.Context, enrollment *models.Enrollment) error {
	return c.enrollmentCollection.Upsert(ctx, bson.M{"enrollmentid": enrollment.EnrollmentId}, enrollment)
}

func (c *controller) ListEnrollments(ctx context.Context, practiceId string) ([]*models.Enrollment, error) {
	enrollments := []*models.Enrollment{}
	err := c.enrollmentCollection.Find(ctx, bson.M{"practiceid": practiceId}, &enrollments)
	if err != nil {
		return nil, err
	}
	return enrollments, nil
}

func (c *controller) CreateActivity(ctx context.Context, activity *models.Activity) (string, error) {
	activity.ActivityId = uuid.New().String()
	err := c.activityCollection.Upsert(ctx, bson.M{"activityid": activity.ActivityId}, activity)
	if err != nil {
		return "", err
	}
	return activity.ActivityId, nil
}

func (c *controller) ListActivities(ctx context.Context, enrollmentId string) ([]*models.Activity, error) {
	activities := []*models.Activity{}
	err := c.activityCollection.Find(ctx, bson.M{"enrollmentid": enrollmentId}, &activities)
	if err != nil {
		return nil, err
	}
	return activities, nil
}

func (c *controller) CreateLocation(ctx context.Context, location *models.Location) (string, error) {
	location.LocationId = uuid.New().String()
	err := c.locationCollection.Upsert(ctx, bson.M{"locationid": location.LocationId}, location)
	if err != nil {
		return "", err
	}
	return location.LocationId, nil
}

func (c *controller) DeleteLocation(ctx context.Context, locationId string) error {
	return c.locationCollection.DeleteOne(ctx, bson.M{"locationid": locationId})
}

func (c *controller) ReadLocation(ctx context.Context, locationId string) (*models.Location, error) {
	location := &models.Location{}
	err := c.locationCollection.FindOne(ctx, bson.M{"locationid": locationId}, location)
	if err != nil {
		return nil, err
	}
	return location, nil
}

func (c *controller) UpdateLocation(ctx context.Context, location *models.Location) error {
	return c.locationCollection.Upsert(ctx, bson.M{"locationid": location.LocationId}, location)
}

func (c *controller) ListLocations(ctx context.Context, practiceId string) ([]*models.Location, error) {
	locations := []*models.Location{}
	err := c.locationCollection.Find(ctx, bson.M{"practiceid": practiceId}, &locations)
	if err != nil {
		return nil, err
	}
	return locations, nil
}

func (c *controller) CreatePractice(ctx context.Context, practice *models.Practice) (string, error) {
	practice.PracticeId = uuid.New().String()
	err := c.practiceCollection.Upsert(ctx, bson.M{"practiceid": practice.PracticeId}, practice)
	if err != nil {
		return "", err
	}

	// always create a task when creating an enrollment
	task := &models.Task{
		PracticeId: practice.PracticeId,
		Message:    "Sample task",
		Status:     "Pending",
	}
	_, err = c.CreateTask(ctx, task)
	if err != nil {
		return "", err
	}
	return practice.PracticeId, nil
}

func (c *controller) ListPractices(ctx context.Context) ([]*models.Practice, error) {
	practices := []*models.Practice{}
	err := c.practiceCollection.Find(ctx, bson.M{}, &practices)
	if err != nil {
		return nil, err
	}
	return practices, nil
}

func (c *controller) ReadPractice(ctx context.Context, practiceId string) (*models.Practice, error) {
	practice := &models.Practice{}
	err := c.practiceCollection.FindOne(ctx, bson.M{"practiceid": practiceId}, practice)
	if err != nil {
		return nil, err
	}
	return practice, nil
}

func (c *controller) UpdatePractice(ctx context.Context, practice *models.Practice) error {
	return c.practiceCollection.Upsert(ctx, bson.M{"practiceid": practice.PracticeId}, practice)
}

func (c *controller) CreateTask(ctx context.Context, task *models.Task) (string, error) {
	task.TaskId = uuid.New().String()
	err := c.taskCollection.Upsert(ctx, bson.M{"taskid": task.TaskId}, task)
	if err != nil {
		return "", err
	}
	return task.TaskId, nil
}

func (c *controller) ListTasks(ctx context.Context, practiceId string) ([]*models.Task, error) {
	tasks := []*models.Task{}
	err := c.taskCollection.Find(ctx, bson.M{"practiceid": practiceId}, &tasks)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (c *controller) UpdateTask(ctx context.Context, task *models.Task) error {
	return c.taskCollection.Upsert(ctx, bson.M{"taskid": task.TaskId}, task)
}

func (c *controller) CreateProvider(ctx context.Context, provider *models.Provider) (string, error) {
	provider.ProviderId = uuid.New().String()
	err := c.providerCollection.Upsert(ctx, bson.M{"providerid": provider.ProviderId}, provider)
	if err != nil {
		return "", err
	}
	return provider.ProviderId, nil
}

func (c *controller) DeleteProvider(ctx context.Context, providerId string) error {
	return c.providerCollection.DeleteOne(ctx, bson.M{"providerid": providerId})
}

func (c *controller) ReadProvider(ctx context.Context, providerId string) (*models.Provider, error) {
	provider := &models.Provider{}
	err := c.providerCollection.FindOne(ctx, bson.M{"providerid": providerId}, provider)
	if err != nil {
		return nil, err
	}
	return provider, nil
}

func (c *controller) UpdateProvider(ctx context.Context, provider *models.Provider) error {
	return c.providerCollection.Upsert(ctx, bson.M{"providerid": provider.ProviderId}, provider)
}

func (c *controller) ListProviders(ctx context.Context, practiceId string) ([]*models.Provider, error) {
	providers := []*models.Provider{}
	err := c.providerCollection.Find(ctx, bson.M{"practiceid": practiceId}, &providers)
	if err != nil {
		return nil, err
	}
	return providers, nil
}

func (c *controller) UploadDocument(ctx context.Context, practiceId string, fileName string, file io.Reader) (string, error) {
	practiceUploadDir := filepath.Join(uploadDir, practiceId)
	if err := os.MkdirAll(practiceUploadDir, 0755); err != nil {
		return "", err
	}

	documentId := uuid.New().String()
	storageFileName := fmt.Sprintf("%s_%s", documentId, fileName)
	storagePath := filepath.Join(practiceUploadDir, storageFileName)

	// Create the destination file
	dst, err := os.Create(storagePath)
	if err != nil {
		return "", fmt.Errorf("error creating file: %w", err)
	}
	defer dst.Close()

	// Copy the file data
	if _, err := io.Copy(dst, file); err != nil {
		os.Remove(storagePath) // Clean up on error
		return "", fmt.Errorf("error saving file: %w", err)
	}

	// Create document record
	doc := &models.Document{
		DocumentId:  documentId,
		PracticeId:  practiceId,
		FileName:    fileName,
		StoragePath: storagePath,
	}

	err = c.documentCollection.Upsert(ctx, bson.M{"documentid": doc.DocumentId}, doc)
	if err != nil {
		os.Remove(storagePath)
		return "", err
	}

	return doc.DocumentId, nil
}

func (c *controller) GetDocument(ctx context.Context, documentId string) (*models.Document, error) {
	doc := &models.Document{}
	err := c.documentCollection.FindOne(ctx, bson.M{"documentid": documentId}, doc)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (c *controller) ListDocuments(ctx context.Context, practiceId string) ([]*models.Document, error) {
	docs := []*models.Document{}
	err := c.documentCollection.Find(ctx, bson.M{"practiceid": practiceId}, &docs)
	if err != nil {
		return nil, err
	}
	return docs, nil
}

func (c *controller) DeleteDocument(ctx context.Context, documentId string) error {
	// First get the document to find its storage path
	doc := &models.Document{}
	err := c.documentCollection.FindOne(ctx, bson.M{"documentid": documentId}, doc)
	if err != nil {
		return err
	}

	// Delete the physical file
	os.Remove(doc.StoragePath)

	// Delete the document record from the database
	return c.documentCollection.DeleteOne(ctx, bson.M{"documentid": documentId})
}
