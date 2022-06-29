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
    <form
      ref="addBondForm"
      @submit.prevent="handleSubmit(!v$.$invalid)"
      class="p-fluid"
    >
      <div class="field">
        <label :class="{ 'p-error': v$.name.$invalid && submitted }" for="name"
          >Name</label
        >
        <pv-input-text
          v-model="name"
          :class="{ 'p-invalid': v$.name.$invalid && submitted }"
          id="name"
          placeholder="Founding Bound"
        ></pv-input-text>
        <small
          v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response"
          class="p-error"
          >{{ v$.name.required.$message.replace("Value", "Name") }}</small
        >
      </div>
      <div class="field">
        <label
          :class="{ 'p-error': v$.nominalValue.$invalid && submitted }"
          for="nominalValue"
          >Valor Nominal</label
        >
        <div class="flex">
          <pv-input-number
            v-model="nominalValue"
            :class="{ 'p-invalid': v$.nominalValue.$invalid && submitted }"
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
        <small
          v-if="
            (v$.nominalValue.$invalid && submitted) ||
            v$.nominalValue.$pending.$response
          "
          class="p-error"
          >{{
            v$.nominalValue.required.$message.replace("Value", "Nominal Value")
          }}</small
        >
      </div>
      <div class="field">
        <label
          :class="{ 'p-error': v$.couponRate.$invalid && submitted }"
          for="couponRate"
          >Tasa Cupon</label
        >
        <pv-input-number
          :class="{ 'p-invalid': v$.couponRate.$invalid && submitted }"
          v-model="couponRate"
          id="couponRate"
          placeholder="2%"
        ></pv-input-number>
        <small
          v-if="
            (v$.couponRate.$invalid && submitted) ||
            v$.couponRate.$pending.$response
          "
          class="p-error"
          >{{
            v$.couponRate.required.$message.replace("Value", "Coupon Rate")
          }}</small
        >
      </div>
      <div class="field">
        <label
          :class="{ 'p-error': v$.expiration.$invalid && submitted }"
          for="expiration"
          >Vencimiento</label
        >
        <pv-calendar
          dateFormat="dd/mm/yy"
          :class="{ 'p-invalid': v$.expiration.$invalid && submitted }"
          v-model="expiration"
          id="expiration"
          placeholder="Ingresa la fecha de vencimiento"
        ></pv-calendar>
        <small
          v-if="
            (v$.expiration.$invalid && submitted) ||
            v$.expiration.$pending.$response
          "
          class="p-error"
          >{{
            v$.expiration.required.$message.replace("Value", "Expiration")
          }}</small
        >
      </div>
      <div class="field">
        <label
          :class="{ 'p-error': v$.frequency.$invalid && submitted }"
          for="capitalizationType"
          >Capitalizacion</label
        >
        <pv-dropdown
          :class="{ 'p-invalid': v$.frequency.$invalid && submitted }"
          :options="frequencies"
          v-model="frequency"
          optionLabel="name"
          optionValue="name"
          id="capitalizationType"
          placeholder="Seleccione el tipo de capitalización"
        ></pv-dropdown>
        <small
          v-if="
            (v$.frequency.$invalid && submitted) ||
            v$.frequency.$pending.$response
          "
          class="p-error"
          >{{
            v$.frequency.required.$message.replace("Value", "Frequency")
          }}</small
        >
      </div>
      <div class="field">
        <label
          :class="{ 'p-error': v$.marketType.$invalid && submitted }"
          for="marketType"
          >Tipo de Mercado</label
        >
        <pv-dropdown
          :class="{ 'p-invalid': v$.marketType.$invalid && submitted }"
          :options="marketTypes"
          v-model="marketType"
          id="marketType"
          placeholder="Seleccione el tipo de mercado"
        ></pv-dropdown>
        <small
          v-if="
            (v$.marketType.$invalid && submitted) ||
            v$.marketType.$pending.$response
          "
          class="p-error"
          >{{
            v$.marketType.required.$message.replace("Value", "Market type")
          }}</small
        >
      </div>
      <div v-if="marketType === 'Secundario'">
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
            dateFormat="dd/mm/yy"
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
        <pv-button
          @click="executeSubmitEvent"
          class="w-7rem p-button-success"
          label="Agregar"
        ></pv-button>
      </div>
    </template>
  </pv-dialog>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import CurrencyService from "../services/currency.service";
import FrequencyService from "../services/frequency.service";
import BondService from "../services/bond.service";
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
      nominalValue: {
        required,
      },
      couponRate: {
        required,
      },
      expiration: {
        required,
      },
      frequency: {
        required,
      },
      marketType: {
        required,
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    closeDialogBondAdd() {
      this.$emit("close-dialog-add");
    },
    executeSubmitEvent() {
      this.$refs.addBondForm.requestSubmit();
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
    async handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        const dtoBond = {
          name: this.name,
          userId: this.currentUser.id,
          nominalValue: this.nominalValue,
          currency: this.currency,
          couponRate: this.couponRate,
          expiration: this.expiration,
          frequency: this.frequency,
          market: this.marketType,
        };
        if (this.marketType === "Secundario") {
          dtoBond.performanceRate = this.performanceRate;
          dtoBond.buyingPeriod = this.buyingPeriod;
        }
        await BondService.post(dtoBond)
          .then((response) => {
            this.$toast.add({
              severity: "success",
              summary: `New bonus registered`,
              detail: `${response.data.name} registered`,
              life: 3000,
            });
            this.reset();
            this.$emit("bond-registered");
          })
          .catch((error) => {
            this.$toast.add({
              severity: "error",
              summary: "An error occurred",
              detail: `${error.message}`,
              life: 3000,
            });
          });
      }
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
    reset() {
      this.submitted = false;
      this.name = null;
      this.nominalValue = null;
      this.couponRate = null;
      this.expiration = null;
      this.marketType = "";
      this.performanceRate = null;
      this.buyingPeriod = null;
      this.currency = "PEN";
      this.frequency = null;
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
