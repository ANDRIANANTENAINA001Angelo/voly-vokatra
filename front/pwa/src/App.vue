<template>
  <div>
    <h1>Tableau de Bord</h1>
    <div>
      <h2>Météo à {{ location }}</h2>
      <p>Température : {{ weather.temp }}°C</p>
      <p>Précipitations : {{ weather.rain }} mm</p>
      <div v-if="weather.rain > 50" style="color: red;">
        <p>Alerte : Risque d'inondation !</p>
      </div>
    </div>
    <div>
      <h2>Saisons de Plantation</h2>
      <p>Culture : {{ crop }}</p>
      <p>Plantation : {{ season.plant }}</p>
      <p>Récolte : {{ season.harvest }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      location: 'Antananarivo', // Localisation par défaut à Madagascar
      weather: { temp: '', rain: '' },
      crop: 'rice', // Culture par défaut pertinente
      season: { plant: '', harvest: '' }
    };
  },
  async mounted() {
    const weatherResponse = await axios.get(`http://localhost:3000/weather?location=${this.location}`);
    this.weather = {
      temp: weatherResponse.data.main.temp,
      rain: weatherResponse.data.rain ? weatherResponse.data.rain['1h'] : 0
    };

    const seasonResponse = await axios.get(`http://localhost:3000/agriculture/seasons?location=${this.location}&crop=${this.crop}`);
    this.season = seasonResponse.data.season;
  }
};
</script>