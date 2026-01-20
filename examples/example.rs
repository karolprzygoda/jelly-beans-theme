// Rust example demonstrating structs, enums, and async operations

use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use tokio;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
    email: String,
    is_active: bool,
    created_at: SystemTime,
}

#[derive(Debug)]
enum ApiError {
    NetworkError(String),
    ParseError(String),
    NotFound,
    ServerError(u16),
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::NetworkError(msg) => write!(f, "Network error: {}", msg),
            ApiError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            ApiError::NotFound => write!(f, "Resource not found"),
            ApiError::ServerError(code) => write!(f, "Server error: {}", code),
        }
    }
}

impl std::error::Error for ApiError {}

struct UserService {
    base_url: String,
    client: reqwest::Client,
}

impl UserService {
    fn new(base_url: String) -> Self {
        Self {
            base_url,
            client: reqwest::Client::new(),
        }
    }

    async fn fetch_user(&self, user_id: u32) -> Result<User, ApiError> {
        let url = format!("{}/users/{}", self.base_url, user_id);
        
        let response = self.client
            .get(&url)
            .send()
            .await
            .map_err(|e| ApiError::NetworkError(e.to_string()))?;

        match response.status() {
            reqwest::StatusCode::OK => {
                let user: User = response
                    .json()
                    .await
                    .map_err(|e| ApiError::ParseError(e.to_string()))?;
                Ok(user)
            }
            reqwest::StatusCode::NOT_FOUND => Err(ApiError::NotFound),
            status => Err(ApiError::ServerError(status.as_u16())),
        }
    }

    async fn fetch_all_users(&self) -> Result<Vec<User>, ApiError> {
        let url = format!("{}/users", self.base_url);
        
        let response = self.client
            .get(&url)
            .send()
            .await
            .map_err(|e| ApiError::NetworkError(e.to_string()))?;

        let users: Vec<User> = response
            .json()
            .await
            .map_err(|e| ApiError::ParseError(e.to_string()))?;

        let active_users: Vec<User> = users
            .into_iter()
            .filter(|user| user.is_active)
            .collect();

        Ok(active_users)
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let service = UserService::new("https://api.example.com".to_string());

    match service.fetch_user(42).await {
        Ok(user) => {
            println!("User: {} ({})", user.name, user.email);
        }
        Err(e) => {
            eprintln!("Error fetching user: {}", e);
        }
    }

    match service.fetch_all_users().await {
        Ok(users) => {
            println!("Found {} active users", users.len());
        }
        Err(e) => {
            eprintln!("Error fetching users: {}", e);
        }
    }

    Ok(())
}
