package config

import (
	"fmt"
	"os"
)

type config struct {
	RedisUrl string
	Auth     string
}

func new() *config {
	errors := []error{}

	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		errors = append(errors, fmt.Errorf("REDIS_URL not set"))
	}

	auth := os.Getenv("AUTH")
	if auth == "" {
		errors = append(errors, fmt.Errorf("AUTH not set"))
	}

	if len(errors) > 0 {
		panic(fmt.Errorf("errors: %v", errors))
	}

	return &config{
		RedisUrl: redisUrl,
		Auth:     auth,
	}
}

var Config = new()
