<template>
  <div class="flex justify-content-center">
    <pv-card>
      <template #title> <div class="text-center">German Method</div> </template>
      <template #content>
        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label for="loan-input"> <strong>Loan</strong> </label>
            <pv-input-number
              id="loan-input"
              v-model="loan"
              showButtons
              buttonLayout="horizontal"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              mode="currency"
              currency="EUR"
            ></pv-input-number>
          </div>
          <div class="flex flex-column gap-2">
            <label for="loan-input"> <strong>Cuota Inicial</strong> </label>
            <div class="flex gap-3">
              <pv-input-number
                id="loan-input"
                v-model="cuote"
                showButtons
                buttonLayout="horizontal"
                decrementButtonClass="p-button-danger"
                incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              ></pv-input-number>
              <pv-dropdown
                placeholder="timeT Unit"
                v-model="cuoteUnit"
                :options="cuoteUnits"
                optionLabel="name"
                :editable="true"
              />
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <pv-input-number v-model="financialResult"></pv-input-number>
          </div>
          <div class="flex flex-column gap-2">
            <label for="loan-input"> <strong>Time</strong> </label>
            <div class="flex gap-3">
              <pv-input-number
                id="loan-input"
                v-model="time"
                showButtons
                buttonLayout="horizontal"
                decrementButtonClass="p-button-danger"
                incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              ></pv-input-number>
              <pv-dropdown
                placeholder="timeT Unit"
                v-model="timeUnit"
                :options="timeUnits"
                optionLabel="name"
                :editable="true"
              />
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label for="loan-input"> <strong>Time Rate</strong> </label>
            <div class="flex gap-3">
              <pv-input-number
                id="loan-input"
                v-model="timeT"
                showButtons
                buttonLayout="horizontal"
                decrementButtonClass="p-button-danger"
                incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              ></pv-input-number>
              <pv-dropdown
                placeholder="timeT Unit"
                v-model="timeTUnit"
                :options="timeUnits"
                optionLabel="name"
                :editable="true"
              />
            </div>
          </div>
          <div class="flex flex-column gap-2">
            <label for="loan-input">
              <strong>TEA (Tasa Efectiva Anual) </strong>
            </label>
            <div class="flex align-items-center gap-3">
              <pv-input-number
                id="loan-input"
                v-model="tea"
                showButtons
                buttonLayout="horizontal"
                decrementButtonClass="p-button-danger"
                incrementButtonClass="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
              ></pv-input-number
              ><span>%</span>
              <pv-input-number v-model="transformedTen" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="loan-input">
                <strong>Cuotas</strong>
              </label>
              <pv-input-number v-model="numberOfCuotes"></pv-input-number>
            </div>
            <div>
              <span> <strong>Amortizaciones</strong> {{ amortizations }} </span>
            </div>
          </div>
          <div>
            <pv-button @click="solve()"></pv-button>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script>
export default {
  name: "german-method",
  data() {
    return {
      loan: 0,
      timeT: 0,
      tea: 0,
      cuote: 0,
      timeUnits: [
        { name: "Days", code: 0 },
        { name: "Months", code: 1 },
        { name: "Years", code: 2 },
      ],
      cuoteUnits: [
        { name: "%", code: 0 },
        { name: "money", code: 1 },
      ],
      cuoteUnit: { name: "%", code: 0 },
      timeTUnit: { name: "Days", code: 0 },
      divisors: [360, 12, 1],
      time: 0,
      timeUnit: { name: "Days", code: 0 },
      interestsSolve: [],
      cuotesSolve: [],
    };
  },
  computed: {
    transformedTen() {
      return (Math.pow(1 + this.tea / 100, this.timeT / 12) - 1) * 100;
    },
    cuoteResult() {
      return this.cuoteUnit.code == 0
        ? (this.loan * this.cuote) / 100
        : this.cuote;
    },
    financialResult() {
      return this.cuoteUnit.code == 0
        ? this.loan * ((100 - this.cuote) / 100)
        : this.loan - this.cuote;
    },
    numberOfCuotes() {
      return (
        (this.time * this.divisors[this.timeTUnit.code]) /
        (this.timeT * this.divisors[this.timeUnit.code])
      );
    },
    amortizations() {
      return this.financialResult / this.numberOfCuotes;
    },
  },
  methods: {
    solve() {
      var principalC = this.financialResult;
      console.log(this.cuoteResult);
      for (let i = 0; i < this.numberOfCuotes; i++) {
        var interestTemp = (principalC * this.transformedTen) / 100;
        this.interestsSolve.push(interestTemp);
        this.cuotesSolve.push(interestTemp + principalC);
        principalC = principalC - this.amortizations;
      }
      console.log("interests: ", this.interestsSolve);
      console.log("cuotes: ", this.cuotesSolve);
    },
  },
};
</script>

<style scoped>
</style>