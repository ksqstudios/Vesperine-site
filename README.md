# vesperine-site

Marketing site for Vesperine, vesperine.app.

Static HTML/CSS, deployed via Cloudflare Pages with GitHub auto-deploy on push to `main`.

Candlelight, after dark, like the app: coal paper, cream ink, honey for the Mirror. Cormorant Garamond for display, Newsreader for reading. A candle glow in the corner burns down as you read toward the end of the home page.

```
.
├── index.html         # home page
├── privacy.html       # privacy policy (linked from app Settings)
├── support.html       # support page with FAQ
├── event/duo.html     # 2.1 release page (deep link target)
├── styles.css         # shared stylesheet
├── scripts.js         # candle, the example evening, Looking back
├── _headers           # Cloudflare Pages headers
├── .well-known/       # apple-app-site-association for universal links
└── images/            # app screenshots and the iPhone Duo image
```

The example evening in the hero is written for the page: the entries and reflections in `scripts.js` are not generated, and the caption says so.

## Analytics

None. The privacy policy says the site collects nothing: no analytics, no cookies, no third-party scripts. Keep it that way.
