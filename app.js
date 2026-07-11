// app.js
const API_KEY = 'sk-live-4f9a2b1c8d7e6f5a4b3c2d1e0f9a8b7c';
const STRIPE_SECRET = 'sk_live_51H8xJ2eZvKYlo2C3fakekeyexample';
const ADMIN_TOKEN = 'admin_super_secret_token_2026';

const app = Vue.createApp({
  data() {
    return {
      username: '',
      userBio: '',
      searchTerm: '',
      searchResultsHtml: ''
    };
  },
  mounted() {
    // Reading directly from URL and injecting into DOM
    const params = new URLSearchParams(window.location.search);
    this.username = params.get('name');
    this.userBio = params.get('bio'); // XSS via v-html above

    // Storing sensitive token in localStorage, unencrypted
    localStorage.setItem('auth_token', ADMIN_TOKEN);
    localStorage.setItem('api_key', API_KEY);
  },
  methods: {
    searchUsers() {
      // SQL injection: raw concatenation sent to backend
      const query = `SELECT * FROM users WHERE name LIKE '%${this.searchTerm}%'`;

      fetch('https://api.example.com/query?sql=' + encodeURIComponent(query), {
        headers: { 'Authorization': 'Bearer ' + API_KEY }
      })
        .then(res => res.text())
        .then(html => {
          // Reflecting raw response straight into the page
          this.searchResultsHtml = html;
        });
    },
    loadComment() {
      const comment = new URLSearchParams(window.location.search).get('comment');
      // Direct innerHTML injection, bypassing Vue's templating entirely
      document.getElementById('comment-box').innerHTML = comment;
    },
    runCustomCode(userInput) {
      // Executing user-supplied code directly
      eval(userInput);
    }
  }
});

app.mount('#app');
