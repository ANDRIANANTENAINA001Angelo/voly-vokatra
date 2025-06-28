<template>
  <div class="dashboard-container">
    <header>
      <h1>Bienvenue {{ user.name || 'Utilisateur' }} 🌾</h1>
      <router-link to="/profil"><button>👤 Mon profil</button></router-link>
      <button @click="logout">Se déconnecter</button>
    </header>
    <div v-if="!isOnline" class="offline-alert">
    ⚠️ Vous êtes hors ligne. Certaines données peuvent ne pas être à jour.
    </div>



    <div v-if="loading">Chargement des données...</div>
    <div v-else>
      <section>
        <h2>📍 Localisation</h2>
        <p>Village : {{ village.name || 'Non précisé' }}</p>
        <p>Région : {{ village.region_id.name || 'Non précisé' }}</p>
      </section>

      <section>
        <h2>🌱 Cultures</h2>
        <ul>
          <li v-for="culture in cultures" :key="culture">{{ culture.name }}</li>
        </ul>
      </section>

      <section class="calendar-section">
        <h3>📅 Saisons agricoles</h3>
        <div v-if="calendar.length">
          <div v-for="(item, index) in calendar" :key="index" class="calendar-item">
            <strong>{{ item.culture_id.name }}</strong>
            <p>
              🌱 Plantation : {{ formatDate(item.plant_start) }} → {{ formatDate(item.plant_end) }}<br />
              🌾 Récolte : {{ formatDate(item.harvest_start) }} → {{ formatDate(item.harvest_end) }}
            </p>
          </div>
        </div>
        <p v-else>📭 Aucun calendrier trouvé pour votre région.</p>
      </section>

      <section class="forecast-section">
        <h3>🌤️ Prévisions météo</h3>
        <label>📅 Choisir une date :</label>
        <input type="date" v-model="selectedDate" @change="fetchForecastByDate" />
        <div class="forecast-nav">
          <button v-for="(item, index) in forecastHistory" :key="index" @click="currentForecast = item" :class="{ active: currentForecast.date === item.date }">
            {{ formatDate(item.date) }}
          </button>
        </div>
        <div v-if="currentForecast" class="forecast-card">
          <p><strong>📆 Date :</strong> {{ formatDate(currentForecast.date) }}</p>
          <p>🌧️ Pluie : {{ currentForecast.rain }} mm</p>
          <p>🌡️ Température : {{ currentForecast.temperature }} °C</p>
          <p>💧 Humidité : {{ currentForecast.humidity }} %</p>
          <p>💨 Vent : {{ currentForecast.wind_speed }} km/h</p>
        </div>
        <p v-else>⏳ Aucune donnée météo disponible pour cette date.</p>
      </section>

      <section>
        <h2>⚠️ Alertes</h2>
        <div class="alert-card" v-for="alert in alerts" :key="alert._id">
        <h4>⚠️ {{ alert.type }}</h4>
        <p>{{ alert.description }}</p>
        </div>

      </section>

      <section>
        <h2>✅ Recommandations</h2>
        <div class="recommendation-card" v-for="rec in recommendations" :key="rec._id">
        <p>🌿 {{ rec.message || rec }}</p>
        </div>
      </section>

      <section>
        <h2>🔔 Notifications</h2>
        <div class="notification-card" v-for="note in notifications" :key="note._id">
        🔔 {{ note.message }}
        </div>
      </section>
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
      localStorage.removeItem('auth');
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
    }
  }
};
</script>


<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

button {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #c53030;
}

section {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.calendar-section {
  margin-top: 2rem;
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
}

.calendar-item {
  border-left: 4px solid #38a169;
  background-color: #ffffff;
  padding: 0.8rem 1rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.forecast-section {
  margin-top: 2rem;
  background-color: #f0f4f8;
  padding: 1rem;
  border-radius: 10px;
}

.forecast-card {
  background: white;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
}

.forecast-nav {
  margin-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.forecast-nav button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #e2e8f0;
  cursor: pointer;
}

.forecast-nav button.active {
  background-color: #3182ce;
  color: white;
}

.alert-card {
  background-color: #fff5f5;
  border-left: 5px solid #e53e3e;
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-radius: 6px;
}

.recommendation-card {
  background-color: #f0fff4;
  border-left: 4px solid #38a169;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-style: italic;
}

.notification-card {
  background-color: #ebf8ff;
  border-left: 4px solid #3182ce;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
}

.offline-alert {
  background-color: #fff3cd;
  padding: 10px;
  color: #856404;
  text-align: center;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  margin-bottom: 1rem;
}


</style>
