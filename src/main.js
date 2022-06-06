import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/md-light-indigo/theme.css"; //theme
import "/node_modules/primeflex/primeflex.css"; //prime-flex
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Card from "primevue/card";
import Toolbar from "primevue/toolbar";
import InputSwitch from "primevue/inputswitch";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });

//Components
app.component("pv-button", Button);
app.component("pv-data-table", DataTable);
app.component("pv-input-text", InputText);
app.component("pv-input-number", InputNumber);
app.component("pv-card", Card);
app.component("pv-toolbar", Toolbar);
app.component("pv-input-switch", InputSwitch);
app.component("pv-toast", Toast);

app.mount("#app");
