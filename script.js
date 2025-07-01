// Minimal JavaScript for 2012-era browser compatibility

// JSON polyfill for IE Mobile 11 (2012)
if (typeof JSON === 'undefined' || !JSON.parse) {
    window.JSON = {
        parse: function(text) {
            try {
                return eval('(' + text + ')');
            } catch (e) {
                throw new Error('Invalid JSON');
            }
        },
        stringify: function(obj) {
            // Basic stringify for IE Mobile 11
            if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
            if (obj === null) return 'null';
            return 'null';
        }
    };
}

// Global variables to store API data
var apiData = null;

// Navigation functions
function goToComic(comicId) {
    // For now, just show an alert since the details page was removed
    alert("Comic clicked: " + comicId);
    // In a real app, this would navigate to a comic details page
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

// Fetch data from API using CORS proxy - 2012 compatible
function fetchComicData() {
    showLoading();
    
    // Create XMLHttpRequest object
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // For very old IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    var proxyUrl = 'https://corsproxy.io/?';
    var targetUrl = 'https://api.comick.io/top';
    var url = proxyUrl + targetUrl;
    
    xhr.open('GET', url, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            hideLoading();
            
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response && response.error) {
                        console.error('API Error:', response.error);
                        populateEmptySections();
                    } else {
                        apiData = response;
                        populateComicSections();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Try fallback parsing for IE Mobile 11
                    try {
                        var response = eval('(' + xhr.responseText + ')');
                        if (response && response.error) {
                            console.error('API Error:', response.error);
                            populateEmptySections();
                        } else {
                            apiData = response;
                            populateComicSections();
                        }
                    } catch (fallbackError) {
                        console.error('Fallback parsing also failed:', fallbackError);
                        populateEmptySections();
                    }
                }
            } else {
                console.error('XHR failed with status:', xhr.status);
                populateEmptySections();
            }
        }
    };
    
    xhr.onerror = function() {
        hideLoading();
        console.error('XHR error occurred');
        populateEmptySections();
    };
    
    // Set timeout for older browsers
    if (xhr.timeout !== undefined) {
        xhr.timeout = 30000; // 30 seconds for very slow connections
    }
    
    if (xhr.ontimeout !== undefined) {
        xhr.ontimeout = function() {
            hideLoading();
            console.error('XHR timeout');
            populateEmptySections();
        };
    }
    
    try {
        xhr.send();
    } catch (error) {
        hideLoading();
        console.error('Error sending XHR request:', error);
        populateEmptySections();
    }
}

// Populate comic sections with API data - 2012 compatible
function populateComicSections() {
    if (!apiData) return;

    var trendingGrid = document.getElementById('trendingGrid');
    var recentsGrid = document.getElementById('recentsGrid');
    var topNewGrid = document.getElementById('topNewGrid');
    var topFollowedGrid = document.getElementById('topFollowedGrid');

    // Clear existing content
    trendingGrid.innerHTML = '';
    recentsGrid.innerHTML = '';
    topNewGrid.innerHTML = '';
    topFollowedGrid.innerHTML = '';

    // Get data from API keys - safe property access for old browsers
    var trending = [];
    if (apiData.trending && apiData.trending["7"]) {
        trending = apiData.trending["7"];
    }
    
    var recentRank = [];
    if (apiData.recentRank) {
        recentRank = apiData.recentRank;
    }
    
    var topFollowNewComics = [];
    if (apiData.topFollowNewComics && apiData.topFollowNewComics["7"]) {
        topFollowNewComics = apiData.topFollowNewComics["7"];
    }
    
    var topFollowComics = [];
    if (apiData.topFollowComics && apiData.topFollowComics["7"]) {
        topFollowComics = apiData.topFollowComics["7"];
    }

    // Populate Trending section (10 comics)
    var trendingComics = trending.slice(0, 10);
    for (var i = 0; i < trendingComics.length; i++) {
        var comicCard = createComicCard(trendingComics[i]);
        trendingGrid.appendChild(comicCard);
    }

    // Populate Recents section (10 comics)
    var recentsComics = recentRank.slice(0, 10);
    for (var i = 0; i < recentsComics.length; i++) {
        var comicCard = createComicCard(recentsComics[i]);
        recentsGrid.appendChild(comicCard);
    }

    // Populate Top New section (10 comics)
    var topNewComics = topFollowNewComics.slice(0, 10);
    for (var i = 0; i < topNewComics.length; i++) {
        var comicCard = createComicCard(topNewComics[i]);
        topNewGrid.appendChild(comicCard);
    }

    // Populate Top Followed section (10 comics)
    var topFollowedComics = topFollowComics.slice(0, 10);
    for (var i = 0; i < topFollowedComics.length; i++) {
        var comicCard = createComicCard(topFollowedComics[i]);
        topFollowedGrid.appendChild(comicCard);
    }
    
    // Debug: Show API response for troubleshooting
    var debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'padding: 20px; margin: 20px; border: 1px solid #ccc; font-family: monospace; font-size: 12px; white-space: pre-wrap; max-height: 300px; overflow: auto;';
    debugDiv.innerHTML = 'API Response Debug:\n' + JSON.stringify(apiData, null, 2);
    document.body.appendChild(debugDiv);
}

// Create a comic card element - 2012 compatible
function createComicCard(comic) {
    var card = document.createElement('div');
    card.className = 'comic-card';
    card.onclick = function() {
        goToComic(comic.hid || comic.id);
    };

    // Get first 2-3 letters of title for image placeholder
    var title = comic.title || 'Unknown';
    var imageText = title.substring(0, 2).toUpperCase();

    card.innerHTML = 
        '<div class="comic-image">' + imageText + '</div>' +
        '<div class="comic-title-container">' +
            '<h3 class="comic-title">' + title + '</h3>' +
            '<p class="comic-desc">' + (comic.last_chapter || 'No information') + '</p>' +
        '</div>';

    return card;
}

// Remove duplicates from array based on a key - 2012 compatible
function removeDuplicates(array, key) {
    var seen = {};
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var value = array[i][key];
        if (!seen[value]) {
            seen[value] = true;
            result.push(array[i]);
        }
    }
    return result;
}

// Format date for display - 2012 compatible
function formatDate(dateString) {
    try {
        var date = new Date(dateString);
        var now = new Date();
        var diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return diffInHours + ' hours ago';
        } else {
            var diffInDays = Math.floor(diffInHours / 24);
            return diffInDays + ' days ago';
        }
    } catch (error) {
        return 'Unknown date';
    }
}

// Populate empty sections when API fails
function populateEmptySections() {
    var trendingGrid = document.getElementById('trendingGrid');
    var recentsGrid = document.getElementById('recentsGrid');
    var topNewGrid = document.getElementById('topNewGrid');
    var topFollowedGrid = document.getElementById('topFollowedGrid');

    // Clear existing content
    trendingGrid.innerHTML = '';
    recentsGrid.innerHTML = '';
    topNewGrid.innerHTML = '';
    topFollowedGrid.innerHTML = '';
}

// Add event listeners when DOM is loaded - 2012 compatible
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
} else if (document.attachEvent) {
    // For very old IE
    document.attachEvent("onreadystatechange", function() {
        if (document.readyState === "complete") {
            var searchInput = document.getElementById("searchInput");
            if (searchInput) {
                searchInput.attachEvent("onkeypress", handleSearchKeyPress);
            }
            fetchComicData();
        }
    });
}

// Fallback for IE Mobile 11 if DOM ready events don't fire
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(function() {
        var searchInput = document.getElementById("searchInput");
        if (searchInput && !searchInput.onkeypress) {
            if (searchInput.addEventListener) {
                searchInput.addEventListener("keypress", handleSearchKeyPress);
            } else if (searchInput.attachEvent) {
                searchInput.attachEvent("onkeypress", handleSearchKeyPress);
            }
        }
        if (!apiData) {
            fetchComicData();
        }
    }, 100);
}

// Simple page loading indicator
function showLoading() {
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML = "LOADING...";
    loading.style.position = "fixed";
    loading.style.top = "50%";
    loading.style.left = "50%";
    loading.style.transform = "translate(-50%,-50%)";
    loading.style.color = "#fff";
    loading.style.padding = "20px";
    loading.style.fontSize = "18px";
    loading.style.fontWeight = "200";
    loading.style.zIndex = "9999";
    loading.style.textTransform = "lowercase";
    document.body.appendChild(loading);
}

function hideLoading() {
    var loading = document.getElementById("loading");
    if (loading) {
        loading.parentNode.removeChild(loading);
    }
}

// Simple error handling
function showError(message) {
    alert("Error: " + message);
}

// Check if we're on a mobile device (basic detection) - 2012 compatible
function isMobile() {
    // IE Mobile 11 detection for 2012
    var userAgent = navigator.userAgent || navigator.appVersion || '';
    var isIEMobile = /IEMobile/i.test(userAgent);
    var isWindowsPhone = /Windows Phone/i.test(userAgent);
    var isMobileWidth = window.innerWidth <= 768;
    
    return isIEMobile || isWindowsPhone || isMobileWidth;
}

// Handle orientation changes - 2012 compatible
if (window.addEventListener) {
    window.addEventListener("orientationchange", function() {
        // For IE Mobile 11, use a gentler approach
        if (isMobile()) {
            // Just refresh layout instead of full reload
            setTimeout(function() {
                var body = document.body;
                if (body) {
                    body.style.display = 'none';
                    setTimeout(function() {
                        body.style.display = '';
                    }, 10);
                }
            }, 100);
        } else {
            // Reload page on orientation change for better compatibility
            setTimeout(function() {
                window.location.reload();
            }, 500);
        }
    });
} else if (window.attachEvent) {
    // For very old IE
    window.attachEvent("onorientationchange", function() {
        if (isMobile()) {
            setTimeout(function() {
                var body = document.body;
                if (body) {
                    body.style.display = 'none';
                    setTimeout(function() {
                        body.style.display = '';
                    }, 10);
                }
            }, 100);
        } else {
            setTimeout(function() {
                window.location.reload();
            }, 500);
        }
    });
} 