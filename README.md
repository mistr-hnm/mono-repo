# 📦 MonoRepo Structure

```plaintext
my-monorepo/
├── apps/                      # App-level entry points (e.g., frontend, backend)
│   ├── myschool-fe/           # React / Vue frontend
│   └── myschool-be/           # Express / NestJS / tRPC backend
│
├── packages/                  # Shared packages / libraries
│   ├── ui/                    # Reusable UI components (React/Vue/etc.)
│   ├── config/                # Shared config (eslint, tailwind, tsconfig)
│   ├── utils/                 # Shared utilities
│   └── types/                 # Shared TypeScript types
│
├── .github/                   # GitHub workflows (CI/CD)
├── node_modules/              # Managed by pnpm
├── package.json               # Root scripts and dependencies
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── nx.json                    # (optional) Nx configuration for advanced task orchestration
├── tsconfig.base.json         # Base TypeScript configuration shared across workspaces
└── README.md                  # Project documentation


## TODO

pnpm i                       #(pnpm should be install by "npm i -g pnpm@latest") 

pnpm run dev                                           #(if nx installed)
pnpx nx run-many -t start:dev                          #(if nx not-installed)



pnpm add @nestjs/config --filter ./apps/myschool-be/   #(install package in workspace)