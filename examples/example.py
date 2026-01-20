# Python example demonstrating classes, type hints, and async operations

from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime
import asyncio
import aiohttp

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime

class UserService:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def fetch_user(self, user_id: int) -> Optional[User]:
        """Fetch a user by ID from the API."""
        if not self.session:
            raise RuntimeError("Session not initialized")
        
        url = f"{self.base_url}/users/{user_id}"
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return User(
                        id=data['id'],
                        name=data['name'],
                        email=data['email'],
                        is_active=data['is_active'],
                        created_at=datetime.fromisoformat(data['created_at'])
                    )
                return None
        except Exception as e:
            print(f"Error fetching user {user_id}: {e}")
            return None

    async def fetch_all_users(self) -> List[User]:
        """Fetch all active users."""
        users = []
        async with self.session.get(f"{self.base_url}/users") as response:
            if response.status == 200:
                data = await response.json()
                users = [
                    User(**user_data) 
                    for user_data in data 
                    if user_data.get('is_active', False)
                ]
        return users

async def main():
    async with UserService("https://api.example.com") as service:
        user = await service.fetch_user(42)
        if user:
            print(f"User: {user.name} ({user.email})")
        
        active_users = await service.fetch_all_users()
        print(f"Found {len(active_users)} active users")

if __name__ == "__main__":
    asyncio.run(main())
