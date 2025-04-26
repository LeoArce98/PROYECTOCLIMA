
// Archivo principal de JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Usar la API key desde el archivo de configuración
    const apiKey = config.apiKey;
    
    // Inicialización de la aplicación
    console.log('ClimApp inicializada');
    
    // Elementos del DOM
    const refreshButton = document.querySelector('.weather-card__refresh');
    const searchInput = document.querySelector('.location__input');
    const searchButton = document.querySelector('.location__button');
    const locationList = document.querySelector('.location-list');
    const forecastContainer = document.querySelector('.forecast__container');
    const mapLayerSelect = document.querySelector('.map-controls__select');
    const historicalTabs = document.querySelectorAll('.historical__tab');
    
    // Datos de la ubicación actual
    let currentCity = 'Madrid';
    let currentCountry = 'España';
    
    // Función para obtener datos del clima actual
    async function getWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Error al obtener datos del clima');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    
    // Función para obtener pronóstico de 5 días
    async function getForecastData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Error al obtener pronóstico');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    
    // Función para obtener datos históricos
    async function getHistoricalData(city, type) {
        // En una aplicación real, esto requeriría una API que proporcione datos históricos
        console.log(`Obteniendo datos históricos de ${type} para ${city}`);
        // Simulación de datos para demostración
        return {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            data: [10, 12, 15, 18, 22, 26, 28, 29, 25, 20, 15, 12]
        };
    }
    
    // Función para actualizar la UI con datos del clima actual
    function updateWeatherUI(data) {
        if (!data) return;
        
        // Actualizar información principal
        document.querySelector('.weather-card__title').textContent = `${data.name}, ${data.sys.country}`;
        
        // Fecha actual formateada
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.querySelector('.weather-card__subtitle').textContent = now.toLocaleDateString('es-ES', options);
        
        // Última actualización
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.weather-card__update p').textContent = `Última actualización: ${hours}:${minutes}`;
        
        // Temperatura actual
        document.querySelector('.weather-card__temp').textContent = `${Math.round(data.main.temp)}°C`;
        
        // Icono del clima (simplificado)
        const weatherIconClass = getWeatherIconClass(data.weather[0].id);
        const weatherIcon = document.querySelector('.weather-card__icon');
        // Eliminar clases de icono anteriores
        weatherIcon.className = 'weather-card__icon';
        weatherIcon.classList.add(weatherIconClass);
        
        // Detalles del clima
        document.querySelector('.weather-detail:nth-child(1) .weather-detail__value').textContent = 
            `${Math.round(data.main.temp_max)}°C / ${Math.round(data.main.temp_min)}°C`;
        document.querySelector('.weather-detail:nth-child(2) .weather-detail__value').textContent = 
            `${data.main.humidity}%`;
        document.querySelector('.weather-detail:nth-child(3) .weather-detail__value').textContent = 
            `${Math.round(data.wind.speed * 3.6)} km/h`; // Convertir m/s a km/h
        document.querySelector('.weather-detail:nth-child(4) .weather-detail__value').textContent = 
            `${data.main.pressure} hPa`;
    }
    
    // Función para actualizar el pronóstico de 5 días
    function updateForecastUI(data) {
        if (!data || !data.list) return;
        
        // Limpiar contenedor de pronóstico
        forecastContainer.innerHTML = '';
        
        // Obtener datos para cada día (cada 24h)
        const dailyData = [];
        const processedDays = new Set();
        
        for (const item of data.list) {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('es-ES', { weekday: 'long' });
            
            // Solo tomar un registro por día
            if (!processedDays.has(day) && dailyData.length < 5) {
                processedDays.add(day);
                dailyData.push({
                    day: day,
                    icon: getWeatherIconClass(item.weather[0].id),
                    tempMax: Math.round(item.main.temp_max),
                    tempMin: Math.round(item.main.temp_min)
                });
            }
        }
        
        // Crear tarjetas de pronóstico
        dailyData.forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-card__day">${day.day}</div>
                <div class="forecast-card__icon ${day.icon}"></div>
                <div class="forecast-card__temp">
                    <span class="forecast-card__temp-max">${day.tempMax}°C</span>
                    <span class="forecast-card__temp-min">${day.tempMin}°C</span>
                </div>
            `;
            forecastContainer.appendChild(card);
        });
    }
    
    // Función para obtener la clase de icono basada en el código del clima
    function getWeatherIconClass(weatherCode) {
        // Códigos según la API de OpenWeatherMap
        if (weatherCode >= 200 && weatherCode < 300) {
            return 'icon-thunderstorm';
        } else if (weatherCode >= 300 && weatherCode < 400) {
            return 'icon-drizzle';
        } else if (weatherCode >= 500 && weatherCode < 600) {
            return 'icon-rainy';
        } else if (weatherCode >= 600 && weatherCode < 700) {
            return 'icon-snowy';
        } else if (weatherCode >= 700 && weatherCode < 800) {
            return 'icon-foggy';
        } else if (weatherCode === 800) {
            return 'icon-sunny';
        } else if (weatherCode > 800) {
            return 'icon-cloudy';
        }
        return 'icon-sunny'; // Valor predeterminado
    }
    
    // Función para inicializar el mapa del clima
    function initWeatherMap() {
        const mapContainer = document.getElementById('weatherMap');
        console.log('Inicializando mapa del clima');
        // Aquí iría la implementación real del mapa, posiblemente usando una biblioteca como Leaflet o Google Maps
        mapContainer.innerHTML = '<div style="background-color: #e0e0e0; height: 400px; display: flex; align-items: center; justify-content: center;">Mapa del clima cargando...</div>';
    }
    
    // Función para mostrar datos históricos
    function showHistoricalData(type) {
        getHistoricalData(currentCity, type).then(data => {
            const chartContainer = document.querySelector('.historical__chart');
            console.log(`Mostrando datos históricos de ${type}`);
            // Aquí iría la implementación real del gráfico, posiblemente usando una biblioteca como Chart.js
            chartContainer.innerHTML = `<div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center;">Gráfico de ${type}</div>`;
        });
    }
    
    // Función para buscar una ciudad
    function searchCity(cityName) {
        if (!cityName.trim()) return;
        
        getWeatherData(cityName).then(data => {
            if (data) {
                currentCity = data.name;
                currentCountry = data.sys.country;
                updateWeatherUI(data);
                
                // Actualizar pronóstico
                getForecastData(cityName).then(forecastData => {
                    updateForecastUI(forecastData);
                });
                
                // Actualizar datos históricos
                const activeTab = document.querySelector('.historical__tab--active');
                showHistoricalData(activeTab.textContent.toLowerCase());
                
                // Añadir a la lista de ubicaciones si no existe
                addToLocationList(data.name, data.sys.country);
            }
        });
    }
    
    // Función para añadir una ciudad a la lista de ubicaciones
    function addToLocationList(city, country) {
        // Comprobar si ya existe en la lista
        const existingItems = Array.from(locationList.querySelectorAll('.location-list__city'));
        if (existingItems.some(item => item.textContent === city)) {
            return;
        }
        
        // Crear nuevo elemento de lista
        const listItem = document.createElement('li');
        listItem.className = 'location-list__item';
        listItem.innerHTML = `
            <span class="location-list__icon icon-location"></span>
            <div class="location-list__text">
                <div class="location-list__city">${city}</div>
                <div class="location-list__country">${country}</div>
            </div>
        `;
        
        // Añadir evento de clic
        listItem.addEventListener('click', function() {
            // Remover clase activa de todos los elementos
            locationList.querySelectorAll('.location-list__item').forEach(item => {
                item.classList.remove('location-list__item--active');
            });
            // Añadir clase activa al elemento clicado
            this.classList.add('location-list__item--active');
            // Buscar la ciudad seleccionada
            searchCity(city);
        });
        
        // Añadir a la lista
        locationList.appendChild(listItem);
    }
    
    // Eventos y listeners
    
    // Botón de actualizar
    refreshButton.addEventListener('click', function() {
        searchCity(currentCity);
    });
    
    // Búsqueda de ciudad
    searchButton.addEventListener('click', function() {
        searchCity(searchInput.value);
    });
    
    // Búsqueda al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCity(this.value);
        }
    });
    
    // Cambio de capa del mapa
    mapLayerSelect.addEventListener('change', function() {
        console.log(`Cambiando capa del mapa a: ${this.value}`);
        // Aquí iría el código para cambiar la capa del mapa
    });
    
    // Pestañas de datos históricos
    historicalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase activa de todas las pestañas
            historicalTabs.forEach(t => t.classList.remove('historical__tab--active'));
            // Añadir clase activa a la pestaña clicada
            this.classList.add('historical__tab--active');
            // Mostrar datos históricos del tipo seleccionado
            showHistoricalData(this.textContent.toLowerCase());
        });
    });
    
    // Elementos de la lista de ubicaciones
    locationList.querySelectorAll('.location-list__item').forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase activa de todos los elementos
            locationList.querySelectorAll('.location-list__item').forEach(i => {
                i.classList.remove('location-list__item--active');
            });
            // Añadir clase activa al elemento clicado
            this.classList.add('location-list__item--active');
            // Buscar la ciudad seleccionada
            const city = this.querySelector('.location-list__city').textContent;
            searchCity(city);
        });
    });
    
    // Inicialización
    
    // Cargar datos iniciales
    searchCity(currentCity);
    
    // Inicializar mapa
    initWeatherMap();
});
