import { useHtml } from "nukejs"
import CodeBlock from "../../../components/docs/CodeBlock"

export default function OrpcPage() {
    const title = "oRPC"
    const subtitle = "Add end-to-end type-safe RPC to NukeJS with oRPC. Define your procedures on the server, call them from client components with full TypeScript inference."
    useHtml({ title })
    const prev = { href: "/docs/examples/mongoose", label: "Mongoose" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <div className="doc-integration-badge">Integration</div>

                <h2>What is oRPC?</h2>
                <p>
                    oRPC is a TypeScript-first RPC library. You define typed procedures on the server and call them
                    from the client — like tRPC but with a cleaner API and no adapter layer needed.
                    With NukeJS you expose oRPC through a catch-all API route.
                </p>

                <h2>Install</h2>
                <CodeBlock language="bash" filename="terminal" code={`npm install @orpc/server @orpc/client @orpc/react-query
npm install @tanstack/react-query`} />

                <h2>Define your router</h2>
                <p>Create a file that defines all your procedures. This runs on the server only:</p>
                <CodeBlock filename="lib/orpc/router.ts" code={`import { os, ORPCError } from '@orpc/server'
import { z } from 'zod'
import { prisma } from '../db'  // or your DB of choice

// Base procedure builder
const pub = os  // public procedures

// Authenticated procedure (extend with auth middleware)
const authed = os.use(async ({ context, next }) => {
    const token = context?.headers?.authorization?.split(' ')[1]
    if (!token) throw new ORPCError({ code: 'UNAUTHORIZED' })
    const user = await verifyToken(token)
    return next({ context: { user } })
})

export const router = {
    posts: {
        list: pub
            .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
            .handler(async ({ input }) => {
                return prisma.post.findMany({
                    where: { published: true },
                    orderBy: { createdAt: 'desc' },
                    take: input.limit,
                })
            }),

        bySlug: pub
            .input(z.object({ slug: z.string() }))
            .handler(async ({ input }) => {
                const post = await prisma.post.findUnique({
                    where: { slug: input.slug },
                })
                if (!post) throw new ORPCError({ code: 'NOT_FOUND' })
                return post
            }),

        create: authed
            .input(z.object({ title: z.string().min(1), content: z.string() }))
            .handler(async ({ input, context }) => {
                return prisma.post.create({
                    data: {
                        ...input,
                        slug: input.title.toLowerCase().replace(/\\s+/g, '-'),
                        authorId: context.user.id,
                    },
                })
            }),
    },

    users: {
        me: authed
            .handler(async ({ context }) => {
                return prisma.user.findUnique({
                    where: { id: context.user.id },
                    select: { id: true, email: true, name: true },
                })
            }),
    },
}

export type Router = typeof router`} />

                <h2>Expose via a NukeJS API route</h2>
                <p>Mount the oRPC handler on a catch-all API route:</p>
                <CodeBlock filename="server/rpc/[...path].ts" code={`import type { ApiRequest, ApiResponse } from 'nukejs'
import { createServer } from '@orpc/server/node'
import { router } from '../../lib/orpc/router'

const handler = createServer(router)

export async function POST(req: ApiRequest, res: ApiResponse) {
    // Pass raw Node req/res to oRPC
    await handler(req as any, res as any)
}`} />

                <h2>Create a typed client</h2>
                <p>Generate a fully typed client from your router type. Import this in client components:</p>
                <CodeBlock filename="lib/orpc/client.ts" code={`import { createClient } from '@orpc/client'
import type { Router } from './router'

export const orpc = createClient<Router>({
    baseURL: '/rpc',
})`} />

                <h2>Call procedures from a client component</h2>
                <CodeBlock filename="app/components/PostList.tsx" code={`"use client"
import { useState, useEffect } from 'react'
import { orpc } from '../../lib/orpc/client'

export default function PostList() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        orpc.posts.list({ limit: 5 }).then(data => {
            setPosts(data)
            setLoading(false)
        })
    }, [])

    if (loading) return <p>Loading…</p>

    return (
        <ul>
            {posts.map(post => (
                <li key={post.id}>
                    <a href={'/blog/' + post.slug}>{post.title}</a>
                </li>
            ))}
        </ul>
    )
}`} />

                <h2>With React Query (recommended)</h2>
                <p>Combine oRPC with TanStack Query for caching, refetching, and mutations in client components:</p>
                <CodeBlock filename="app/components/Providers.tsx" code={`"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}`} />
                <CodeBlock filename="app/pages/layout.tsx" code={`import Providers from '../components/Providers'

export default function Layout({ children }: { children: React.ReactNode }) {
    return <Providers>{children}</Providers>
}`} />
                <CodeBlock filename="app/components/PostListWithQuery.tsx" code={`"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '../../lib/orpc/client'

export default function PostListWithQuery() {
    const queryClient = useQueryClient()

    // Fetch posts with caching
    const { data: posts, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: () => orpc.posts.list({ limit: 10 }),
    })

    // Optimistic mutation
    const createPost = useMutation({
        mutationFn: (data: { title: string; content: string }) =>
            orpc.posts.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    if (isLoading) return <p>Loading…</p>

    return (
        <div>
            <ul>
                {posts?.map(post => <li key={post.id}>{post.title}</li>)}
            </ul>
            <button
                onClick={() => createPost.mutate({ title: 'New Post', content: '…' })}
                disabled={createPost.isPending}
            >
                {createPost.isPending ? 'Creating…' : 'New Post'}
            </button>
        </div>
    )
}`} />

                <h2>Call procedures from server pages</h2>
                <p>Because server pages run on the server, you can call your router procedures directly — bypassing HTTP entirely:</p>
                <CodeBlock filename="app/pages/blog/index.tsx" code={`import { router } from '../../lib/orpc/router'

export default async function BlogIndex() {
    // Call procedure directly on the server — no fetch, no latency
    const posts = await router.posts.list({ limit: 10 })

    return (
        <main>
            {posts.map(post => (
                <article key={post.id}>
                    <h2>{post.title}</h2>
                </article>
            ))}
        </main>
    )
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Best of both worlds</strong>
                        Server pages call router procedures directly for zero-latency data access.
                        Client components call the same procedures over HTTP via the typed client —
                        with full TypeScript inference and no schema duplication.
                    </div>
                </div>
            </div>
        </article>
    )
}
