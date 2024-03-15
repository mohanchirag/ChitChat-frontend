<template>
  <div class="vue-template">
    <h1 class="heading">Let's ChitChat</h1>
    <form class="form" name="signup" @submit.prevent="signUp">
      <h3>Sign Up</h3>
      <div class="form-group">
        <input v-model="username" id="username" name="username" placeholder="Username" type="text" class="form-control form-control-lg" required />
      </div>
      <div class="form-group">
        <input v-model="email" id="email" name="email" placeholder="Email" type="email" class="form-control form-control-lg" required pattern="[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\.com" title="Enter Your Email" />
      </div>
      <div class="form-group">
        <input v-model="password" id="password" name="password" placeholder="Password" type="password" class="form-control form-control-lg" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" />
      </div>
      <div class="form-group">
        <input v-model="rePassword" id="re-password" name="re-password" placeholder="Re-type Password" type="password" class="form-control form-control-lg" required :pattern="password" :title="'Passwords do not match'" />
      </div>
      <button type="submit" class="submit">Sign Up</button>
    </form>
    <br>
    <router-link to="/">Already have an account? Sign In</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config'

export default {
  name: 'signupPage',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      rePassword: '',
      serverUrl: config.baseurlApi
    };
  },
  methods: {
    async signUp() {
      if (this.password !== this.rePassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const response = await axios.post(`${this.serverUrl}signup`, {
          username: this.username,
          email: this.email,
          pass: this.password,
        });
        console.log(this.serverUrl,"uiuyf");
        console.log('Signup response:', response.data);
        if (response.status === 200 && response.data.success) {
          // Success: Redirect to homepage or show success message
          window.localStorage.setItem('accessToken', response.data.userDetails.idToken);
          window.localStorage.setItem('refreshToken', response.data.userDetails.refreshToken);
          window.localStorage.setItem('username', response.data.userDetails.displayName || 'No_NAME');
          this.$router.push('/homePage');
        } else {
          // Error: Show error message
          alert(response.data.messages);
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred while signing up. Please try again later.');
      }
    },
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
.vue-template {
  max-width: 500px;
  width: 35%;
  margin: 5% auto; /* Adjust vertical margin to center vertically */
  padding: 30px;
  border: 1px solid #0ab8af;
  border-radius: 5px;
  background-image: linear-gradient(to bottom right, #c5c3c9, #60e6d4); 
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
