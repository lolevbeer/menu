

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
    async loadData(addr) {
      let rLk = Math.random().toString(36).slice(2, 4);
      let rLv = Math.random().toString(36).slice(2, 4);
      let response = await axios.get(addr);
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
        let style = item.getElementsByClassName('beer-style');
        if (style.length) {
          style[0].style.backgroundColor = color;
        }
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
      console.log('Data updated from ' + addr)
    }, 15000);
    window.addEventListener('error', () => location.reload(), true);
  }
});
