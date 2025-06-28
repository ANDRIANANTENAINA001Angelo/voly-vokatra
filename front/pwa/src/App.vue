<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">
        <span class="icon">🌾</span>
        Voly Vokatra
      </h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-green: #2d5016;
  --secondary-green: #4a7c59;
  --light-green: #8fbc8f;
  --accent-brown: #8b4513;
  --light-brown: #deb887;
  --sky-blue: #87ceeb;
  --warm-white: #fefefe;
  --light-gray: #f5f5f5;
  --medium-gray: #e0e0e0;
  --dark-gray: #666;
  --error-red: #dc3545;
  --success-green: #28a745;
  --warning-orange: #ffc107;
  
  --border-radius: 12px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
  --transition: all 0.3s ease;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  color: var(--dark-gray);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-medium);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.app-title .icon {
  font-size: 2.5rem;
  animation: sway 3s ease-in-out infinite;
}

@keyframes sway {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-main {
    padding: 1rem;
  }
}
</style>
