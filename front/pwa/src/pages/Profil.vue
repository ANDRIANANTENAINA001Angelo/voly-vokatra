<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h2 class="profile-title">
          <span class="profile-icon">👤</span>
          Mon Profil
        </h2>
        <p class="profile-subtitle">Gérez vos informations personnelles et préférences</p>
      </div>

      <div v-if="!isOnline" class="offline-alert">
        <span class="alert-icon">⚠️</span>
        <span>Vous êtes hors ligne. Certaines données peuvent ne pas être à jour.</span>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>⏳ Chargement du profil...</p>
      </div>

      <form v-else @submit.prevent="updateProfile" class="profile-form">
        <div class="form-section">
          <h3 class="section-title">
            <span class="section-icon">ℹ️</span>
            Informations personnelles
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">👤</span>
                Nom complet
              </label>
              <input 
                type="text" 
                v-model="form.name" 
                class="form-input"
                placeholder="Entrez votre nom complet"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📧</span>
                Adresse email
              </label>
              <input 
                type="email" 
                v-model="form.email" 
                disabled 
                class="form-input disabled"
                title="L'email ne peut pas être modifié"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <span class="section-icon">🌍</span>
            Localisation et cultures
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏡</span>
                Village
              </label>
              <select v-model="form.location_ids" required class="form-select">
                <option disabled value="">Choisir un village</option>
                <option v-for="v in villages" :key="v._id" :value="v._id">
                  {{ v.name }} ({{ v.region_id?.name || 'Région inconnue' }})
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <span class="label-icon">🌱</span>
                Cultures pratiquées
              </label>
              <select v-model="form.culture_ids" multiple required class="form-select multiple">
                <option v-for="c in cultures" :key="c._id" :value="c._id">
                  {{ c.name }}
                </option>
              </select>
              <small class="form-hint">
                <span class="hint-icon">💡</span>
                Maintenez Ctrl/Cmd pour sélectionner plusieurs cultures
              </small>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            :disabled="submitting || !isOnline" 
            class="submit-btn"
            :class="{ submitting: submitting }"
          >
            <span class="btn-icon">{{ submitting ? '⏳' : '💾' }}</span>
            {{ submitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>

        <div v-if="message" class="message-container">
          <div class="message" :class="{ success: success, error: error }">
            <span class="message-icon">{{ success ? '✅' : '❌' }}</span>
            {{ message }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../plugins/axios';

export default {
  name: 'Profil',
  data() {
    return {
      form: {
        name: '',
        email: '',
        location_ids: '',
        culture_ids: []
      },
      villages: [],
      cultures: [],
      message: '',
      success: false,
      error: false,
      loading: true,
      submitting: false,
      isOnline: navigator.onLine,

    };
  },
async mounted() {
    // 🔌 Gestion en ligne / hors ligne
    window.addEventListener('online', () => { this.isOnline = true });
    window.addEventListener('offline', () => { this.isOnline = false });
  
  if (this.isOnline) {
    try {
      const [me, v, c] = await Promise.all([
        axios.get('/auth/me'),
        axios.get('/localisation/villages'),
        axios.get('/cultures')
      ]);

      this.form = {
        name: me.data.name,
        email: me.data.email,
        location_ids: me.data.location_ids?.[0] || '',
        culture_ids: me.data.culture_ids || []
      };

      this.villages = v.data;
      this.cultures = c.data;
    } catch (err) {
      console.error(err);
      this.message = "❌ Erreur de chargement du profil.";
      this.error = true;
    } finally {
      this.loading = false;
    }
  } else {
    // 📴 Mode offline : charger depuis IndexedDB
    try {
      const { openDB } = await import('idb');
      const db = await openDB('agri-db', 1);
      const info = await db.get('userinfo', 'data');

      if (info) {
        this.form = {
          name: info.user_info.name,
          email: info.user_info.email,
          location_ids: info.user_info.location_ids?.[0] || '',
          culture_ids: info.user_info.culture_ids || []
        };
        this.villages = info.villages || [];
        this.cultures = info.cultures || [];
        this.message = '🕸️ Chargé depuis le cache local (hors ligne)';
        this.success = true;
      } else {
        this.message = "📭 Données indisponibles hors ligne.";
        this.error = true;
      }
    } catch (e) {
      console.error('❌ Erreur lecture cache', e);
      this.message = "📭 Échec récupération locale";
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
},
  methods: {
    async updateProfile() {
      this.submitting = true;
      this.message = '';
      this.success = false;
      this.error = false;

      try {
        await axios.patch('/auth/profile', this.form);
        this.message = '✅ Profil mis à jour avec succès !';
        this.success = true;

        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1000);
      } catch (err) {
        this.message = err.response?.data?.error || '❌ Échec de la mise à jour.';
        this.error = true;
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  position: relative;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green), var(--secondary-green), var(--light-green));
}

.profile-header {
  background: linear-gradient(135deg, var(--light-gray), #f8f9fa);
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid var(--medium-gray);
}

.profile-title {
  color: var(--primary-green);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.profile-icon {
  font-size: 2.5rem;
}

.profile-subtitle {
  color: var(--dark-gray);
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
}

.offline-alert {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--warning-orange);
  font-weight: 500;
}

.alert-icon {
  font-size: 1.2rem;
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--light-gray);
  border-top: 3px solid var(--secondary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  color: var(--primary-green);
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--light-green);
}

.section-icon {
  font-size: 1.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
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
  padding: 1rem;
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

.form-input.disabled {
  background: var(--light-gray);
  color: var(--dark-gray);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-select.multiple {
  min-height: 120px;
  resize: vertical;
}

.form-hint {
  color: var(--dark-gray);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.hint-icon {
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--medium-gray);
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
  min-width: 250px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.submitting {
  background: var(--dark-gray);
}

.btn-icon {
  font-size: 1.2rem;
}

.message-container {
  display: flex;
  justify-content: center;
}

.message {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 400px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: var(--success-green);
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: var(--error-red);
  border: 1px solid #f5c6cb;
}

.message-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-header {
    padding: 1.5rem;
  }
  
  .profile-title {
    font-size: 1.6rem;
  }
  
  .profile-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .submit-btn {
    min-width: auto;
    width: 100%;
  }
}
</style>
