<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="welcome-title">
          <span class="welcome-icon">👋</span>
          Bienvenue {{ user.name || 'Utilisateur' }}
        </h1>
        <div class="header-actions">
          <button v-if="isOnline" @click="refreshDashboard" class="action-btn refresh-btn">
            <span class="btn-icon">🔄</span>
            Actualiser
          </button>
          <router-link to="/profil">
            <button class="action-btn profile-btn">
              <span class="btn-icon">👤</span>
              Mon profil
            </button>
          </router-link>
          <button @click="logout" class="action-btn logout-btn">
            <span class="btn-icon">🚪</span>
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div v-if="!isOnline" class="offline-alert">
      <span class="alert-icon">⚠️</span>
      <span>Vous êtes hors ligne. Certaines données peuvent ne pas être à jour.</span>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else class="dashboard-content">
      <div class="dashboard-grid">
        <!-- Localisation -->
        <section class="dashboard-card location-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📍</span>
              Localisation
            </h2>
          </div>
          <div class="card-content">
            <div class="location-info">
              <div class="info-item">
                <span class="info-label">Village :</span>
                <span class="info-value">{{ village.name || 'Non précisé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Région :</span>
                <span class="info-value">{{ village.region_id.name || 'Non précisé' }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Cultures -->
        <section class="dashboard-card cultures-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🌱</span>
              Mes Cultures
            </h2>
          </div>
          <div class="card-content">
            <div class="cultures-grid">
              <div v-for="culture in cultures" :key="culture" class="culture-tag">
                <span class="culture-icon">🌾</span>
                {{ culture.name }}
              </div>
            </div>
          </div>
        </section>

        <!-- Calendrier -->
        <section class="dashboard-card calendar-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">📅</span>
              Saisons agricoles
            </h2>
          </div>
          <div class="card-content">
            <div v-if="calendar.length" class="calendar-list">
              <div v-for="(item, index) in calendar" :key="index" class="calendar-item">
                <div class="calendar-culture">
                  <span class="culture-name">{{ item.culture_id.name }}</span>
                </div>
                <div class="calendar-periods">
                  <div class="period planting">
                    <span class="period-icon">🌱</span>
                    <div class="period-info">
                      <span class="period-label">Plantation</span>
                      <span class="period-dates">{{ formatDate(item.plant_start) }} → {{ formatDate(item.plant_end) }}</span>
                    </div>
                  </div>
                  <div class="period harvest">
                    <span class="period-icon">🌾</span>
                    <div class="period-info">
                      <span class="period-label">Récolte</span>
                      <span class="period-dates">{{ formatDate(item.harvest_start) }} → {{ formatDate(item.harvest_end) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">📭</span>
              <p>Aucun calendrier trouvé pour votre région.</p>
            </div>
          </div>
        </section>

        <!-- Prévisions météo -->
        <section class="dashboard-card forecast-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🌤️</span>
              Prévisions météo
            </h2>
          </div>
          <div class="card-content">
            <div class="forecast-controls">
              <label class="date-label">
                <span class="label-icon">📅</span>
                Choisir une date :
              </label>
              <input 
                type="date" 
                v-model="selectedDate" 
                @change="fetchForecastByDate" 
                :disabled="!isOnline"
                class="date-input"
              />
            </div>

            <div class="forecast-nav" v-if="forecastHistory.length">
              <button 
                v-for="(item, index) in forecastHistory" 
                :key="index" 
                @click="currentForecast = item" 
                :class="['nav-btn', { active: currentForecast.date === item.date }]"
              >
                {{ formatDate(item.date) }}
              </button>
            </div>

            <div v-if="currentForecast" class="forecast-details">
              <div class="forecast-header">
                <h4 class="forecast-date">{{ formatDate(currentForecast.date) }}</h4>
              </div>
              <div class="weather-grid">
                <div class="weather-item rain">
                  <span class="weather-icon">🌧️</span>
                  <div class="weather-info">
                    <span class="weather-label">Pluie</span>
                    <span class="weather-value">{{ currentForecast.rain }} mm</span>
                  </div>
                </div>
                <div class="weather-item temperature">
                  <span class="weather-icon">🌡️</span>
                  <div class="weather-info">
                    <span class="weather-label">Température</span>
                    <span class="weather-value">{{ currentForecast.temperature }} °C</span>
                  </div>
                </div>
                <div class="weather-item humidity">
                  <span class="weather-icon">💧</span>
                  <div class="weather-info">
                    <span class="weather-label">Humidité</span>
                    <span class="weather-value">{{ currentForecast.humidity }} %</span>
                  </div>
                </div>
                <div class="weather-item wind">
                  <span class="weather-icon">💨</span>
                  <div class="weather-info">
                    <span class="weather-label">Vent</span>
                    <span class="weather-value">{{ currentForecast.wind_speed }} km/h</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">⏳</span>
              <p>Aucune donnée météo disponible pour cette date.</p>
            </div>
          </div>
        </section>

        <!-- Alertes -->
        <section class="dashboard-card alerts-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">⚠️</span>
              Alertes
            </h2>
          </div>
          <div class="card-content">
            <div v-if="alerts.length" class="alerts-list">
              <div class="alert-item" v-for="alert in alerts" :key="alert._id">
                <div class="alert-header">
                  <span class="alert-icon">⚠️</span>
                  <h4 class="alert-type">{{ alert.type }}</h4>
                </div>
                <p class="alert-description">{{ alert.description }}</p>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">✅</span>
              <p>Aucune alerte active</p>
            </div>
          </div>
        </section>

        <!-- Recommandations -->
        <section class="dashboard-card recommendations-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">✅</span>
              Recommandations
            </h2>
          </div>
          <div class="card-content">
            <div v-if="recommendations.length" class="recommendations-list">
              <div class="recommendation-item" v-for="rec in recommendations" :key="rec._id">
                <span class="recommendation-icon">🌿</span>
                <p class="recommendation-text">{{ rec.message || rec }}</p>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">💡</span>
              <p>Aucune recommandation disponible</p>
            </div>
          </div>
        </section>

        <!-- Notifications -->
        <section class="dashboard-card notifications-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🔔</span>
              Notifications
            </h2>
          </div>
          <div class="card-content">
            <div v-if="notifications.length" class="notifications-list">
              <div class="notification-item" v-for="note in notifications" :key="note._id">
                <span class="notification-icon">🔔</span>
                <p class="notification-text">{{ note.message }}</p>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">📭</span>
              <p>Aucune notification</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../plugins/axios';
import { openDB } from 'idb';

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {},
      calendar: [],
      alerts: [],
      forecast: {},
      recommendations: [],
      notifications: [],
      village: "",
      cultures: [],
      loading: true,
      forecastHistory: [],
      currentForecast: null,
      selectedDate: '',
      userInfo: null,
      isOnline: navigator.onLine,
    };
  },
  async mounted() {
    // 🔌 Gestion en ligne / hors ligne
    window.addEventListener('online', () => { this.isOnline = true });
    window.addEventListener('offline', () => { this.isOnline = false });

    // 🧠 Chargement des caches
    await this.loadFromCache();

    // 🌐 Si en ligne et les données sont incomplètes, on appelle l’API
    if (this.isOnline && (!this.userInfo || !this.userInfo.village || !this.userInfo.cultures?.length)) {
      await this.fetchAndCacheAll();
    }

    this.loading = false;

    // 🌦️ Charger la météo du jour (si forecastHistory est vide)
    const today = new Date().toISOString().slice(0, 10);
    if (!this.forecastHistory.find(f => f.date === today)) {
      await this.fetchForecast(today);
    }
  },

  methods: {
    // 📦 Chargement des données depuis IndexedDB + localStorage
    async loadFromCache() {
      try {
        const db = await openDB('agri-db', 1, {
          upgrade(db) {
            db.createObjectStore('userinfo');
          }
        });
        const info = await db.get('userinfo', 'data');
        if (info) {
          this.userInfo = info;
          this.user = info.user_info;
          this.alerts = info.alerts || [];
          this.forecast = info.forecast || {};
          this.recommendations = info.recommendations || [];
          this.notifications = info.notifications || [];
          this.village = info.village || {};
          this.cultures = info.cultures || [];
        }

        const forecastStr = localStorage.getItem('forecastHistory');
        if (forecastStr) {
          this.forecastHistory = JSON.parse(forecastStr);
          this.currentForecast = this.forecastHistory[this.forecastHistory.length - 1];
        }

        const calendarStr = localStorage.getItem('calendar');
        if (calendarStr) {
          this.calendar = JSON.parse(calendarStr);
        }
      } catch (err) {
        console.error('❌ Erreur chargement cache local', err);
      }
    },

    // 🔄 Appel /info et stockage dans IndexedDB
    async fetchAndCacheAll() {
      try {
        const res = await axios.get('/info');
        const data = res.data;
        this.userInfo = data;
        this.user = data.user_info;
        this.alerts = data.alerts || [];
        this.forecast = data.forecast || {};
        this.recommendations = data.recommendations || [];
        this.notifications = data.notifications || [];
        this.village = data.village || {};
        this.cultures = data.cultures || [];

        // Calendar
        const region_id = data.village.region_id._id;
        const calendarRes = await axios.get(`/cultures/calendar/${region_id}`);
        this.calendar = calendarRes.data;
        localStorage.setItem('calendar', JSON.stringify(this.calendar));

        // Cache userInfo
        const db = await openDB('agri-db', 1);
        await db.put('userinfo', data, 'data');
      } catch (err) {
        console.error("❌ Erreur lors de l'appel API info", err);
      }
    },

    async logout() {
        try {
            await axios.post('/auth/logout');
        } catch (e) {
            console.warn("Erreur pendant le logout (ignorée) :", e);
        }

        // 🧹 Nettoyage des données locales
        localStorage.removeItem('auth');
        localStorage.removeItem('forecastHistory');
        localStorage.removeItem('calendar');

        try {
            const { openDB } = await import('idb');
            const db = await openDB('agri-db', 1);
            await db.delete('userinfo', 'data');
            console.log('🧽 Cache user supprimé');
        } catch (e) {
            console.warn('⚠️ Impossible de nettoyer le cache IndexedDB', e);
        }

        // 🔄 Redirection
        this.$router.push('/');
    },

    // 📆 Sélection date manuelle
    async fetchForecastByDate() {
      if (!this.selectedDate) return;
      await this.fetchForecast(this.selectedDate);
    },

    // 🌤️ Appel d’une prévision météo
    async fetchForecast(dateStr) {
      try {
        const loc_id = this.userInfo.village._id;
        const response = await axios.get(`/meteo/forecast?location_id=${loc_id}&date=${dateStr}`);
        const forecast = response.data;

        if (!this.forecastHistory.find(f => f.date === forecast.date)) {
          this.forecastHistory.push(forecast);
          localStorage.setItem('forecastHistory', JSON.stringify(this.forecastHistory));
        }

        this.currentForecast = forecast;
      } catch (err) {
        console.error("❌ Erreur récupération météo", err);

        const fallback = this.forecastHistory.find(f => f.date === dateStr);
        this.currentForecast = fallback || null;
      }
    },

    // 📅 Format propre
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async refreshDashboard() {
        this.loading = true;
        // localStorage.removeItem('forecastHistory');

        // ⚠️ IndexedDB est asynchrone, on doit bien le vider aussi
        try {
            const db = await openDB('agri-db', 1);
            await db.clear('userinfo');
        } catch (e) {
            console.warn('Impossible de vider IndexedDB :', e);
        }

        await this.loadDashboardData(true);
        this.loading = false;
    },
    async loadDashboardData(isRefresh=false) {
        if(isRefresh){
            await this.fetchAndCacheAll();
        }
        else{
            
            await this.loadFromCache();
    
            if (this.isOnline && (!this.userInfo || !this.userInfo.village || !this.userInfo.cultures?.length)) {
                await this.fetchAndCacheAll();
            }
    
            const today = new Date().toISOString().slice(0, 10);
            if (!this.forecastHistory.find(f => f.date === today)) {
                await this.fetchForecast(today);
            }
        }
    }
  }
};
</script>


<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  margin-bottom: 2rem;
  overflow: hidden;
}

.header-content {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-title {
  color: var(--primary-green);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome-icon {
  font-size: 2rem;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.refresh-btn {
  background: var(--sky-blue);
  color: white;
}

.profile-btn {
  background: var(--secondary-green);
  color: white;
}

.logout-btn {
  background: var(--error-red);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-light);
}

.offline-alert {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 4px solid var(--warning-orange);
  font-weight: 500;
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--light-gray);
  border-top: 4px solid var(--secondary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  overflow: hidden;
  transition: var(--transition);
}

.dashboard-card:hover {
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, var(--light-gray), #f8f9fa);
  padding: 1.5rem;
  border-bottom: 1px solid var(--medium-gray);
}

.card-title {
  color: var(--primary-green);
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.card-icon {
  font-size: 1.5rem;
}

.card-content {
  padding: 1.5rem;
}

/* Localisation Card */
.location-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--light-gray);
  border-radius: 8px;
}

.info-label {
  font-weight: 600;
  color: var(--dark-gray);
}

.info-value {
  color: var(--primary-green);
  font-weight: 700;
}

/* Cultures Card */
.cultures-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.culture-tag {
  background: linear-gradient(135deg, var(--light-green), var(--secondary-green));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Calendar Card */
.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calendar-item {
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-culture {
  background: var(--primary-green);
  color: white;
  padding: 1rem;
  font-weight: 700;
}

.calendar-periods {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.period {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
}

.period.planting {
  background: rgba(143, 188, 143, 0.1);
}

.period.harvest {
  background: rgba(218, 165, 32, 0.1);
}

.period-icon {
  font-size: 1.5rem;
}

.period-info {
  display: flex;
  flex-direction: column;
}

.period-label {
  font-weight: 600;
  color: var(--primary-green);
}

.period-dates {
  color: var(--dark-gray);
  font-size: 0.9rem;
}

/* Forecast Card */
.forecast-controls {
  margin-bottom: 1.5rem;
}

.date-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--primary-green);
  margin-bottom: 0.5rem;
}

.date-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
}

.date-input:focus {
  outline: none;
  border-color: var(--secondary-green);
}

.forecast-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--medium-gray);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
}

.nav-btn:hover {
  border-color: var(--secondary-green);
}

.nav-btn.active {
  background: var(--secondary-green);
  color: white;
  border-color: var(--secondary-green);
}

.forecast-details {
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  overflow: hidden;
}

.forecast-header {
  background: var(--sky-blue);
  color: white;
  padding: 1rem;
  text-align: center;
}

.forecast-date {
  margin: 0;
  font-size: 1.2rem;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1px;
  background: var(--medium-gray);
}

.weather-item {
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.weather-icon {
  font-size: 1.5rem;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-label {
  font-size: 0.8rem;
  color: var(--dark-gray);
  font-weight: 500;
}

.weather-value {
  font-weight: 700;
  color: var(--primary-green);
}

/* Alerts, Recommendations, Notifications */
.alerts-list,
.recommendations-list,
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 1rem;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.alert-type {
  color: var(--error-red);
  margin: 0;
  font-size: 1.1rem;
}

.alert-description {
  color: var(--dark-gray);
  margin: 0;
}

.recommendation-item,
.notification-item {
  background: var(--light-gray);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.recommendation-icon,
.notification-icon {
  font-size: 1.2rem;
  margin-top: 0.1rem;
}

.recommendation-text,
.notification-text {
  margin: 0;
  color: var(--dark-gray);
  line-height: 1.5;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--dark-gray);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .weather-grid {
    grid-template-columns: 1fr;
  }
  
  .calendar-periods {
    gap: 0.75rem;
  }
  
  .period {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
