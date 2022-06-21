<template>
  <pv-dialog
    style="width: 40vw"
    v-model:visible="dialogAddVisible"
    :modal="true"
    :closable="false"
    position="center"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
  >
    <template #header>
      <div class="flex justify-content-center w-full">
        <h2 class="text-center">Bonos Corporativos</h2>
      </div>
    </template>
    <form ref="addBondForm" @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field">
        <label :class="{'p-error':v$.name.$invalid && submitted}" for="name">Name</label>
        <pv-input-text
          v-model="name"
          :class="{'p-invalid':v$.name.$invalid && submitted}"
          id="name"
          placeholder="Founding Bound"
        ></pv-input-text>
        <small v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response" class="p-error">{{v$.name.required.$message.replace('Value', 'Name')}}</small>
      </div>
      <div class="field">
        <label for="nominalValue">Valor Nominal</label>
        <div class="flex">
          <pv-input-number
            v-model="nominalValue"
            id="nominalValue"
            placeholder="2000"
          ></pv-input-number>
          <pv-dropdown
            :options="currencies"
            optionLabel="name"
            optionValue="name"
            v-model="currency"
          ></pv-dropdown>
        </div>
      </div>
      <div class="field">
        <label for="couponRate">Tasa Cupon</label>
        <pv-input-number
          v-model="couponRate"
          id="couponRate"
          placeholder="2%"
        ></pv-input-number>
      </div>
      <div class="field">
        <label for="expiration">Vencimiento</label>
        <pv-calendar
          v-model="expiration"
          id="expiration"
          placeholder="Ingresa la fecha de vencimiento"
        ></pv-calendar>
      </div>
      <div class="field">
        <label for="capitalizationType">Capitalizacion</label>
        <pv-dropdown
          :options="frequencies"
          v-model="frequency"
          optionLabel="name"
          optionValue="name"
          id="capitalizationType"
          placeholder="Seleccione el tipo de capitalización"
        ></pv-dropdown>
      </div>
      <div class="field">
        <label for="marketType">Tipo de Mercado</label>
        <pv-dropdown
          :options="marketTypes"
          v-model="marketType"
          id="marketType"
          placeholder="Seleccione el tipo de mercado"
        ></pv-dropdown>
      </div>
      <div class="">
        <div class="field">
          <label for="performanceRate">Rendimiento de Mercado</label>
          <pv-input-number
            v-model="performanceRate"
            id="performanceRate"
            placeholder="Ingrese la tasa de rendimiento"
          ></pv-input-number>
        </div>
        <div class="field">
          <label for="buyingPeriod">Periodo Compra</label>
          <pv-calendar
            v-model="buyingPeriod"
            id="buyingPeriod"
            placeholder="Ingresa el perido de compra"
          ></pv-calendar>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex justify-content-end column-gap-2 w-full">
        <pv-button
          @click="closeDialogBondAdd"
          class="w-7rem p-button-text"
          label="Cerrar"
        ></pv-button>
        <pv-button @click="handleSubmit" class="w-7rem p-button-success" label="Agregar"></pv-button>
      </div>
    </template>
  </pv-dialog>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import CurrencyService from "../services/currency.service";
import FrequencyService from "../services/frequency.service";
export default {
  name: "bond-add",
  setup: () => ({ v$: useVuelidate() }),
  props: { dialogAddVisible: Boolean },
  data() {
    return {
      submitted: false,
      name: null,
      nominalValue: null,
      couponRate: null,
      expiration: null,
      capitalizationType: null,
      marketType: "",
      performanceRate: null,
      buyingPeriod: null,
      currency: null,
      frequency: null,
      currencies: [],
      frequencies: [],
      marketTypes: ["Primario", "Secundario"],
    };
  },
  validations() {
    return {
      name: {
        required,
      },
    };
  },
  methods: {
    closeDialogBondAdd() {
      this.$emit("close-dialog-add");
    },
    async getCurrencies() {
      await CurrencyService.getAll()
        .then((response) => {
          this.currencies = response.data;
          this.currency = response.data.at(0).name;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: `${error.message}`,
            detail: "An error occurred while fetching the information",
            life: 3000,
          });
        });
    },
    handleSubmit(isFormValid) {
      this.submitted = true;
      console.log("here");
    },
    async getFrequencies() {
      await FrequencyService.getAll()
        .then((response) => {
          this.frequencies = response.data;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: `${error.message}`,
            detail: "An error occurred while fetching the information",
            life: 3000,
          });
        });
    },
  },
  mounted() {
    this.getCurrencies();
    this.getFrequencies();
  },
};
</script>

<style scoped>
.bg-success {
  background-color: #5cb85c;
}
.p-dialog-header {
  padding: 0 0;
}
</style>
