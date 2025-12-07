# Pokédex Lite

A modern, fully responsive web application for exploring and collecting Pokémon. Built with Next.js, React, and TailwindCSS, powered by the PokéAPI.

## Features

✨ **Pokémon Listing** - Browse through 1000+ Pokémon with beautiful grid layout
🔍 **Smart Search** - Real-time search filtering by Pokémon name
🏷️ **Type Filtering** - Filter Pokémon by their type (Fire, Water, Grass, etc.)
⭐ **Favorites System** - Save your favorite Pokémon (persisted in localStorage)
📊 **Detailed View** - Comprehensive modal with stats, abilities, height, and weight
📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop screens
🎨 **Modern Design** - Clean UI with smooth animations and transitions
⚡ **Fast Performance** - Efficient pagination and lazy loading

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn/ui
- **API**: PokéAPI (https://pokeapi.co)
- **Storage**: Browser localStorage
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Steps

1. **Clone or download the project**
   \`\`\`bash
   git clone <repository-url>
   cd pokedex-lite
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage

### Browse Pokémon
- The homepage displays Pokémon in a responsive grid (4 columns on desktop, 2 on tablet, 1 on mobile)
- Use pagination buttons to navigate between pages (20 Pokémon per page)

### Search
- Enter a Pokémon name in the search bar for real-time filtering
- Click the X button to clear the search

### Filter by Type
- Select a type from the dropdown menu to see only Pokémon of that type
- All types are fetched from the PokéAPI

### Save Favorites
- Click the heart icon on any Pokémon card to add/remove from favorites
- View only favorites by clicking the "Favorites" button in the header
- Your favorites are automatically saved and persist after page refresh

### View Details
- Click on any Pokémon card to open a detailed modal
- View stats, abilities, height, weight, and types
- Add/remove from favorites directly from the detail view

## Project Structure

\`\`\`
pokedex-lite/
├── app/
│   ├── page.jsx          # Main page with Pokémon listing and filters
│   ├── layout.jsx        # Root layout with metadata
│   └── globals.css       # Global styles and design tokens
├── components/
│   ├── pokemon-card.jsx         # Individual Pokémon card component
│   ├── pokemon-header.jsx       # Header with title and favorites button
│   ├── pokemon-detail-modal.jsx # Detail modal with full Pokémon info
│   ├── search-bar.jsx          # Search input component
│   └── type-filter.jsx         # Type dropdown filter component
├── services/
│   └── pokemonService.js       # PokéAPI service with fetch functions
├── lib/
│   └── utils.ts         # Utility functions (cn for className joining)
├── hooks/
│   └── use-mobile.tsx   # Mobile detection hook
├── public/              # Static assets
└── package.json         # Project dependencies and scripts

\`\`\`

## API Integration

The app uses the free, public [PokéAPI](https://pokeapi.co/docs/v2) to fetch data:

- **Pokémon List**: `/pokemon?limit=1000&offset=0`
- **Pokémon Details**: `/pokemon/{id}`
- **Types List**: `/type`
- **Type Details**: `/type/{name}`

No API key is required. All data is fetched client-side with proper error handling.

## Challenges & Solutions

### Challenge 1: Loading 1000+ Pokémon
**Solution**: Fetched all 1000 Pokémon upfront for instant filtering/search. Used pagination (20 per page) to limit DOM nodes. This provides instant search results without additional API calls.

### Challenge 2: Image Loading
**Solution**: Used official artwork images from PokéAPI. Added fallback placeholders and error handling for missing images.

### Challenge 3: Responsive Design
**Solution**: Built mobile-first with TailwindCSS responsive classes. Grid adjusts: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop).

### Challenge 4: Favorites Persistence
**Solution**: Implemented localStorage to save favorite IDs. Favorites automatically persist across sessions without a backend.

### Challenge 5: Type Filtering Performance
**Solution**: Cached all Pokémon data in state. Filters apply to cached data instantly without additional API calls.

## Performance Optimizations

- **Client-side filtering** for instant search and type filtering
- **Pagination** to limit rendered components
- **Lazy loading** of Pokémon details (only loaded when modal opens)
- **Image optimization** using official artwork URLs
- **Debounced search** (built-in via React state updates)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements (Optional)

- OAuth login with Google/GitHub
- User accounts to sync favorites across devices
- Advanced filtering (by stats, abilities, generation)
- Pokémon comparisons side-by-side
- Generation-based filtering
- Pokédex completion tracker
- Dark mode toggle (currently light)
- Backend database for user favorites

## Running Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

## License

This project is open source and available for educational purposes. Uses PokéAPI which is licensed under Creative Commons.

## Author

Created with v0.app - AI-powered web development tool

## Support

For issues or feature requests, please create an issue in the repository.

---

**Happy Pokémon collecting! 🎉**
