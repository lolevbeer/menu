

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
    getElementPosition(element) {
      let boundingBox = element.getBoundingClientRect();
      let offsetLeft = boundingBox.left + window.pageXOffset;
      let offsetRight = boundingBox.right + window.pageXOffset;
      return { left: offsetLeft, right: offsetRight };
    },
    getWidths() {
      let articles = document.querySelectorAll("article");

      articles.forEach((article) => {
        // Get the .percent and .beer-info elements within this article
        let percentElement = article.querySelector(".percent");
        let beerInfoElement = article.querySelector(".beer-info");

        // Get the .description element within this article
        let descriptionElement = article.querySelector(".description");

        // Ensure all elements exist
        if (percentElement && beerInfoElement && descriptionElement) {
          // Get the positions of each element
          let percentPosition = this.getElementPosition(percentElement);
          let beerInfoPosition = this.getElementPosition(beerInfoElement);

          console.log("percentRight",percentPosition.right, "InfoPosition", beerInfoPosition.left)

          // Calculate the distance in pixels along the X-axis
          let distanceX = Math.abs(percentPosition.right - beerInfoPosition.left);

          // Set this distance as the max-width of the .description element
          descriptionElement.style.maxWidth = distanceX - 30 + "px";

        }
      });
    },
    adjustPosition(app) {
      let height = app.offsetHeight;
      let margin = (window.innerHeight - height) / 2
      app.style.marginTop = (75 + margin) + 'px';
    },
    changeColors() {
      let items = document.querySelectorAll('article');
      for (let i = 0; i < items.length; i++) {
        let color = randomColor({ luminosity: 'bright'});
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
    this.loadData(id, tab);
    setInterval(() => {
      this.getWidths();
      this.adjustPosition(app);
    }, 100);
    setInterval(() => {
      this.refreshOnUpate();
    }, 5000);
    setInterval(() => {
      this.loadData(id, tab);
      console.log('Data updated from Google Sheets')
    }, 10000);
  }
});
