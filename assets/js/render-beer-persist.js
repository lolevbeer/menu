new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    items: []
  },
  methods: {
    async loadData(addr) {
      let rLk = Math.random().toString(36).slice(2, 4);
      let rLv = Math.random().toString(36).slice(2, 4);
      try {
        const response = await fetch(`${addr}?${rLk}=${rLv}`);
        const data = await response.json();
        this.items = data;
        console.log(data)
        this.$nextTick(this.changeColors);
      } catch (error) {
        console.log(error)
      }
    },
    async refreshOnUpate() {
      try {
        const response = await fetch(`/timestamp.json`);
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
    changeColors() {
      let items = document.querySelectorAll('article');
      for (let i = 0; i < items.length; i++) {
        let color = randomColor({ luminosity: "light" });
        items[i].style.color = color;
      }
    }
  },
  mounted() {
    const app = document.querySelector("#app");
    const addr = app.dataset.addr;
    this.loadData(addr);
    setInterval(() => {
      this.loadData(addr);
      this.refreshOnUpate();
    }, 5000);
    window.addEventListener('error', () => location.reload(), true);
  }
});
