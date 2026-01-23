// Java example demonstrating classes, generics, streams, and modern Java features

import java.util.*;
import java.util.stream.Collectors;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.function.Predicate;

public class UserService {
    private final String baseUrl;
    private final HttpClient httpClient;
    
    public UserService(String baseUrl) {
        this.baseUrl = baseUrl;
        this.httpClient = new HttpClient();
    }
    
    public Optional<User> fetchUserById(int userId) {
        try {
            String url = baseUrl + "/users/" + userId;
            ApiResponse<User> response = httpClient.get(url, User.class);
            
            if (response.getStatus() == 200 && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Failed to fetch user: " + e.getMessage());
            return Optional.empty();
        }
    }
    
    public List<User> fetchActiveUsers() {
        try {
            String url = baseUrl + "/users";
            ApiResponse<List<User>> response = httpClient.get(url, List.class);
            
            if (response.getStatus() == 200 && response.getData() != null) {
                return response.getData().stream()
                    .filter(User::isActive)
                    .sorted(Comparator.comparing(User::getName))
                    .collect(Collectors.toList());
            }
            return Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            return Collections.emptyList();
        }
    }
    
    public Map<String, List<User>> groupUsersByEmailDomain() {
        return fetchActiveUsers().stream()
            .collect(Collectors.groupingBy(
                user -> user.getEmail().substring(user.getEmail().indexOf('@') + 1)
            ));
    }
}

class User {
    private final int id;
    private final String name;
    private final String email;
    private final boolean active;
    private final LocalDateTime createdAt;
    
    public User(int id, String name, String email, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
        this.createdAt = createdAt;
    }
    
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public String toString() {
        return String.format("User{id=%d, name='%s', email='%s', active=%s}", 
            id, name, email, active);
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

interface ApiResponse<T> {
    T getData();
    int getStatus();
    String getMessage();
}

class HttpClient {
    public <T> ApiResponse<T> get(String url, Class<T> clazz) {
        // Implementation would make HTTP request
        return null;
    }
}
