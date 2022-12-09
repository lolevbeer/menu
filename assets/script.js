let beers = document.querySelectorAll('section article'),
    row1 = Math.ceil(beers.length / 2),
    percent = 1 / row1 * 100;

console.log(row1)
for (let beer of beers) {
  beer.style.flexBasis = percent +"%";
}

let items = document.querySelectorAll("article");
for (let i = 0; i < items.length; i++) {
  items[i].style.color = randomColor({ luminosity: "light" });
}
