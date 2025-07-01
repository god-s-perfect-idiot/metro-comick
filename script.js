// Minimal JavaScript for Windows Phone 8.1 compatibility

// Global variables to store API data
let apiData = null;

// Navigation functions
function goToComic(comicId) {
    // Store the comic ID in localStorage for the next page
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("selectedComic", comicId);
    }
    window.location.href = "comic-details.html";
}

function goToReader() {
    window.location.href = "reader.html";
}

function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = "index.html";
}

// Search function
function searchComics() {
    var searchTerm = document.getElementById("searchInput").value;
    if (searchTerm.trim() !== "") {
        // Simple search - just show an alert for demo
        alert("Searching for: " + searchTerm);
        // In a real app, this would filter the comics or redirect to search results
    }
}

// Handle Enter key in search input
function handleSearchKeyPress(event) {
    if (event.keyCode === 13) {
        searchComics();
    }
}

// Fetch data from API
function fetchComicData() {
    showLoading();
    
    // Try XMLHttpRequest first (better Windows Phone compatibility)
    if (window.XMLHttpRequest) {
        const xhr = new XMLHttpRequest();
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = 'https://api.comick.io/top';
        
        xhr.open('GET', proxyUrl + targetUrl, true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                hideLoading();
                
                if (xhr.status === 200) {
                    try {
                        apiData = JSON.parse(xhr.responseText);
                        populateComicSections();
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        showError('Failed to parse data');
                        loadSampleData();
                    }
                } else {
                    console.error('XHR failed with status:', xhr.status);
                    showError('Failed to load comic data');
                    loadSampleData();
                }
            }
        };
        
        xhr.onerror = function() {
            hideLoading();
            console.error('XHR error occurred');
            showError('Network error occurred');
            loadSampleData();
        };
        
        // Set timeout for Windows Phone
        xhr.timeout = 10000; // 10 seconds
        
        xhr.ontimeout = function() {
            hideLoading();
            console.error('XHR timeout');
            showError('Request timed out');
            loadSampleData();
        };
        
        try {
            xhr.send();
        } catch (error) {
            hideLoading();
            console.error('Error sending XHR request:', error);
            showError('Failed to send request');
            loadSampleData();
        }
    } else {
        // Fallback for very old browsers
        hideLoading();
        console.log('XMLHttpRequest not supported, using sample data');
        loadSampleData();
    }
}

// Populate comic sections with API data
function populateComicSections() {
    if (!apiData) return;

    const trendingGrid = document.getElementById('trendingGrid');
    const recentsGrid = document.getElementById('recentsGrid');
    const topNewGrid = document.getElementById('topNewGrid');
    const topFollowedGrid = document.getElementById('topFollowedGrid');

    // Clear existing content
    trendingGrid.innerHTML = '';
    recentsGrid.innerHTML = '';
    topNewGrid.innerHTML = '';
    topFollowedGrid.innerHTML = '';

    // Get data from API keys
    const trending = apiData.trending?.["7"] || [];
    const recentRank = apiData.recentRank || [];
    const topFollowNewComics = apiData.topFollowNewComics?.["7"] || [];
    const topFollowComics = apiData.topFollowComics?.["7"] || [];

    // Populate Trending section (10 comics)
    const trendingComics = trending.slice(0, 10);
    trendingComics.forEach(comic => {
        const comicCard = createComicCard(comic);
        trendingGrid.appendChild(comicCard);
    });

    // Populate Recents section (10 comics)
    const recentsComics = recentRank.slice(0, 10);
    recentsComics.forEach(comic => {
        const comicCard = createComicCard(comic);
        recentsGrid.appendChild(comicCard);
    });

    // Populate Top New section (10 comics)
    const topNewComics = topFollowNewComics.slice(0, 10);
    topNewComics.forEach(comic => {
        const comicCard = createComicCard(comic);
        topNewGrid.appendChild(comicCard);
    });

    // Populate Top Followed section (10 comics)
    const topFollowedComics = topFollowComics.slice(0, 10);
    topFollowedComics.forEach(comic => {
        const comicCard = createComicCard(comic);
        topFollowedGrid.appendChild(comicCard);
    });
}

// Create a comic card element
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.onclick = () => goToComic(comic.hid || comic.id);

    // Get first 2-3 letters of title for image placeholder
    const title = comic.title || 'Unknown';
    const imageText = title.substring(0, 2).toUpperCase();

    card.innerHTML = `
        <div class="comic-image">${imageText}</div>
        <div class="comic-title-container">
            <h3 class="comic-title">${title}</h3>
            <p class="comic-desc">${comic.last_chapter || 'No information'}</p>
        </div>
    `;

    return card;
}

// Remove duplicates from array based on a key
function removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

// Format date for display
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    } catch (error) {
        return 'Unknown date';
    }
}

// Add event listeners when DOM is loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        // Add keypress listener to search input if it exists
        var searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("keypress", handleSearchKeyPress);
        }

        // Fetch comic data when page loads
        fetchComicData();
    });
}

// Simple page loading indicator
function showLoading() {
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML = "LOADING...";
    loading.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;padding:20px;font-size:18px;font-weight:200;z-index:9999;text-transform:lowercase;";
    document.body.appendChild(loading);
}

function hideLoading() {
    var loading = document.getElementById("loading");
    if (loading) {
        loading.remove();
    }
}

// Simple error handling
function showError(message) {
    alert("Error: " + message);
}

// Check if we're on a mobile device (basic detection)
function isMobile() {
    return window.innerWidth <= 768;
}

// Handle orientation changes
if (window.addEventListener) {
    window.addEventListener("orientationchange", function() {
        // Reload page on orientation change for better compatibility
        setTimeout(function() {
            window.location.reload();
        }, 500);
    });
}

// Load sample data as fallback
function loadSampleData() {
    console.log('Loading sample data as fallback...');
    apiData = {
        trending: {
            "7": [
                {
                    hid: "one-piece",
                    title: "One Piece",
                    last_chapter: "Chapter 1085"
                },
                {
                    hid: "naruto",
                    title: "Naruto",
                    last_chapter: "Chapter 700"
                },
                {
                    hid: "dragon-ball",
                    title: "Dragon Ball",
                    last_chapter: "Chapter 519"
                },
                {
                    hid: "bleach",
                    title: "Bleach",
                    last_chapter: "Chapter 686"
                },
                {
                    hid: "attack-on-titan",
                    title: "Attack on Titan",
                    last_chapter: "Chapter 139"
                },
                {
                    hid: "my-hero-academia",
                    title: "My Hero Academia",
                    last_chapter: "Chapter 362"
                },
                {
                    hid: "jujutsu-kaisen",
                    title: "Jujutsu Kaisen",
                    last_chapter: "Chapter 200"
                },
                {
                    hid: "demon-slayer",
                    title: "Demon Slayer",
                    last_chapter: "Chapter 205"
                },
                {
                    hid: "chainsaw-man",
                    title: "Chainsaw Man",
                    last_chapter: "Chapter 150"
                },
                {
                    hid: "spy-x-family",
                    title: "Spy x Family",
                    last_chapter: "Chapter 85"
                }
            ]
        },
        recentRank: [
            {
                hid: "black-clover",
                title: "Black Clover",
                last_chapter: "Chapter 350",
                updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "fairy-tail",
                title: "Fairy Tail",
                last_chapter: "Chapter 545",
                updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "hunter-x-hunter",
                title: "Hunter x Hunter",
                last_chapter: "Chapter 400",
                updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "blue-lock",
                title: "Blue Lock",
                last_chapter: "Chapter 250",
                updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "mashle",
                title: "Mashle",
                last_chapter: "Chapter 180",
                updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "solo-leveling",
                title: "Solo Leveling",
                last_chapter: "Chapter 200",
                updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "tower-of-god",
                title: "Tower of God",
                last_chapter: "Chapter 550",
                updated_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "god-of-high-school",
                title: "The God of High School",
                last_chapter: "Chapter 580",
                updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "noblesse",
                title: "Noblesse",
                last_chapter: "Chapter 544",
                updated_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
            },
            {
                hid: "unordinary",
                title: "UnOrdinary",
                last_chapter: "Chapter 300",
                updated_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
            }
        ],
        topFollowNewComics: {
            "7": [
                {
                    hid: "one-punch-man",
                    title: "One Punch Man",
                    last_chapter: "Chapter 180"
                },
                {
                    hid: "tokyo-ghoul",
                    title: "Tokyo Ghoul",
                    last_chapter: "Chapter 143"
                },
                {
                    hid: "fullmetal-alchemist",
                    title: "Fullmetal Alchemist",
                    last_chapter: "Chapter 108"
                },
                {
                    hid: "death-note",
                    title: "Death Note",
                    last_chapter: "Chapter 108"
                },
                {
                    hid: "code-geass",
                    title: "Code Geass",
                    last_chapter: "Chapter 8"
                },
                {
                    hid: "steins-gate",
                    title: "Steins;Gate",
                    last_chapter: "Chapter 25"
                },
                {
                    hid: "evangelion",
                    title: "Neon Genesis Evangelion",
                    last_chapter: "Chapter 14"
                },
                {
                    hid: "cowboy-bebop",
                    title: "Cowboy Bebop",
                    last_chapter: "Chapter 3"
                },
                {
                    hid: "ghost-in-shell",
                    title: "Ghost in the Shell",
                    last_chapter: "Chapter 12"
                },
                {
                    hid: "akira",
                    title: "Akira",
                    last_chapter: "Chapter 6"
                }
            ]
        },
        topFollowComics: {
            "7": [
                {
                    hid: "berserk",
                    title: "Berserk",
                    last_chapter: "Chapter 364"
                },
                {
                    hid: "vagabond",
                    title: "Vagabond",
                    last_chapter: "Chapter 327"
                },
                {
                    hid: "monster",
                    title: "Monster",
                    last_chapter: "Chapter 162"
                },
                {
                    hid: "20th-century-boys",
                    title: "20th Century Boys",
                    last_chapter: "Chapter 249"
                },
                {
                    hid: "pluto",
                    title: "Pluto",
                    last_chapter: "Chapter 65"
                },
                {
                    hid: "vinland-saga",
                    title: "Vinland Saga",
                    last_chapter: "Chapter 200"
                },
                {
                    hid: "kingdom",
                    title: "Kingdom",
                    last_chapter: "Chapter 750"
                },
                {
                    hid: "grand-blue",
                    title: "Grand Blue",
                    last_chapter: "Chapter 85"
                },
                {
                    hid: "kaguya-sama",
                    title: "Kaguya-sama: Love is War",
                    last_chapter: "Chapter 281"
                },
                {
                    hid: "komi-san",
                    title: "Komi Can't Communicate",
                    last_chapter: "Chapter 400"
                }
            ]
        }
    };
    
    populateComicSections();
} 