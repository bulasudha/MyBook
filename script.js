// App Initialization
let currentUser = "";

// Check if user is already logged in on load
window.onload = function() {
    const savedUser = sessionStorage.getItem("socialUser");
    if (savedUser) {
        currentUser = savedUser;
        showApp();
    }
    loadPosts();
};

// Login Function
function loginUser() {
    const nameInput = document.getElementById("username-input").value.trim();
    if (nameInput === "") {
        alert("Please enter a valid name!");
        return;
    }
    currentUser = nameInput;
    sessionStorage.setItem("socialUser", currentUser);
    
    // Add to simulated online users list
    let onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    if (!onlineUsers.includes(currentUser)) {
        onlineUsers.push(currentUser);
        localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers));
    }

    showApp();
}

// Display Main Application UI
function showApp() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("app-box").style.display = "block";
    document.getElementById("current-user-name").innerText = currentUser;
    renderOnlineUsers();
}

// Render Online Members Panel
function renderOnlineUsers() {
    const onlineList = document.getElementById("online-list");
    // Default system mock users combined with logged-in user for demonstration
    let onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    
    // Fallback standard simulated active users
    const defaultOnline = ["Amal Perera", "Nimal Silva", "Saman Kumara"];
    const totalOnline = [...new Set([...onlineUsers, ...defaultOnline])];

    onlineList.innerHTML = "";
    totalOnline.forEach(user => {
        const li = document.createElement("li");
        li.innerText = user;
        onlineList.appendChild(li);
    });
}

// Image Preview & Base64 Handler
let encodedImageStr = "";
document.getElementById('post-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            encodedImageStr = event.target.result;
            document.getElementById('image-preview-container').innerHTML = `
                <img src="${encodedImageStr}" style="max-width:100px; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
            `;
        };
        reader.readAsDataURL(file);
    }
});

// Create Post Function (Saves into LocalStorage)
function createNewPost() {
    const text = document.getElementById("post-text").value.trim();
    
    if (text === "" && encodedImageStr === "") {
        alert("Cannot create an empty post!");
        return;
    }

    const newPost = {
        author: currentUser,
        content: text,
        image: encodedImageStr,
        time: new Date().toLocaleString()
    };

    let posts = JSON.parse(localStorage.getItem("socialPosts")) || [];
    posts.unshift(newPost); // Add new post to top
    localStorage.setItem("socialPosts", JSON.stringify(posts));

    // Reset input states
    document.getElementById("post-text").value = "";
    document.getElementById("post-image").value = "";
    document.getElementById('image-preview-container').innerHTML = "";
    encodedImageStr = "";

    loadPosts();
}

// Load and display posts from memory
function loadPosts() {
    const feed = document.getElementById("feed-container");
    let posts = JSON.parse(localStorage.getItem("socialPosts")) || [];

    feed.innerHTML = "";

    if(posts.length === 0) {
        feed.innerHTML = "<p style='text-align:center; color:#606770;'>No posts yet. Be the first to share!</p>";
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement("div");
        postCard.className = "post-card";

        let imgHtml = post.image ? `<img src="${post.image}" alt="Post image">` : "";

        postCard.innerHTML = `
            <div class="post-header">
                ${post.author}
                <span>Posted on: ${post.time}</span>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            ${imgHtml}
        `;
        feed.appendChild(postCard);
    });
}

// Logout Function
function logoutUser() {
    let onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    onlineUsers = onlineUsers.filter(user => user !== currentUser);
    localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers));

    sessionStorage.removeItem("socialUser");
    location.reload();
}
