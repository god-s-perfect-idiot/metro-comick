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

// Fetch data from API directly - 2012 compatible
function fetchComicData() {
    showLoading();
    
    console.log('Fetching API data directly...');
    
    // Create XMLHttpRequest object
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // For very old IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    var url = 'https://api.comick.io/top';
    console.log('Requesting:', url);
    
    xhr.open('GET', url, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            hideLoading();
            
            console.log('XHR Status:', xhr.status);
            console.log('Response Length:', xhr.responseText ? xhr.responseText.length : 'null');
            
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    console.log('API Success:', response);
                    apiData = response;
                    populateComicSections();
                } catch (error) {
                    console.error('JSON Parse Error:', error);
                    populateEmptySections();
                }
            } else {
                console.error('HTTP Error:', xhr.status);
                populateEmptySections();
            }
        }
    };
    
    xhr.onerror = function() {
        hideLoading();
        console.error('XHR Error');
        populateEmptySections();
    };
    
    // Set timeout
    if (xhr.timeout !== undefined) {
        xhr.timeout = 30000;
    }
    
    if (xhr.ontimeout !== undefined) {
        xhr.ontimeout = function() {
            hideLoading();
            console.error('XHR Timeout');
            populateEmptySections();
        };
    }
    
    try {
        xhr.send();
    } catch (error) {
        hideLoading();
        console.error('Send Error:', error);
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
    
    // Add message for IE Mobile users about API issue
    var message = document.createElement('div');
    message.style.cssText = 'text-align: center; padding: 20px; color: #666; background: #f9f9f9; margin: 20px; border: 1px solid #ddd; border-radius: 5px;';
    message.innerHTML = '<strong>API Connection Issue</strong><br>The live API may be blocked by your network or browser security settings.<br><small>This is common on older mobile browsers.</small>';
    document.body.appendChild(message);
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

// DOM Console for IE Mobile 11 (no browser console)
var domConsole = {
    logs: [],
    maxLogs: 50,
    
    log: function(message, data) {
        this.addLog('LOG', message, data);
    },
    
    error: function(message, data) {
        this.addLog('ERROR', message, data);
    },
    
    addLog: function(type, message, data) {
        var logEntry = {
            type: type,
            message: message,
            data: data,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.logs.push(logEntry);
        
        // Keep only last 50 logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        this.updateDisplay();
    },
    
    updateDisplay: function() {
        var consoleDiv = document.getElementById('dom-console');
        if (!consoleDiv) {
            consoleDiv = document.createElement('div');
            consoleDiv.id = 'dom-console';
            consoleDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #000; color: #fff; font-family: monospace; font-size: 10px; padding: 10px; max-height: 200px; overflow-y: auto; z-index: 10000; border-top: 2px solid #333;';
            document.body.appendChild(consoleDiv);
        }
        
        var html = '<div style="margin-bottom: 5px; font-weight: bold;">DOM Console Logs:</div>';
        for (var i = 0; i < this.logs.length; i++) {
            var log = this.logs[i];
            var color = log.type === 'ERROR' ? '#ff6b6b' : '#4ecdc4';
            html += '<div style="margin: 2px 0; color: ' + color + ';">[' + log.timestamp + '] ' + log.type + ': ' + log.message;
            if (log.data !== undefined) {
                html += ' - ' + (typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data));
            }
            html += '</div>';
        }
        consoleDiv.innerHTML = html;
    }
};

// Override console methods for IE Mobile 11
if (typeof console === 'undefined' || !console.log) {
    window.console = {
        log: function(message, data) { domConsole.log(message, data); },
        error: function(message, data) { domConsole.error(message, data); },
        warn: function(message, data) { domConsole.log('WARN: ' + message, data); },
        info: function(message, data) { domConsole.log('INFO: ' + message, data); }
    };
} else {
    // Keep original console but also log to DOM
    var originalLog = console.log;
    var originalError = console.error;
    console.log = function(message, data) {
        originalLog.apply(console, arguments);
        domConsole.log(message, data);
    };
    console.error = function(message, data) {
        originalError.apply(console, arguments);
        domConsole.error(message, data);
    };
} 