

new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    items: []
  },
  filters: {
    replaceDashes(value) {
      if (typeof value === 'string') {
        return value.replace(/-/g, ' ');
      }
      return value;
    }
  },
  methods: {
    async loadData(id, tab) {
      let ak = 'AIzaSyD4yUvvzDDtsAa4MzlO0jrSMLdlVyQqOhY';
      let addr = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${tab}?key=${ak}`;

      try {
        let response = await axios.get(addr);
        let parsedData = response.data.values; // 'values' contains the data

        // Assuming the first row contains headers, we use it to build objects for each subsequent row
        let headers = parsedData[0];
        let items = parsedData.slice(1).map(row => {
          let item = {};
          row.forEach((value, index) => {
            item[headers[index]] = value;
          });
          return item;
        });

        this.items = items;
        this.$nextTick(this.changeColors);
      } catch (error) {
        console.log(error);
      }
    },
    async refreshOnUpate() {
      try {
        let rLk = Math.random().toString(36).slice(2, 4);
        let rLv = Math.random().toString(36).slice(2, 4);
        const response = await fetch(`/timestamp.json?${rLk}=${rLv}`);
        const data = await response.json();
        let timestamp = data.timestamp;
        let lastRefresh = localStorage.getItem('lastRefresh');
        if (timestamp != lastRefresh) {
          location.reload()
          localStorage.setItem('lastRefresh', timestamp);
        }
      } catch (error) {
        console.log(error)
      }
    },
    adjustPosition(app) {
      let height = app.offsetHeight;
      let margin = (window.innerHeight - height) / 2
      app.style.marginTop = margin + 'px';
    },
    changeColors() {
      let items = document.querySelectorAll('article');
      for (let i = 0; i < items.length; i++) {
        let color = randomColor({ luminosity: 'light'});
        let item = items[i];
        item.style.color = color;
        let style = item.getElementsByClassName('beer-style');
        if (style.length) {
          style[0].style.backgroundColor = color;
        }
      }
    }
  },
  mounted() {
    const id = app.dataset.id;
    const tab = app.dataset.tab;
    // const sheetId = '1kzvwcErnsYkShc1rEalzlKSsDQzF6wb-CyIwtZ44syY'; // Replace with your Google Sheets ID
    // const tab = 'Beer Menu'; // Replace with your sheet's name
    this.loadData(id, tab);
    setInterval(() => {
      this.adjustPosition(app);
    }, 1000);
    setInterval(() => {
      this.refreshOnUpate();
    }, 1000);
    setInterval(() => {
      this.loadData(id, tab);
      console.log('Data updated from Google Sheets')
    }, 10000);
  }
});
