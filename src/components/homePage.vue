<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Chat Dashboard</h1>
      <div class="user-profile">
        <span id="profile-name">{{ profileName }}</span>
        <button id="logout-btn" @click="logout">Logout</button>
      </div>
    </div>

    <div class="content">
      <div class="messages" ref="messagesContainer">
        <h2 class="header">Messages</h2>
        <ul class="message-list">
          <li
            v-for="message in messages"
            :key="message.id"
            :class="{ 'current-user': message.sender != this.profileName }"
            class="message"
          >
            <strong>{{ message.sender }}:</strong> {{ message.message }}
          </li>
        </ul>
        <div v-if="isLoading" class="loading">Loading...</div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
    </div>
    <div class="footer">
      <h2>Send Message</h2>
      <input type="text" v-model="newMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      messages: [],
      newMessage: "",
      isLoading: false,
      errorMessage: "",
      profileName: "",
    };
  },
  mounted() {
    this.validateUser()
      .then(() => {
        // Call other methods once validateUser() completes successfully
        this.getMessages();
        this.profileName = localStorage.getItem("username") || "";
        this.scrollToBottom();
      })
      .catch((error) => {
        console.error("Error validating user:", error);
        // Handle error if validateUser() fails
      });
  },
  methods: {
    async validateUser() {
      try {
        // Retrieve access token from storage
        const accessToken = localStorage.getItem("accessToken");

        // Check if access token is present and not expired
        if (!accessToken) {
          // If access token is not present, redirect the user to the login page
          alert('Please Log In First!')
          window.location.href = "http://localhost:8080/";
          return; // Exit the function
        }

        // Call the /validateuser endpoint with access token
        const response = await axios.post(
          "http://localhost:3000/api/validateuser",
          {
            accessToken,
          }
        );

        // Handle response from the server
        if (response.data.success) {
          // User is validated, handle success scenario
          const userDetails = response.data.userDetails[0];
          console.log(userDetails,"iuuigu");
          const displayName = userDetails
            ? userDetails.displayName || "No_NAME"
            : "No_NAME";

          // Set the username in local storage
          window.localStorage.setItem("username", displayName);

          console.log("User validated successfully.");
        } else {
          // User is not validated, handle error scenario
          console.error("User validation failed:", response.data.error);
          window.location.href = "http://localhost:8080/";
        }
      } catch (error) {
        alert('Please Log In First!')
        console.error("Error validating user:", error);
        // Handle error scenario
      }
    },
    async getMessages() {
      this.isLoading = true;
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getMessages"
        );
        if (response.data.messages && response.data.messages.length > 0) {
          // Sort the array based on the timestamp
          response.data.messages.sort((a, b) => {
            // Accessing _seconds property of timestamp
            return a.timestamp._seconds - b.timestamp._seconds;
          });

          // Now this.messages will contain the sorted array of messages
          this.messages = response.data.messages;
        }
        this.isLoading = false;
        this.scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        this.isLoading = false;
        this.errorMessage = "Error fetching messages. Please try again.";
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) {
        return; // Don't send empty messages
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/api/messages",
          {
            sender: window.localStorage.getItem("username"), // You can change this to the actual user's name or ID
            message: this.newMessage,
          }
        );
        console.log("Message sent:", response);
        this.newMessage = ""; // Clear the input field after sending message
        // Fetch messages again to update the list
        this.getMessages();
      } catch (error) {
        console.error("Error sending message:", error);
        this.errorMessage = "Error sending message. Please try again.";
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
    },
    logout() {
      // Clear profile name from local storage
      localStorage.removeItem("username");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.replace("http://localhost:8080/");
      // Redirect to logout page or perform logout action
      // Example: window.location.href = '/logout';
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #15bea8;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-profile #logout-btn {
  margin-left: 10px; /* Adjust as needed */
}

.title {
  text-align: center;
  margin: 0;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.messages {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.message-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  clear: both; /* Ensure each message appears on a new line */
}

.message.current-user {
  text-align: left;
  background-color: #e2f2fe; /* Background color for current user's messages */
}

.message:not(.current-user) {
  text-align: right;
}

.footer {
  background-color: #f0f0f0;
  padding: 20px;
}

.footer input[type="text"] {
  width: calc(100% - 80px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.footer button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.footer button:hover {
  background-color: #0056b3;
}

.loading,
.error {
  text-align: center;
  padding: 10px;
  margin-top: 10px;
}

.error {
  color: red;
}
</style>
