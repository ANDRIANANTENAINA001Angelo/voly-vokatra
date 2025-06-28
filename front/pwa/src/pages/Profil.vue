<template>
  <div class="profile-container">
    <h2>👤 Mon Profil</h2>

    <div v-if="loading">⏳ Chargement du profil...</div>
    <form v-else @submit.prevent="updateProfile">
      <div class="form-group">
        <label>Nom</label>
        <input type="text" v-model="form.name" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="form.email" disabled />
      </div>

      <div class="form-group">
        <label>🏡 Village</label>
        <select v-model="form.location_ids" required>
          <option disabled value="">Choisir un village</option>
          <option v-for="v in villages" :key="v._id" :value="v._id">
            {{ v.name }} ({{ v.region_id?.name || 'Région inconnue' }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>🌱 Cultures</label>
        <select v-model="form.culture_ids" multiple required>
          <option v-for="c in cultures" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <button type="submit" :disabled="submitting">💾 Enregistrer</button>

      <p class="message" :class="{ success: success, error: error }" v-if="message">
        {{ message }}
      </p>
    </form>
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
      submitting: false
    };
  },
  async mounted() {
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
      this.message = "❌ Erreur de chargement du profil.";
      this.error = true;
    } finally {
      this.loading = false;
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
  max-width: 500px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.3rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button {
  background-color: #3182ce;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #2c5282;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
