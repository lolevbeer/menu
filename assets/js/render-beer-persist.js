

new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    items: []
  },
  methods: {
    async loadData(addr) {
      const googleSheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQAp3EundNzu6OHCDLFrYUTcU36xsIl4DoTewG2a9HKfSyeHm_YKBiQ5xdaxosJh364-e9Vz5fFYqPD/pub?output=csv'
      let response = await axios.get(googleSheet);
      let parsedData = Papa.parse(response.data, { header: true }).data;
      let json = { ...parsedData }
      try {
        this.items = json;
        this.$nextTick(this.changeColors)
      } catch (error) {
        console.log(error)
      }
    },
    async refreshOnUpate() {
      try {
        let rLk = Math.random().toString(36).slice(2, 4);
        let rLv = Math.random().toString(36).slice(2, 4);
        const response = await fetch(`/timestamp.json?${rLk}=${rLv}`);
        const data = await response.json();
        let timestamp = data.timestamp;
        let lastRefresh = localStorage.getItem("lastRefresh");
        if (timestamp != lastRefresh) {
          location.reload()
          localStorage.setItem("lastRefresh", timestamp);
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
        let color = randomColor({ luminosity: "light" });
        let item = items[i];
        item.style.color = color;
        item.getElementsByClassName('beer-style')[0].style.backgroundColor = color;
      }
    }
  },
  mounted() {
    const app = document.querySelector("#app");
    const addr = app.dataset.addr;
    this.loadData(addr, app);
    setInterval(() => {
      this.adjustPosition(app);
    }, 1000);
    setInterval(() => {
      this.refreshOnUpate();
    }, 5000);
    setInterval(() => {
      this.loadData(addr);
    }, 30000);
    window.addEventListener('error', () => location.reload(), true);
  }
});
