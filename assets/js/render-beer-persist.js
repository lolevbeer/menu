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
          // Instead of reloading the page, refresh the Vue data
          await this.loadData(id, tab); // Ensure you have access to id and tab
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
    addCounts() {
      // Count all 'article' tags
      var articleCount = document.querySelectorAll('article').length;
      var newClassName = 'count-' + articleCount;

      // Select the '#app' element
      var appElement = document.querySelector('#app');
      if (appElement) {
        // Check if class name has changed
        if (appElement.className !== newClassName) {
          // Update class name
          appElement.className = newClassName;

          // Wait for the next DOM update cycle
          this.$nextTick(() => {
            // Then reset animations
            this.resetAnimations();
            console.log('Reset animations');
          });
        }
      }
    },
    resetAnimations() {
      let animatedElements = document.querySelectorAll('.price, .sale'); // Add other selectors as needed
      animatedElements.forEach(el => {
        // Force a reflow
        void el.offsetWidth;

        // Restart animation
        el.style.animation = 'none';
        setTimeout(() => {
          el.style.animation = '';
        }, 10);
      });
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
          // Get the positions of each element using offsetLeft instead of getBoundingClientRect
          let percentPosition = percentElement.offsetLeft + percentElement.offsetWidth;
          let beerInfoPosition = beerInfoElement.offsetLeft;

          let distanceX = Math.abs(percentPosition - beerInfoPosition);

          // Set this distance as the max-width of the .description element
          descriptionElement.style.maxWidth = distanceX - 30 + "px";
        }
      });
    },
    adjustPosition(app) {
      let height = app.offsetHeight;
      let margin = (window.innerHeight - height) / 2;
      app.style.marginTop = (75 + margin) + 'px';
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

    // Make the mounted method async
    (async () => {
      // Await the completion of loadData before executing addCounts
      await this.loadData(id, tab);
      this.addCounts();

      // The rest of your setInterval calls remain the same
      setInterval(() => {
        this.getWidths();
        this.adjustPosition(app);
      }, 100);

      setInterval(() => {
        this.refreshOnUpate();
      }, 10000);

      setInterval(async () => {
        await this.loadData(id, tab);
        console.log('Data updated from Google Sheets');
        this.addCounts();
        console.log("Counts updated");
      }, 10000);
    })();
  }
});
