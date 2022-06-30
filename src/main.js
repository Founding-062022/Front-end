import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/md-light-indigo/theme.css"; //theme
import "/node_modules/primeflex/primeflex.css"; //prime-flex
import VueSmoothScroll from "vue3-smooth-scroll";
import ToastService from "primevue/toastservice";
import store from "./store";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Card from "primevue/card";
import Toolbar from "primevue/toolbar";
import InputSwitch from "primevue/inputswitch";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Checkbox from "primevue/checkbox";
import Password from "primevue/password";
import OverlayPanel from "primevue/overlaypanel";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import Menu from "primevue/menu";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(VueSmoothScroll);
app.use(store);
app.use(ToastService);

//Components
app.component("pv-button", Button);
app.component("pv-data-table", DataTable);
app.component("pv-input-text", InputText);
app.component("pv-input-number", InputNumber);
app.component("pv-password", Password);
app.component("pv-card", Card);
app.component("pv-toolbar", Toolbar);
app.component("pv-input-switch", InputSwitch);
app.component("pv-toast", Toast);
app.component("pv-checkbox", Checkbox);
app.component("pv-overlay-panel", OverlayPanel);
app.component("pv-dropdown", Dropdown);
app.component("pv-column", Column);
app.component("pv-dialog", Dialog);
app.component("pv-calendar", Calendar);
app.component("pv-menu", Menu);
app.component("pv-column-group", ColumnGroup);
app.component("pv-row", Row);
app.mount("#app");
