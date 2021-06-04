<template>
  <div>
    <div class="page-login">
      <base-dialog :show="!!error" title="An error occurred" @close="handleError">
        <p>{{ error }}</p>
      </base-dialog>
      <base-dialog :show="isLoading" title="Authenticating..." fixed>
        <base-spinner></base-spinner>
      </base-dialog>
      <base-card>
      <h2>Sign In</h2>
        <p class="sub-title">Name Entity Recognation Application</p>
        <form @submit.prevent="submitForm">
          <div class="form-control">
            <label for="username">Username</label>
            <input type="username" id="username" v-model.trim="username" />
          </div>
          <div class="form-control">
            <label for="password">Password</label>
            <input type="password" id="password" v-model.trim="password" />
          </div>
          <p
            v-if="!formIsValid"
          >Please enter a valid username and password (must be at least 6 characters long).</p>
          <base-button class="btn-login">{{ submitButtonCaption }}</base-button>
          <!-- <base-button type="button" mode="flat" @click="switchAuthMode">{{ switchModeButtonCaption }}</base-button> -->
        </form>
      </base-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      formIsValid: true,
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    },
  },
  methods: {
    async submitForm() {
      this.formIsValid = true;
      // if (
      //   this.username === '' ||
      //   !this.email.includes('@') ||
      //   this.password.length < 6
      // ) {
      //   this.formIsValid = false;
      //   return;
      // }

      this.isLoading = true;

      const actionPayload = {
        username: this.username,
        password: this.password,
      };

      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', actionPayload);
        } else {
          await this.$store.dispatch('signup', actionPayload);
        }
        const redirectUrl = '/'; // + (this.$route.query.redirect || 'prediction');
        this.$router.replace(redirectUrl);
      } catch (err) {
        this.error = err.message || 'Failed to authenticate, try later.';
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
.page-login {
  background-color: #1B2B47;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.card {
  background-color: white;
  min-width: 500px;
}

.sub-title {
  font-size: 16px;
  text-align: center;
  padding: 0px 1rem;
  margin: 0px 1rem;
  margin-top: 1rem;
}

h2 {
  font-size: 30px;
  text-align: center;
  margin: 0;
  margin-top: 20px;
}

form {
  margin: 0 1rem 1rem 1rem;
  padding: 1rem;
}

form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 5px;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.btn-login {
  margin-top: 20px;
}
</style>