<template>
  <div class="container h-content mt-4">
    <div class="grid">
      <div
        class="col-12 md:col-6 flex md:flex-none justify-content-center md:justify-content-start"
      >
        <h2>{{ bond.name }}</h2>
      </div>
      <div
        class="col-12 md:col-6 flex justify-content-end align-items-center gap-2"
      >
        <pv-dropdown
          :options="options"
          v-model="methodSelected"
          class="w-full md:w-18rem p-inputtext-sm"
        ></pv-dropdown>
        <pv-button label="Calcular" class="w-8rem"></pv-button>
      </div>
    </div>
    <div class="grid text-xl">
      <div class="col-12 md:col-4">
        <p class="font-bold">
          Valor nominal:
          <span class="font-normal"
            >{{ bond.nominalValue }} {{ bond.currency }}</span
          >
        </p>
      </div>
      <div class="col-12 md:col-4">
        <p class="font-bold">
          Vencimiento:
          <span class="font-normal">{{ formatDate(bond.expiration) }}</span>
        </p>
      </div>
      <div v-if="bond.market === 'Secundario'" class="col-12 md:col-4">
        <p class="font-bold">
          Tasa de Rendimiento:
          <span class="font-normal">{{
            formatPercentage(bond.performanceRate)
          }}</span>
        </p>
      </div>
      <div class="col-12 md:col-4">
        <p class="font-bold">
          Tasa Cupon:
          <span class="font-normal">{{
            formatPercentage(bond.couponRate)
          }}</span>
        </p>
      </div>
      <div class="col-12 md:col-4">
        <p class="font-bold">
          Capitalizacion: <span class="font-normal">{{ bond.frequency }}</span>
        </p>
      </div>
      <div v-if="bond.market === 'Secundario'" class="col-12 md:col-4">
        <p class="font-bold">
          Periodo Compra:
          <span class="font-normal">{{ formatDate(bond.buyingPeriod) }}</span>
        </p>
      </div>
    </div>
    <pv-data-table :value="table">
      <pv-column field="name"></pv-column>
      <div v-for="index in frequency+1" v-bind:key="index">
        <pv-column :header="`${index-1}`" :field="`period${index-1}`"></pv-column>
      </div>
    </pv-data-table>
  </div>
</template>

<script>
import BondService from "../services/bond.service.js";
export default {
  name: "bond-detail",
  data() {
    return {
      bondId: null,
      bond: {},
      methodSelected: "Metodo Frances",
      options: ["Metodo Frances", "Metodo Americano", "Metodo Aleman"],
      cals: [
        { name: "Capital", period1: 10, period2: 20, period3: 30 },
        { name: "Amortizacion", period1: 10, period2: 20, period3: 30 },
        { name: "Interes", period1: 10, period2: 20, period3: 30 },
        { name: "Cuota", period1: 10, period2: 20, period3: 30 },
      ],
      table: [],
      frequency: 0,
    };
  },
  methods: {
    async getBoundById() {
      await BondService.getById(this.bondId)
        .then((response) => {
          this.bond = response.data;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: "An error occurred",
            detail: `${error.message}`,
            life: 3000,
          });
        });
    },
    calculateCouponRateInFrequency() {
      let days = 0;
      if (this.bond.frequency === "Anual") days = 360;
      else if (this.bond.frequency === "Semestral") days = 180;
      else if (this.bond.frequency === "Mensual") days = 30;
      else if (this.bond.frequency === "Diario") days = 1;
      return Math.pow(1 + this.bond.couponRate / 100, days / 360) - 1;
    },
    calculateMethodFrench() {
      let capital = {};
      let amortization = {};
      let interest = {};
      let quota = {};
      let frequency = this.calculateFrequency();
      let couponRate = this.calculateCouponRateInFrequency();

      for (let i = 0; i < frequency + 1; i++) {
        if (i === 0) {
          capital.name = "Capital";
          amortization.name = "Amortización";
          interest.name = "Interes";
          quota.name = "Quota";
          capital[`period${i}`] = this.bond.nominalValue;
          amortization[`period${i}`] = 0;
          interest[`period${i}`] = 0;
          quota[`period${i}`] = -this.bond.nominalValue;
        } else {
          quota[`period${i}`] =
            (this.bond.nominalValue * ((couponRate * Math.pow(1 + couponRate, frequency)) / (Math.pow(1 + couponRate, frequency) - 1))).toFixed(2);
          interest[`period${i}`] = (capital[`period${i - 1}`] * couponRate).toFixed(2);
          amortization[`period${i}`] = (quota[`period${i}`] - interest[`period${i}`]).toFixed(2);
          let capitalValue = capital[`period${i-1}`] - amortization[`period${i}`];
          capital[`period${i}`] = (capitalValue >= 0? capitalValue : capitalValue*-1).toFixed();
        }
      }
      this.table.push(capital);
      this.table.push(amortization);
      this.table.push(interest);
      this.table.push(quota);
    },
    formatDate(date) {
      const dateInFormat = new Date(Date.parse(date));

      const month = dateInFormat.getMonth() + 1;
      const day = dateInFormat.getDate();

      const monthString = month > 9 ? `${month}` : `0${month}`;
      const dayString = day > 9 ? `${day}` : `0${day}`;
      return `${dayString}/${monthString}/${dateInFormat.getFullYear()}`;
    },
    formatPercentage(percentage) {
      return `${percentage}%`;
    },
    calculateFrequency() {
      let timeToday = Date.now();
      let dateExpire = Date.parse(this.bond.expiration);
      let expire = new Date(dateExpire);
      let today = new Date(timeToday);

      let years = expire.getFullYear() - today.getFullYear();
      let months = expire.getMonth() + 1 - (today.getMonth() + 1);
      let days = expire.getDate() - today.getDate();

      if (this.bond.marketType === "Secundario") {
        let buyingPeriod = new Date(Date.parse(this.bond.buyingPeriod));
        years = years - buyingPeriod.getFullYear();
        months = months - (buyingPeriod.getMonth() + 1);
        days = days - buyingPeriod.getDate();
      }

      if (this.bond.frequency === "Anual") {
        return years;
      } else if (this.bond.frequency === "Semestral") {
        if (months >= 6) return years * 2 + 1;
        else return years * 2;
      } else if (this.bond.frequency === "Mensual") {
        return years * 12 + months;
      } else if (this.bond.frequency === "Diario") {
        return years * 360 + months * 30 + days;
      }
    },
  },
  async mounted() {
    this.bondId = this.$route.params.idBond;
    await this.getBoundById();
    this.frequency = this.calculateFrequency();
    this.calculateMethodFrench();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
}
.h-content {
  min-height: calc(100vh - 190px);
}
</style>
