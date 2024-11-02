import CodeBlock from "../../components/shared/code-block/code-block";
import Sidebar from "./Sidebar";

export default function AuthTutorialBlogPost() {
  return (
    <div className="flex">
      <Sidebar />
      <article className="flex-grow max-w-4xl mx-auto py-8 px-4 ml-64">
        <h1 className="text-3xl font-bold mb-6">Building a Scalable Authentication System in Next.js 15</h1>

        <section id="introduction">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            In this comprehensive guide, we'll walk through the process of building a scalable authentication system using Next.js 15, React 19, and the latest best practices. Our focus will be on creating a solid foundation for a large-scale SaaS application, adhering to SOLID principles and leveraging modern web development techniques.
          </p>
          <p className="mb-4">Our stack will include:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Next.js 15 for the framework</li>
            <li>NextAuth v5 for authentication</li>
            <li>Neon (PostgreSQL) for the database</li>
            <li>Drizzle ORM for type-safe database interactions</li>
            <li>Server Actions for form submissions</li>
            <li>Server-Side Rendering for optimal performance</li>
            <li>Zod for schema validation</li>
            <li>Tailwind CSS for styling</li>
          </ul>
          <p>Let's dive in and build a robust authentication system!</p>
        </section>

        <section id="project-setup" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Project Setup</h2>
          <p className="mb-4">First, let's create a new Next.js project:</p>
          <CodeBlock
            code={`npx create-next-app@latest auth-saas-app
cd auth-saas-app`}
            fileName="Terminal"
            language="bash"
          />
          <p className="my-4">Now, let's install the necessary dependencies:</p>
          <CodeBlock
            code={`npm install next-auth@5 @auth/drizzle-adapter @neondatabase/serverless drizzle-orm zod bcrypt
npm install -D @types/bcrypt`}
            fileName="Terminal"
            language="bash"
          />
        </section>

        <section id="project-structure" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
          <p className="mb-4">Let's set up a scalable project structure:</p>
          <CodeBlock
            code={`auth-saas-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   └── input.tsx
│   └── auth/
│       ├── login-form.tsx
│       └── register-form.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── validations.ts
├── actions/
│   └── auth.ts
└── db/
    └── schema.ts`}
            fileName="Project Structure"
            language="plaintext"
          />
          <p className="mt-4">This structure separates concerns and promotes modularity, making it easier to maintain and scale the application.</p>
        </section>

        <section id="database-setup" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Database Setup with Neon and Drizzle</h2>
          <p className="mb-4">Let's set up our database schema using Drizzle ORM. Create a new file <code>db/schema.ts</code>:</p>
          <CodeBlock
            code={`import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;`}
            fileName="db/schema.ts"
            language="typescript"
          />
          <p className="my-4">Now, let's create a database connection file <code>lib/db.ts</code>:</p>
          <CodeBlock
            code={`import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);`}
            fileName="lib/db.ts"
            language="typescript"
          />
          <p className="my-4">Add your Neon database URL to your <code>.env.local</code> file:</p>
          <CodeBlock
            code={`DATABASE_URL=your_neon_database_url_here`}
            fileName=".env.local"
            language="bash"
          />
        </section>

        <section id="authentication-setup" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Setup with NextAuth v5</h2>
          <p className="mb-4">Let's set up NextAuth v5. Create a new file <code>app/api/auth/[...nextauth]/route.ts</code>:</p>
          <CodeBlock
            code={`import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1).then(res => res[0]);

        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) return null;

        return { id: user.id.toString(), email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
});

export { auth as GET, auth as POST };`}
            fileName="app/api/auth/[...nextauth]/route.ts"
            language="typescript"
          />
        </section>

        <section id="form-components" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reusable Form Components</h2>
          <p className="mb-4">Let's create reusable form components for our authentication system. First, create <code>components/ui/form.tsx</code>:</p>
          <CodeBlock
            code={`'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

interface FormProps {
  action: (formData: FormData) => Promise<{ error?: string }>;
  children: React.ReactNode;
}

export function Form({ action, children }: FormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {children}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Action completed successfully!</p>}
      <button type="submit" disabled={pending} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
        {pending ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
}`}
            fileName="components/ui/form.tsx"
            language="typescript"
          />
          <p className="my-4">Now, let's create a reusable input component in <code>components/ui/input.tsx</code>:</p>
          <CodeBlock
            code={`import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  );
}`}
            fileName="components/ui/input.tsx"
            language="typescript"
          />
        </section>

        <section id="auth-actions" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Actions</h2>
          <p className="mb-4">Let's create our server actions for authentication in <code>actions/auth.ts</code>:</p>
          <CodeBlock
            code={`'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hash } from 'bcrypt';
import { signIn } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function register(formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password } = result.data;

  try {
    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({ name, email, password: hashedPassword });
    return { success: true };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { error: 'Failed to register user' };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', { email, password });
    return { success: true };
  } catch (error) {
    console.error('Failed to log in:', error);
    return { error: 'Invalid credentials' };
  }
}`}
            fileName="actions/auth.ts"
            language="typescript"
          />
        </section>

        <section id="auth-components" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Components</h2>
          <p className="mb-4">Let's create our login and register form components. First, <code>components/auth/login-form.tsx</code>:</p>
          <CodeBlock
            code={`'use client';

import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/actions/auth';

export function LoginForm() {
  return (
    <Form action={login}>
      <Input label="Email" name="email" type="email" required />
      <Input label="Password" name="password" type="password" required />
    </Form>
  );
}`}
            fileName="components/auth/login-form.tsx"
            language="typescript"
          />
          <p className="my-4">Now, let's create <code>components/auth/register-form.tsx</code>:</p>
          <CodeBlock
            code={`'use client';

import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { register } from '@/actions/auth';

export function RegisterForm() {
  return (
    <Form action={register}>
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <Input label="Password" name="password" type="password" required />
    
    </Form>
  );
}`}
            fileName="components/auth/register-form.tsx"
            language="typescript"
          />
        </section>

        <section id="auth-pages" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Pages</h2>
          <p className="mb-4">Let's create our login and register pages. First, <code>app/login/page.tsx</code>:</p>
          <CodeBlock
            code={`import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}`}
            fileName="app/login/page.tsx"
            language="typescript"
          />
          <p className="my-4">Now, let's create <code>app/register/page.tsx</code>:</p>
          <CodeBlock
            code={`import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <RegisterForm />
    </div>
  );
}`}
            fileName="app/register/page.tsx"
            language="typescript"
          />
        </section>

        <section id="dashboard" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <p className="mb-4">Let's create a simple dashboard page. Create <code>app/dashboard/page.tsx</code>:</p>
          <CodeBlock
            code={`import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }

  const user = await db.select().from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, parseInt(session.user.id)))
    .then(res => res[0]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.users.name}!</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <p><strong>Email:</strong> {user.users.email}</p>
        {user.profiles && (
          <>
            <p><strong>Bio:</strong> {user.profiles.bio || 'No bio yet'}</p>
            <p><strong>Location:</strong> {user.profiles.location || 'No location set'}</p>
            <p><strong>Website:</strong> {user.profiles.website || 'No website set'}</p>
          </>
        )}
      </div>
    </div>
  );
}`}
            fileName="app/dashboard/page.tsx"
            language="typescript"
          />
        </section>

        <section id="settings-page" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">User Settings Page</h2>
          <p className="mb-4">Let's create a user settings page where users can update their profile. First, let's create a new action in <code>actions/auth.ts</code>:</p>
          <CodeBlock
            code={`// Add this to the existing actions/auth.ts file

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  website: z.string().url('Invalid URL').max(255, 'Website URL must be 255 characters or less').optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const result = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
    location: formData.get('location'),
    website: formData.get('website'),
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, bio, location, website } = result.data;

  try {
    await db.transaction(async (tx) => {
      await tx.update(users)
        .set({ name })
        .where(eq(users.id, parseInt(session.user.id)));

      await tx.insert(profiles)
        .values({
          userId: parseInt(session.user.id),
          bio,
          location,
          website,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: { bio, location, website },
        });
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { error: 'Failed to update profile' };
  }
}`}
            fileName="actions/auth.ts"
            language="typescript"
          />
          <p className="my-4">Now, let's create the settings page in <code>app/settings/page.tsx</code>:</p>
          <CodeBlock
            code={`import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateProfile } from '@/actions/auth';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }

  const user = await db.select().from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, parseInt(session.user.id)))
    .then(res => res[0]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <Form action={updateProfile}>
        <Input label="Name" name="name" defaultValue={user.users.name || ''} required />
        <Input label="Bio" name="bio" defaultValue={user.profiles?.bio || ''} />
        <Input label="Location" name="location" defaultValue={user.profiles?.location || ''} />
        <Input label="Website" name="website" type="url" defaultValue={user.profiles?.website || ''} />
      </Form>
    </div>
  );
}`}
            fileName="app/settings/page.tsx"
            language="typescript"
          />
        </section>

        <section id="layout" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Layout and Navigation</h2>
          <p className="mb-4">Let's create a layout with navigation. Update <code>app/layout.tsx</code>:</p>
          <CodeBlock
            code={`import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { auth } from './api/auth/[...nextauth]/route'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Auth SaaS App',
  description: 'A scalable authentication system built with Next.js 15',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Auth SaaS App</Link>
            <div className="space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/settings">Settings</Link>
                  <form action="/api/auth/signout" method="POST" className="inline">
                    <button type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8">
          {children}
        </main>
      </body>
    </html>
  )
}`}
            fileName="app/layout.tsx"
            language="typescript"
          />
        </section>

        <section id="conclusion" className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="mb-4">
            In this comprehensive tutorial, we've built a scalable authentication system using Next.js 15, leveraging server-side rendering, server actions, and modern best practices. We've implemented user registration, login, a dashboard, and a user settings page with profile editing capabilities.
          </p>
          <p className="mb-4">
            Key features of our implementation include:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Modular and scalable project structure</li>
            <li>Type-safe database interactions with Drizzle ORM</li>
            <li>Secure authentication with NextAuth v5</li>
            <li>Reusable form components for consistent UI and behavior</li>
            <li>Server actions for form submissions, adhering to the new Next.js paradigms</li>
            <li>Input validation using Zod for both client and server-side validation</li>
            <li>Proper error handling and user feedback</li>
            <li>Responsive layout with navigation</li>
          </ul>
          <p className="mb-4">
            This foundation sets you up for building a large-scale SaaS application. As you continue to build upon this, consider implementing features such as:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Email verification</li>
            <li>Password reset functionality</li>
            <li>Multi-factor authentication</li>
            <li>Role-based access control</li>
            <li>API rate limiting</li>
            <li>Audit logging for security events</li>
          </ul>
          <p>
            Remember to always follow security best practices, keep your dependencies updated, and regularly audit your application for potential vulnerabilities. Happy coding, and may your Next.js application be secure, performant, and scalable!
          </p>
        </section>
      </article>
    </div>
  )
}
