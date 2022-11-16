var beers = document.querySelectorAll('section article');
var row1 = beers.length / 2;
var percent = 1 / row1 * 100;

for (let beer of beers) {
  beer.style.flexBasis = percent +"%";
}
