# Search Page Specification

## ADDED Requirements

### Requirement: Search Page Navigation
The system SHALL provide a full-page search interface accessible from the header search button.

#### Scenario: Navigate to search page from header
- **WHEN** user clicks the search icon in the header
- **THEN** the system navigates to the search page
- **AND** the feed page is hidden
- **AND** the search input is focused

#### Scenario: Navigate back from search page
- **WHEN** user clicks the back button on the search page
- **THEN** the system navigates back to the feed page
- **AND** the search page is hidden

### Requirement: Search Bar Display
The system SHALL display a search bar at the top of the search page with a back button.

#### Scenario: Search bar layout
- **WHEN** the search page is displayed
- **THEN** the search bar is positioned at the top
- **AND** a back button is shown on the left
- **AND** a search input field is shown in the center
- **AND** the search input has a search icon
- **AND** the search input has placeholder text "Search" or equivalent

### Requirement: Recent Searches Display
The system SHALL display recent searches below the search bar when no search query is active.

#### Scenario: Show recent searches
- **WHEN** the search page loads without a query
- **AND** recent searches exist in the backend
- **THEN** the system displays recent searches below the search bar
- **AND** each recent search shows a clock icon
- **AND** each recent search shows the search query text
- **AND** each recent search has a dismiss (X) button on the right

#### Scenario: Dismiss recent search
- **WHEN** user clicks the dismiss button on a recent search item
- **THEN** the system removes that item from the display
- **AND** the system sends DELETE request to backend to remove from history

#### Scenario: Click recent search
- **WHEN** user clicks on a recent search item
- **THEN** the system performs a search with that query
- **AND** the search results are displayed

#### Scenario: No recent searches
- **WHEN** the search page loads
- **AND** no recent searches exist
- **THEN** the system does not display the recent searches section

### Requirement: Tag-Based Search Navigation
The system SHALL support navigating to the search page with a tag pre-selected.

#### Scenario: Navigate with tag
- **WHEN** user clicks on a tag (e.g., from prediction card or tag list)
- **THEN** the system navigates to the search page
- **AND** the tag is displayed at the top of the page as a badge
- **AND** the search is performed with the tag as the query
- **AND** search results filtered by that tag are displayed

#### Scenario: Remove tag filter
- **WHEN** user clicks the X button on the tag badge
- **THEN** the system removes the tag filter
- **AND** the search query is cleared
- **AND** the page shows trending predictions or recent searches

### Requirement: Trending Predictions Section
The system SHALL display trending predictions when no search query is active.

#### Scenario: Show trending predictions
- **WHEN** the search page loads without a search query
- **THEN** the system displays a "Trending Today" or equivalent section header
- **AND** the system fetches trending predictions from the backend
- **AND** the system displays prediction cards in the same format as the feed page
- **AND** prediction cards are displayed vertically one after another

#### Scenario: Trending predictions loading
- **WHEN** trending predictions are being fetched
- **THEN** the system displays skeleton loaders
- **AND** the number of skeletons matches the expected number of cards

#### Scenario: No trending predictions
- **WHEN** no trending predictions are available
- **THEN** the system displays an appropriate empty state message

### Requirement: Search Results Display
The system SHALL display search results using the same prediction card format as the feed page.

#### Scenario: Display search results
- **WHEN** user enters a search query
- **AND** search results are returned
- **THEN** the system displays prediction cards in the same format as the feed page
- **AND** prediction cards are displayed vertically one after another
- **AND** each card is clickable to view prediction details

#### Scenario: Search results loading
- **WHEN** user enters a search query
- **AND** results are being fetched
- **THEN** the system displays skeleton loaders
- **AND** the search input shows a loading indicator

#### Scenario: No search results
- **WHEN** user enters a search query
- **AND** no results are found
- **THEN** the system displays an empty state message
- **AND** the message suggests trying different keywords

#### Scenario: Infinite scroll for search results
- **WHEN** user scrolls to the bottom of search results
- **AND** more results are available
- **THEN** the system automatically loads the next page of results
- **AND** new results are appended to the existing list

### Requirement: Search History API Integration
The system SHALL fetch and manage search history from the backend.

#### Scenario: Fetch recent searches
- **WHEN** the search page loads
- **THEN** the system sends GET request to `/search-history` endpoint
- **AND** the system displays the returned recent searches
- **AND** the system handles errors gracefully

#### Scenario: Delete search history item
- **WHEN** user dismisses a recent search item
- **THEN** the system sends DELETE request to `/search-history/:id` endpoint
- **AND** the system updates the UI to remove the item
- **AND** the system handles errors gracefully

### Requirement: Search Functionality
The system SHALL perform debounced search queries and display results.

#### Scenario: Debounced search
- **WHEN** user types in the search input
- **THEN** the system waits 300ms after typing stops
- **AND** then sends the search query to the backend
- **AND** displays results when received

#### Scenario: Clear search
- **WHEN** user clicks the clear button (X) in the search input
- **THEN** the system clears the search query
- **AND** the system hides search results
- **AND** the system shows trending predictions or recent searches
