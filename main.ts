import { createApp } from 'vue';
import App from './app.tsx'; // This is your "Root" component

// In C++, this is like initializing your engine and entering the main loop
const app = createApp(App);

// Mount the app to the DOM
// This links your logic to the <div id="app"></div> in index.html
app.mount('#app');