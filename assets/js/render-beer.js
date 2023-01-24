new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    beers: []
  },
  methods: {
    async loadData() {
      const response = await fetch('https://lolev.beer/menu.json');
      const data = await response.json();
      this.beers = data;
      this.$nextTick(this.changeColors);
    },
    changeColors() {
      let items = document.querySelectorAll('article');
      console.log(items.length)
      for (let i = 0; i < items.length; i++) {
        items[i].style.color = randomColor({ luminosity: "light" });
      }
    }
  },
  mounted() {
    this.loadData();
  }
});
