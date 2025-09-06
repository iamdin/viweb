# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe Coding DevTools is a comprehensive development tools ecosystem built as a monorepo using pnpm workspaces and Turbo. The project includes a VS Code extension, browser extension, development toolbar, and server components.

## High-Level Architecture

The project consists of several interconnected packages:

1. **@viweb/toolbar** (`packages/toolbar/`) - Main unplugin that works with Vite, Webpack, and Rspack. Provides the core development toolbar functionality with compiler, transform, and server capabilities.

2. **@viweb/toolbar-client** (`packages/toolbar-client/`) - React-based client application for the toolbar. Uses XState for state management (app-machine, inspect-machine) and features inspector functionality with IDE integration.

3. **@viweb/server-trpc** (`packages/server-trpc/`) - tRPC server implementation providing agent functionality with tools like bash execution and string replacement.

4. **@viweb/vscode-trpc** (`packages/vscode-trpc/`) - tRPC integration for the VSCode extension.

Applications:
- **VSCode Extension** (`apps/vscode/`) - Integrates with VSCode's AI features using WebSocket connections
- **Browser Extension** (`apps/browser/`) - Built with WXT framework, supports Chrome/Firefox with AI chat integration
- **Backend Server** (`apps/backend/`) - Express server with health checks and chat endpoints

## Essential Commands

### Development
```bash
pnpm dev          # Start development mode with file watching for all packages
pnpm stub         # Build packages in development/stub mode
pnpm build        # Build all packages for production
pnpm test         # Run all tests
pnpm clean        # Clean all build artifacts
```

### Code Quality
```bash
pnpm check        # Run Biome linter/formatter checks
pnpm check:fix    # Auto-fix linting and formatting issues
```

Diagnostic files after generate or edit.

### Package-Specific Commands
```bash
# Run commands for specific packages
pnpm test --filter=@viweb/toolbar-client
pnpm build --filter=@viweb/vscode

# VSCode extension specific
cd apps/vscode && pnpm pack    # Create .vsix package
```

### Testing
```bash
# Run tests for a specific package
pnpm test -F ./packages/toolbar

# Run specific test file
pnpm vitest test/transform.test.ts

# Run tests in watch mode
pnpm vitest --watch
```

## Code Standards

- **Formatter/Linter**: Biome (not ESLint/Prettier)
  - Indentation: Tabs
  - Quote style: Double quotes
  - Organize imports: Enabled
- **TypeScript**: Version 5.8.3
- **Testing**: Vitest
- **Package Manager**: pnpm 10.13.0 (required)

## Key Technologies

- **Frontend**: React 19, Vue 3, XState, Tailwind CSS, shadcn/ui
- **Backend**: Express, tRPC
- **Build Tools**: Vite, Turbo, WXT (browser extension)
- **AI Integration**: Anthropic SDK, OpenAI SDK

## Important Notes

1. This is a monorepo - always consider package dependencies when making changes
2. Use Turbo for running commands across packages efficiently
3. The toolbar-client uses XState machines for state management - understand app-machine.ts and inspect-machine.ts before modifying state logic
4. Browser extension uses WXT framework - follow WXT conventions when modifying
5. Always run `pnpm check:fix` before committing to ensure code style consistency
6. Use changesets (`pnpm changeset`) for documenting changes that affect package versions
