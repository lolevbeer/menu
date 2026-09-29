# menu.lolev.beer

This GitHub Pages site now redirects every HTML page (including former kiosk/display URLs) to [https://lolev.beer/](https://lolev.beer/).

GitHub Pages cannot emit a true HTTP `301` to another domain. Pages use an immediate meta refresh + `location.replace` plus a `canonical` link to the main site. For a hard HTTP 301, put Cloudflare (or similar) in front of `menu.lolev.beer`.

Deploy: push to `master` → Actions builds Jekyll → publishes `gh-pages`.
