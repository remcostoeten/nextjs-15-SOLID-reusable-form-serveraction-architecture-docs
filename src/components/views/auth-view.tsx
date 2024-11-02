'use client'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Home } from 'lucide-react'
import Mermaid from 'mermaid'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../shared/code-block/code-block'

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'project-setup', title: 'Project Setup' },
  { id: 'database-schema', title: 'Database Schema' },
  { id: 'nextauth-setup', title: 'NextAuth Setup' },
  { id: 'server-actions', title: 'Server Actions' },
  { id: 'auth-components', title: 'Authentication Components' },
  { id: 'oauth-implementation', title: 'OAuth Implementation' },
  { id: 'onboarding-flow', title: 'Onboarding Flow' },
  { id: 'image-storage', title: 'Image Storage' },
  { id: 'protected-routes', title: 'Protected Routes' },
  { id: 'solid-principles', title: 'SOLID Principles' },
]

export default function AdvancedAuthGuideView() {
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
          <h1 className="text-2xl font-bold mb-4">Advanced NextAuth Implementation</h1>
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
          <h2 className="text-3xl font-bold mb-4">Introduction to Advanced NextAuth Implementation</h2>
          <p className="mb-4">
            In this comprehensive guide, we'll implement an advanced authentication system using NextAuth.js, 
            including username/password authentication, OAuth, and a custom onboarding flow with image storage. 
            We'll use Next.js 15+, Drizzle ORM with PostgreSQL, server actions, and follow SOLID principles for 
            a scalable and maintainable authentication system.
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <script src="https://cdn.jsdelivr.net/npm/mermaid@8.13.3/dist/mermaid.min.js"></script>
                <div class="mermaid">
                  graph TD
                    A[Next.js Application] --> B[NextAuth.js]
                    B --> C[Username/Password Auth]
                </div>
              `,
            }}
          />
                B --> D[OAuth Providers]
                B --> E[Custom Onboarding Flow]
                E --> F[Image Storage]
                G[Drizzle ORM] --> H[PostgreSQL]
                B --> G
                E --> G
                I[Server Actions] --> B
                I --> E
                J[Next.js 15 Form] --> C
                J --> E
            `}
          />
        </section>

        <section id="project-setup">
          <h2 className="text-3xl font-bold my-8">Project Setup</h2>
          <p className="mb-4">
            Let's start by setting up our Next.js project with the necessary dependencies.
          </p>
          <CodeBlock
            code={`
npm create next-app@latest advanced-nextauth-app
cd advanced-nextauth-app
npm install next-auth@beta @auth/drizzle-adapter
npm install drizzle-orm pg @neondatabase/serverless
npm install -D drizzle-kit
npm install bcrypt
npm install @types/bcrypt --save-dev
npm install @uploadthing/react uploadthing
            `}
            fileName="terminal"
            language="bash"
          />
          <p className="mt-4">
            Now, let's set up our database connection using Drizzle ORM and NeonDB (PostgreSQL).
          </p>
          <CodeBlock
            code={`
// lib/db.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
            `}
            fileName="lib/db.ts"
            language="typescript"
          />
        </section>

        <section id="database-schema">
          <h2 className="text-3xl font-bold my-8">Database Schema</h2>
          <p className="mb-4">
            Let's define our database schema using Drizzle ORM, including tables for users, accounts, and sessions.
          </p>
          <CodeBlock
            code={`
// lib/schema.ts
import { pgTable, text, timestamp, integer, primaryKey, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  onboardingCompleted: boolean('onboarding_completed').default(false),
});

export const accounts = pgTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey(account.provider, account.providerAccountId),
}));

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey(vt.identifier, vt.token),
}));

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
            `}
            fileName="lib/schema.ts"
            language="typescript"
          />
          <p className="mt-4">
            Now, let's create a migration script to apply this schema to our database.
          </p>
          <CodeBlock
            code={`
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

// package.json (add these scripts)
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg"
  }
}

// Run the migration
npm run db:generate
npm run db:push
            `}
            fileName="drizzle.config.ts & package.json"
            language="typescript"
          />
        </section>

        <section id="nextauth-setup">
          <h2 className="text-3xl font-bold my-8">NextAuth Setup</h2>
          <p className="mb-4">
            Let's set up NextAuth.js with our Drizzle adapter and configure the basic options.
          </p>
          <CodeBlock
            code={`
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await db.select().from(users).where(eq(users.email, credentials.email)).then(res => res[0]);
        
        if (!user || !user.password) return null;
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordValid) return null;
        
        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/onboarding',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
            `}
            fileName="app/api/auth/[...nextauth]/route.ts"
            language="typescript"
          />
        </section>

        <section id="server-actions">
          <h2 className="text-3xl font-bold my-8">Server Actions</h2>
          <p className="mb-4">
            Let's implement server actions for user authentication and profile management.
          </p>
          <CodeBlock
            code={`
// app/actions/auth.ts
'use server'

import { db } from '@/lib/db'
import { users, userProfiles } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'

export async function signUp(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0])

  if (existingUser) {
    return { error: 'User already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  }).returning()

  revalidatePath('/auth/signin')
  return { success: true, user: newUser[0] }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  const bio = formData.get('bio') as string
  const location = formData.get('location') as string
  const website = formData.get('website') as string

  await db.insert(userProfiles).values({
    userId,
    bio,
    location,
    website,
  }).onConflictDoUpdate({
    target: userProfiles.userId,
    set: { bio, location, website },
  })

  await db.update(users)
    .set({ onboardingCompleted: true })
    .where(eq(users.id, userId))

  revalidatePath('/dashboard')
  return { success: true }
}

export async function uploadProfileImage(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  const imageUrl = formData.get('imageUrl') as string

  await db.update(users)
    .set({ image: imageUrl })
    .where(eq(users.id, userId))

  revalidatePath('/dashboard')
  return { success: true }
}
            `}
            fileName="app/actions/auth.ts"
            language="typescript"
          />
        </section>

        <section id="auth-components">
          <h2 className="text-3xl font-bold my-8">Authentication Components</h2>
          <p className="mb-4">
            Let's create the sign-up and sign-in components using the Next.js 15 Form component.
          </p>
          <CodeBlock
            code={`
// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Form } from  'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/app/actions/auth'

export default function SignUp() {
  const [error, setError] = useState('')
  const router = useRouter()

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <Form action={signUp} onSubmit={async (formData) => {
          const result = await signUp({}, formData)
          if (result.error) {
            setError(result.error)
          } else {
            const signInResult = await signIn('credentials', {
              email: formData.get('email'),
              password: formData.get('password'),
              redirect: false,
            })
            if (signInResult?.error) {
              setError(signInResult.error)
            } else {
              router.push('/auth/onboarding')
            }
          }
        }} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </Form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

// app/auth/signin/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Form } from 'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignIn() {
  const [error, setError] = useState('')
  const router = useRouter()

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Form action={async (formData: FormData) => {
          const result = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
          })
          if (result?.error) {
            setError(result.error)
          } else {
            router.push('/dashboard')
          }
        }} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </Form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}
            `}
            fileName="app/auth/signup/page.tsx & app/auth/signin/page.tsx"
            language="typescript"
          />
        </section>

        <section id="oauth-implementation">
          <h2 className="text-3xl font-bold my-8">OAuth Implementation</h2>
          <p className="mb-4">
            Let's add OAuth authentication using Google as an example provider.
          </p>
          <CodeBlock
            code={`
// Update app/auth/signin/page.tsx to include OAuth
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function SignIn() {
  // ... existing code ...

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        {/* ... existing form ... */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
            `}
            fileName="app/auth/signin/page.tsx"
            language="typescript"
          />
        </section>

        <section id="onboarding-flow">
          <h2 className="text-3xl font-bold my-8">Onboarding Flow</h2>
          <p className="mb-4">
            Let's create an onboarding flow for new users to complete their profile.
          </p>
          <CodeBlock
            code={`
// app/auth/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Form } from 'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ImageUpload'
import { updateProfile, uploadProfileImage } from '@/app/actions/auth'

export default function Onboarding() {
  const { data: session, update } = useSession()
  const [image, setImage] = useState('')
  const router = useRouter()

  if (!session?.user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>
        <Form action={updateProfile} onSubmit={async (formData) => {
          formData.append('userId', session.user.id)
          const result = await updateProfile({}, formData)
          if (result.success) {
            if (image) {
              const imageFormData = new FormData()
              imageFormData.append('userId', session.user.id)
              imageFormData.append('imageUrl', image)
              await uploadProfileImage({}, imageFormData)
            }
            await update({ onboardingCompleted: true })
            router.push('/dashboard')
          }
        }} className="space-y-4">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" type="text" />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" />
          </div>
          <ImageUpload onImageUpload={setImage} />
          <Button type="submit" className="w-full">Complete Profile</Button>
        </Form>
      </div>
    </div>
  )
}
            `}
            fileName="app/auth/onboarding/page.tsx"
            language="typescript"
          />
        </section>

        <section id="image-storage">
          <h2 className="text-3xl font-bold my-8">Image Storage</h2>
          <p className="mb-4">
            Let's implement image storage using UploadThing for the user's profile picture.
          </p>
          <CodeBlock
            code={`
// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;

// app/api/uploadthing/route.ts
import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";
 
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

// components/ImageUpload.tsx
'use client'

import { useState } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const { startUpload, isUploading } = useUploadThing("imageUploader")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (file) {
      const result = await startUpload([file])
      if (result && result[0]) {
        onImageUpload(result[0].url)
      }
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  )
}
            `}
            fileName="lib/uploadthing.ts & app/api/uploadthing/route.ts & components/ImageUpload.tsx"
            language="typescript"
          />
        </section>

        <section id="protected-routes">
          <h2 className="text-3xl font-bold my-8">Protected Routes</h2>
          <p className="mb-4">
            Let's implement protected routes and server-side session checks.
          </p>
          <CodeBlock
            code={`
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom logic here
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith('/dashboard') &&
          token?.onboardingCompleted !== true
        ) {
          return false
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'],
}

// app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p>Hello, {session.user?.name}!</p>
      {/* Add more dashboard content here */}
    </div>
  )
}
            `}
            fileName="middleware.ts & app/dashboard/page.tsx"
            language="typescript"
          />
        </section>

        <section id="solid-principles">
          <h2 className="text-3xl font-bold my-8">SOLID Principles</h2>
          <p className="mb-4">
            Let's review how our implementation adheres to SOLID principles:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Single Responsibility Principle (SRP):</strong> Each component and server action has a single, well-defined responsibility. For example, the SignUp component handles user registration, while the Onboarding component manages profile completion.
            </li>
            <li>
              <strong>Open-Closed Principle (OCP):</strong> Our authentication system is open for extension (e.g., adding new OAuth providers) but closed for modification. The core NextAuth setup remains unchanged while allowing for easy addition of new features.
            </li>
            <li>
              <strong>Liskov Substitution Principle (LSP):</strong> While not explicitly demonstrated, our component structure allows for easy substitution of child components without affecting the parent's behavior. For instance, the ImageUpload component could be replaced with a different implementation without changing the Onboarding component.
            </li>
            <li>
              <strong>Interface Segregation Principle (ISP):</strong> We've kept our interfaces (props and function parameters) small and specific to each component's needs, avoiding unnecessary dependencies.
            </li>
            <li>
              <strong>Dependency Inversion Principle (DIP):</strong> Our components and server actions depend on abstractions (like the NextAuth session and Drizzle ORM) rather than concrete implementations, allowing for easier testing and maintenance.
            </li>
          </ul>
        </section>

        <section id="conclusion">
          <h2 className="text-3xl font-bold my-8">Conclusion</h2>
          <p className="mb-4">
            In this guide, we've implemented an advanced authentication system using NextAuth.js, 
            incorporating username/password authentication, OAuth, and a custom onboarding flow with 
            image storage. We've leveraged Next.js 15 features like the Form component and server 
            actions, used Drizzle ORM with PostgreSQL for data management, and followed SOLID 
            principles to create a scalable and maintainable authentication system.
          </p>
          <p className="mb-4">
            Key takeaways from this implementation include:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Efficient use of server actions for data mutations</li>
            <li>Integration of NextAuth.js with custom credentials and OAuth providers</li>
            <li>Implementation of a flexible onboarding flow with image upload functionality</li>
            <li>Application of SOLID principles for better code organization and maintainability</li>
            <li>Use of Next.js 15 features like the Form component for enhanced performance and developer experience</li>
          </ul>
          <p className="mt-4">
            This implementation provides a solid foundation for building secure and scalable authentication 
            systems in Next.js applications. It can be easily extended to include additional features such 
            as email verification, password reset functionality, and more advanced user profile management.
          </p>
        </section>
      </main>
    </div>
  )
}
