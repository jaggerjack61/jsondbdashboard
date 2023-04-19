<template>
  <div>
    <div v-if="!$store.state.records">
      <div class="row m-2">
        <div class="col-3"><span v-if="!$store.state.records && $store.state.database" class="btn btn-primary btn-sm"
                                 data-bs-toggle="modal"
                                 data-bs-target="#addTableModal">new {{ $store.state.database.replace('.json', '') }} table</span>
        </div>
        <div class="col-9"><h2>Database: {{ $store.state.database.replace('.json', '') }}</h2></div>
      </div>
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
    <div v-if="$store.state.records">
      <div class="row m-2">
        <div class="col-3"><span class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addRecordModal">new {{ $store.state.table }} record</span>
        </div>
        <div class="col-9"><h2>Table: {{ $store.state.table }}</h2></div>
      </div>


      <table class="table table-bordered">
        <thead>
        <tr>
          <th v-for="(value, key) in columns">{{ value }}</th>

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
    <div v-if="schema" class="modal fade" id="addRecordModal" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add New Record</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row" v-for="sc in schema">

              <input type="text" :id="sc.name" class="form-control m-1" v-if="sc.type==='string'"
                     :placeholder="sc.name+' '+sc.type">
              <input type="number" :id="sc.name" class="form-control m-1" step="1"
                     v-if="sc.type==='integer' && sc.name!=='id'" :placeholder="sc.name+' '+sc.type">
              <input type="number" :id="sc.name" class="form-control m-1" v-if="sc.type==='float'"
                     :placeholder="sc.name+' '+sc.type">


            </div>
            <button @click="createRecord()" class="form-control">submit</button>
          </div>

        </div>
      </div>
    </div>
    <div v-if="!$store.state.records && $store.state.database" class="modal modal-xl ms-5 pe-5 fade" id="addTableModal"
         tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add New Table</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <input class="form-control m-2" id="table_name" placeholder="Table name"/>
            </div>
            <div class="row" v-for="c in count">

              <div class="col-3">
                <input type="text" class="form-control m-1" :id="'column'+c" placeholder="column name">
              </div>
              <div class="col-3">

                <select :id="'data_type'+c" class="form-control m-1">
                  <option value="">Select Datatype</option>
                  <option value="integer">Integer</option>
                  <option value="float">Float</option>
                  <option value="string">String</option>
                </select>
              </div>

              <div class="col-3">
                <label>Encrypted</label>
                <br>
                <input type="checkbox" class="" :id="'encrypted'+c">
              </div>

              <div class="col-3">

                <input class="form-control m-1" type="number" step="1" :id="'length'+c" placeholder="length">
              </div>


            </div>
            <button @click="addColumn()" class="form-control">More Columns</button>
            <button @click="removeColumn()" v-if="count>0" class="form-control">Less Columns</button>
            <button @click="createTable()" v-if="count>0" class="form-control">Submit</button>

          </div>

        </div>
      </div>
    </div>


  </div>
</template>
<script>
import store from "@/store";
import axios from "axios";
import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'Tables',

  mounted() {


  },
  data() {
    return {
      columns: null,
      schema: null,
      count: 1,
      strLength: []
    }
  },
  methods: {
    getRecords(table) {

      store.commit('setTable', table);
      console.log(store.state.table)
      axios.post('http://localhost:8000/table', {
        database: store.state.database,
        table: table,

      })
          .then((response) => {
            store.commit('setRecords', response.data[table]);
            console.log(response.data[table][0]);
            this.columns = null;
            this.columns = Object.keys(response.data[table][0] ?? [{column: '???'}]);
            this.getSchema(table)

          })
          .catch(function (error) {
            console.log(error);
          });
    },
    getSchema(table) {
      axios.post('http://localhost:8000/schema', {
        database: store.state.database,
        table: table,

      })
          .then((response) => {
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
        if (schema[i]['name'] !== 'id') {
          if (schema[i]['type'] === 'string') {
            Object.assign(sc, {[schema[i]['name']]: document.getElementById(schema[i]['name']).value});
          } else if (schema[i]['type'] === 'integer') {
            Object.assign(sc, {[schema[i]['name']]: parseInt(document.getElementById(schema[i]['name']).value, 10)});
          } else if (schema[i]['type'] === 'float') {
            Object.assign(sc, {[schema[i]['name']]: parseFloat(document.getElementById(schema[i]['name']).value)});
          }

        }
      }
      Object.assign(sc, {'database': store.state.database.replace('.json', '')});
      Object.assign(sc, {'table': store.state.table});
      console.log(sc);
      axios.post('http://localhost:8000/save', sc)
          .then((response) => {
            toast.info(response.data.message, {autoClose: 2000});
            console.log(response);
            this.getRecords(store.state.table)
          })
          .catch(function (error) {
            toast.warning('Failed to save record.', {autoClose: 2000});
            console.log(error);
          });
    },
    dynamicV(data) {
      return data.toString();
    },
    addColumn() {
      this.count++;
    },
    removeColumn() {
      this.count--;
    },
    createTable() {
      let sc = {
        "table": document.getElementById('table_name').value.replace(' ', '_'),
        "schema": [],
        "database": store.state.database.replace('.json', '')
      };
      for (let i = 1; i <= this.count; i++) {
        if (document.getElementById('data_type' + i.toString()).value === 'string' && document.getElementById('length' + i.toString()).value !== null) {
          sc["schema"].push({
                "name": document.getElementById('column' + i.toString()).value.replace(' ', '_'),
                "type": document.getElementById('data_type' + i.toString()).value,
                "encrypted": document.getElementById('encrypted' + i.toString()).checked,
                "length": parseInt(document.getElementById('length' + i.toString()).value)
              }
          );

        } else {
          sc["schema"].push({
                "name": document.getElementById('column' + i.toString()).value.replace(' ', '_'),
                "type": document.getElementById('data_type' + i.toString()).value,
                "encrypted": document.getElementById('encrypted' + i.toString()).checked
              }
          );

        }


      }

      // sc[2]=store.state.database.replace('.json','');

      console.log(sc);
      axios.post('http://localhost:8000/create/table', sc)
          .then((response) => {
            toast.success('Table successfully created.', {autoClose: 2000});
            console.log(response);
            axios.post('http://localhost:8000/database', {
              database: store.state.database,

            })
                .then(function (response) {
                  store.commit('setTables', response.data);
                })
                .catch(function (error) {
                  toast.warning('Failed to create table.', {autoClose: 2000});
                  console.log(error);
                });


          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}
</script>