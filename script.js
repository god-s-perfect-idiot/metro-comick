// Minimal JavaScript for Windows Phone 8.1 compatibility

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

// Add event listeners when DOM is loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        // Add keypress listener to search input if it exists
        var searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("keypress", handleSearchKeyPress);
        }
    });
}

// Simple page loading indicator
function showLoading() {
    var loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML = "LOADING...";
    loading.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#0078d4;color:#fff;padding:20px;font-size:18px;font-weight:bold;z-index:9999;";
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