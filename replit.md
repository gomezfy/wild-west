# Wild West MMO RTS

## Overview

Wild West MMO RTS is a browser-based multiplayer real-time strategy game set in the Wild West era. Players build and manage frontier towns, gather resources (gold, wood, food), construct buildings, recruit troops, and compete on a leaderboard. The game features real-time multiplayer interactions through WebSocket connections, persistent player states, and a Western-themed UI inspired by games like Forge of Empires and Tribal Wars.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible and composable UI elements. The design system follows a "new-york" style with custom Western-themed typography.

**Styling Approach**: Tailwind CSS with custom CSS variables for theming. The design uses three custom font families:
- "Rye" for Western-themed headings and titles
- "Overpass" for UI elements and body text  
- "Courier Prime" for monospace numbers and coordinates

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- Local React state (useState) for UI-specific state
- No global state management library (Redux/Zustand) - relying on React Query's built-in caching

**Routing**: Single-page application with conditional rendering (no React Router). App flow: Splash Screen → Game Screen.

**Real-time Communication**: Custom WebSocket hook (`use-websocket.ts`) for bidirectional communication with the server, handling chat messages, building completion notifications, and resource updates.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript in ESM mode.

**API Design**: RESTful API endpoints under `/api` prefix combined with WebSocket connections at `/ws` for real-time features.

**Data Storage Strategy**: 
- Abstracted storage interface (`IStorage`) allowing swappable implementations
- `MemStorage` class for in-memory development/testing
- Designed to support database persistence through the same interface
- Database schema defined using Drizzle ORM with PostgreSQL dialect

**Session Management**: Uses `connect-pg-simple` for session storage, indicating PostgreSQL-backed session persistence.

**WebSocket Architecture**:
- Separate WebSocket server running alongside HTTP server
- Connection mapping by player ID for targeted messages
- Message types: `identify`, `chat`, `building_complete`, `resource_update`, `unit_recruited`, `battle`
- Broadcast mechanism for global events

### Data Layer

**ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach.

**Database Schema**:
- `players`: User accounts with resources (gold, wood, food), level, rank, and territory size
- `buildings`: Player-owned structures with type, level, position, and construction status
- `units`: Military units with attack/defense/speed stats and quantity
- `chat_messages`: Global chat history with timestamps
- `battles`: Battle records between attackers and defenders

**Schema Validation**: Zod schemas generated from Drizzle schemas using `drizzle-zod` for runtime type safety and API validation.

**Migration Strategy**: Drizzle Kit for schema migrations with migrations stored in `/migrations` directory.

### Game Logic

**Resource System**: Three resource types (gold, wood, food) produced by buildings at defined intervals. Buildings have costs and production rates defined in `shared/constants.ts`.

**Building System**: 
- Multiple building types (saloon, bank, stable, goldmine) with upgrade levels
- Grid-based placement system with position coordinates
- Construction time mechanics with completion tracking
- Real-time notifications on construction completion

**Unit/Combat System**: 
- Unit types (cowboy, bandit, sheriff) with distinct stats
- Recruitment costs in resources
- Battle system for player vs. player interactions

**Game Constants**: Centralized in `shared/constants.ts` including building definitions, unit types, map size, and tile size.

### External Dependencies

**UI Components**: 
- @radix-ui/* family of headless UI components (20+ packages)
- lucide-react for icons
- embla-carousel-react for carousels
- cmdk for command palette
- react-day-picker for date selection

**Database & ORM**:
- @neondatabase/serverless for PostgreSQL connection
- drizzle-orm and drizzle-kit for schema management
- connect-pg-simple for session storage

**Validation & Forms**:
- zod for schema validation
- react-hook-form with @hookform/resolvers for form management
- drizzle-zod for database schema validation

**Utilities**:
- date-fns for date manipulation
- class-variance-authority for variant-based styling
- clsx and tailwind-merge for className management

**Development Tools**:
- @replit/vite-plugin-* family for Replit IDE integration
- tsx for TypeScript execution
- esbuild for production builds

**Real-time**: 
- WebSocket (ws) library for server-side WebSocket handling
- Native WebSocket API on client

**Asset Management**: Static assets stored in `attached_assets/generated_images/` with custom Vite alias `@assets` for imports.