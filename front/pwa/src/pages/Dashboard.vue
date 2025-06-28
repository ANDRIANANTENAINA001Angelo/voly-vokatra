<template>
  <div class="dashboard-container">
    <header>
      <h1>Bienvenue {{ user.name || 'Utilisateur' }} 🌾</h1>
      <button @click="logout">Se déconnecter</button>
    </header>

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

      <section>
        <h2>☁️ Prévisions météo</h2>
        <div v-if="forecast">
            <ul>
                <li>📅 Date : {{ formatDate(forecast.date) }}</li>
                <li>🌧️ Pluie : {{ forecast.rain }} mm</li>
                <li>🌡️ Température : {{ forecast.temperature }}°C</li>
                <li>💧 Humidité : {{ forecast.humidity }}%</li>
                <li>💨 Vent : {{ forecast.wind_speed }} km/h</li>
            </ul>
    </div>
      </section>

      <section>
        <h2>⚠️ Alertes</h2>
        <ul>
          <li v-for="alert in alerts" :key="alert._id">
            {{ alert.type }} – {{ alert.description }}
          </li>
        </ul>
      </section>

      <section>
        <h2>✅ Recommandations</h2>
        <ul>
          <li v-for="rec in recommendations" :key="rec._id">
            {{ rec.message || rec }}
          </li>
        </ul>
      </section>

      <section>
        <h2>🔔 Notifications</h2>
        <ul>
          <li v-for="note in notifications" :key="note._id">
            {{ note.message }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {},
      alerts: [],
      forecast: {},
      recommendations: [],
      notifications: [],
      village:"",
      cultures:[], 
      loading: true
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/info');
      const data = response.data;
      console.log("info data: ",data);
      

      this.user = data.user_info;
      this.alerts = data.alerts || [];
      this.forecast = data.forecast || {};
      this.recommendations = data.recommendations || [];
      this.notifications = data.notifications || [];
      this.village = data.village || "Village non trouvé";
      this.cultures = data.cultures || [];
    } catch (err) {
      console.error('Erreur lors du chargement du tableau de bord :', err);
    //   this.$router.push('/auth');
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.post('/auth/logout');
      } catch (e) {
        console.warn("Erreur pendant le logout (ignorée) :", e);
      }
      localStorage.removeItem('auth');
      this.$router.push('/');
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('fr-FR', options);
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
</style>
