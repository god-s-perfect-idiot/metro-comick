# Windows Phone 8.1 Comic Reader

A simple, lightweight comic reader web app designed specifically for Windows Phone 8.1 devices running Internet Explorer from 2013. Built with pure HTML, CSS, and minimal JavaScript for maximum compatibility.

## Features

- **Windows Phone 8.1 Metro Design**: Black background with big fonts and tile-based layout
- **Three-Page App Structure**:
  - Page 1: Popular comics grid and search functionality
  - Page 2: Comic details and chapter selection
  - Page 3: Vertical scrolling comic reader with pagination
- **Mobile-Optimized**: Designed for small screens and touch interaction
- **Minimal JavaScript**: Uses only basic JavaScript for compatibility with older browsers
- **Responsive Design**: Adapts to different screen sizes

## File Structure

```
comic-reader/
├── index.html          # Page 1: Main page with popular comics
├── comic-details.html  # Page 2: Comic details and chapters
├── reader.html         # Page 3: Comic reader with pagination
├── styles.css          # Windows Phone 8.1 Metro styling
├── script.js           # Minimal JavaScript functionality
└── README.md           # This file
```

## How to Use

1. **Open the App**: Navigate to `index.html` in your Windows Phone 8.1 browser
2. **Browse Comics**: View popular comics on the main page
3. **Search**: Use the search bar to find specific comics
4. **Select Comic**: Tap on any comic card to view details
5. **Choose Chapter**: Select a chapter from the chapter list
6. **Read**: Scroll vertically through the comic pages
7. **Navigate**: Use the controls to move between pages and chapters

## Navigation

- **Back Button**: Returns to the previous page
- **Page Controls**: Navigate between pages within a chapter
- **Chapter Navigation**: Move to previous/next chapters
- **Chapter List**: Return to chapter selection

## Technical Details

### Browser Compatibility
- Designed for Windows Phone 8.1 Internet Explorer (2013)
- Uses basic HTML5, CSS3, and ES5 JavaScript
- No modern JavaScript features or frameworks
- Minimal DOM manipulation for better performance

### Design Principles
- **Metro Design**: Inspired by Windows Phone 8.1 interface
- **High Contrast**: Black background with white text for readability
- **Large Touch Targets**: Buttons and interactive elements sized for touch
- **Simple Layout**: Clean, uncluttered interface
- **Big Fonts**: Easy to read on small screens

### Performance Optimizations
- Minimal JavaScript for faster loading
- Simple CSS without complex animations
- No external dependencies
- Optimized for low-end devices

## Customization

### Adding Comics
Edit the `getComicData()` function in `comic-details.html` to add more comics:

```javascript
var comics = {
    "your-comic-id": {
        title: "YOUR COMIC TITLE",
        shortTitle: "YCT",
        description: "Your comic description...",
        status: "ONGOING",
        chapters: "100",
        genre: "ACTION, ADVENTURE"
    }
};
```

### Styling
Modify `styles.css` to change colors, fonts, or layout:
- Primary color: `#0078d4` (Windows blue)
- Background: `#000000` (black)
- Secondary background: `#1a1a1a` (dark gray)

## Browser Requirements

- Windows Phone 8.1 Internet Explorer
- JavaScript enabled
- Local storage support (for basic functionality)
- Touch screen support

## Notes

- This is a demo app with placeholder content
- In a real implementation, you would connect to a comic API
- Images would be replaced with actual comic page images
- Search functionality would be connected to a backend service

## Troubleshooting

If the app doesn't work properly:
1. Ensure JavaScript is enabled
2. Check that local storage is supported
3. Try refreshing the page
4. Clear browser cache if needed

The app is designed to be as simple and compatible as possible for Windows Phone 8.1 devices. 