document.addEventListener('DOMContentLoaded', function () {
    const articlesContainer = document.getElementById('articles'); // Assuming you have a div with the ID 'articles'

    // Function to display the last 3 articles
    function displayLast3Articles() {
        const articles = JSON.parse(localStorage.getItem('wikiArticles')) || [];
        const last3Articles = articles.slice(-3).reverse(); // Extract last 3 articles and reverse to display the latest first

        // Display the last 3 articles
        last3Articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');
            articleDiv.innerHTML = `<h4>${article.title}</h4>`;
            articlesContainer.appendChild(articleDiv);
        });
    }

    // Call the function to display the last 3 articles
    displayLast3Articles();
});
