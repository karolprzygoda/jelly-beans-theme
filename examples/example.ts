// TypeScript example demonstrating type definitions and generics

type ButtonHTMLAttributes<T extends HTMLElement> = React.HTMLAttributes<T>;

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class DataService<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchData(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    const data: T = await response.json();
    
    return {
      data,
      status: response.status,
      message: 'Success'
    };
  }
}

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

const userService = new DataService<User>('https://api.example.com');

async function getUserById(id: number): Promise<User | null> {
  try {
    const response = await userService.fetchData(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

const userId: number = 42;
const user = await getUserById(userId);

if (user) {
  console.log(`User: ${user.name} (${user.email})`);
}
