'use client'

import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../shared/code-block/code-block'
import Mermaid from '../shared/mermaid'

export default function SOLIrchitectureView() {
  const [activeSection, setActiveSection] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    const headings = contentRef.current?.querySelectorAll('h2, h3')
    headings?.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const sections = [
    { id: 'project-structure', title: 'Project Structure' },
    { id: 'solid-principles', title: 'SOLID Principles' },
    { id: 'authentication-setup', title: 'Authentication Setup' },
    { id: 'server-actions', title: 'Server Actions' },
    { id: 'kanban-board', title: 'Kanban Board' },
    { id: 'habit-tracker', title: 'Habit Tracker' },
    { id: 'scalability', title: 'Scalability' },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <nav className="w-64 fixed h-screen overflow-y-auto p-4 border-r border-border">
        <h1 className="text-2xl font-bold mb-4">SOLID Next.js Architecture</h1>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block p-2 rounded transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 ml-64 p-8" ref={contentRef}>
        <section id="project-structure">
          <h2 className="text-3xl font-bold mb-4">Project Structure</h2>
          <p className="mb-4">
            Let's start by defining a scalable and modular project structure that separates concerns and promotes maintainability.
          </p>
          <Mermaid
            chart={`
              graph TD
                A["/src"]
                A --> B["/app"]
                A --> C["/components"]
                A --> D["/lib"]
                A --> E["/hooks"]
                A --> F["/context"]
                A --> G["/types"]
                A --> H["/utils"]
                A --> I["/styles"]
                B --> J["/(auth)"]
                B --> K["/(dashboard)"]
                B --> L["/api"]
                C --> M["/ui"]
                C --> N["/features"]
                N --> O["/kanban-board"]
                N --> P["/habit-tracker"]
                D --> Q["/server-actions"]
                D --> R["/auth"]
            `}
          />
        </section>

        <section id="solid-principles">
          <h2 className="text-3xl font-bold my-8">SOLID Principles in Next.js</h2>
          
          <h3 className="text-2xl font-semibold my-4">Single Responsibility Principle (SRP)</h3>
          <p className="mb-4">Each module or component should have one, and only one, reason to change.</p>
          <CodeBlock
            code={`
// Bad: Component doing too much
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUser(userId).then(setUser);
    fetchPosts(userId).then(setPosts);
  }, [userId]);

  return (
    <div>
      <h1>{user.name}</h1>
      <PostList posts={posts} />
    </div>
  );
};

// Good: Separated concerns
const UserProfile = ({ userId }) => {
  const user = useUser(userId);
  return <UserInfo user={user} />;
};

const UserPosts = ({ userId }) => {
  const posts = usePosts(userId);
  return <PostList posts={posts} />;
};
            `}
            fileName="user-profile.tsx"
            language="typescript"
            badges={["SRP", "React"]}
          />

          <h3 className="text-2xl font-semibold my-4">Open-Closed Principle (OCP)</h3>
          <p className="mb-4">Software entities should be open for extension, but closed for modification.</p>
          <CodeBlock
            code={`
// components/ui/button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded';
  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    danger: 'bg-red-500 text-white',
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

// Usage
import Button from '@/components/ui/button';

const MyComponent = () => (
  <div>
    <Button variant="primary">Primary Action</Button>
    <Button variant="secondary">Secondary Action</Button>
    <Button variant="danger">Dangerous Action</Button>
  </div>
);
            `}
            fileName="button.tsx"
            language="typescript"
            badges={["OCP", "React", "Tailwind CSS"]}
          />

          <h3 className="text-2xl font-semibold my-4">Liskov Substitution Principle (LSP)</h3>
          <p className="mb-4">Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.</p>
          <CodeBlock
            code={`
// types/auth-provider.ts
export interface AuthProvider {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

// lib/auth/email-auth-provider.ts
import { AuthProvider } from '@/types/auth-provider';

export class EmailAuthProvider implements AuthProvider {
  async login({ email, password }: { email: string; password: string }) {
    // Implementation
  }

  async logout() {
    // Implementation
  }

  async getCurrentUser() {
    // Implementation
  }
}

// lib/auth/google-auth-provider.ts
import { AuthProvider } from '@/types/auth-provider';

export class GoogleAuthProvider implements AuthProvider {
  async login({ email, password }: { email: string; password: string }) {
    // Implementation using Google OAuth
  }

  async logout() {
    // Implementation
  }

  async getCurrentUser() {
    // Implementation
  }
}

// Usage
const authProvider: AuthProvider = new EmailAuthProvider();
// or
const authProvider: AuthProvider = new GoogleAuthProvider();

// Both can be used interchangeably
await authProvider.login({ email: 'user@example.com', password: 'password' });
            `}
            fileName="auth-provider.ts"
            language="typescript"
            badges={["LSP", "Authentication"]}
          />

          <h3 className="text-2xl font-semibold my-4">Interface Segregation Principle (ISP)</h3>
          <p className="mb-4">A client should not be forced to depend on interfaces it does not use.</p>
          <CodeBlock
            code={`
// Bad: One large interface
interface UserActions {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: Partial<UserProfile>): Promise<void>;
  getFriends(): Promise<User[]>;
  addFriend(userId: string): Promise<void>;
  removeFriend(userId: string): Promise<void>;
  getPosts(): Promise<Post[]>;
  createPost(data: NewPost): Promise<Post>;
  deletePost(postId: string): Promise<void>;
}

// Good: Segregated interfaces
interface UserProfileActions {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: Partial<UserProfile>): Promise<void>;
}

interface UserFriendActions {
  getFriends(): Promise<User[]>;
  addFriend(userId: string): Promise<void>;
  removeFriend(userId: string): Promise<void>;
}

interface UserPostActions {
  getPosts(): Promise<Post[]>;
  createPost(data: NewPost): Promise<Post>;
  deletePost(postId: string): Promise<void>;
}

// Usage
class UserService implements UserProfileActions, UserFriendActions {
  async getProfile() {
    // Implementation
  }

  async updateProfile(data: Partial<UserProfile>) {
    // Implementation
  }

  async getFriends() {
    // Implementation
  }

  async addFriend(userId: string) {
    // Implementation
  }

  async removeFriend(userId: string) {
    // Implementation
  }
}

class PostService implements UserPostActions {
  async getPosts() {
    // Implementation
  }

  async createPost(data: NewPost) {
    // Implementation
  }

  async deletePost(postId: string) {
    // Implementation
  }
}
            `}
            fileName="user-actions.ts"
            language="typescript"
            badges={["ISP", "TypeScript"]}
          />

          <h3 className="text-2xl font-semibold my-4">Dependency Inversion Principle (DIP)</h3>
          <p className="mb-4">High-level modules should not depend on low-level modules. Both should depend on abstractions.</p>
          <CodeBlock
            code={`
// types/logger.ts
export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// lib/logger/console-logger.ts
import { Logger } from '@/types/logger';

export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }

  error(message: string) {
    console.error(message);
  }
}

// lib/logger/file-logger.ts
import { Logger } from '@/types/logger';
import fs from 'fs/promises';

export class FileLogger implements Logger {
  private logFile: string;

  constructor(logFile: string) {
    this.logFile = logFile;
  }

  async log(message: string) {
    await fs.appendFile(this.logFile, \`[LOG] \${message}\n\`);
  }

  async error(message: string) {
    await fs.appendFile(this.logFile, \`[ERROR] \${message}\n\`);
  }
}

// Usage in a high-level module
import { Logger } from '@/types/logger';

class UserService {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async createUser(userData: NewUser) {
    try {
      // Create user logic
      this.logger.log('User created successfully');
    } catch (error) {
      this.logger.error('Failed to create user');
    }
  }
}

// In the composition root
import { ConsoleLogger } from '@/lib/logger/console-logger';
import { FileLogger } from '@/lib/logger/file-logger';

const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger('/path/to/log/file.log');

const userService = new UserService(consoleLogger);
// or
const userService = new UserService(fileLogger);
            `}
            fileName="logger.ts"
            language="typescript"
            badges={["DIP", "TypeScript"]}
          />
        </section>

        <section id="authentication-setup">
          <h2 className="text-3xl font-bold my-8">Authentication Setup</h2>
          <p className="mb-4">For authentication, we'll use NextAuth.js, which provides a flexible and secure authentication solution for Next.js applications.</p>
          <CodeBlock
            code={`
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.userId = user.id;
      return session;
    },
  },
});

// lib/auth.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }
  // Fetch user from database using session.userId
  return user;
}
            `}
            fileName="auth-setup.ts"
            language="typescript"
            badges={["Authentication", "NextAuth.js"]}
          />
        </section>

        <section id="server-actions">
          <h2 className="text-3xl font-bold my-8">Server Actions Implementation</h2>
          <p className="mb-4">Next.js 13 introduced server actions, which allow you to define and use server-side functions directly in your components. Let's implement a  server action for creating a new task in our Kanban board.</p>
          <CodeBlock
            code={`
// lib/server-actions/kanban-actions.ts
'use server'

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function createTask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to create a task');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const columnId = formData.get('columnId') as string;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      column: { connect: { id: columnId } },
      user: { connect: { id: user.id } },
    },
  });

  return task;
}

// components/features/kanban-board/new-task-form.tsx
'use client'

import { useRef } from 'react';
import { createTask } from '@/lib/server-actions/kanban-actions';

export function NewTaskForm({ columnId }: { columnId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTask(formData);
        formRef.current?.reset();
      }}
    >
      <input type="hidden" name="columnId" value={columnId} />
      <input type="text" name="title" placeholder="Task title" required />
      <textarea name="description" placeholder="Task description"></textarea>
      <button type="submit">Add Task</button>
    </form>
  );
}
            `}
            fileName="kanban-actions.ts"
            language="typescript"
            badges={["Server Actions", "Next.js 13"]}
          />
        </section>

        <section id="kanban-board">
          <h2 className="text-3xl font-bold my-8">Feature Implementation: Kanban Board</h2>
          <p className="mb-4">Now, let's implement the Kanban board feature using our scalable architecture and SOLID principles.</p>
          <CodeBlock
            code={`
// components/features/kanban-board/kanban-board.tsx
import { useKanbanBoard } from '@/hooks/use-kanban-board';
import { KanbanColumn } from './kanban-column';
import { NewColumnForm } from './new-column-form';

export function KanbanBoard() {
  const { columns, isLoading, error } = useKanbanBoard();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex overflow-x-auto p-4 space-x-4">
      {columns.map((column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
      <NewColumnForm />
    </div>
  );
}

// components/features/kanban-board/kanban-column.tsx
import { KanbanTask } from './kanban-task';
import { NewTaskForm } from './new-task-form';

export function KanbanColumn({ column }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg min-w-[250px]">
      <h3 className="font-bold mb-2">{column.title}</h3>
      {column.tasks.map((task) => (
        <KanbanTask key={task.id} task={task} />
      ))}
      <NewTaskForm columnId={column.id} />
    </div>
  );
}

// components/features/kanban-board/kanban-task.tsx
export function KanbanTask({ task }) {
  return (
    <div className="bg-white p-2 mb-2 rounded shadow">
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
    </div>
  );
}

// hooks/use-kanban-board.ts
import useSWR from 'swr';

export function useKanbanBoard() {
  const { data, error } = useSWR('/api/kanban-board', fetcher);

  return {
    columns: data?.columns ?? [],
    isLoading: !error && !data,
    error,
  };
}
            `}
            fileName="kanban-board.tsx"
            language="typescript"
            badges={["React", "SWR", "Tailwind CSS"]}
          />
        </section>

        <section id="habit-tracker">
          <h2 className="text-3xl font-bold my-8">Feature Implementation: Habit Tracker</h2>
          <p className="mb-4">Let's implement the Habit Tracker feature, showcasing how we can reuse components and apply SOLID principles.</p>
          <CodeBlock
            code={`
// components/features/habit-tracker/habit-tracker.tsx
import { useHabits } from '@/hooks/use-habits';
import { HabitList } from './habit-list';
import { NewHabitForm } from './new-habit-form';

export function HabitTracker() {
  const { habits, isLoading, error } = useHabits();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Habit Tracker</h2>
      <HabitList habits={habits} />
      <NewHabitForm />
    </div>
  );
}

// components/features/habit-tracker/habit-list.tsx
import { HabitItem } from './habit-item';

export function HabitList({ habits }) {
  return (
    <ul className="space-y-4">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </ul>
  );
}

// components/features/habit-tracker/habit-item.tsx
import { useToggleHabit } from '@/hooks/use-toggle-habit';

export function HabitItem({ habit }) {
  const { toggle, isLoading } = useToggleHabit(habit.id);

  return (
    <li className="flex items-center justify-between bg-white p-4 rounded shadow">
      <span>{habit.name}</span>
      <button
        onClick={toggle}
        disabled={isLoading}
        className={\`px-4 py-2 rounded \${
          habit.completed ? 'bg-green-500' : 'bg-gray-300'
        }\`}
      >
        {habit.completed ? 'Completed' : 'Mark as Complete'}
      </button>
    </li>
  );
}

// hooks/use-habits.ts
import useSWR from 'swr';

export function useHabits() {
  const { data, error } = useSWR('/api/habits', fetcher);

  return {
    habits: data?.habits ?? [],
    isLoading: !error && !data,
    error,
  };
}

// hooks/use-toggle-habit.ts
import { useState } from 'react';
import { mutate } from 'swr';

export function useToggleHabit(habitId: string) {
  const [isLoading, setIsLoading] = useState(false);

  const toggle = async () => {
    setIsLoading(true);
    try {
      await fetch(\`/api/habits/\${habitId}/toggle\`, { method: 'POST' });
      await mutate('/api/habits');
    } catch (error) {
      console.error('Failed to toggle habit', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { toggle, isLoading };
}
            `}
            fileName="habit-tracker.tsx"
            language="typescript"
            badges={["React", "SWR", "Tailwind CSS"]}
          />
        </section>

        <section id="scalability">
          <h2 className="text-3xl font-bold my-8">Scalability Considerations</h2>
          <p className="mb-4">To ensure our Next.js application remains scalable as it grows, consider the following:</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Code Splitting: Utilize Next.js's built-in code splitting to reduce initial load times.</li>
            <li>Server-Side Rendering (SSR) and Static Site Generation (SSG): Use SSR for dynamic content and SSG for static pages to improve performance.</li>
            <li>API Routes: Implement API routes for backend functionality, allowing for easy serverless deployment.</li>
            <li>Caching: Implement caching strategies using SWR or React Query for client-side data fetching.</li>
            <li>Database Indexing: Ensure proper indexing on your database for frequently accessed data.</li>
            <li>Monitoring and Logging: Implement robust logging and monitoring solutions to track performance and errors.</li>
          </ol>
          <p className="mb-4">Here's a diagram illustrating the scalable architecture of our Next.js application:</p>
          <Mermaid
            chart={`
              graph TD
                A[Client] -->|HTTP Request| B[Next.js Server]
                B -->|SSR/SSG| C[React Components]
                B -->|API Routes| D[Server Actions]
                D -->|Database Queries| E[Database]
                C -->|Client-side Fetching| F[SWR/React Query]
                F -->|Cache| G[Browser Cache]
                F -->|API Calls| D
                B -->|Authentication| H[NextAuth.js]
                H -->|User Data| E
                I[Monitoring/Logging] -->|Collect Metrics| B
                J[CDN] -->|Static Assets| A
            `}
          />
          <p className="mt-4">This architecture ensures that our application can handle increased load and complexity while maintaining performance and maintainability.</p>
        </section>
      </main>
    </div>
  )
}
