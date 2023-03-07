<template>
  <div>
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
      <h2>Databases</h2>
    <ul class="menu-inner py-1">
      <!-- Dashboard -->
      <li class="menu-item">
        <a href="#" class="menu-link">
          <i class="menu-icon tf-icons bx bx-add-to-queue"></i>
          <div data-i18n="Analytics">Add New Database</div>
        </a>
      </li>
      <li class="menu-item"  v-for="database in databases">
        <a href="#" @click="getTables(database.name)" class="menu-link">
          <i class="menu-icon tf-icons bx bx-data"></i>
          <div data-i18n="Analytics" @click="getTables(database.name)">{{database.name.replace(".json","")}}</div>
        </a>
      </li>

    </ul>
    <p v-if="!databases">
      no databases
    </p>

    </aside>

  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";

export default {
  name: 'Sidebar',

  mounted() {

      axios.get('http://localhost:8000').then(response => this.databases = response.data).catch(error => this.database='error');



  },
  data() {
    return {
      databases: null,
    }
  },
  methods: {
    getTables(database) {
      store.commit('setDatabase',database);
      store.commit('setRecords',null);
      axios.post('http://localhost:8000/database', {
        database: database,

      })
          .then(function (response) {
            store.commit('setTables', response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
