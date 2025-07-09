// Tab switching functionality
function showTab(tabId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Blog post navigation
function openBlogPost(postElement) {
    const postId = postElement.dataset.postId;
    // For now, show an alert. Later you can navigate to individual blog post pages
    alert(`Opening blog post: ${postId}\n\nIn a real implementation, this would navigate to a detailed blog post page like:\nblog/${postId}.html`);
    
    // Example of what you could do:
    // window.location.href = `blog/${postId}.html`;
    // or if using a single-page app:
    // showFullBlogPost(postId);
}

// Blog filtering functionality
let currentFilter = 'all';

// Add click event listeners to tag filters
document.querySelectorAll('.tag-filter').forEach(filter => {
    filter.addEventListener('click', function() {
        // Remove active class from all filters
        document.querySelectorAll('.tag-filter').forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        this.classList.add('active');
        
        // Get the selected tag
        currentFilter = this.dataset.tag;
        
        // Filter posts
        filterPosts();
    });
});

function filterPosts() {
    const posts = document.querySelectorAll('.blog-post');
    const noPostsMessage = document.getElementById('no-posts');
    let visiblePosts = 0;

    posts.forEach(post => {
        const postTags = post.dataset.tags.split(',');
        
        if (currentFilter === 'all' || postTags.includes(currentFilter)) {
            post.style.display = 'block';
            visiblePosts++;
        } else {
            post.style.display = 'none';
        }
    });

    // Show/hide no posts message
    if (visiblePosts === 0) {
        noPostsMessage.style.display = 'block';
    } else {
        noPostsMessage.style.display = 'none';
    }
}

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', function() {
    filterPosts();
});