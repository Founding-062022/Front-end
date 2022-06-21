<template>
  <div class="grid banner container">
    <div
      class="col-12 md:col-6 flex flex-column justify-content-center align-items-center banner-content"
    >
      <h2 class="title">Tome mejores decisiones financieras</h2>
      <p class="subtitle">
        Analiza tus inversiones a través de indicadores financieros
      </p>
      <div class="action flex justify-content-start">
        <a
          href="#sign-up"
          v-smooth-scroll
          class="p-button image px-6 mb-4 md:mb-0 no-underline"
          >Unirse</a
        >
      </div>
    </div>
    <div
      style="display: none"
      class="md:col-6 md:flex flex-column align-items-center justify-content-center"
    >
      <img
        width="414"
        class="border-round-xl"
        src="../shared/resources/img/empresario.jpg"
        alt=""
      />
    </div>
  </div>
  <div class="container py-8">
    <div class="grid">
      <div
        class="col-12 md:col-4 p-3"
        v-for="card in cards"
        v-bind:key="card.id"
      >
        <pv-card class="card">
          <template #header>
            <img
              height="200"
              class="border-round-top"
              alt="user header"
              :src="card.photo"
            />
          </template>
          <template #title>
            <div style="font-size: 27px">{{ card.title }}</div>
          </template>
          <template #content>
            <div style="height: 90px">
              <div
                class="flex"
                v-for="description in card.description"
                v-bind:key="description.id"
              >
                <p class="pi pi-check ml-3 mr-2 mb-0"></p>
                <p class="mb-0 font-bold text-black-alpha-70">
                  {{ description.content }}
                </p>
              </div>
            </div>
          </template>
          <template #footer>
            <pv-button
              icon="pi pi-arrow-right"
              iconPos="right"
              class="p-button-text"
              label="Saber más"
            ></pv-button>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
  <div class="container grid">
    <div
      class="visible md:col-6 flex justify-content-center align-items-center"
    >
      <icon-people></icon-people>
    </div>
    <div class="col-12 md:col-6" id="sign-up">
      <pv-card class="pt-4 px-5">
        <template #title>
          <div class="text-center">Unete a la Comunidad</div>
        </template>
        <template #content>
          <div>
            <form ref="sign-up" @submit.prevent="handleSubmit(!v$.$invalid)">
              <div class="p-fluid">
                <div class="md:flex gap-3">
                  <div class="field">
                    <label
                      :class="{ 'p-error': v$.name.$invalid && submitted }"
                      for="name"
                      >Nombres</label
                    >
                    <pv-input-text
                      id="name"
                      v-model="v$.name.$model"
                      placeholder="Ingresa tu nombre"
                      :class="{ 'p-invalid': v$.name.$invalid && submitted }"
                    ></pv-input-text>
                    <small
                      v-if="
                        (v$.name.$invalid && submitted) ||
                        v$.name.$pending.$response
                      "
                      class="p-error"
                      >{{
                        v$.name.required.$message.replace("Value", "Name")
                      }}</small
                    >
                  </div>
                  <div class="field">
                    <label
                      :class="{ 'p-error': v$.lastname.$invalid && submitted }"
                      for="lastname"
                      >Apellido</label
                    >
                    <pv-input-text
                      id="lastname"
                      v-model="v$.lastname.$model"
                      placeholder="Ingresa tus apellidos"
                      :class="{
                        'p-invalid': v$.lastname.$invalid && submitted,
                      }"
                    ></pv-input-text>
                    <small
                      v-if="
                        (v$.lastname.$invalid && submitted) ||
                        v$.lastname.$pending.$response
                      "
                      class="p-error"
                      >{{
                        v$.lastname.required.$message.replace(
                          "Value",
                          "Lastname"
                        )
                      }}</small
                    >
                  </div>
                </div>
                <div class="field">
                  <label
                    :class="{ 'p-error': v$.email.$invalid && submitted }"
                    for="email"
                    >Correo</label
                  >
                  <pv-input-text
                    id="email"
                    v-model="email"
                    placeholder="Ingresa tu correo"
                    :class="{
                      'p-invalid': v$.email.$invalid && submitted,
                    }"
                  ></pv-input-text>
                  <small
                    v-if="
                      (v$.email.$invalid && submitted) ||
                      v$.email.$pending.$response
                    "
                    class="p-error"
                    >{{
                      v$.email.required.$message.replace("Value", "Email")
                    }}</small
                  >
                </div>
                <div class="field">
                  <label
                    :class="{ 'p-error': v$.country.$invalid && submitted }"
                    for="country"
                    >Pais</label
                  >
                  <pv-dropdown
                    id="country"
                    :options="countries"
                    optionLabel="translations.spa.common"
                    optionValue="translations.spa.common"
                    v-model="country"
                    placeholder="Selecciona el nombre de tu pais"
                    :class="{
                      'p-invalid': v$.country.$invalid && submitted,
                    }"
                  ></pv-dropdown>
                  <small
                    v-if="
                      (v$.country.$invalid && submitted) ||
                      v$.country.$pending.$response
                    "
                    class="p-error"
                    >{{
                      v$.country.required.$message.replace("Value", "Country")
                    }}</small
                  >
                </div>
                <div class="field">
                  <label
                    :class="{ 'p-error': v$.username.$invalid && submitted }"
                    for="username"
                    >Nombre de Usuario</label
                  >
                  <pv-input-text
                    id="username"
                    v-model="username"
                    placeholder="Ingresa tu nombre de usuario"
                    :class="{
                      'p-invalid': v$.username.$invalid && submitted,
                    }"
                  ></pv-input-text>
                  <small
                    v-if="
                      (v$.username.$invalid && submitted) ||
                      v$.username.$pending.$response
                    "
                    class="p-error"
                    >{{
                      v$.username.required.$message.replace("Value", "Username")
                    }}</small
                  >
                </div>
                <div class="field">
                  <label
                    :class="{ 'p-error': v$.password.$invalid && submitted }"
                    for="password"
                    >Contraseña</label
                  >
                  <pv-password
                    id="password"
                    v-model="password"
                    placeholder="Ingresa tu contraseña"
                    :class="{
                      'p-invalid': v$.password.$invalid && submitted,
                    }"
                  ></pv-password>
                  <small
                    v-if="
                      (v$.password.$invalid && submitted) ||
                      v$.password.$pending.$response
                    "
                    class="p-error"
                    >{{
                      v$.password.required.$message.replace("Value", "Password")
                    }}</small
                  >
                </div>
                <div class="field-checkbox">
                  <pv-checkbox
                    id="terms"
                    v-model="terms"
                    value="Acepto terminos y condiciones"
                    :class="{ 'p-invalid': v$.terms.$invalid && submitted }"
                  ></pv-checkbox>
                  <label
                    for="terms"
                    :class="{ 'p-error': v$.terms.$invalid && submitted }"
                    >Acepto terminos y condiciones</label
                  >
                </div>
                <div class="field pb-0">
                  <pv-button
                    type="submit"
                    :loading="isLoading"
                    label="Unirse"
                  ></pv-button>
                </div>
              </div>
            </form>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<script>
import IconPeople from "../shared/resources/svg/IconPeople.vue";
import CountriesService from "../shared/services/countries.service.js";
import { email, maxLength, minLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { inject, ref } from "vue";
import RegisterRequest from "../security/models/register.request";
export default {
  name: "AppHome",
  setup() {
    const myEl = ref(null);
    const smoothScroll = inject("smoothScroll");
    // eslint-disable-next-line no-unused-vars
    const scrollToMyEl = () => {
      smoothScroll({
        scrollTo: myEl.value,
        hash: "#sampleHash",
      });
    };
    return { v$: useVuelidate() };
  },
  components: { IconPeople },
  data() {
    return {
      name: "",
      lastname: "",
      email: "",
      country: "",
      username: "",
      password: "",
      terms: null,
      countries: null,
      submitted: false,
      isLoading: false,
      cards: [
        {
          id: 1,
          title: "Análisis de bonos corporativos",
          description: [
            {
              id: 1,
              content: "Obtener capitalizaciones de bonos corporativos",
            },
            {
              id: 2,
              content: "Consultar indicadores financieros",
            },
          ],
          photo: "/src/shared/resources/img/indicadores%20financieros.jpg",
        },
        {
          id: 2,
          title: "Comparar bonos corporativos",
          description: [
            {
              id: 1,
              content: "Compare los beneficios entre dos bonos corporativos.",
            },
            {
              id: 2,
              content: "Consultar indicadores financieros",
            },
          ],
          photo: "/src/shared/resources/img/compara.jpg",
        },
        {
          id: 3,
          title: "Mercados primarios y secundarios",
          description: [
            {
              id: 1,
              content: "Analizar mercados primarios y secundarios.",
            },
            {
              id: 2,
              content: "Consultar indicadores financieros",
            },
          ],
          photo: "/src/shared/resources/img/mercados.jpg",
        },
      ],
    };
  },
  validations() {
    return {
      name: {
        required,
      },
      lastname: {
        required,
      },
      email: {
        required,
        email,
      },
      country: {
        required,
      },
      username: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15),
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(25),
      },
      terms: {
        required,
      },
    };
  },
  methods: {
    async getCountries() {
      await CountriesService.getAll()
        .then((response) => {
          this.countries = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        setTimeout(() => (this.isLoading = true), 1000);
        const registerRequest = new RegisterRequest(
          this.name,
          this.lastname,
          this.email,
          this.country,
          this.username,
          this.password
        );
        this.$store
          .dispatch("auth/register", registerRequest)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Registered user successfully",
              detail: `Congratulations Sr.${this.lastname} your account has been created successfully`,
              life: 4000,
            });
            this.resetForm();
          })
          .catch((error) => {
            this.$toast.add({
              severity: "error",
              summary: "An error occurred",
              detail: `${error.message}`,
              life: 3000,
            });
          });
        setTimeout(() => (this.isLoading = false), 100);
      }
    },
    resetForm() {
      this.name = "";
      this.lastname = "";
      this.email = "";
      this.country = "";
      this.username = "";
      this.password = "";
      this.terms = null;
      this.countries = null;
      this.submitted = false;
      this.isLoading = false;
    },
  },
  mounted() {
    this.getCountries();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
}
.visible {
  visibility: hidden;
  height: 0;
}
@media (min-width: 767px) {
  .visible {
    visibility: initial;
    height: auto;
  }
}
.banner {
  width: 100%;
  height: calc(100vh - 78px);
}
.banner-content {
  background-color: transparent;
  color: black;
}
@media (max-width: 767px) {
  .banner {
    background-image: url("../shared/resources/img/empresario.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .banner-content {
    background-color: rgb(0, 0, 0, 0.5);
    color: white;
  }
}
.card {
  height: 500px;
}
@media (max-width: 767px) {
  .card {
    height: auto;
  }
}
.title {
  font-weight: bolder;
  font-size: 40px;
  width: 80%;
  margin-bottom: 0;
}
.subtitle {
  width: 80%;
  font-weight: bolder;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 5px;
}
@media (max-width: 767px) {
  .subtitle {
    color: rgba(255, 255, 255, 0.7);
  }
}
.action {
  width: 80%;
}
</style>
