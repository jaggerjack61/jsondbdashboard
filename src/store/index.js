import { createStore } from 'vuex'

export default createStore({
  state: {
    database:'',
    table:'',
    tables:null,
    records:null,
  },
  getters: {
  },
  mutations: {
    setDatabase(state,database){
      state.database = database;
      console.log(database);
    },
    setTable(state,table){
      state.table = table;
    },
    setTables(state,tables){
      state.tables = tables;
    },
    setRecords(state, records) {
      state.records = records;
    }
  },
  actions: {
  },
  modules: {
  }
})
