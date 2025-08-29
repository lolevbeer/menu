new Vue({
  delimiters: ['${', '}'],
  el: '#app',
  data: {
    items: []
  },
  methods: {
    changeColors() {
      let items = document.querySelectorAll('article');
      for (let i = 0; i < items.length; i++) {
        let color = randomColor({ luminosity: 'light'});
        let item = items[i];
        item.style.color = color;
      }
    },
    isUpcomingEvent(dateString) {
      if (!dateString) return false;
      // Parse date as local time, not UTC
      const [year, month, day] = dateString.split('-');
      const eventDate = new Date(year, month - 1, day);
      eventDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today; // This includes today's events
    },
    formatDate(dateString) {
      if (!dateString) return '';
      // Parse date as local time, not UTC
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    async loadEventsData() {
      console.log('Loading events from multiple sources');
      let ak = 'AIzaSyD4yUvvzDDtsAa4MzlO0jrSMLdlVyQqOhY';
      
      // Get sheet IDs from data attributes
      const app = document.getElementById('app');
      let eventSheetId = app.dataset.eventSheetId || '1i-9OpihaBU4QSoVjZrLPpBW_Xjn7cGTQ6IRBwp8mDjk';
      let foodSheetId = app.dataset.foodSheetId || '1QXWoyMGc9Q7V01ZLpFJn1mE-HXXaOpwFy5Ss5l3z7Pw';
      
      console.log('Using Event Sheet ID:', eventSheetId);
      console.log('Using Food Sheet ID:', foodSheetId);
      
      // Build URLs only if we have valid sheet IDs
      let eventAddr = null;
      let foodAddr = null;
      
      if (eventSheetId && eventSheetId !== 'undefined') {
        eventAddr = `https://sheets.googleapis.com/v4/spreadsheets/${eventSheetId}/values/Events?key=${ak}`;
        console.log('Event URL:', eventAddr);
      }
      
      if (foodSheetId && foodSheetId !== 'undefined') {
        foodAddr = `https://sheets.googleapis.com/v4/spreadsheets/${foodSheetId}/values/Food?key=${ak}`;
        console.log('Food URL:', foodAddr);
      }
      
      try {
        // Prepare promises array
        let promises = [];
        if (eventAddr) promises.push(axios.get(eventAddr));
        else promises.push(Promise.reject('No event sheet ID'));
        
        if (foodAddr) promises.push(axios.get(foodAddr));
        else promises.push(Promise.reject('No food sheet ID'));
        
        // Fetch both sheets in parallel
        let [eventsResponse, foodResponse] = await Promise.allSettled(promises);
        
        let allItems = [];
        
        // Process events sheet
        if (eventsResponse.status === 'fulfilled') {
          let eventData = eventsResponse.value.data.values;
          let eventHeaders = eventData[0];
          let eventItems = eventData.slice(1).map(row => {
            let item = {};
            row.forEach((value, index) => {
              item[eventHeaders[index]] = value;
            });
            return item;
          });
          allItems = allItems.concat(eventItems);
          console.log('Loaded events:', eventItems.length);
        } else {
          console.warn('Could not load events sheet:', eventsResponse.reason);
        }
        
        // Process food vendors sheet
        if (foodResponse.status === 'fulfilled') {
          let foodData = foodResponse.value.data.values;
          let foodHeaders = foodData[0];
          let foodItems = foodData.slice(1).map(row => {
            let item = {};
            row.forEach((value, index) => {
              item[foodHeaders[index]] = value;
            });
            // Mark as food vendor and add suffix
            if (item.vendor) {
              item.vendor = item.vendor + ' • Food';
              item.isFood = true;
            }
            return item;
          }).filter(item => item.vendor && item.date); // Only include items with vendors and dates
          allItems = allItems.concat(foodItems);
          console.log('Loaded food vendors:', foodItems.length);
        } else {
          console.warn('Could not load food vendors sheet:', foodResponse.reason);
        }
        
        // Filter for upcoming events and sort by date
        allItems = allItems.filter(item => this.isUpcomingEvent(item.date));
        allItems.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Limit to next 9 events
        allItems = allItems.slice(0, 9);
        
        console.log('Total upcoming events (showing 9):', allItems.length);
        this.items = allItems;
        this.$nextTick(this.changeColors);
      } catch (error) {
        console.error('Error loading events data:', error);
        
        // If we get a 403, show a warning for local testing
        if (error.response && error.response.status === 403) {
          console.warn('403 Error - This usually happens when testing locally. The page will work on menu.lolev.beer');
        }
      }
    },
    async refreshOnUpdate() {
      try {
        let rLk = Math.random().toString(36).slice(2, 4);
        let rLv = Math.random().toString(36).slice(2, 4);
        const response = await fetch(`/timestamp.json?${rLk}=${rLv}`);
        const data = await response.json();
        let timestamp = data.timestamp;
        let lastRefresh = localStorage.getItem('lastRefreshEvents');
        if (timestamp != lastRefresh) {
          await this.loadEventsData();
          localStorage.setItem('lastRefreshEvents', timestamp);
          this.$nextTick(this.changeColors);
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    console.log('Events Vue app mounted');
    
    (async () => {
      console.log('Starting initial events data load');
      await this.loadEventsData();

      // Refresh based on timestamp
      setInterval(() => {
        this.refreshOnUpdate();
      }, 10000);

      // Also refresh from sheets periodically
      setInterval(async () => {
        await this.loadEventsData();
        console.log('Events data refreshed');
      }, 30000);
    })();
  }
});