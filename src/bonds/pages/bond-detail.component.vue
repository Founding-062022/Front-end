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
        <pv-button
          @click="changeMethodOfAmortization"
          label="Calcular"
          class="w-8rem"
        ></pv-button>
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
      <div class="col-12 md:col-4">
        <p v-if="bond.discountRate !== 0" class="font-bold">
          Tasa de Descuento: <span class="font-normal">{{ bond.discountRate }}%</span>
        </p>
        <p v-else class="font-bold">
          Tasa de Descuento: <span class="font-normal">No definido</span>
        </p>
      </div>
      <div v-if="bond.market === 'Primario'" class="col-12 md:col-4">
        <p class="font-bold">Mercado Secundario:
          <a href="" class="info-color font-normal">Agregar</a>
        </p>
      </div>
    </div>
    <pv-data-table :value="table">
      <pv-column field="name"></pv-column>
      <div v-for="index in frequency + 1" v-bind:key="index">
        <pv-column :header="`${index - 1}`" :field="`period${index - 1}`">
          <template #body="slotProps">
            <span>{{ this.round(slotProps.data[`period${index - 1}`]) }}</span>
          </template>
        </pv-column>
      </div>
    </pv-data-table>
    <div class="pt-4 pb-4">
      <h2>Indicadores financieros</h2>
      <div class="flex justify-content-between pt-2 px-4">
        <pv-button
          v-if="van > 0"
          class="p-button-success"
          :label="`VAN: ${this.van} ${bond.currency}`"
        >
        </pv-button>
        <pv-button
          v-else-if="van < 0"
          class="p-button-danger"
          :label="`VAN: ${this.van * -1} ${bond.currency}`"
        ></pv-button>
        <pv-button
          v-else
          class="p-button-warning"
          :label="`VAN: ${this.van} ${bond.currency}`"
        ></pv-button>
        <pv-button
          v-if="this.tir > 0"
          class="p-button-success"
          :label="`TIR: ${this.tir}%`"
        ></pv-button>
        <pv-button
          v-else-if="this.tir < 0"
          class="p-button-danger"
          :label="`TIR: ${this.tir}%`"
        ></pv-button>
        <pv-button
          v-else
          class="p-button-warning"
          :label="`TIR: ${this.tir}%`"
        ></pv-button>
        <pv-button class="p-button-info" :label="`VA: ${this.va} ${bond.currency}`"></pv-button>
      </div>
    </div>
  </div>
  <div v-if="bond.market === 'Secundario'">
    <pv-divider></pv-divider>
    <div class="container pt-4">
      <h2>Mercado Secundario</h2>
      <div class="grid text-xl">
        <div class="col-12 md:col-4">
          <p class="font-bold">
            Periodo Compra:
            <span class="font-normal">{{ formatDate(bond.buyingPeriod) }}</span>
          </p>
        </div>
        <div class="col-12 md:col-4">
          <p class="font-bold">
            Tasa de Rendimiento:
            <span class="font-normal">{{
                formatPercentage(bond.performanceRate)
              }}</span>
          </p>
        </div>
      </div>
    </div>
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
      van: null,
      tir: null,
      va: null,
      annuity: null,
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
    calculateVA(netFlowList, frequency, couponRate) {
      return this.calculateValuesFutures(netFlowList, frequency, couponRate);
    },
    calculateTIR(periods) {
      let ret = -1000000000.0;
      let interesInicial = -1.0;
      let interesMedio = 0.0;
      let interesFinal = 1.0;
      let vpl_inicial = 0.0;
      let vpl_final = 0.0;
      let err = 1e-5;

      for (let i = 0; i < 100; i++) {
        vpl_inicial = this.vpl(interesInicial, periods);
        vpl_final = this.vpl(interesFinal, periods);
        if (this.sign(vpl_inicial) != this.sign(vpl_final)) break;
        interesInicial -= 1.0;
        interesFinal += 1.0;
      }

      let count = 0;
      for (;;) {
        // Buscar bisecciÃ³n
        interesMedio = (interesInicial + interesFinal) / 2.0;
        let vpl_medio = this.vpl(interesMedio, periods);

        if (Math.abs(vpl_medio) <= err) {
          // Resultado
          return interesMedio * 100.0;
        }

        if (this.sign(vpl_inicial) == this.sign(vpl_medio)) {
          interesInicial = interesMedio;
          vpl_inicial = this.vpl(interesMedio, periods);
        } else {
          interesFinal = interesMedio;
          vpl_final = this.vpl(interesMedio, periods);
        }

        if (++count > 10000) throw "looping invalid";
      }

      // eslint-disable-next-line
      return ret;
    },
    calculateVAN(netFlowList, frequency, couponRate, inversion) {
      console.log(netFlowList);
      let netFlowAccumulate = this.calculateValuesFutures(
        netFlowList,
        frequency,
        couponRate
      );
      return this.round(netFlowAccumulate - inversion);
    },
    calculateMethodFrench() {
      let capital = {};
      let amortization = {};
      let interest = {};
      let quota = {};
      let frequency = this.calculateFrequency();
      let couponRate = this.calculateCouponRateInFrequency();
      const decimal = 5;

      for (let i = 0; i <= frequency; i++) {
        if (i === 0) {
          capital.name = "Capital";
          amortization.name = "Amortización";
          interest.name = "Interes";
          quota.name = "Cuota";
          capital[`period${i}`] = this.bond.nominalValue;
          amortization[`period${i}`] = 0;
          interest[`period${i}`] = 0;
          quota[`period${i}`] = -this.bond.nominalValue;
        } else {
          quota[`period${i}`] = this.roundDecimal(
            this.bond.nominalValue *
              ((couponRate * Math.pow(1 + couponRate, frequency)) /
                (Math.pow(1 + couponRate, frequency) - 1)),
            decimal
          );
          interest[`period${i}`] = this.roundDecimal(
            capital[`period${i - 1}`] * couponRate,
            decimal
          );
          amortization[`period${i}`] = this.roundDecimal(
            quota[`period${i}`] - interest[`period${i}`],
            decimal
          );
          let capitalValue =
            capital[`period${i - 1}`] - amortization[`period${i}`];
          capital[`period${i}`] = this.roundDecimal(
            capitalValue >= 0 ? capitalValue : capitalValue * -1,
            decimal
          );
        }
      }
      this.table.splice(0, this.table.length);
      this.table.push(capital);
      this.table.push(amortization);
      this.table.push(interest);
      this.table.push(quota);
    },
    calculateMethodAmerican() {
      let capital = {};
      let amortization = {};
      let interest = {};
      let quota = {};
      let frequency = this.calculateFrequency();
      let couponRate = this.calculateCouponRateInFrequency();
      //const decimal = 5;

      for (let i = 0; i <= frequency; i++) {
        if (i === 0) {
          capital.name = "Capital";
          amortization.name = "Amortización";
          interest.name = "Interes";
          quota.name = "Cuota";
          capital[`period${i}`] = this.bond.nominalValue;
          amortization[`period${i}`] = 0;
          interest[`period${i}`] = 0;
          quota[`period${i}`] = -this.bond.nominalValue;
        } else if (i == frequency) {
          amortization[`period${i}`] = this.bond.nominalValue;
          capital[`period${i}`] =
            capital[`period${i - 1}`] - amortization[`period${i}`];
          interest[`period${i}`] = this.bond.nominalValue * couponRate;
          quota[`period${i}`] =
            interest[`period${i}`] + amortization[`period${i}`];
        } else {
          amortization[`period${i}`] = 0;
          capital[`period${i}`] = this.bond.nominalValue;
          interest[`period${i}`] = this.bond.nominalValue * couponRate;
          quota[`period${i}`] =
            interest[`period${i}`] + amortization[`period${i}`];
        }
      }
      this.table.splice(0, this.table.length);
      this.table.push(capital);
      this.table.push(amortization);
      this.table.push(interest);
      this.table.push(quota);
    },
    calculateMethodAleman() {
      let capital = {};
      let amortization = {};
      let interest = {};
      let quota = {};
      let frequency = this.calculateFrequency();
      let couponRate = this.calculateCouponRateInFrequency();
      for (let i = 0; i <= frequency; i++) {
        if (i === 0) {
          capital.name = "Capital";
          amortization.name = "Amortización";
          interest.name = "Interes";
          quota.name = "Cuota";
          capital[`period${i}`] = this.bond.nominalValue;
          amortization[`period${i}`] = 0;
          interest[`period${i}`] = 0;
          quota[`period${i}`] = -this.bond.nominalValue;
        } else {
          amortization[`period${i}`] = capital[`period${0}`] / this.frequency;
          capital[`period${i}`] =
            capital[`period${i - 1}`] - amortization[`period${i}`];
          interest[`period${i}`] = capital[`period${i - 1}`] * couponRate;
          quota[`period${i}`] =
            amortization[`period${i}`] + interest[`period${i}`];
        }
      }
      this.table.splice(0, this.table.length);
      this.table.push(capital);
      this.table.push(amortization);
      this.table.push(interest);
      this.table.push(quota);
    },
    calculateFinancialIndicatorsPrimaryMarket() {
      let frequency = this.calculateFrequency();
      let rate = this.calculateCouponRateInFrequency();
      if (this.bond.discountRate !== 0) {
        rate = this.calculateRateInFrequency(this.bond.discountRate);
      }
      let quota = this.table.at(this.table.length - 1);
      console.log(quota);
      this.van = this.calculateVAN(
        quota,
        frequency,
        rate,
        this.bond.nominalValue
      );
      let quotaList = [];
      for (let i = 0; i <= frequency; i++) {
        quotaList.push(quota[`period${i}`]);
      }
      this.tir = this.round(this.calculateTIR(quotaList));
      this.va = this.roundDecimal(
        this.calculateVA(quota, frequency, rate),
        0
      );
    },
    round(num) {
      let m = Number((Math.abs(num) * 100).toPrecision(15));
      return (Math.round(m) / 100) * Math.sign(num);
    },
    roundDecimal(num, decimal) {
      let m = Number((Math.abs(num) * Math.pow(10, decimal)).toPrecision(15));
      return (Math.round(m) / Math.pow(10, decimal)) * Math.sign(num);
    },
    vpl(valuation, periods) {
      let ret = periods[0];

      for (let i = 1; i < periods.length; i++)
        ret += periods[i] / Math.pow(1.0 + valuation, i);
      return ret;
    },
    sign(x) {
      return x < 0.0 ? -1 : 1;
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
    calculateRateInFrequency(rate) {
      let days = 0;
      if (this.bond.frequency === "Anual") days = 360;
      else if (this.bond.frequency === "Semestral") days = 180;
      else if (this.bond.frequency === "Mensual") days = 30;
      else if (this.bond.frequency === "Diario") days = 1;
      return Math.pow(1 + rate / 100, days / 360) - 1;
    },
    calculateCouponRateInFrequency() {
      let days = 0;
      if (this.bond.frequency === "Anual") days = 360;
      else if (this.bond.frequency === "Semestral") days = 180;
      else if (this.bond.frequency === "Mensual") days = 30;
      else if (this.bond.frequency === "Diario") days = 1;
      return Math.pow(1 + this.bond.couponRate / 100, days / 360) - 1;
    },
    calculateValuesFutures(netFlowList, frequency, couponRate) {
      let netFlowAccumulated = 0;
      for (let i = 1; i <= frequency; i++) {
        netFlowAccumulated +=
          Number(netFlowList[`period${i}`]) / Math.pow(1 + couponRate, i);
      }
      return netFlowAccumulated;
    },
    changeMethodOfAmortization() {
      if (this.methodSelected === "Metodo Frances") {
        this.calculateMethodFrench();
      } else if (this.methodSelected === "Metodo Americano") {
        this.calculateMethodAmerican();
      } else {
        this.calculateMethodAleman();
      }
    },
  },
  async mounted() {
    this.bondId = this.$route.params.idBond;
    await this.getBoundById();
    this.frequency = this.calculateFrequency();
    this.calculateMethodFrench();
    this.calculateFinancialIndicatorsPrimaryMarket();
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
.info-color {
  color: #5bc0de
}
</style>
