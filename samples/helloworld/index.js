import hello from "./helloworld.wk";
import css from "./style.css";

document.addEventListener("DOMContentLoaded", function(event) { 
    whisk.mount(new hello(), "app");
});