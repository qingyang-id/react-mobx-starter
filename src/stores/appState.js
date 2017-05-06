import { observable, action } from 'mobx';
import axios from 'axios';

class AppState {
  @observable authenticated;
  @observable authenticating;
  @observable items;
  @observable item;

  constructor() {
    this.authenticated = false;
    this.authenticating = false;
    this.items = [];
    this.item = {};
  }

  async fetchData(pathname) {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com${pathname}`);
    console.log(data);
    if (data.length > 0) {
      this.setData(data);
    } else {
      this.setSingle(data);
    }
  }

  @action setData(data) {
    this.items = data;
  }

  @action setSingle(data) {
    this.item = data;
  }

  @action clearItems() {
    this.items = [];
    this.item = {};
  }

  @action authenticate() {
    return new Promise((resolve) => {
      this.authenticating = true;
      setTimeout(() => {
        this.authenticated = !this.authenticated;
        this.authenticating = false;
        resolve(this.authenticated);
      }, 0);
    });
  }

}

export default AppState;
