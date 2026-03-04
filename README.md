# nukejs.com

The documentation website for [NukeJS](https://nukejs.com) — React. Weaponized. 

Built with NukeJS itself.

## Getting started

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Structure

```
app/
├── pages/
│   ├── layout.tsx          # Root layout (Nav + Footer)
│   ├── index.tsx           # Homepage
│   └── docs/
│       ├── layout.tsx      # Docs layout (sidebar + main area)
│       ├── index.tsx       # /docs — Introduction
│       ├── installation.tsx
│       ├── routing.tsx
│       ├── ...
│       └── examples/
│           ├── tailwindcss.tsx
│           ├── prisma.tsx
│           ├── mongoose.tsx
│           └── orpc.tsx
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   └── docs/
│       ├── DocSidebar.tsx  # Responsive sidebar with mobile toggle
│       └── CodeBlock.tsx
└── public/
    ├── main.css
    └── atom-one-dark.min.css
```

## Adding a doc page

1. Create a new file in `app/pages/docs/` (or `examples/` for integrations).
2. Follow the pattern from any existing page — export a default component that returns an `<article className="doc-article">`.
3. Add your page to the `NAV` array in `app/components/docs/DocSidebar.tsx`.

## Building

```bash
npm run build
node dist/index.mjs
```

## Contributing

Contributions are welcome! If you spot a typo, outdated example, or a missing topic, feel free to open a pull request.

- **Fixing docs** — edit the relevant file in `app/pages/docs/` and submit a PR.
- **New pages** — follow the pattern in [Adding a doc page](#adding-a-doc-page) above, then open a PR with a short description of what you added and why.
- **Bug reports** — open an issue describing what's wrong and how to reproduce it.

Please keep PRs focused. One fix or addition per PR makes review much faster.