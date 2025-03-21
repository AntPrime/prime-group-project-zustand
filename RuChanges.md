3/21/2025 - Changes Made to the Original Repo:

Hey team! Here's what I worked on:

1. Added MUI Components
We installed Material UI (MUI) to cards, buttons, and form fields instead of basic HTML elements.
2. Improved the Events Page
Changed the form to add new events using MUI components
Added cards to display events in a grid layout
Added edit and delete buttons to each event card
3. Added Search and Filter Features
Created a search bar that lets you find events by typing keywords
Added dropdown filters for:
Categories (like Basketball, Football, etc.)
Schools (like Albert Lea, Faibault, etc.)
Event Types (like Sporting Event, Online Event, etc.)
Added chips to show which filters are active and let you remove them
4. Updated the Database
Added an "event_type" column to the events table so we can filter by event type (subject to change)
5. Created New API Routes
Added routes to get all categories (/api/categories)
Added routes to get all schools (/api/schools)
Updated the events route to handle filters
6. Updated the Student Homepage
Made it match the style of the Events page
Added the same search and filter functionality
Shows events in cards just like the Events page
Added buttons for students to sign up for roles (Producer, Camera, Play-by-play)
7. Fixed Bugs
Fixed issues with creating new events
Fixed issues with updating events
Made sure search results display correctly