# To Do
1. Add steam integration                  - Complete
2. Add Playstation/Xbox integration       -
3. Create stat dashboard page             - Complete
4. Set up wishlist and affilate links.    - Complete (Amazon until live)
5. Add 'notify me when price drops to'    - 
6. Remove 'grow' from games on home page  - Complete
7. Added 'x' to delete game on card.      - Complete
8. Adde check price on steam button       - 
9. Make steam activity a drop down.       - Complete
10. On Public profile add "add to wishlist and check price on steam" buttoms

# Pre-production
Authentication
- Sign up with email - Done
- Log in with email - Done
- Log out - Done
- Google sign-in - Done
- Password reset - Done 
- Wrong password / invalid login - Done
- Duplicate email signup - Done
- Session persists after refresh - Done
- Protected pages redirect correctly when logged out - Done
- Account deletion actually removes access/data - Done

Library
- Add a game - Done
- Autofill/search works - Done
- Cover image loads - Done
- Publisher, release date, genre, IGDB rating populate correctly - Done
- Platform dropdown works - Done 
- Status changes work - Done
- Personal rating works - Done 
- Edit works - Done
- Delete using X works - Done
- Delete using bottom button works - Done
- Duplicate game protection works - Done 
- Search works - Done 
- Filters work - Done
- Sorting works - Done 
- Empty library state looks correct - Done
- Long game titles don’t break cards - Done 

Steam
- Connect Steam account - Done 
- Steam profile loads - Done 
- Steam games syn - Done
- Duplicate Steam games are not created - Done
- Playtime is correct - Done
- Last played is correct - Done
- Recent playtime is correct - Done 
- Sync again after adding new Steam games - Done
- Steam badge appears correctly - Done
- Non-Steam cards still align properly - Done 
- Steam failure/error state is understandable - Done

Wishlist
- Add game to wishlist - Done
- Remove from wishlist - Done 
- Delete from wishlist using X - Done
- Wishlist doesn’t duplicate games - Done 
- Existing library game can become wishlist without creating another row - Done
- Amazon button opens correct search - Done
- Affiliate tag appears in Amazon URL - Done 
- Wishlist cards display correctly - Done 

Recommendations
- Recommendations appear with wishlist games present - Done
- Recommendations exclude games already in library - Done 
- Recommendations exclude existing wishlist games - Done
- Refresh #1 gives a new set - Done 
- Refresh #2 gives another new set -Done 
- Older games are filtered appropriately - Done
- Recent games are prioritised - Done
- Publisher/genre matching looks sensible - Done
- Carousel arrows work - Done 
- Horizontal scrolling works on mobile - Done
- Adding a recommendation to wishlist removes it from recommendations - Done

Stats dashboard
- Total games correct - Done
- Playing count correct - Done
- Completed count correct - Done 
- Backlog count correct - Done
- Wishlist count correct - Done
- Average rating correct - Done
- Steam hours correct - Done 
- Platform breakdown correct - Done 
- Most played games correct -Done 
- Recently played games correct - Done
- Works with no Steam data - Done 
- Works with only 1–2 games - Done 

Public profile/library
- Public toggle works - Done
- Public URL works when enabled - Done
- Public URL does not expose private data - Done
- Private profile cannot be viewed publicly - Done
- Correct games appear publicly - done
- No account email/private IDs exposed - Done

Account page
- Public library settings save - Done
- Steam settings save - Done
- Account deletion works - Done 
- Delete button cannot accidentally delete another user - Done
- Profile information displays correctly - Done

UI / responsive
- Desktop Chrome - Done
- Desktop Safari - Done
- iPhone-sized screen - Done
- Android-sized screen - Done
- Tablet width - Done
- Navbar doesn’t overflow - Done
- Cards remain readable- Done
- Forms don’t overflow - Done
- Buttons are tappable - Done
- Recommendation carousel works by touch - Done
- No horizontal page scrolling - Done
- Footer looks correct - Done
- Home page images remain static - Done

Images
- IGDB covers load - Done
- Steam covers load - Done  
- Missing image fallback works - Done
- Images aren’t blurry - Done
- No broken image icons - Done

Error handling
- Disconnect internet temporarily and test - Done
- Bad API response - Done
- IGDB fails - Done
- Steam fails - Done
- Supabase fails - Done
- Recommendation API fails- Done
- User gets a useful message instead of a blank screen - Done

Performance
- Library with 5 games - Done
- Library with 50 games - Done
- Library with 100+ games - Done
- Page doesn’t become painfully slow - Done
- Images load progressively - Done
- No obvious layout jumping - Done
- Recommendation refresh doesn’t freeze UI - Done

Database integrity
- Delete game actually deletes row - Done
- Remove from wishlist only changes is_wishlist - Done
- Editing one game doesn’t affect another - Done
- Duplicate protection works at database level - Done
- Steam sync doesn’t overwrite personal ratings/status unexpectedly - Done

Analytics
- Page views register - Done
- Signup event - Done
- Game added event - Done
- Wishlist event - Done
- Amazon click event - Done
- Steam connection event - Done
- Recommendation refresh event - Done


# Affiliate links
- Amazon
- Fanatical
- GG Games

# Game Library

Game Library is a web app for organising and tracking your personal video game collection.

## Features

- Create your own account
- Build a personal game library
- Search for games
- Automatically retrieve game cover artwork
- Track games as Backlog, Playing or Completed
- Organise games across multiple gaming platforms
- Search, filter and sort your collection
- Manage your gaming profile

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- IGDB

## About

Game Library was created as a learning project to develop experience building a full-stack web application with authentication, databases and external APIs.

The project is currently under development.