Pokedex Lite – Web Application

A lightweight and responsive Pokemon explorer built using React, Vite, and the PokéAPI.
The app provides search, filtering, pagination, favorites, and detailed Pokémon insights — all designed to deliver a smooth and intuitive user experience.

/**Features**/

/**Pokemon Listing**/:
Fetches Pokémon data from PokéAPI using paginated requests.
Displays Pokémon in a clean, responsive grid layout.
Shows Pokémon name and official artwork.

/**Search**?
Real-time search bar for filtering Pokémon by name.

/**Filter by Type**/
Users can filter Pokémon by types such as Fire, Water, Grass, etc.
Filters update the list instantly.

/**Pagination**/
“Next” and “Previous” buttons to navigate between pages.
Prevents fetching all Pokémon at once for better performance.

/**Favorites**/
Users can favorite Pokémon.
Favorites persist using localStorage, surviving page reloads.

/**Pokemon Detail View**/
Clicking a Pokémon opens a modal or separate view.
Displays:
Image
Height & weight
Pokémon type(s)
Base stats (HP, Attack, Defense, etc.)
Abilities

/**Responsive UI**/
Optimized for mobile, tablet, and desktop screens.

/**Install Dependencies**/
npm install

/**Run the Development Server**/
npm run dev