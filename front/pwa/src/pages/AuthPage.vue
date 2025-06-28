<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">
          <span class="auth-icon">{{ isLogin ? '🔐' : '🌱' }}</span>
          {{ isLogin ? 'Connexion' : 'Inscription' }}
        </h2>
        <p class="auth-subtitle">
          {{ isLogin ? 'Accédez à votre tableau de bord agricole' : 'Rejoignez la communauté agricole' }}
        </p>
      </div>

      <form @submit.prevent="submitForm" class="auth-form">
        <!-- Nom uniquement en inscription -->
        <div class="form-group" v-if="!isLogin">
          <label for="name" class="form-label">
            <span class="label-icon">👤</span>
            Nom complet
          </label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required 
            class="form-input"
            placeholder="Entrez votre nom complet"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-icon">📧</span>
            Adresse email
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            class="form-input"
            placeholder="exemple@email.com"
          />
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">🔒</span>
            Mot de passe
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            class="form-input"
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <!-- Village + Cultures uniquement en inscription -->
        <div v-if="!isLogin" class="registration-fields">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🏘️</span>
              Choisir votre village
            </label>
            <select v-model="form.location_id" required class="form-select">
              <option disabled value="">Sélectionnez un village</option>
              <option v-for="village in villages" :key="village._id" :value="village._id">
                {{ village.name }} ({{ village.region_id?.name || 'Région inconnue' }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🌾</span>
              Choisir vos cultures
            </label>
            <select v-model="form.culture_ids" multiple required class="form-select multiple">
              <option v-for="culture in cultures" :key="culture._id" :value="culture._id">
                {{ culture.name }}
              </option>
            </select>
            <small class="form-hint">Maintenez Ctrl/Cmd pour sélectionner plusieurs cultures</small>
          </div>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>

        <!-- Bouton + lien -->
        <div class="form-actions">
          <button type="submit" class="submit-btn">
            <span class="btn-icon">{{ isLogin ? '🚀' : '🌱' }}</span>
            {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
          </button>
          
          <p class="toggle-link" @click="isLogin = !isLogin">
            {{ isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter" }}
          </p>
        </div>
      </form>
    </div>
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
        const response = await axios.post(url, payload); 
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green), var(--secondary-green), var(--light-green));
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  color: var(--primary-green);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-icon {
  font-size: 2rem;
}

.auth-subtitle {
  color: var(--dark-gray);
  font-size: 0.95rem;
  opacity: 0.8;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--primary-green);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input,
.form-select {
  padding: 0.875rem 1rem;
  border: 2px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: var(--transition);
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--secondary-green);
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.form-select.multiple {
  min-height: 120px;
}

.form-hint {
  color: var(--dark-gray);
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.registration-fields {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--light-green);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background: #fee;
  color: var(--error-red);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--error-red);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.submit-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.2rem;
}

.toggle-link {
  text-align: center;
  color: var(--secondary-green);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  padding: 0.5rem;
  border-radius: 4px;
}

.toggle-link:hover {
  background: var(--light-gray);
  color: var(--primary-green);
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
