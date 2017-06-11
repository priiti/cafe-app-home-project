const axios = require('axios');

const searchResultsToHtmlDocument = (cafes) => {
    return cafes.map(cafe => {
        return `
            <a href="/cafe/${cafe.slug}" class="search-cafe-result">
                <strong>${cafe.name}</strong>
            </a>
        `;
    }).join('');
};

const typeForSearch = (searchTerm) => {
    if (!searchTerm) return;
    
    const searchInput = searchTerm.querySelector('input[name="search"]');
    const searchResults = searchTerm.querySelector('.search-cafe-results');

    searchInput.addEventListener('input', function() {
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }

        window.addEventListener('click', () => {
            searchResults.style.display = 'none';
        });

        searchInput.addEventListener('click', e => {
            e.stopPropagation();
        });

        searchResults.style.display = 'block';
        searchResults.innerHTML = '';

        axios.get(`/api/v1/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = searchResultsToHtmlDocument(res.data);
                }
            })
            .catch(err => {
                console.error(error);
            });
    });

    searchInput.addEventListener('keyup', e => {
        if (![38, 40, 13].includes(e.keyCode)) { return; };
        
    })
};

export default typeForSearch;