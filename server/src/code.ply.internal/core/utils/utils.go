package utils

import (
	"encoding/json"
)

func ConvertRequestBody[T any](body interface{}) (*T, error) {
	jsonData, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	result := new(T)
	if err := json.Unmarshal(jsonData, result); err != nil {
		return nil, err
	}

	return result, nil
}

func StringPtr(s string) *string {
	return &s
}
