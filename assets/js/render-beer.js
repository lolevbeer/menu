if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/assets/js/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    items: []
  },
  methods: {
    async loadData() {
      const response = await fetch('https://lolev.beer/menu.json');
      const data = await response.json();
      this.items = data;
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
