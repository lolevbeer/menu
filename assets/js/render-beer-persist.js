new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    beers: []
  },
  methods: {
    async loadData() {
      let rLk = Math.random().toString(36).slice(2, 4);
      let rLv = Math.random().toString(36).slice(2, 4);
      const response = await fetch(`https://lolev.beer/menu.json?${rLk}=${rLv}`);
      const data = await response.json();
      this.beers = data;
      this.$nextTick(this.changeColors);
    },
    async checkForRefresh() {
      const response = await fetch(`/timestamp.json`);
      const data = await response.json();
      let timestamp = data[0].timestamp;
      let lastRefresh = localStorage.getItem("lastRefresh");
      if (timestamp != lastRefresh) {
        location.reload()
        localStorage.setItem("lastRefresh", timestamp);
      }
    },
    changeColors() {
      let items = document.querySelectorAll('article');
      for (let i = 0; i < items.length; i++) {
        items[i].style.color = randomColor({ luminosity: "light" });
      }
    },
    refresh() {
      window.location.reload(true);
    }
  },
  mounted() {
    this.loadData();
    this.intervalId = setInterval(() => {
      this.loadData();
      this.checkForRefresh();
    }, 5000);
    window.addEventListener('error', () => location.reload(), true);
  }
});
