<template>
  <ApolloMutation
    :mutation="loginQuery"
    :variables="{
      email,
      pass: password
    }"
    @done="loginSuccess"
    @error="receivedError"
  >
    <template slot-scope="{ mutate, loading }" height=" 300px">
      <div class="loginForm">
        <v-card
          width="500px"
          height="400px"
          flex
          class="max-auto justify-center align-center mt-5"
        >
          <v-card-title
            flex
            color="#29B6"
            height="300px"
            class=" justify-center pb=0"
          >
            <h4 class="h4 text-center mb-4">Login</h4>
          </v-card-title>
          <v-card-text>
            <v-form
              class=" pt-5"
              v-model="isValid"
              v-on:submit.prevent="mutate()"
            >
              <v-text-field
                label="Email"
                :rules="emailRules"
                required
                prepend-icon="mdi-email"
                v-model="email"
              />
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                required
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              />

              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <div class="text-center">
                  <v-btn
                    class="mr-4"
                    normal
                    color="warning"
                    :loading="loading"
                    :disabled="!isValid"
                    type="submit"
                    >Login
                    <span v-if="loading" class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </v-btn>
                  <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
                    :color="snackBarColor"
                    top
                    center
                  >
                    {{ snackBarText }}
                  </v-snackbar>
                </div>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </ApolloMutation>
</template>
<script>
import { LOGIN } from "../../graphql/quries";
import localStorage from "../../utils/localStorageService";
const localStorageService = localStorage.getService();
export default {
  name: "App",
  data: () => ({
    loginQuery: LOGIN,
    snackbar: false,
    snackBarColor: null,
    isValid: false,
    showPassword: false,
    loading: true,
    timeout: 3000,
    snackBarText: null,
    email: "",
    password: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],

    passwordRules: [v => !!v || "Password is required"]
  }),
  methods: {
    loginSuccess(data) {
      const current_data = data.data.userLogin.user;
      const token = data.data.userLogin.token;
      this.snackBarColor = "success";
      this.snackBarText = "Successfully logged in";
      this.snackbar = true;
      localStorageService.setCurrentUser(current_data);
      localStorageService.setToken(token);
      location.reload();
    },
    receivedError(error) {
      this.snackBarColor = "red";
      this.snackBarText = error;
      this.snackbar = true;
    }
  }
};
</script>
<style scoped>
.loginForm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
