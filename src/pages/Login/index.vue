<template>
  <ApolloMutation
    :mutation="loginQuery"
    :variables="{
      email,
      pass
    }"
    @done="loginSuccess"
  >
    <template slot-scope="{ mutate, loading, error }">
      <form v-on:submit.prevent="mutate()">
        <div class="measure">
          <label htmlFor="name">
            email
          </label>
          <input id="name" type="text" required v-model="email" />
          <label htmlFor="name">
            pass
          </label>
          <input id="name" type="text" required v-model="pass" />
          <input id="name" type="submit" value="submit" />
          <h4 v-if="loading">The mutation is loading!</h4>
          <p v-if="error">{{ error }}</p>
        </div>
      </form>
    </template>
  </ApolloMutation>
</template>

<script>
import { LOGIN } from "../../graphql/quries";
import localStorage from "../../utils/localStorageService";
const localStorageService = localStorage.getService();

export default {
  name: "Login",
  data() {
    return {
      email: "",
      pass: "",
      loginQuery: LOGIN
    };
  },
  methods: {
    loginSuccess(data) {
      console.log("done", data);
      const current_data = data.data.userLogin.user;
      const token = data.data.userLogin.token;
      console.log(token, current_data);
      localStorageService.setCurrentUser(current_data);
      localStorageService.setToken(token);
    }
    // async onSubmit() {
    //   const email = this.email;
    //   const pass = this.pass;
    //   this.pass = "";
    //   this.email = "";
    //   const result = await this.$apollo.mutate({
    //     mutation: LOGIN,
    //     variables: {
    //       email,
    //       pass
    //     }
    //   });
    // }
  }
};
</script>
