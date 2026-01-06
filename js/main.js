// Initialize total blogs count
function updateTotalBlogs() {
    let total = 0;
    const categories = ['games', 'news', 'entertainment', 'sports'];
    
    categories.forEach(category => {
        const blogs = JSON.parse(localStorage.getItem(`blogs_${category}`) || '[]');
        total += blogs.length;
    });
    
    document.getElementById('totalBlogs').textContent = total;
}

// Navigate to category page
function goToCategory(category) {
    window.location.href = `html/${category}.html`;
}

// Update blogs count on page load
document.addEventListener('DOMContentLoaded', updateTotalBlogs);
