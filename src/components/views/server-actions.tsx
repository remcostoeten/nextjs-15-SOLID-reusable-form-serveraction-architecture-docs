'use client'

import { Home } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../shared/code-block/code-block'

export default function ServerActionsView() {
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
    { id: 'reusable-server-actions', title: 'Reusable Server Actions' },
    { id: 'next-form-component', title: 'Next.js 15 Form Component' },
    { id: 'reusable-data-fetching', title: 'Reusable Data Fetching' },
    { id: 'finance-forms', title: 'Finance Forms Example' },
    { id: 'inventory-management', title: 'Inventory Management Example' },
  ]

  return (
    <>
    <div className="flex min-h-screen bg-background text-foreground">
      <nav className="w-64 fixed h-screen overflow-y-auto p-4 border-r border-border">
        <h1 className="text-2xl font-bold mb-4">Advanced Next.js Patterns</h1>
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
        <section id="reusable-server-actions">
          <h2 className="text-3xl font-bold mb-4">Reusable Server Actions</h2>
          <p className="mb-4">
            Creating reusable server actions in Next.js 15 allows us to adhere to the SOLID principles, particularly the Single Responsibility Principle and the Open-Closed Principle. Let's create a reusable server action for handling CRUD operations on entities.
          </p>
          <CodeBlock
            code={`
// lib/server-actions/entity-actions.ts
'use server'

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
          <p className="mt-4">
            This implementation follows the SOLID principles:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Single Responsibility: Each action has a single purpose (create, read, update, delete, or list).</li>
            <li>Open-Closed: The `createEntityActions` function is open for extension (you can add new entity types) but closed for modification.</li>
            <li>Liskov Substitution: Any entity that extends the `Entity` interface can be used with these actions.</li>
            <li>Interface Segregation: The `EntityActions` interface provides a clear contract for CRUD operations.</li>
            <li>Dependency Inversion: The actions depend on abstractions (the `Entity` interface and Drizzle's table abstraction) rather than concrete implementations.</li>
          </ul>
        </section>

        <section id="next-form-component">
          <h2 className="text-3xl font-bold my-8">Next.js 15 Form Component</h2>
          <p className="mb-4">
            Next.js 15 introduces a new `&lt;Form&gt;` component that integrates seamlessly with server actions. Let&apos;s explore how to use it in various scenarios while adhering to SOLID principles.
          </p>
          <CodeBlock
            code={`
// components/entity-form.tsx
'use client'

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
          <p className="mt-4">
            This implementation adheres to SOLID principles:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Single Responsibility: The `EntityForm` component is responsible only for rendering and handling form submissions.</li>
            <li>Open-Closed: The component is open for extension (you can add new field types) but closed for modification.</li>
            <li>Liskov Substitution: The component can work with any entity type that matches the expected structure.</li>
            <li>Interface Segregation: The `EntityFormProps` interface clearly defines the required props.</li>
            <li>Dependency Inversion: The component depends on abstractions (the `onSubmit` function) rather than concrete implementations.</li>
          </ul>
        </section>

        <section id="reusable-data-fetching">
          <h2 className="text-3xl font-bold my-8">Reusable Data Fetching</h2>
          <p className="mb-4">
            Let's create reusable hooks for data fetching and mutation using SWR and our server actions.
          </p>
          <CodeBlock
            code={`
// hooks/use-entity.ts
import useSWR from 'swr'
import { EntityActions } from '@/lib/server-actions/entity-actions'

export function useEntity<T extends { id: string }>(
  actions: EntityActions<T>,
  id?: string
) {
  const { data, error, mutate } = useSWR(
    id ? \`entity:\${id}\` : null,
    () => actions.read(id!)
  )

  const update = async (data: Partial<T>) => {
    if (!id) throw new Error('Cannot update without an ID')
    const updated = await actions.update(id, data)
    mutate(updated)
    return updated
  }

  const remove = async () => {
    if (!id) throw new Error('Cannot delete without an ID')
    await actions.delete(id)
    mutate(null)
  }

  return {
    data,
    error,
    isLoading: !data && !error,
    update,
    remove,
  }
}

export function useEntityList<T extends { id: string }>(
  actions: EntityActions<T>,
  filters?: Partial<T>
) {
  const { data, error, mutate } = useSWR(
    ['entityList', filters],
    () => actions.list(filters)
  )

  const create = async (newData: Omit<T, 'id'>) => {
    const created = await actions.create(newData)
    mutate((current) => [...(current || []), created])
    return created
  }

  return {
    data,
    error,
    isLoading: !data && !error,
    create,
    mutate,
  }
}

// Usage example
import { useEntity, useEntityList } from '@/hooks/use-entity'
import { userActions } from '@/lib/server-actions/entity-actions'

export function UserProfile({ userId }: { userId: string }) {
  const { data: user, update, remove, isLoading, error } = useEntity(userActions, userId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => update({ name: 'New Name' })}>Update Name</button>
      <button onClick={remove}>Delete User</button>
    </div>
  )
}

export function UserList() {
  const { data: users, create, isLoading, error } = useEntityList(userActions)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={() => create({ name: 'New User', email: 'new@example.com' })}>
        Add User
      </button>
    </div>
  )
}
            `}
            fileName="use-entity.ts"
            language="typescript"
            badges={["SWR", "SOLID", "Custom Hooks"]}
          />
          <p className="mt-4">
            This implementation follows SOLID principles:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Single Responsibility: Each hook has a single purpose (managing a single entity or a list of entities).</li>
            <li>Open-Closed: The hooks are open for extension (you can add new entity types) but closed for modification.</li>
            <li>Liskov Substitution: The hooks can work with any entity type that extends the base `Entity` type.</li>
            <li>Interface Segregation: The hooks provide only the necessary methods for their specific use cases.</li>
            <li>Dependency Inversion: The hooks depend on abstractions (the `EntityActions` interface) rather than concrete implementations.</li>
          </ul>
        </section>

        <section id="finance-forms">
          <h2 className="text-3xl font-bold my-8">Finance Forms Example</h2>
          <p className="mb-4">
            Let's create a set of finance-related forms using our reusable components and adhering to SOLID principles.
          </p>
          <CodeBlock
            code={`
// lib/schema.ts
import { pgTable, serial, varchar, decimal, date } from  'drizzle-orm/pg-core'

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: date('date').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
})

// lib/server-actions/finance-actions.ts
import { createEntityActions } from './entity-actions'
import { transactions } from '@/lib/schema'

export const transactionActions = createEntityActions(transactions)

// components/finance/transaction-form.tsx
'use client'

import { EntityForm } from '@/components/entity-form'
import { transactionActions } from '@/lib/server-actions/finance-actions'

export function TransactionForm({ transaction }: { transaction?: Transaction }) {
  return (
    <EntityForm
      entity={transaction}
      onSubmit={transaction ? transactionActions.update.bind(null, transaction.id) : transactionActions.create}
      fields={[
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'amount', label: 'Amount', type: 'number' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'category', label: 'Category', type: 'text' },
      ]}
    />
  )
}

// components/finance/transaction-list.tsx
'use client'

import { useEntityList } from '@/hooks/use-entity'
import { transactionActions } from '@/lib/server-actions/finance-actions'
import { TransactionForm } from './transaction-form'

export function TransactionList() {
  const { data: transactions, isLoading, error, create } = useEntityList(transactionActions)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <ul className="space-y-4">
        {transactions?.map((transaction) => (
          <li key={transaction.id} className="bg-secondary p-4 rounded">
            <p className="font-bold">{transaction.description}</p>
            <p>Amount: &apos;DOLLR_SIGN{transaction.amount}&apos;</p>
            <p>Date: {transaction.date}</p>
            <p>Category: {transaction.category}</p>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-bold mt-8 mb-4">Add New Transaction</h3>
      <TransactionForm />
    </div>
  )
}

// pages/finance.tsx
import { TransactionList } from '@/components/finance/transaction-list'

export default function FinancePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Finance Dashboard</h1>
      <TransactionList />
    </div>
  )
}
            `}
            fileName="finance-forms.tsx"
            language="typescript"
            badges={["Finance", "Forms", "SOLID"]}
          />
          <p className="mt-4">
            This finance forms example demonstrates how our reusable components and SOLID principles can be applied to create a specific feature set:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>We define a schema for financial transactions using Drizzle ORM.</li>
            <li>We create specific actions for transactions using our reusable `createEntityActions` function.</li>
            <li>We implement a `TransactionForm` component using our reusable `EntityForm` component.</li>
            <li>We create a `TransactionList` component that uses our custom hooks for data fetching and mutation.</li>
            <li>The finance page brings these components together to create a cohesive feature.</li>
          </ul>
        </section>

        <section id="inventory-management">
          <h2 className="text-3xl font-bold my-8">Inventory Management Example</h2>
          <p className="mb-4">
            Let's create an inventory management system as another example of how to use our reusable components and SOLID principles.
          </p>
          <CodeBlock
            code={`
// lib/schema.ts
import { pgTable, serial, varchar, integer, decimal } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
})

// lib/server-actions/inventory-actions.ts
import { createEntityActions } from './entity-actions'
import { products } from '@/lib/schema'

export const productActions = createEntityActions(products)

// components/inventory/product-form.tsx
'use client'

import { EntityForm } from '@/components/entity-form'
import { productActions } from '@/lib/server-actions/inventory-actions'

export function ProductForm({ product }: { product?: Product }) {
  return (
    <EntityForm
      entity={product}
      onSubmit={product ? productActions.update.bind(null, product.id) : productActions.create}
      fields={[
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'sku', label: 'SKU', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'price', label: 'Price', type: 'number' },
      ]}
    />
  )
}

// components/inventory/product-list.tsx
'use client'

import { useEntityList } from '@/hooks/use-entity'
import { productActions } from '@/lib/server-actions/inventory-actions'
import { ProductForm } from './product-form'

export function ProductList() {
  const { data: products, isLoading, error, create } = useEntityList(productActions)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">SKU</th>
            <th className="text-right">Quantity</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="py-2">{product.name}</td>
              <td>{product.sku}</td>
              <td className="text-right">{product.quantity}</td>
              <td className="text-right">DOLLAR_SIGN{product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-xl font-bold mt-8 mb-4">Add New Product</h3>
      <ProductForm />
    </div>
  )
}

// pages/inventory.tsx
import { ProductList } from '@/components/inventory/product-list'

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      <ProductList />
    </div>
  )
}
            `}
            fileName="inventory-management.tsx"
            language="typescript"
            badges={["Inventory", "Forms", "SOLID"]}
          />
          <p className="mt-4">
            This inventory management example further demonstrates the flexibility and reusability of our components:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>We define a schema for products using Drizzle ORM.</li>
            <li>We create specific actions for products using our reusable `createEntityActions` function.</li>
            <li>We implement a `ProductForm` component using our reusable `EntityForm` component.</li>
            <li>We create a `ProductList` component that uses our custom hooks for data fetching and mutation.</li>
            <li>The inventory page brings these components together to create a cohesive feature.</li>
          </ul>
          <p className="mt-4">
            By following SOLID principles and creating reusable components and hooks, we've built a flexible system that can be easily extended to handle various types of entities and use cases, from financial transactions to inventory management.
          </p>
        </section>
      </main>
    </div>
  </>
  )
}
