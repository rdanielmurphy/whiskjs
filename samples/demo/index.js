import demo from "./components/demo.wk";
import css from "./style.css";

document.addEventListener("DOMContentLoaded", function(event) { 
    whisk.mount(new demo(), "app");
});