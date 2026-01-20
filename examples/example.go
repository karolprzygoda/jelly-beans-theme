// Go example demonstrating structs, interfaces, and concurrency

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// User represents a user in the system
type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// UserService handles user-related operations
type UserService struct {
	baseURL    string
	httpClient *http.Client
}

// NewUserService creates a new UserService instance
func NewUserService(baseURL string) *UserService {
	return &UserService{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// FetchUser retrieves a user by ID
func (s *UserService) FetchUser(ctx context.Context, userID int) (*User, error) {
	url := fmt.Sprintf("%s/users/%d", s.baseURL, userID)
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}

	return &user, nil
}

// FetchAllUsers retrieves all active users
func (s *UserService) FetchAllUsers(ctx context.Context) ([]User, error) {
	url := fmt.Sprintf("%s/users", s.baseURL)
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}
	defer resp.Body.Close()

	var users []User
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		return nil, fmt.Errorf("failed to decode users: %w", err)
	}

	// Filter active users
	activeUsers := make([]User, 0)
	for _, user := range users {
		if user.IsActive {
			activeUsers = append(activeUsers, user)
		}
	}

	return activeUsers, nil
}

func main() {
	service := NewUserService("https://api.example.com")
	ctx := context.Background()

	user, err := service.FetchUser(ctx, 42)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("User: %s (%s)\n", user.Name, user.Email)

	users, err := service.FetchAllUsers(ctx)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Found %d active users\n", len(users))
}
