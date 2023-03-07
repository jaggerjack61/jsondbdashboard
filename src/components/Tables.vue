<template>
  <div>
    <div  v-if="!$store.state.records">
    <h2>Database: {{$store.state.database.replace('.json','')}}</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody v-if="$store.state.tables">
        <tr v-for="table in $store.state.tables">
            <td><a href="#">{{ table.name }}</a></td>
            <td><a href="#" @click="getRecords(table.name)" class="btn btn-info btn-sm m-1">View</a>
              <a href="#" class="btn btn-danger btn-sm m-1">Delete</a></td>
        </tr>
      </tbody>
    </table>
  </div>
    <div  v-if="$store.state.records">
      <div class="row m-2">
        <div class="col-3"><span class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addRecordModal">new {{$store.state.table}} record</span></div>
        <div class="col-9"><h2>Table: {{$store.state.table}}</h2></div>
      </div>


      <table class="table table-bordered">
        <thead>
        <tr>
          <th v-for="(value, key) in columns">{{value}}</th>

        </tr>
        </thead>
        <tbody v-if="$store.state.records">
        <tr v-for="row in $store.state.records">
          <td v-for="data in row"><a href="#">{{ data }}</a></td>

<!--          <td><a href="#" @click="getRecords(table.name)" class="btn btn-info btn-sm m-1">View</a>-->
<!--            <a href="#" class="btn btn-danger btn-sm m-1">Delete</a></td>-->
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="schema" class="modal fade" id="addRecordModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add New Record</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row" v-for="sc in schema">

              <input type="text" :id="sc.name" class="form-control m-1" v-if="sc.type==='string'" :placeholder="sc.name+' '+sc.type">
              <input type="number" :id="sc.name" class="form-control m-1" step="1" v-if="sc.type==='integer' && sc.name!=='id'" :placeholder="sc.name+' '+sc.type">
              <input type="number" :id="sc.name" class="form-control m-1" v-if="sc.type==='float'" :placeholder="sc.name+' '+sc.type">


            </div>
            <button @click="createRecord()" class="form-control">submit</button>
          </div>

        </div>
      </div>
    </div>




  </div>
</template>
<script>
import store from "@/store";
import axios from "axios";

export default {
  name: 'Tables',

  mounted() {





  },
  data() {
    return {
          columns:null,
          schema:null
    }
  },
  methods: {
    getRecords(table) {

      store.commit('setTable',table);
      console.log(store.state.table)
      axios.post('http://localhost:8000/table', {
        database: store.state.database,
        table: table,

      })
          .then((response)=> {
            store.commit('setRecords', response.data[table]);
            console.log(response.data[table][0]);
            this.columns = null;
            this.columns = Object.keys(response.data[table][0]??[{column:'???'}]);
            this.getSchema(table)

          })
          .catch(function (error) {
            console.log(error);
          });
    },
    getSchema(table){
      axios.post('http://localhost:8000/schema', {
        database: store.state.database,
        table: table,

      })
          .then((response)=> {
            console.log('hello');
            console.log(response)
            this.schema = response.data;

          })
          .catch(function (error) {
            console.log(error);
          });
    },
    createRecord() {

      let sc = {};
      let schema = this.schema;
      for (let i = 0; i < schema.length; i++) {
        if(schema[i]['name'] !== 'id'){
          if(schema[i]['type'] === 'string'){
            Object.assign(sc, {[schema[i]['name']] : document.getElementById(schema[i]['name']).value});
          }
          else if(schema[i]['type'] === 'integer') {
            Object.assign(sc, {[schema[i]['name']] : parseInt(document.getElementById(schema[i]['name']).value,10)});
          }
          else if(schema[i]['type'] === 'float') {
            Object.assign(sc, {[schema[i]['name']] : parseFloat(document.getElementById(schema[i]['name']).value)});
          }

        }
      }
      Object.assign(sc,{'database': store.state.database.replace('.json','')});
      Object.assign(sc,{'table': store.state.table});
      console.log(sc);
      axios.post('http://localhost:8000/save',sc)
          .then((response)=> {
            console.log(response);

          })
          .catch(function (error) {
            console.log(error);
          });
    },
    dynamicV(data) {
      return data.toString();
    }
  }
}
</script>