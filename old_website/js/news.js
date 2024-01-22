document.addEventListener('DOMContentLoaded', function () {
    const articlesContainer = document.getElementById('articles');	
    const addArticleForm = document.getElementById('add-article-form');
    let selectedArticle = null;
    let archive = {};

    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image']
            ]
        }
    });

    addArticleForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const content = quill.root.innerHTML; // Get HTML content from Quill
        
        if (selectedArticle) {
            const updatedArticle = {
                title: title,
                content: content,
                createdAt: selectedArticle.createdAt
            };
            updateArticle(selectedArticle, updatedArticle);
            selectedArticle = null;
        } else {
            const article = {
                title: title,
                content: content
            };
            saveArticle(article);
        }

        displayArticles();
        addArticleForm.reset();
        quill.root.innerHTML = '';
    });

    const clearArticlesBtn = document.getElementById('clearArticlesBtn');
    if (clearArticlesBtn) {
        clearArticlesBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to clear all articles?')) {
                localStorage.removeItem('wikiArticles');
				articlesContainer.innerHTML = '';
            }
        });
    }

    function saveArticle(article) {
        let articles = JSON.parse(localStorage.getItem('wikiArticles')) || [];
        article.createdAt = new Date().toISOString();
        articles.push(article);
        localStorage.setItem('wikiArticles', JSON.stringify(articles));
    }

    function updateArticle(oldArticle, updatedArticle) {
        const articles = JSON.parse(localStorage.getItem('wikiArticles')) || [];
        const index = articles.findIndex(article => article.createdAt === oldArticle.createdAt);
        if (index !== -1) {
            articles[index] = updatedArticle;
            localStorage.setItem('wikiArticles', JSON.stringify(articles));
        }
    }

	function toggleMonths(year) {
		const yearNode = document.querySelector(`.year-node[data-year="${year}"]`);
		if (yearNode && yearNode.querySelectorAll('.month-node').length === 0) {
			const months = Object.keys(archive[year]).sort((a, b) => a - b);
			const monthNodes = months.map(month => {
				const monthNode = document.createElement('div');
				monthNode.innerHTML = `<h4>${getMonthName(month)}</h4>`;
				monthNode.classList.add('month-node');
				monthNode.dataset.month = month;
				monthNode.addEventListener('click', () => toggleDays(year, month));
				return monthNode;
			});
			yearNode.append(...monthNodes);
		} 		
	}

    function getMonthName(month) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1];
    }

    function toggleDays(year, month) {
        const monthNode = document.querySelector(`.year-node[data-year="${year}"] .month-node[data-month="${month}"]`);
        if (monthNode && monthNode.querySelectorAll('.day-node').length === 0) {
            const days = Object.keys(archive[year][month]).sort((a, b) => a - b);
            const dayNodes = days.map(day => {
                const dayNode = document.createElement('div');
                dayNode.innerHTML = `<h5>${day}</h5>`;
                dayNode.classList.add('day-node');
                dayNode.dataset.day = day;
                dayNode.addEventListener('click', () => toggleArticles(year, month, day));
                return dayNode;
            });
            monthNode.append(...dayNodes);
        } 
    }
	
	function toggleArticles(year, month, day) {
		const dayNode = document.querySelector(`.year-node[data-year="${year}"] .month-node[data-month="${month}"] .day-node[data-day="${day}"]`);
		if (dayNode) {
			const articleListDiv = document.createElement('div');
			articleListDiv.classList.add('article-list');

			if (archive[year] && archive[year][month] && archive[year][month][day]) {
				archive[year][month][day].forEach(article => {
					const articleDiv = document.createElement('div');
					articleDiv.classList.add('article');
					articleDiv.innerHTML = `<h4>${article.title}</h4>`;
					articleListDiv.appendChild(articleDiv);
					
					articleDiv.addEventListener('click', () => {
						document.getElementById('title').value = article.title;
						quill.root.innerHTML = article.content;

						selectedArticle = article;

						const existingUpdateBtn = document.getElementById('updateArticleBtn');
						const existingAddBtn = document.getElementById('addArticleBtn');

						if (existingUpdateBtn) {
							addArticleForm.removeChild(existingUpdateBtn);
						} else if (!existingAddBtn) {
							const addBtn = document.createElement('button');
							addBtn.id = 'addArticleBtn';
							addBtn.textContent = 'Add Article';
							addArticleForm.appendChild(addBtn);
						}
						const updateBtn = document.createElement('button');
						updateBtn.id = 'updateArticleBtn';
						updateBtn.textContent = 'Update Article';
						addArticleForm.appendChild(updateBtn);

						updateBtn.addEventListener('click', (event) => {
							event.preventDefault();
							const title = document.getElementById('title').value;
							const content = quill.root.innerHTML;
							const updatedArticle = {
								title: title,
								content: content,
								createdAt: article.createdAt // Retain original creation date
							};

							updateArticle(article, updatedArticle);

							addArticleForm.reset();
							quill.root.innerHTML = '';

							addArticleForm.removeChild(updateBtn);

							const addBtn = document.createElement('button');
							addBtn.id = 'addArticleBtn';
							addBtn.textContent = 'Add Article';
							addArticleForm.appendChild(addBtn);

							selectedArticle = null;

							displayArticles();
						});
					});
				});
			} else {
				const noArticleDiv = document.createElement('div');
				noArticleDiv.innerHTML = '<p>No articles found for this day.</p>';
				articleListDiv.appendChild(noArticleDiv);
			}

			articlesContainer.appendChild(articleListDiv);
		}
	}

    function displayArticles() {
		articlesContainer.innerHTML = '';
		const articles = JSON.parse(localStorage.getItem('wikiArticles')) || [];

		articles.forEach(article => {
			const createdAt = new Date(article.createdAt);
			const year = createdAt.getFullYear();
			const month = createdAt.getMonth() + 1;
			const day = createdAt.getDate();

			if (!archive[year]) {
				archive[year] = {};
			}
			if (!archive[year][month]) {
				archive[year][month] = {};
			}
			if (!archive[year][month][day]) {
				archive[year][month][day] = [];
			}

			archive[year][month][day].push(article);
		});

        for (const year in archive) {
            const yearNode = document.createElement('div');
            yearNode.innerHTML = `<h3>${year}</h3>`;
            yearNode.classList.add('year-node');
            yearNode.dataset.year = year;
            yearNode.addEventListener('click', () => toggleMonths(year));
            articlesContainer.appendChild(yearNode);
        }
    }

    displayArticles();

    // Check if an article is selected to hide/show the "Add" button
    articles.addEventListener('click', function () {
        if (selectedArticle) {
            addArticleForm.removeChild(document.getElementById('addArticleBtn'));
            selectedArticle = null; // Deselect the article
        }
    });
});