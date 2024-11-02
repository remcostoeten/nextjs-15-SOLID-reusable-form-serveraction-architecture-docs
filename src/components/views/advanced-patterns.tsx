'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Home } from 'lucide-react';
import Mermaid from 'mermaid';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import CodeBlock from '../shared/code-block/code-block';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'project-structure', title: 'Project Structure' },
  { id: 'solid-principles', title: 'SOLID Principles' },
  { id: 'reusable-server-actions', title: 'Reusable Server Actions' },
  { id: 'next-form-component', title: 'Next.js 15 Form Component' },
  { id: 'reusable-data-fetching', title: 'Reusable Data Fetching' },
  { id: 'authentication-setup', title: 'Authentication Setup' },
  { id: 'kanban-board', title: 'Kanban Board Implementation' },
  { id: 'habit-tracker', title: 'Habit Tracker Implementation' },
  { id: 'scalability', title: 'Scalability Considerations' },
]

export default function AdvancedPatternsView() {
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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <nav className="w-64 fixed h-screen overflow-y-auto p-4 border-r border-border">
        <ScrollArea className="h-full">
          <h1 className="text-2xl font-bold mb-4">Advanced Next.js Patterns and SOLID Architecture</h1>
          <ul className="space-y-2 mb-4">
            <li>
              <Link href="/" className="flex items-center p-2 rounded hover:bg-secondary">
                <Home className="mr-2" size={16} />
                Home
              </Link>
            </li>
          </ul>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={`block p-2 rounded transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </nav>
      <main className="flex-1 ml-64 p-8" ref={contentRef}>
        <section id="introduction">
          <h2 className="text-3xl font-bold mb-4">Introduction to Advanced Next.js Patterns and SOLID Architecture</h2>
          <p className="mb-4">
            In this comprehensive guide, we'll explore advanced patterns and techniques for building
            scalable, maintainable, and robust Next.js applications. We'll cover topics such as
            SOLID principles, reusable server actions, advanced state management, and feature
            implementations that showcase these concepts in action.
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <script src="https://cdn.jsdelivr.net/npm/mermaid@8.13.0/dist/mermaid.min.js"></script>
                <div class="mermaid">
                  graph TD
                    A[Next.js Application] --> B[SOLID Principles]
                    A --> C[Reusable Server Actions]
                </div>
              `,
            }}
          />
                A --> D[Advanced State Management]
                A --> E[Feature Implementations]
                E --> F[Kanban Board]
                E --> G[Habit Tracker]
                A --> H[Scalability Considerations]
            `}
          />
        </section>

        <section id="project-structure">
          <h2 className="text-3xl font-bold my-8">Project Structure</h2>
          <p className="mb-4">
            A well-organized project structure is crucial for maintaining a scalable and modular Next.js application. Here's a recommended structure that separates concerns and promotes maintainability:
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
          <p className="mt-4">
            This structure allows for clear separation of concerns, making it easier to navigate and maintain the codebase as it grows.
          </p>
        </section>

        <section id="solid-principles">
          <h2 className="text-3xl font-bold my-8">SOLID Principles in Next.js</h2>
          <p className="mb-4">
            Applying SOLID principles to your Next.js application can greatly improve its maintainability and scalability. Let's explore each principle with practical examples:
          </p>

          <h3 className="text-2xl font-semibold my-4">Single Responsibility Principle (SRP)</h3>
          <p className="mb-4">Each module or component should have one, and only one, reason to change.</p>
          <CodeBlock
            code={`
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
            fileName="user-components.tsx"
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
            `}
            fileName="button.tsx"
            language="typescript"
            badges={["OCP", "React", "Tailwind CSS"]}
          />

          {/* Add sections for Liskov Substitution, Interface Segregation, and Dependency Inversion principles here */}
        </section>

        <section id="reusable-server-actions">
          <h2 className="text-3xl font-bold my-8">Reusable Server Actions</h2>
          <p className="mb-4">
            Creating reusable server actions in Next.js 15 allows us to adhere to the SOLID principles while providing a clean API for data mutations. Here's an example of a reusable server action for handling CRUD operations:
          </p>
          <CodeBlock
            code={`
// lib/server-actions/entity-actions.ts


import { db } from '@/lib/db'
import { and, eq } from 'drizzle-orm'

export interface Entity {
  id: string
  [key: string]: any
}

export interface EntityActions<T extends Entity> {
  create: (data: Omit<T, 'id'>) => Promise<T>
  read: (id: string) => Promise<T | null>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete: (id: string) => Promise<void>
  list: (filters?: Partial<T>) => Promise<T[]>
}

export function createEntityActions<T extends Entity>(table: any): EntityActions<T> {
  return {
    create: async (data) => {
      const [created] = await db.insert(table).values(data).returning()
      return created as T
    },
    read: async (id) => {
      const [entity] = await db.select().from(table).where(eq(table.id, id))
      return entity as T | null
    },
    update: async (id, data) => {
      const [updated] = await db.update(table).set(data).where(eq(table.id, id)).returning()
      return updated as T
    },
    delete: async (id) => {
      await db.delete(table).where(eq(table.id, id))
    },
    list: async (filters = {}) => {
      const whereClause = Object.entries(filters).map(([key, value]) => eq(table[key], value))
      const entities = await db.select().from(table).where(and(...whereClause))
      return entities as T[]
    },
  }
}

// Usage example
import { users } from '@/lib/schema'

export const userActions = createEntityActions<User>(users)
            `}
            fileName="entity-actions.ts"
            language="typescript"
            badges={["Server Actions", "SOLID", "Drizzle ORM"]}
          />
        </section>

        <section id="next-form-component">
          <h2 className="text-3xl font-bold my-8">Next.js 15 Form Component</h2>
          <p className="mb-4">
            Next.js 15 introduces a new `&lt;Form&gt;` component that integrates seamlessly with server actions. Here's an example of how to use it in combination with our reusable server actions:
          </p>
          <CodeBlock
            code={`
// components/entity-form.tsx


import { useRef } from 'react'
import { Form } from 'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

interface EntityFormProps<T> {
  entity?: T
  onSubmit: (formData: FormData) => Promise<T>
  fields: Array<{
    name: keyof T
    label: string
    type: string
  }>
}

export function EntityForm<T>({ entity, onSubmit, fields }: EntityFormProps<T>) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Form
      action={async (formData: FormData) => {
        try {
          await onSubmit(formData)
          toast.success('Entity saved successfully')
          formRef.current?.reset()
        } catch (error) {
          toast.error('Failed to save entity')
        }
      }}
    >
      {fields.map((field) => (
        <div key={field.name as string} className="mb-4">
          <label htmlFor={field.name as string} className="block text-sm font-medium mb-1">
            {field.label}
          </label>
          <Input
            type={field.type}
            id={field.name as string}
            name={field.name as string}
            defaultValue={entity?.[field.name] as string}
          />
        </div>
      ))}
      <Button type="submit">Save</Button>
    </Form>
  )
}

// Usage example
import { userActions } from '@/lib/server-actions/entity-actions'

export function UserForm({ user }: { user?: User }) {
  return (
    <EntityForm
      entity={user}
      onSubmit={user ? userActions.update.bind(null, user.id) : userActions.create}
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'age', label: 'Age', type: 'number' },
      ]}
    />
  )
}
            `}
            fileName="entity-form.tsx"
            language="typescript"
            badges={["Next.js 15", "Form", "SOLID"]}
          />
        </section>

        {/* Add sections for Reusable Data Fetching, Authentication Setup, Kanban Board Implementation, Habit Tracker Implementation, and Scalability Considerations here */}

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
          <p className="mb-4">Here's a diagram illustrating the scalable  architecture of our Next.js application:</p>
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
