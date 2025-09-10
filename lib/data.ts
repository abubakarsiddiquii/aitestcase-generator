import bcrypt from "bcryptjs"

const hashPassword = (password: string) => {
  try {
    return bcrypt.hashSync(password, 12)
  } catch (error) {
    console.error("Error hashing password:", error)
    return password // fallback for build time
  }
}

// In-memory data store (replace with database in production)
export const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.LBHyuu", // demo123
    bio: "Welcome to AI Test Case Generator! I'm a demo user here to show you around the platform. Feel free to explore and create your own posts!",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    bio: "Software Engineer passionate about building great user experiences.",
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    bio: "I am a developer with a passion for open source.",
    createdAt: "2024-02-01T00:00:00.000Z",
  },
]

export const posts = [
  {
    id: "1",
    content:
      "Hello World",
    authorId: "1",
    createdAt: "2024-01-02T10:00:00.000Z",
  },
  {
    id: "2",
    content:
      "Just finished working on a new React project!",
    authorId: "2",
    createdAt: "2024-01-16T14:30:00.000Z",
  },
  {
    id: "3",
    content:
      " What's your favorite React feature?",
    authorId: "3",
    createdAt: "2024-02-02T09:15:00.000Z",
  },
  {
    id: "4",
    content:
      "Had an amazing networking event today! Met so many talented professionals from different industries.",
    authorId: "3",
    createdAt: "2024-02-03T16:45:00.000Z",
  },
]
