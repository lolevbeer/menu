new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    beers: []
  },
  methods: {
    loadData: function () {
      fetch('https://lolev.beer/menu.json')
        .then(response =>
          response.json()
        )
        .then(data =>
          this.beers = data
        );
    }
  },
  mounted: function () {
    this.loadData();
    setInterval(function () {
      this.loadData();
      let items = document.querySelectorAll('article'),
          columnSize = Math.ceil(items.length / 2),
          percent = 1 / columnSize * 100;
      for (let i = 0; i < items.length; i++) {
        items[i].style.flexBasis = percent +"%";
        items[i].style.color = randomColor({ luminosity: "light" });
      }
    }.bind(this), 5000);

  }
});
