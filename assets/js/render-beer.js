let gs =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPjm7mKrXp1FR-e_WKwCLKgAJLLo3N6ad48SESfujo3o7hwFqk06lseZTkUQ6vIaILlbJbjY05VpJh/pub?gid=0&single=true&output=csv";

$.ajax({
  url: gs,
  type: "GET",
  dataType: "text"
})
  .done(function (csv) {
    let beers = csvToJson(csv);
    console.log(beers);
    let app = new Vue({
      el: "#app",
      data: {
        beers: beers
      }
    });
  })
    .fail((e) => console.log(e.status));

fetch("/assets/beer.json")
  .then(response => {
     return response.json();
  })
  .then(data => {
    console.log(data.recipes);
    let app = new Vue({
      el: "#app-2",
      data: {
        recipes: data.recipes
      }
    });
  });


// Todo: repalce with a better csv parser.
let csvToJson = function (csv) {
  let lines = csv.split("\n");
  let result = [];
  let headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj = {};

    let row = lines[i],
      queryIdx = 0,
      startValueIdx = 0,
      idx = 0;

    if (row.trim() === "") {
      continue;
    }

    while (idx < row.length) {
      /* if we meet a double quote we skip until the next one */
      let c = row[idx];

      if (c === '"') {
        do {
          c = row[++idx];
        } while (c !== '"' && idx < row.length - 1);
      }

      if (
        c === "," ||
        /* handle end of line with no comma */ idx === row.length - 1
      ) {
        /* we've got a value */
        let value = row.substr(startValueIdx, idx - startValueIdx).trim();

        /* skip first double quote */
        if (value[0] === '"') {
          value = value.substr(1);
        }
        /* skip last comma */
        if (value[value.length - 1] === ",") {
          value = value.substr(0, value.length - 1);
        }
        /* skip last double quote */
        if (value[value.length - 1] === '"') {
          value = value.substr(0, value.length - 1);
        }

        let key = headers[queryIdx++];
        obj[key] = value;
        startValueIdx = idx + 1;
      }

      ++idx;
    }

    result.push(obj);
  }
  return result;
};
