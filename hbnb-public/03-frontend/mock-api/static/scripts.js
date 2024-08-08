/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await loginUser(email, password);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('error-message').textContent = 'An error occurred during login.';
                document.getElementById('error-message').style.display = 'block';
            }
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Network or server error');
    }
}






document.addEventListener('DOMContentLoaded', async () => {
    const loginLink = document.getElementById('login-link');
    const token = getCookie('token');

    if (token) {
        loginLink.style.display = 'none';
    }

    try {
        const places = await fetchPlaces(token);
        populatePlacesList(places);

        const countryFilter = document.getElementById('country-filter');
        countryFilter.addEventListener('change', () => filterPlaces(places));
    } catch (error) {
        console.error('Error fetching places:', error);
    }

    if (window.location.pathname.includes('place.html')) {
        const placeId = getPlaceIdFromUrl();
        try {
            const place = await fetchPlaceDetails(placeId, token);
            populatePlaceDetails(place);
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
    const response = await fetch('/places', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch places');
    }
}

function populatePlacesList(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';

        placeCard.innerHTML = `
            <div class="place-info">
                <div class="place-name">${place.id}</div>
                <div class="place-price">Price per night: $${place.price_per_night}</div>
                <div class="place-location">Location: ${place.city_name}, ${place.country_name}</div>
                <a href="/places/${place.id}" class="details-button">View Details</a>
            </div>
        `;

        placesList.appendChild(placeCard);
    });
}

function filterPlaces(places) {
    const selectedCountry = document.getElementById('country-filter').value;
    const placesList = document.getElementById('places-list');

    placesList.childNodes.forEach((placeCard, index) => {
        const place = places[index];
        const placeCountry = place.location.toLowerCase();

        if (selectedCountry === 'all' || placeCountry.includes(selectedCountry)) {
            placeCard.style.display = '';
        } else {
            placeCard.style.display = 'none';
        }
    });
}

function getPlaceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id');
}

async function fetchPlaceDetails(placeId, token) {
    const response = await fetch(`/places/${placeId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch place details');
    }
}

function populatePlaceDetails(place) {
    document.querySelector('.place-info h1').textContent = place.name;
    document.querySelector('.place-info .Price').textContent = `$${place.price} per night`;
    document.querySelector('.place-info .Location').textContent = `${place.city}, ${place.country}`;
    document.querySelector('.place-info .Description').textContent = place.description;
    document.querySelector('.place-info .Amenities').textContent = place.amenities.join(', ');
    document.querySelector('.place-image-large').src = place.image_url;
}



document.getElementById('country-filter').addEventListener('change', function() {
    const selectedCountry = this.value;
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const cardCountry = card.getAttribute('data-country');

        if (selectedCountry === 'all' || cardCountry === selectedCountry) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
