<template>
  <div class="login-page">
    <h1 class="heading">Welcome to VueChat App</h1>
    <form class="form" name="login" @submit.prevent="authenticate">
      <h3>Sign In</h3>
      <div class="form-group">
        <input
          v-model="username"
          id="email"
          name="email"
          autofocus
          placeholder="Enter your email"
          type="email"
          class="form-control form-control-lg"
          required
        />
      </div>
      <div class="form-group">
        <input
          v-model="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          type="password"
          class="form-control form-control-lg"
          required
        />
      </div>
      <button type="submit" class="submit">Sign In</button>
      <p class="forgot-password">
        <button @click="forgotPassword" class="forgot-pass">Forgot password?</button>
      </p>
      <router-link to="/signupPage" class="signup-link">New User? Sign Up Here</router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config'
export default {
  name: "loginPage",
  data() {
    return {
      username: "",
      password: "",
      serverUrl: config.baseurlApi
    };
  },
  methods: {
    async authenticate() {
      try {
        const response = await axios.post(`${this.serverUrl}login`, {
          user: this.username,
          pass: this.password
        });
        if (response.data.success) {
          // Authentication successful
          // Store user details in local storage
          window.localStorage.setItem("accessToken", response.data.userDetails.idToken);
          window.localStorage.setItem("refreshToken", response.data.userDetails.refreshToken);
          window.localStorage.setItem("username", response.data.userDetails.displayName || "No_NAME");
          // Redirect to homepage
          this.$router.push('/homePage');
        } else {
          // Authentication failed
          alert(response.data.messages || "Authentication failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    },
    forgotPassword() {
      // Implement forgot password functionality
      alert("Forgot password feature is coming soon!");
    }
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
.login-page {
  max-width: 400px;
  margin: 7% auto; /* Adjust vertical margin to center vertically */
  padding: 20px;
  border: 1px solid #0ab8af;
  border-radius: 5px;
  background-image: linear-gradient(to bottom right, #c9f3c3, #9bd6ce); 
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.5); /* Add shadow */
}


.heading {
  text-align: center;
  margin-top: 0;
}

.form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.forgot-password {
  text-align: right;
}

.forgot-pass {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.signup-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
}
</style>
