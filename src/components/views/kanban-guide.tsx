'use client'


import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../shared/code-block/code-block'
import Mermaid from '../shared/mermaid'

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'project-setup', title: 'Project Setup' },
  { id: 'database-schema', title: 'Database Schema' },
  { id: 'server-actions', title: 'Server Actions' },
  { id: 'backlog-component', title: 'Backlog Component' },
  { id: 'kanban-board', title: 'Kanban Board' },
  { id: 'issue-management', title: 'Issue Management' },
  { id: 'board-switching', title: 'Board Switching' },
  { id: 'lane-configuration', title: 'Lane Configuration' },
  { id: 'solid-principles', title: 'SOLID Principles Applied' },
]

export default function BacklogKanbanGuideView() {
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
          <h1 className="text-2xl font-bold mb-4">Advanced Backlog and Kanban System</h1>
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
          <h2 className="text-3xl font-bold mb-4">Introduction to Advanced Backlog and Kanban System</h2>
          <p className="mb-4">
            In this comprehensive guide, we'll build an advanced backlog and Kanban board system using Next.js 13+, 
            Drizzle ORM with NeonDB (PostgreSQL), server actions, and the new Form component. We'll follow SOLID 
            principles to create a scalable and maintainable application.
          </p>
          <Mermaid
            chart={`
              graph TD
                A[Backlog] --> B[Issue Creation]
                B --> C[Database Storage]
                A --> D[Kanban Board]
                D --> E[Multiple Boards]
                D --> F[Configurable Lanes]
                E --> G[Board Switching]
                C --> H[Drizzle ORM]
                H --> I[NeonDB PostgreSQL]
                J[Server Actions] --> C
                K[Form Component] --> J
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
npm create next-app@latest backlog-kanban-system
cd backlog-kanban-system
npm install drizzle-orm pg @neondatabase/serverless
npm install -D drizzle-kit
npm install @tanstack/react-query
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
            `}
            fileName="terminal"
            language="bash"
          />
          <p className="mt-4">
            Now, let's set up our database connection using Drizzle ORM and NeonDB.
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
            Let's define our database schema using Drizzle ORM.
          </p>
          <CodeBlock
            code={`
// lib/schema.ts
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('backlog'),
  labels: text('labels').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const lanes = pgTable('lanes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  boardId: integer('board_id').references(() => boards.id),
  order: integer('order').notNull(),
});

export const boardIssues = pgTable('board_issues', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id').references(() => boards.id),
  issueId: integer('issue_id').references(() => issues.id),
  laneId: integer('lane_id').references(() => lanes.id),
  order: integer('order').notNull(),
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

        <section id="server-actions">
          <h2 className="text-3xl font-bold my-8">Server Actions</h2>
          <p className="mb-4">
            Let's implement server actions for our CRUD operations.
          </p>
          <CodeBlock
            code={`
// lib/actions.ts
'use server'

import { db } from './db';
import { issues, boards, lanes, boardIssues } from './schema';
import { eq } from 'drizzle-orm';

export async function createIssue(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const labels = formData.get('labels') as string;

  const newIssue = await db.insert(issues).values({
    title,
    description,
    labels: labels.split(',').map(label => label.trim()),
  }).returning();

  return newIssue[0];
}

export async function updateIssue(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const labels = formData.get('labels') as string;
  const status = formData.get('status') as string;

  const updatedIssue = await db.update(issues)
    .set({
      title,
      description,
      labels: labels.split(',').map(label => label.trim()),
      status,
    })
    .where(eq(issues.id, id))
    .returning();

  return updatedIssue[0];
}

export async function createBoard(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const newBoard = await db.insert(boards).values({
    name,
    description,
  }).returning();

  return newBoard[0];
}

export async function createLane(formData: FormData) {
  const name = formData.get('name') as string;
  const boardId = parseInt(formData.get('boardId') as string);
  const order = parseInt(formData.get('order') as string);

  const newLane = await db.insert(lanes).values({
    name,
    boardId,
    order,
  }).returning();

  return newLane[0];
}

export async function assignIssueToBoard(formData: FormData) {
  const issueId = parseInt(formData.get('issueId') as string);
  const boardId = parseInt(formData.get('boardId') as string);
  const laneId = parseInt(formData.get('laneId') as string);
  const order = parseInt(formData.get('order') as string);

  const assignment = await db.insert(boardIssues).values({
    issueId,
    boardId,
    laneId,
    order,
  }).returning();

  return assignment[0];
}

export async function getBacklogIssues() {
  return db.select().from(issues).where(eq(issues.status, 'backlog'));
}

export async function getBoards() {
  return db.select().from(boards);
}

export async function getBoardDetails(boardId: number) {
  const boardData = await db.select().from(boards).where(eq(boards.id, boardId));
  const lanesData = await db.select().from(lanes).where(eq(lanes.boardId, boardId));
  const issuesData = await db
    .select()
    .from(boardIssues)
    .innerJoin(issues, eq(boardIssues.issueId, issues.id))
    .where(eq(boardIssues.boardId, boardId));

  return {
    board: boardData[0],
    lanes: lanesData,
    issues: issuesData,
  };
}
            `}
            fileName="lib/actions.ts"
            language="typescript"
          />
        </section>

        <section id="backlog-component">
          <h2 className="text-3xl font-bold my-8">Backlog Component</h2>
          <p className="mb-4">
            Let's create a Backlog component to display and manage backlog issues.
          </p>
          <CodeBlock
            code={`
// components/Backlog.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form } from 'next/form'
import { getBacklogIssues, createIssue, updateIssue } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Backlog() {
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()

  const { data: backlogIssues, isLoading } = useQuery({
    queryKey: ['backlogIssues'],
    queryFn: getBacklogIssues,
  })

  const createIssueMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries(['backlogIssues'])
      setIsCreating(false)
    },
  })

  const updateIssueMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateIssue(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['backlogIssues'])
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Backlog</h2>
      <Button onClick={() => setIsCreating(true)}>Create New Issue</Button>
      {isCreating && (
        <Form action={createIssueMutation.mutate} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div>
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input id="labels" name="labels" />
          </div>
          <Button  type="submit">Create Issue</Button>
        </Form>
      )}
      <ul className="space-y-2">
        {backlogIssues?.map((issue) => (
          <li key={issue.id} className="border p-4 rounded">
            <h3 className="font-bold">{issue.title}</h3>
            <p>{issue.description}</p>
            <div className="flex space-x-2 mt-2">
              {issue.labels?.map((label, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {label}
                </span>
              ))}
            </div>
            <Form
              action={(formData) => updateIssueMutation.mutate({ id: issue.id, formData })}
              className="mt-4 space-y-2"
            >
              <Input name="status" type="hidden" value="in_progress" />
              <Button type="submit">Move to Board</Button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  )
}
            `}
            fileName="components/Backlog.tsx"
            language="typescript"
          />
        </section>

        <section id="kanban-board">
          <h2 className="text-3xl font-bold my-8">Kanban Board</h2>
          <p className="mb-4">
            Now, let's implement the Kanban board component.
          </p>
          <CodeBlock
            code={`
// components/KanbanBoard.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form } from 'next/form'
import { getBoardDetails, createLane, assignIssueToBoard } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function KanbanBoard({ boardId }: { boardId: number }) {
  const [isCreatingLane, setIsCreatingLane] = useState(false)
  const queryClient = useQueryClient()

  const { data: boardDetails, isLoading } = useQuery({
    queryKey: ['boardDetails', boardId],
    queryFn: () => getBoardDetails(boardId),
  })

  const createLaneMutation = useMutation({
    mutationFn: createLane,
    onSuccess: () => {
      queryClient.invalidateQueries(['boardDetails', boardId])
      setIsCreatingLane(false)
    },
  })

  const assignIssueMutation = useMutation({
    mutationFn: assignIssueToBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(['boardDetails', boardId])
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{boardDetails?.board.name}</h2>
      <Button onClick={() => setIsCreatingLane(true)}>Add New Lane</Button>
      {isCreatingLane && (
        <Form action={createLaneMutation.mutate} className="space-y-4">
          <Input name="boardId" type="hidden" value={boardId} />
          <div>
            <Label htmlFor="name">Lane Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="order">Order</Label>
            <Input id="order" name="order" type="number" required />
          </div>
          <Button type="submit">Create Lane</Button>
        </Form>
      )}
      <div className="flex space-x-4 overflow-x-auto">
        {boardDetails?.lanes.map((lane) => (
          <div key={lane.id} className="min-w-[250px] bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">{lane.name}</h3>
            <ul className="space-y-2">
              {boardDetails.issues
                .filter((issue) => issue.board_issues.laneId === lane.id)
                .map((issue) => (
                  <li key={issue.id} className="bg-white p-2 rounded shadow">
                    <h4 className="font-semibold">{issue.title}</h4>
                    <p className="text-sm">{issue.description}</p>
                  </li>
                ))}
            </ul>
            <Form action={assignIssueMutation.mutate} className="mt-4">
              <Input name="boardId" type="hidden" value={boardId} />
              <Input name="laneId" type="hidden" value={lane.id} />
              <Input name="order" type="hidden" value={boardDetails.issues.length + 1} />
              <select name="issueId" className="w-full p-2 rounded">
                <option value="">Select an issue</option>
                {boardDetails.issues
                  .filter((issue) => !issue.board_issues.laneId)
                  .map((issue) => (
                    <option key={issue.id} value={issue.id}>
                      {issue.title}
                    </option>
                  ))}
              </select>
              <Button type="submit" className="mt-2 w-full">
                Add Issue to Lane
              </Button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  )
}
            `}
            fileName="components/KanbanBoard.tsx"
            language="typescript"
          />
        </section>

        <section id="issue-management">
          <h2 className="text-3xl font-bold my-8">Issue Management</h2>
          <p className="mb-4">
            Let's create a component for managing individual issues.
          </p>
          <CodeBlock
            code={`
// components/IssueDetail.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form } from 'next/form'
import { updateIssue } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function IssueDetail({ issueId }: { issueId: number }) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => db.select().from(issues).where(eq(issues.id, issueId)).then((res) => res[0]),
  })

  const updateIssueMutation = useMutation({
    mutationFn: (formData: FormData) => updateIssue(issueId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['issue', issueId])
      setIsEditing(false)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (!issue) return <div>Issue not found</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{issue.title}</h2>
      {!isEditing ? (
        <>
          <p>{issue.description}</p>
          <div className="flex space-x-2">
            {issue.labels?.map((label, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {label}
              </span>
            ))}
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Issue</Button>
        </>
      ) : (
        <Form action={updateIssueMutation.mutate} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={issue.title} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={issue.description} />
          </div>
          <div>
            <Label htmlFor="labels">Labels (comma-separated)</Label>
            <Input id="labels" name="labels" defaultValue={issue.labels?.join(', ')} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" defaultValue={issue.status} className="w-full p-2 rounded">
              <option value="backlog">Backlog</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <Button type="submit">Update Issue</Button>
        </Form>
      )}
    </div>
  )
}
            `}
            fileName="components/IssueDetail.tsx"
            language="typescript"
          />
        </section>

        <section id="board-switching">
          <h2 className="text-3xl font-bold my-8">Board Switching</h2>
          <p className="mb-4">
            Let's implement a component for switching between multiple boards.
          </p>
          <CodeBlock
            code={`
// components/BoardSelector.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form } from 'next/form'
import { getBoards, createBoard } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BoardSelector({ onSelectBoard }: { onSelectBoard: (boardId: number) => void }) {
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()

  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  })

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries(['boards'])
      setIsCreating(false)
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select a Board</h2>
      <ul className="space-y-2">
        {boards?.map((board) => (
          <li key={board.id}>
            <Button onClick={() => onSelectBoard(board.id)}>{board.name}</Button>
          </li>
        ))}
      </ul>
      <Button onClick={() => setIsCreating(true)}>Create New Board</Button>
      {isCreating && (
        <Form action={createBoardMutation.mutate} className="space-y-4">
          <div>
            <Label htmlFor="name">Board Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          <Button type="submit">Create Board</Button>
        </Form>
      )}
    </div>
  )
}

// pages/index.tsx
'use client'

import { useState } from 'react'
import { Backlog } from '@/components/Backlog'
import { KanbanBoard } from '@/components/KanbanBoard'
import { BoardSelector } from '@/components/BoardSelector'

export default function Home() {
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Backlog and Kanban System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Backlog />
        </div>
        <div>
          <BoardSelector onSelectBoard={setSelectedBoardId} />
          {selectedBoardId && <KanbanBoard boardId={selectedBoardId} />}
        </div>
      </div>
    </div>
  )
}
            `}
            fileName="components/BoardSelector.tsx & pages/index.tsx"
            language="typescript"
          />
        </section>

        <section id="lane-configuration">
          <h2 className="text-3xl font-bold my-8">Lane Configuration</h2>
          <p className="mb-4">
            Let's create a component for configuring lanes within a board.
          </p>
          <CodeBlock
            code={`
// components/LaneConfig.tsx
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form } from 'next/form'
import { getBoardDetails, createLane } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LaneConfig({ boardId }: { boardId: number }) {
  const [isCreating, setIsCreating] = useState(false)
  const queryClient = useQueryClient()

  const { data: boardDetails, isLoading } = useQuery({
    queryKey: ['boardDetails', boardId],
    queryFn: () => getBoardDetails(boardId),
  })

  const createLaneMutation = useMutation({
    mutationFn: createLane,
    onSuccess: () => {
      queryClient.invalidateQueries(['boardDetails', boardId])
      setIsCreating(false)
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lane Configuration</h2>
      <ul className="space-y-2">
        {boardDetails?.lanes.map((lane) => (
          <li key={lane.id} className="flex justify-between items-center">
            <span>{lane.name}</span>
            <span>Order: {lane.order}</span>
          </li>
        ))}
      </ul>
      <Button onClick={() => setIsCreating(true)}>Add New Lane</Button>
      {isCreating && (
        <Form action={createLaneMutation.mutate} className="space-y-4">
          <Input name="boardId" type="hidden" value={boardId} />
          <div>
            <Label htmlFor="name">Lane Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={boardDetails?.lanes.length ?? 0}
              required
            />
          </div>
          <Button type="submit">Create Lane</Button>
        </Form>
      )}
    </div>
  )
}

// Update KanbanBoard.tsx to include LaneConfig
import { LaneConfig } from './LaneConfig'

export function KanbanBoard({ boardId }: { boardId: number }) {
  // ... existing code ...

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{boardDetails?.board.name}</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {/* ... existing lane rendering code ... */}
        </div>
      </div>
      <LaneConfig boardId={boardId} />
    </div>
  )
}
            `}
            fileName="components/LaneConfig.tsx"
            language="typescript"
          />
        </section>

        <section id="solid-principles">
          <h2 className="text-3xl font-bold my-8">SOLID Principles Applied</h2>
          <p className="mb-4">
            Let's review how we've applied SOLID principles in our implementation:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Single Responsibility Principle (SRP):</strong> Each component and server action has a single, well-defined responsibility. For example, the Backlog component is responsible for managing backlog issues, while the KanbanBoard component handles the board's layout and interactions.
            </li>
            <li>
              <strong>Open-Closed Principle (OCP):</strong> Our components are open for extension but closed for modification. For instance, we can easily add new features to the KanbanBoard without modifying its core functionality.
            </li>
            <li>
              <strong>Liskov Substitution Principle (LSP):</strong> While not explicitly demonstrated in this example, our component structure allows for easy substitution of child components without affecting the parent's behavior.
            </li>
            <li>
              <strong>Interface Segregation Principle (ISP):</strong> We've kept our interfaces (props) small and specific to each component's needs, avoiding unnecessary dependencies.
            </li>
            <li>
              <strong>Dependency Inversion Principle (DIP):</strong> Our components depend on abstractions (like the server actions) rather than concrete implementations, allowing for easier testing and maintenance.
            </li>
          </ul>
          <p className="mt-4">
            By following these principles, we've created a modular, extensible, and maintainable system for managing backlogs and Kanban boards.
          </p>
        </section>

        <section id="conclusion">
          <h2 className="text-3xl font-bold my-8">Conclusion</h2>
          <p className="mb-4">
            In this guide, we've built a comprehensive backlog and Kanban board system using Next.js, Drizzle ORM, and NeonDB. We've implemented server actions, used the new Form component, and followed SOLID principles to create a scalable and maintainable application.
          </p>
          <p className="mb-4">
            Key takeaways from this implementation include:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Efficient use of server actions for data mutations</li>
            <li>Leveraging React Query for client-side state management and caching</li>
            <li>Implementing a flexible and configurable Kanban board system</li>
            <li>Following SOLID principles for better code organization and maintainability</li>
            <li>Using Next.js 13+ features like the new Form component for enhanced performance</li>
          </ul>
          <p className="mt-4">
            This implementation provides a solid foundation for building more complex project management tools and can be easily extended to include additional features such as user authentication, real-time updates, and more advanced issue tracking capabilities.
          </p>
        </section>
      </main>
    </div>
  )
}
