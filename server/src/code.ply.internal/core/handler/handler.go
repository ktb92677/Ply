package handler

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	cfg "code.ply.internal/core/config"
	"code.ply.internal/core/controller"
	"code.ply.internal/core/models"
	"code.ply.internal/core/utils"
	serverapi "code.ply.internal/gen"
	"github.com/go-chi/chi/v5"
	middleware "github.com/oapi-codegen/nethttp-middleware"
	"github.com/rs/cors"
)

type (
	handler struct {
		serverapi.StrictServerInterface
		mainController controller.Controller
	}

	Params struct {
	}
)

func New(ctx context.Context, p Params) (serverapi.StrictServerInterface, error) {
	_ = cfg.GetConfigFromContext(ctx)

	mainController, _ := controller.New(ctx, controller.Params{})

	return &handler{
		mainController: mainController,
	}, nil
}

func StartGatewayService(ctx context.Context, gateway serverapi.StrictServerInterface) {
	config := cfg.GetConfigFromContext(ctx)

	swagger, err := serverapi.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}

	// Clear out the servers array in the swagger spec, that skips validating
	// that server names match. We don't know how this thing will be run.
	swagger.Servers = nil

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"*"},
	})
	router := chi.NewRouter()
	router.Use(corsHandler.Handler)
	router.Use(middleware.OapiRequestValidator(swagger))

	// Create the server implementation
	serverStrictHandler := serverapi.NewStrictHandler(gateway, nil)

	// Register the server routes
	serverapi.HandlerFromMux(serverStrictHandler, router)

	// Start the server
	http.ListenAndServe(fmt.Sprintf(":%d", config.Service.Port), router)
}

func (h *handler) PostV1PlyEnrollment(ctx context.Context, request serverapi.PostV1PlyEnrollmentRequestObject) (serverapi.PostV1PlyEnrollmentResponseObject, error) {
	enrollment, err := utils.ConvertRequestBody[models.Enrollment](request.Body)
	if err != nil {
		return serverapi.PostV1PlyEnrollment500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	enrollmentId, err := h.mainController.CreateEnrollment(ctx, enrollment)
	if err != nil {
		return serverapi.PostV1PlyEnrollment500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyEnrollment200JSONResponse{
		EnrollmentId: utils.StringPtr(enrollmentId),
	}, nil
}

func (h *handler) DeleteV1PlyEnrollmentEnrollmentId(ctx context.Context, request serverapi.DeleteV1PlyEnrollmentEnrollmentIdRequestObject) (serverapi.DeleteV1PlyEnrollmentEnrollmentIdResponseObject, error) {
	err := h.mainController.DeleteEnrollment(ctx, request.EnrollmentId)
	if err != nil {
		return serverapi.DeleteV1PlyEnrollmentEnrollmentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}
	return serverapi.DeleteV1PlyEnrollmentEnrollmentId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyEnrollmentEnrollmentId(ctx context.Context, request serverapi.GetV1PlyEnrollmentEnrollmentIdRequestObject) (serverapi.GetV1PlyEnrollmentEnrollmentIdResponseObject, error) {
	enrollment, err := h.mainController.ReadEnrollment(ctx, request.EnrollmentId)
	if err != nil {
		return serverapi.GetV1PlyEnrollmentEnrollmentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	httpEnrollment, err := utils.ConvertRequestBody[serverapi.GetV1PlyEnrollmentEnrollmentId200JSONResponse](enrollment)
	if err != nil {
		return serverapi.GetV1PlyEnrollmentEnrollmentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpEnrollment, nil
}

func (h *handler) PostV1PlyEnrollmentEnrollmentId(ctx context.Context, request serverapi.PostV1PlyEnrollmentEnrollmentIdRequestObject) (serverapi.PostV1PlyEnrollmentEnrollmentIdResponseObject, error) {
	enrollment, err := utils.ConvertRequestBody[models.Enrollment](request.Body)
	if err != nil {
		return serverapi.PostV1PlyEnrollmentEnrollmentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	err = h.mainController.UpdateEnrollment(ctx, enrollment)
	if err != nil {
		return serverapi.PostV1PlyEnrollmentEnrollmentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyEnrollmentEnrollmentId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyEnrollmentEnrollmentIdActivity(ctx context.Context, request serverapi.GetV1PlyEnrollmentEnrollmentIdActivityRequestObject) (serverapi.GetV1PlyEnrollmentEnrollmentIdActivityResponseObject, error) {
	activities, err := h.mainController.ListActivities(ctx, request.EnrollmentId)
	if err != nil {
		return serverapi.GetV1PlyEnrollmentEnrollmentIdActivity500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedActivities := struct {
		Activities []*models.Activity `json:"activities,omitempty"`
	}{
		Activities: activities,
	}

	httpActivities, err := utils.ConvertRequestBody[serverapi.GetV1PlyEnrollmentEnrollmentIdActivity200JSONResponse](parsedActivities)
	if err != nil {
		return serverapi.GetV1PlyEnrollmentEnrollmentIdActivity500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpActivities, nil
}

func (h *handler) PostV1PlyLocation(ctx context.Context, request serverapi.PostV1PlyLocationRequestObject) (serverapi.PostV1PlyLocationResponseObject, error) {
	location, err := utils.ConvertRequestBody[models.Location](request.Body)
	if err != nil {
		return serverapi.PostV1PlyLocation500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	locationId, err := h.mainController.CreateLocation(ctx, location)
	if err != nil {
		return serverapi.PostV1PlyLocation500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyLocation200JSONResponse{
		LocationId: utils.StringPtr(locationId),
	}, nil
}

func (h *handler) DeleteV1PlyLocationLocationId(ctx context.Context, request serverapi.DeleteV1PlyLocationLocationIdRequestObject) (serverapi.DeleteV1PlyLocationLocationIdResponseObject, error) {
	err := h.mainController.DeleteLocation(ctx, request.LocationId)
	if err != nil {
		return serverapi.DeleteV1PlyLocationLocationId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}
	return serverapi.DeleteV1PlyLocationLocationId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyLocationLocationId(ctx context.Context, request serverapi.GetV1PlyLocationLocationIdRequestObject) (serverapi.GetV1PlyLocationLocationIdResponseObject, error) {
	location, err := h.mainController.ReadLocation(ctx, request.LocationId)
	if err != nil {
		return serverapi.GetV1PlyLocationLocationId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	httpLocation, err := utils.ConvertRequestBody[serverapi.GetV1PlyLocationLocationId200JSONResponse](location)
	if err != nil {
		return serverapi.GetV1PlyLocationLocationId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpLocation, nil
}

func (h *handler) PostV1PlyLocationLocationId(ctx context.Context, request serverapi.PostV1PlyLocationLocationIdRequestObject) (serverapi.PostV1PlyLocationLocationIdResponseObject, error) {
	location, err := utils.ConvertRequestBody[models.Location](request.Body)
	if err != nil {
		return serverapi.PostV1PlyLocationLocationId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	err = h.mainController.UpdateLocation(ctx, location)
	if err != nil {
		return serverapi.PostV1PlyLocationLocationId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyLocationLocationId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) PostV1PlyPractice(ctx context.Context, request serverapi.PostV1PlyPracticeRequestObject) (serverapi.PostV1PlyPracticeResponseObject, error) {
	practice, err := utils.ConvertRequestBody[models.Practice](request.Body)
	if err != nil {
		return serverapi.PostV1PlyPractice500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	practiceId, err := h.mainController.CreatePractice(ctx, practice)
	if err != nil {
		return serverapi.PostV1PlyPractice500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyPractice200JSONResponse{
		PracticeId: utils.StringPtr(practiceId),
	}, nil
}

func (h *handler) GetV1PlyPracticeList(ctx context.Context, request serverapi.GetV1PlyPracticeListRequestObject) (serverapi.GetV1PlyPracticeListResponseObject, error) {
	practices, err := h.mainController.ListPractices(ctx)
	if err != nil {
		return serverapi.GetV1PlyPracticeList500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedPractices := struct {
		Practices []*models.Practice `json:"practices,omitempty"`
	}{
		Practices: practices,
	}

	httpPractices, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticeList200JSONResponse](parsedPractices)
	if err != nil {
		return serverapi.GetV1PlyPracticeList500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpPractices, nil
}

func (h *handler) GetV1PlyPracticePracticeId(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdRequestObject) (serverapi.GetV1PlyPracticePracticeIdResponseObject, error) {
	practice, err := h.mainController.ReadPractice(ctx, request.PracticeId)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	httpPractice, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeId200JSONResponse](practice)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpPractice, nil
}

func (h *handler) PostV1PlyPracticePracticeId(ctx context.Context, request serverapi.PostV1PlyPracticePracticeIdRequestObject) (serverapi.PostV1PlyPracticePracticeIdResponseObject, error) {
	practice, err := utils.ConvertRequestBody[models.Practice](request.Body)
	if err != nil {
		return serverapi.PostV1PlyPracticePracticeId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	err = h.mainController.UpdatePractice(ctx, practice)
	if err != nil {
		return serverapi.PostV1PlyPracticePracticeId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyPracticePracticeId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyPracticePracticeIdEnrollment(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdEnrollmentRequestObject) (serverapi.GetV1PlyPracticePracticeIdEnrollmentResponseObject, error) {
	enrollments, err := h.mainController.ListEnrollments(ctx, request.PracticeId)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdEnrollment500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedEnrollments := struct {
		Enrollments []*models.Enrollment `json:"enrollments,omitempty"`
	}{
		Enrollments: enrollments,
	}

	httpEnrollments, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeIdEnrollment200JSONResponse](parsedEnrollments)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdEnrollment500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpEnrollments, nil
}

func (h *handler) GetV1PlyPracticePracticeIdLocation(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdLocationRequestObject) (serverapi.GetV1PlyPracticePracticeIdLocationResponseObject, error) {
	locations, err := h.mainController.ListLocations(ctx, request.PracticeId)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdLocation500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedLocations := struct {
		Locations []*models.Location `json:"locations,omitempty"`
	}{
		Locations: locations,
	}

	httpLocations, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeIdLocation200JSONResponse](parsedLocations)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdLocation500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpLocations, nil
}

func (h *handler) GetV1PlyPracticePracticeIdProvider(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdProviderRequestObject) (serverapi.GetV1PlyPracticePracticeIdProviderResponseObject, error) {
	providers, err := h.mainController.ListProviders(ctx, request.PracticeId)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdProvider500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedProviders := struct {
		Providers []*models.Provider `json:"providers,omitempty"`
	}{
		Providers: providers,
	}

	httpProviders, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeIdProvider200JSONResponse](parsedProviders)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdProvider500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpProviders, nil
}

func (h *handler) PostV1PlyProvider(ctx context.Context, request serverapi.PostV1PlyProviderRequestObject) (serverapi.PostV1PlyProviderResponseObject, error) {
	provider, err := utils.ConvertRequestBody[models.Provider](request.Body)
	if err != nil {
		return serverapi.PostV1PlyProvider500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	providerId, err := h.mainController.CreateProvider(ctx, provider)
	if err != nil {
		return serverapi.PostV1PlyProvider500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyProvider200JSONResponse{
		ProviderId: utils.StringPtr(providerId),
	}, nil
}

func (h *handler) DeleteV1PlyProviderProviderId(ctx context.Context, request serverapi.DeleteV1PlyProviderProviderIdRequestObject) (serverapi.DeleteV1PlyProviderProviderIdResponseObject, error) {
	err := h.mainController.DeleteProvider(ctx, request.ProviderId)
	if err != nil {
		return serverapi.DeleteV1PlyProviderProviderId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}
	return serverapi.DeleteV1PlyProviderProviderId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyProviderProviderId(ctx context.Context, request serverapi.GetV1PlyProviderProviderIdRequestObject) (serverapi.GetV1PlyProviderProviderIdResponseObject, error) {
	provider, err := h.mainController.ReadProvider(ctx, request.ProviderId)
	if err != nil {
		return serverapi.GetV1PlyProviderProviderId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	httpProvider, err := utils.ConvertRequestBody[serverapi.GetV1PlyProviderProviderId200JSONResponse](provider)
	if err != nil {
		return serverapi.GetV1PlyProviderProviderId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}
	return httpProvider, nil
}

func (h *handler) PostV1PlyProviderProviderId(ctx context.Context, request serverapi.PostV1PlyProviderProviderIdRequestObject) (serverapi.PostV1PlyProviderProviderIdResponseObject, error) {
	provider, err := utils.ConvertRequestBody[models.Provider](request.Body)
	if err != nil {
		return serverapi.PostV1PlyProviderProviderId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	err = h.mainController.UpdateProvider(ctx, provider)
	if err != nil {
		return serverapi.PostV1PlyProviderProviderId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyProviderProviderId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) GetV1PlyPracticePracticeIdTask(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdTaskRequestObject) (serverapi.GetV1PlyPracticePracticeIdTaskResponseObject, error) {
	tasks, err := h.mainController.ListTasks(ctx, request.PracticeId)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdTask500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedTasks := struct {
		Tasks []*models.Task `json:"tasks,omitempty"`
	}{
		Tasks: tasks,
	}

	httpTasks, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeIdTask200JSONResponse](parsedTasks)
	if err != nil {
		return serverapi.GetV1PlyPracticePracticeIdTask500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpTasks, nil
}

func (h *handler) PostV1PlyTaskTaskId(ctx context.Context, request serverapi.PostV1PlyTaskTaskIdRequestObject) (serverapi.PostV1PlyTaskTaskIdResponseObject, error) {
	task, err := utils.ConvertRequestBody[models.Task](request.Body)
	if err != nil {
		return serverapi.PostV1PlyTaskTaskId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	err = h.mainController.UpdateTask(ctx, task)
	if err != nil {
		return serverapi.PostV1PlyTaskTaskId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return serverapi.PostV1PlyTaskTaskId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}

func (h *handler) PostV1PlyPracticePracticeIdUpload(ctx context.Context, request serverapi.PostV1PlyPracticePracticeIdUploadRequestObject) (serverapi.PostV1PlyPracticePracticeIdUploadResponseObject, error) {
	// Get the file and form fields
	var fileName string
	var fileData []byte

	for {
		part, err := request.Body.NextPart()
		if err != nil {
			break
		}

		switch part.FormName() {
		case "file":
			buf := new(bytes.Buffer)
			buf.ReadFrom(part)
			fileData = buf.Bytes()
		case "fileName":
			buf := new(bytes.Buffer)
			buf.ReadFrom(part)
			fileName = buf.String()
		}
	}

	if len(fileData) == 0 {
		return &serverapi.PostV1PlyPracticePracticeIdUpload500JSONResponse{
			Code:    int32(500),
			Message: "file is required",
		}, nil
	}

	if fileName == "" {
		return &serverapi.PostV1PlyPracticePracticeIdUpload500JSONResponse{
			Code:    int32(500),
			Message: "fileName is required",
		}, nil
	}

	// Upload the document using the file data
	documentId, err := h.mainController.UploadDocument(ctx, request.PracticeId, fileName, bytes.NewReader(fileData))
	if err != nil {
		return &serverapi.PostV1PlyPracticePracticeIdUpload500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return &serverapi.PostV1PlyPracticePracticeIdUpload200JSONResponse{
		DocumentId: utils.StringPtr(documentId),
	}, nil
}

func (h *handler) GetV1PlyDocumentDocumentId(ctx context.Context, request serverapi.GetV1PlyDocumentDocumentIdRequestObject) (serverapi.GetV1PlyDocumentDocumentIdResponseObject, error) {
	doc, err := h.mainController.GetDocument(ctx, request.DocumentId)
	if err != nil {
		return &serverapi.GetV1PlyDocumentDocumentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	// Read the entire file into memory
	fileData, err := os.ReadFile(doc.StoragePath)
	if err != nil {
		return &serverapi.GetV1PlyDocumentDocumentId500JSONResponse{
			Code:    int32(500),
			Message: fmt.Sprintf("error reading file: %v", err),
		}, nil
	}

	// Detect content type based on file extension
	ext := filepath.Ext(doc.FileName)
	contentType := "application/octet-stream" // default binary
	switch strings.ToLower(ext) {
	case ".pdf":
		contentType = "application/pdf"
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".png":
		contentType = "image/png"
	case ".gif":
		contentType = "image/gif"
	case ".txt":
		contentType = "text/plain"
	case ".html", ".htm":
		contentType = "text/html"
	case ".doc", ".docx":
		contentType = "application/msword"
	case ".xls", ".xlsx":
		contentType = "application/vnd.ms-excel"
	case ".zip":
		contentType = "application/zip"
	}

	// Create a response with the file data
	return &serverapi.GetV1PlyDocumentDocumentId200AsteriskResponse{
		Body:          bytes.NewReader(fileData),
		ContentLength: int64(len(fileData)),
		ContentType:   contentType,
	}, nil
}

func (h *handler) GetV1PlyPracticePracticeIdDocument(ctx context.Context, request serverapi.GetV1PlyPracticePracticeIdDocumentRequestObject) (serverapi.GetV1PlyPracticePracticeIdDocumentResponseObject, error) {
	documents, err := h.mainController.ListDocuments(ctx, request.PracticeId)
	if err != nil {
		return &serverapi.GetV1PlyPracticePracticeIdDocument500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	parsedDocuments := struct {
		Documents []*models.Document `json:"documents,omitempty"`
	}{
		Documents: documents,
	}

	httpDocuments, err := utils.ConvertRequestBody[serverapi.GetV1PlyPracticePracticeIdDocument200JSONResponse](parsedDocuments)
	if err != nil {
		return &serverapi.GetV1PlyPracticePracticeIdDocument500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}

	return httpDocuments, nil
}

func (h *handler) DeleteV1PlyDocumentDocumentId(ctx context.Context, request serverapi.DeleteV1PlyDocumentDocumentIdRequestObject) (serverapi.DeleteV1PlyDocumentDocumentIdResponseObject, error) {
	err := h.mainController.DeleteDocument(ctx, request.DocumentId)
	if err != nil {
		return &serverapi.DeleteV1PlyDocumentDocumentId500JSONResponse{
			Code:    int32(500),
			Message: err.Error(),
		}, nil
	}
	return &serverapi.DeleteV1PlyDocumentDocumentId200JSONResponse{
		Status: utils.StringPtr("Completed"),
	}, nil
}
