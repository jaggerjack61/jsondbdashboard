<template>
  <div>
    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
      <h2>Databases</h2>
    <ul class="menu-inner py-1">
      <!-- Dashboard -->
      <li class="menu-item">
        <a href="#" class="menu-link" data-bs-toggle="modal" data-bs-target="#addDatabaseModal">
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

    <div class="modal fade" id="addDatabaseModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add New Database</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">


              <input type="text" v-model="create_database" id="database" class="form-control m-1" placeholder="Database name">




            <button @click="createDatabase()" class="form-control">submit</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import store from "@/store";
import {toast} from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: 'Sidebar',

  mounted() {

      axios.get('http://localhost:8000').then(response => this.databases = response.data).catch(error => this.database='error');



  },
  data() {
    return {
      databases: null,
      create_database:null,
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
    },
    createDatabase() {

      axios.post('http://localhost:8000/create', {
        database: this.create_database.replace(' ','_'),

      })
          .then( (response)=> {

            store.commit('setDatabase',this.create_database.replace(' ','_')+'.json');
            store.commit('setRecords',null);
            axios.get('http://localhost:8000').then(response => this.databases = response.data).catch(error => this.database='error');
            this.getTables(this.create_database.replace(' ','_')+'.json')
            toast.success("Database has been created successfully",{autoClose:1500});
          })
          .catch(function (error) {
            console.log(error);
            toast.warning("There was an error during the database creation process",{autoClose:1500});
          });


    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
