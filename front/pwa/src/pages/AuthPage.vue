<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

    <form @submit.prevent="submitForm">
      <!-- Nom uniquement en inscription -->
      <div class="form-group" v-if="!isLogin">
        <label for="name">Nom</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>

      <!-- Mot de passe -->
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>

      <!-- Village + Cultures uniquement en inscription -->
      <div v-if="!isLogin">
        <div class="form-group">
          <label>Choisir votre village :</label>
          <select v-model="form.location_id" required>
            <option disabled value="">Sélectionnez un village</option>
            <option v-for="village in villages" :key="village._id" :value="village._id">
              {{ village.name }} ({{ village.region_id?.name || 'Région inconnue' }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Choisir vos cultures :</label>
          <select v-model="form.culture_ids" multiple required>
            <option v-for="culture in cultures" :key="culture._id" :value="culture._id">
              {{ culture.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Bouton + lien -->
      <div class="form-actions">
        <button type="submit">{{ isLogin ? 'Se connecter' : 'S’inscrire' }}</button>
        <p class="toggle-link" @click="isLogin = !isLogin">
          {{ isLogin ? "Pas encore de compte ? S’inscrire" : "Déjà inscrit ? Se connecter" }}
        </p>
      </div>

      <!-- Erreur -->
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>


<script>
import axios from '../plugins/axios';

export default {
  name: 'AuthPage',
  data() {
    return {
      isLogin: true,
      form: {
        name: '',
        email: '',
        password: '',
        location_id: '',
        culture_ids: []
        },
      error: ''
    };
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    async submitForm() {
    // console.log("submit called");

    this.error = '';
    try {
        const url = this.isLogin ? '/login' : '/register';
        // console.log("url: ", url);

        const payload = this.isLogin
        ? { email: this.form.email, password: this.form.password }
        : {
            name: this.form.name,
            email: this.form.email,
            password: this.form.password,
            location_id: this.form.location_id,
            culture_ids: this.form.culture_ids
            };

        // console.log('🔹 Avant appel axios');

        const response = await axios.post(url, payload); // ici, plus de try/catch imbriqué
        console.log("✅ Axios response:", response.data);

        const { token } = response.data;
        console.log("token: ", token);

        localStorage.setItem('token', token);
        this.$router.push('/dashboard');
    } catch (err) {
        console.error("❌ Erreur dans submitForm:", err);
        this.error = err.response?.data?.error || 'Une erreur est survenue';
    }
    },
    async loadInitialData() {
    try {
        const villagesRes = await axios.get('/localisation/villages');
        this.villages = villagesRes.data;

        const culturesRes = await axios.get('/cultures');
        this.cultures = culturesRes.data;
    } catch (e) {
        console.error("Erreur lors du chargement des listes:", e);
    }
    },

  }
};
</script>

<style scoped>
.auth-container {
  max-width: 420px;
  margin: 3rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: #f9f9f9;
}

select:focus,
input:focus {
  border-color: #38a169;
  outline: none;
  background-color: #fff;
}

select[multiple] {
  height: auto;
  min-height: 100px;
}

.form-actions {
  margin-top: 1.5rem;
  text-align: center;
}

button {
  background-color: #38a169;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #2f855a;
}

.toggle-link {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
