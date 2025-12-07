# TODO: Fix Pagination Flickering Issue

## Completed Tasks
- [x] Import useMemo from React
- [x] Memoize the filtered Pokémon list to avoid recalculations on every render
- [x] Update useEffect to use the memoized filtered list for totalItems and displayedPokemon
- [x] Simplify handleNextPage and handlePrevPage to use the memoized filtered list
- [x] Add isPaginating state to prevent rapid clicks and flickering
- [x] Update button disabled conditions to include isPaginating
- [x] Add isPaginating state declaration
- [x] Implement lazy loading for Pokemon images to reduce initial load
- [x] Fetch Pokemon types upfront for filtering functionality
- [x] Reduce initial Pokemon load to 50 to prevent network issues

## Summary of Changes
- Optimized filtering logic with useMemo to reduce unnecessary re-renders
- Added pagination loading state to prevent flickering during page transitions
- Simplified pagination handlers by removing duplicate filtering logic
- Implemented lazy loading for images while keeping types available for filtering
- Reduced initial data load to prevent network congestion

## Testing
- Test pagination by clicking Next/Previous buttons
- Verify no flickering occurs during page transitions
- Ensure buttons are disabled during pagination to prevent rapid clicks
- Check that type filtering works correctly
- Verify images load properly when cards are displayed
