package main

import (
	"auth/pkg/config"
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"crypto/subtle"
)

type SessionPutBody struct {
	UserId string `json:"userId"`
}

func auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.GetHeader("Authorization")
		fmt.Println(authorization, config.Config.Auth)

		if authorization == "" {
			c.AbortWithStatus(401)
			return
		}

		if subtle.ConstantTimeCompare([]byte(authorization), []byte(config.Config.Auth)) != 1 {

			c.AbortWithStatus(403)
			return
		}

		c.Next()
	}
}

func main() {
	opt, err := redis.ParseURL(config.Config.RedisUrl)
	if err != nil {
		panic(err)
	}
	redisClient := redis.NewClient(opt)
	redisClient.Ping(context.Background())

	router := gin.Default()

	sessionEndpoints := router.Group("/session").Use(auth())
	{
		sessionEndpoints.PUT("/:sessionId", func(c *gin.Context) {
			sessionId := c.Param("sessionId")

			var body SessionPutBody
			if err := c.ShouldBindJSON(&body); err != nil {
				fmt.Println(fmt.Errorf("error parsing request body - %w", err))
				c.AbortWithStatus(400)
				return
			}

			exists, err := redisClient.Exists(context.Background(), sessionId).Result()
			if err != nil {
				fmt.Println(fmt.Errorf("error checking if session exists - %w", err))
				c.AbortWithStatus(500)
				return
			}

			redisClient.Set(context.Background(), sessionId, body.UserId, 0)

			if exists == 0 {
				c.Status(201)
			} else {
				c.Status(200)
			}
		})

		sessionEndpoints.GET("/:sessionId", func(c *gin.Context) {
			sessionId := c.Param("sessionId")

			userId, err := redisClient.Get(context.Background(), sessionId).Result()
			if err != nil {
				if err == redis.Nil {
					c.JSON(200, gin.H{
						"userId": nil,
					})
					return
				}
				fmt.Println(fmt.Errorf("error getting session - %w", err))
				c.AbortWithStatus(500)
				return
			}

			c.JSON(200, gin.H{
				"userId": userId,
			})
		})

		sessionEndpoints.DELETE("/:sessionId", func(c *gin.Context) {
			sessionId := c.Param("sessionId")

			if _, err := redisClient.Del(context.Background(), sessionId).Result(); err != nil {
				fmt.Println(fmt.Errorf("error deleting session - %w", err))
				c.AbortWithStatus(500)
				return
			}

			c.Status(204)
		})
	}

	router.Run(":8000")
}
