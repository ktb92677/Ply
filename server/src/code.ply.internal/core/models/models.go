package models

type Task struct {
	TaskId     string `json:"taskId,omitempty"`
	PracticeId string `json:"practiceId,omitempty"`
	Message    string `json:"message,omitempty"`
	Status     string `json:"status,omitempty"`
}

type Provider struct {
	ProviderId string `json:"providerId,omitempty"`
	PracticeId string `json:"practiceId,omitempty"`
	Name       string `json:"name,omitempty"`
	Ssn        string `json:"ssn,omitempty"`
}

type Location struct {
	LocationId string `json:"locationId,omitempty"`
	PracticeId string `json:"practiceId,omitempty"`
	Address    string `json:"address,omitempty"`
}

type Enrollment struct {
	EnrollmentId string `json:"enrollmentId,omitempty"`
	PracticeId   string `json:"practiceId,omitempty"`
	State        string `json:"state,omitempty"`
	Payer        string `json:"payer,omitempty"`
	Status       string `json:"status,omitempty"`
	LocationId   string `json:"locationId,omitempty"`
	Type         string `json:"type,omitempty"`
	ProviderId   string `json:"providerId,omitempty"`
}

type Practice struct {
	PracticeId string `json:"practiceId,omitempty"`
	Name       string `json:"name,omitempty"`
	Ein        string `json:"ein,omitempty"`
	OwnerName  string `json:"owner_name,omitempty"`
}

type Activity struct {
	ActivityId   string `json:"activityId,omitempty"`
	EnrollmentId string `json:"enrollmentId,omitempty"`
	Message      string `json:"message,omitempty"`
}

type Document struct {
	DocumentId  string `json:"documentId,omitempty"`
	PracticeId  string `json:"practiceId,omitempty"`
	FileName    string `json:"file_name,omitempty"`
	StoragePath string `json:"storage_path,omitempty"`
}
