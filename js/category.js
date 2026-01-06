// 🔥 FIREBASE CONFIG - REPLACE WITH YOURS
const firebaseConfig = {
  apiKey: "AIzaSyAkhYIIYwTHxEml65pv0ALAnstHkYEadBs",
  authDomain: "blog-hub-fc862.firebaseapp.com",
  databaseURL: "https://blog-hub-fc862-default-rtdb.firebaseio.com",
  projectId: "blog-hub-fc862",
  storageBucket: "blog-hub-fc862.firebasestorage.app",
  messagingSenderId: "56789769918",
  appId: "1:56789769918:web:b4cf011ff80f4eecb188ef",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Get current category
function getCurrentCategory() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const category = getCurrentCategory();
    initializePage(category);
    loadBlogsFromFirebase(category);
});

// Set page title
function initializePage(category) {
    const categoryNames = {
        'games': '🎮 Games',
        'news': '📰 News', 
        'entertainment': '🎬 Entertainment',
        'sports': '⚽ Sports'
    };
    
    document.title = `${categoryNames[category]} - Blog Hub`;
    document.querySelector('.category-header h1').textContent = categoryNames[category];
    document.querySelector('.create-blog-btn').onclick = () => openCreateBlogModal(category);
}

// 🔥 LOAD BLOGS FROM FIREBASE (Real-time!)
function loadBlogsFromFirebase(category) {
    const blogsRef = db.ref(`blogs/${category}`);
    const container = document.querySelector('.blogs-grid');
    
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:50px;">Loading blogs...</p>';
    
    blogsRef.on('value', (snapshot) => {
        const blogs = snapshot.val() ? Object.values(snapshot.val()) : [];
        container.innerHTML = '';
        
        if (blogs.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <p>No blogs yet. Be the first to create one!</p>
                </div>
            `;
            return;
        }
        
        blogs.reverse().forEach(blog => {
            const card = createBlogCard(blog);
            container.appendChild(card);
        });
    });
}

// Create blog card HTML
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-image">${blog.icon}</div>
        <div class="blog-content">
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-excerpt">${blog.excerpt}</p>
            <div class="blog-meta">
                <span>${blog.author}</span>
                <span>${blog.date}</span>
            </div>
        </div>
    `;
    card.onclick = () => openBlogModal(blog);
    return card;
}

// View blog modal
function openBlogModal(blog) {
    document.getElementById('viewBlogTitle').textContent = blog.title;
    document.getElementById('viewBlogAuthor').textContent = `By ${blog.author}`;
    document.getElementById('viewBlogDate').textContent = blog.date;
    document.getElementById('viewBlogContent').textContent = blog.content;
    
    document.getElementById('viewBlogModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Create blog modal
function openCreateBlogModal(category) {
    document.getElementById('createBlogModal').dataset.category = category;
    document.getElementById('createBlogModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close modals
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 🔥 PUBLISH TO FIREBASE (Everyone sees instantly!)
function submitBlogForm(event) {
    event.preventDefault();
    
    const category = document.getElementById('createBlogModal').dataset.category;
    const title = document.getElementById('blogTitle').value;
    const author = document.getElementById('blogAuthor').value;
    const excerpt = document.getElementById('blogExcerpt').value;
    const content = document.getElementById('blogContent').value;
    
    if (!title || !author || !excerpt || !content) {
        alert('Please fill all fields!');
        return;
    }
    
    const categoryIcons = {
        'games': '🎮', 'news': '📰', 
        'entertainment': '🎬', 'sports': '⚽'
    };
    
    const newBlog = {
        id: Date.now(),
        title, author, excerpt, content,
        date: new Date().toLocaleString(),
        icon: categoryIcons[category]
    };
    
    // 🔥 SAVE TO FIREBASE (Real-time sync!)
    db.ref(`blogs/${category}`).push(newBlog)
        .then(() => {
            closeModal('createBlogModal');
            document.getElementById('blogForm').reset();
            alert('✅ Blog published! Everyone can see it now!');
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
}

// Window click handlers
window.onclick = function(event) {
    const viewModal = document.getElementById('viewBlogModal');
    const createModal = document.getElementById('createBlogModal');
    
    if (event.target === viewModal) closeModal('viewBlogModal');
    if (event.target === createModal) closeModal('createBlogModal');
};
