package config

import (
	"context"
	"log"
	"os"

	"gopkg.in/yaml.v2"
)

type configKeyType string

const (
	_configKey configKeyType = "config"
)

const (
	_defaultConfigFileName = "config/test.yaml"
)

var (
	envToFileMapper = map[string]string{
		"test": "config/test.yaml",
	}
)

// Config structure for Kafka settings
type Config struct {
	Service ServiceConfig `yaml:"service"`
	Mongo   MongoConfig   `yaml:"mongo"`
}

type ServiceConfig struct {
	Port int `yaml:"port"`
}

type MongoConfig struct {
	Url                  string `yaml:"url"`
	Database             string `yaml:"database"`
	ActivityCollection   string `yaml:"activityCollection"`
	EnrollmentCollection string `yaml:"enrollmentCollection"`
	LocationCollection   string `yaml:"locationCollection"`
	PracticeCollection   string `yaml:"practiceCollection"`
	ProviderCollection   string `yaml:"providerCollection"`
	TaskCollection       string `yaml:"taskCollection"`
	DocumentCollection   string `yaml:"documentCollection"`
}

// Function to load config from a YAML file
func LoadConfig(ctx context.Context) (context.Context, error) {
	filename := _defaultConfigFileName
	if value, ok := envToFileMapper[os.Getenv("PLY_ENV")]; ok {
		filename = value
	} else {
		log.Fatal("Invalid environment variable PLY_ENV")
	}

	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Config
	decoder := yaml.NewDecoder(file)

	// Set non-strict mode to allow missing fields
	decoder.SetStrict(false)

	if err := decoder.Decode(&config); err != nil {
		return nil, err
	}

	ctx = context.WithValue(ctx, _configKey, &config)

	return ctx, nil
}

func GetConfigFromContext(ctx context.Context) *Config {
	config, ok := ctx.Value(_configKey).(*Config)
	if !ok {
		log.Fatal("Unable to retrieve config from context")
	}
	return config
}
