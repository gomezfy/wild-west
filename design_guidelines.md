# Wild West MMO RTS - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from successful browser-based strategy games like Forge of Empires, Tribal Wars, and Age of Empires Online, combined with Western aesthetic from Red Dead Redemption UI and Western film typography.

**Core Principles**:
- Authentic Western atmosphere through weathered textures and vintage typography
- Clear information hierarchy for strategic decision-making
- Persistent HUD for resource tracking and quick actions
- Map-centric gameplay with overlay panels

## Typography

**Primary Font**: "Rye" (Google Fonts) - Display headlines, building names, game title
**Secondary Font**: "Overpass" (Google Fonts) - UI elements, stats, buttons, body text
**Monospace**: "Courier Prime" (Google Fonts) - Resource numbers, coordinates, chat

**Hierarchy**:
- Game Title/Section Headers: Rye, text-4xl to text-6xl, font-bold
- Building Names: Rye, text-2xl, font-semibold
- UI Labels: Overpass, text-sm, uppercase, font-semibold, tracking-wide
- Body Text: Overpass, text-base
- Resource Counters: Courier Prime, text-lg, font-bold
- Chat Messages: Overpass, text-sm

## Layout System

**Spacing Units**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm

**Screen Structure**:
- Top HUD (fixed): h-16, houses resources, player info, settings
- Side Panel (left, fixed): w-64 to w-80, building menu and actions
- Main Game Area: Remaining space, contains interactive map
- Bottom Panel (expandable): h-48 to h-64, chat and notifications
- Right Panel (contextual): w-80, shows building details, troop management

**Grid System**: 
- Building cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Resource display: Horizontal flex with gap-4
- Map tiles: Custom grid based on game logic (square tiles)

## Component Library

### Navigation & HUD
- **Top Resource Bar**: Horizontal flex displaying gold, wood, food with icons. Each resource in a bordered container with icon + number. Player name, level, and rank badge on right side
- **Settings Menu**: Dropdown from top-right corner with sound controls, game speed, logout
- **Mini-map**: Fixed bottom-left corner, 200x200px, shows territory overview

### Building Interface
- **Building Menu**: Vertical list of buildable structures. Each item: Icon (48x48) + name + cost + build time. Disabled state when resources insufficient
- **Building Cards**: When selecting map building, show popup card with: Large icon, name (Rye font), level, stats table, upgrade/demolish buttons
- **Construction Queue**: List view showing active builds with progress bars and time remaining

### Map & Gameplay
- **Game Map**: Isometric or top-down grid. Each tile clickable. Zoom controls (+ / - buttons) fixed at bottom-right
- **Tile Highlight**: Border emphasis for selected tiles, no background overlays
- **Building Placement Ghost**: Semi-transparent preview when placing new structures

### Combat & Units
- **Troop Panel**: Grid of unit cards showing: Unit portrait, name, quantity, stats (attack/defense/speed)
- **Battle Overlay**: Modal showing attacker vs defender with unit icons, predicted outcome, confirm/cancel actions
- **Attack Queue**: Small notification area showing ongoing attacks (time to arrival)

### Social & Communication
- **Chat Panel**: Dark semi-transparent background, message list with player names in bold, timestamp in smaller text. Input field at bottom with send button
- **Alliance Badge**: Small emblem next to player names throughout interface
- **Leaderboard**: Table view with columns: Rank (#), Player name, Territory size, Total resources, Alliance

### Tutorial System
- **Tutorial Overlay**: Full-screen dark backdrop with spotlight circle on highlighted element
- **Tutorial Card**: Positioned near highlighted element with: Title, instruction text, step counter (1/10), next/skip buttons
- **Arrow Indicators**: Pointing from tutorial card to interactive element

### Common Patterns
- **Buttons**: Text with border, slight padding (px-6 py-2), hover shows subtle transformation
- **Progress Bars**: Horizontal bars with segments, fill from left to right, labeled with percentage or time
- **Tooltips**: Appear on hover over icons, small bordered boxes with concise info
- **Modal Windows**: Centered overlays with title bar (draggable), close button (X), content area, action buttons at bottom
- **Notification Toast**: Slide in from top-right, auto-dismiss after 5 seconds, shows events like "Gold mine completed" or "Under attack!"

## Icons

Use **Font Awesome** (via CDN) for all icons:
- Resources: fa-coins (gold), fa-tree (wood), fa-drumstick-bite (food)
- Buildings: fa-building, fa-home, fa-landmark, fa-shop
- Combat: fa-shield, fa-sword, fa-skull-crossbones
- UI Actions: fa-cog, fa-plus, fa-minus, fa-times, fa-check
- Social: fa-users, fa-comment, fa-trophy

## Images

**Hero/Splash Screen**: Full-viewport background showing Western town panorama (wooden buildings, dusty street, mountains in distance). Centered game logo with weathered wood texture. "Play Now" button with blurred background backdrop.

**Building Illustrations**: Each buildable structure needs iconic representation:
- Saloon: Swinging doors, "SALOON" sign
- Bank: Vault door, columns
- Stable: Horse silhouettes, hay bales
- Gold Mine: Mine cart, wooden entrance

**Map Terrain**: Textured tiles showing desert sand, grass, rock formations, water (if applicable). Use consistent perspective.

**Unit Portraits**: Character illustrations for cowboys, bandits, sheriffs in vintage Western style (sepia tones work well here)

**Background Textures**: Weathered wood planks for panels, aged paper for overlays, leather texture for buttons

All images should maintain cohesive vintage Western aesthetic with weathered, sun-bleached quality.

## Animations

Use sparingly for polish:
- Resource counter increments: Number tick animation
- Building construction: Progress bar smooth fill
- New message: Subtle bounce on chat panel
- Attack notification: Pulse effect (once)
- Tutorial spotlight: Gentle glow pulse

Avoid: Constant movement, parallax scrolling on map, excessive hover animations