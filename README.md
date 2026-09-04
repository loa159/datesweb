# Ben Laribi Dattes

This project is a premium static website for Ben Laribi Dattes, Sté Ben Laribi & Co, built with HTML, CSS and vanilla JavaScript.

## Run locally

Open the project in VS Code and use Live Server, or run:

```bash
cd ben-laribi-dattes
python -m http.server 8000
```

Then open http://localhost:8000 in the browser.

## Customize config

Edit `js/config.js` to set email, phone, address and WhatsApp values.

## Add products and articles

- `data/products.js`

## Replace images

Use the folders under `images/`.

## Update styles

- `css/style.css`
- `css/responsive.css`
- `css/animations.css`

## Code structure

- `data/products.js` stores the product catalog data only.
- `js/config.js` stores company contact and site configuration.
- `js/main.js` contains behavior shared by every page.
- `js/language.js` contains translations and language switching.
- `js/product-card.js` is the shared product-card renderer used by the catalog and related-products sections.
- `js/products.js` handles catalog filtering and rendering.
- `js/product-details.js` handles the product detail page and related products.
- `js/contact.js` handles contact form behavior.
- `css/style.css` contains shared tokens, layout, components, and page styles.
- `css/responsive.css` contains breakpoint-specific layout changes.
- `css/animations.css` contains reveal and motion styles.

When changing product-card markup, edit `js/product-card.js` instead of duplicating the HTML in a page script.

## Configure contact handling

The contact form is a frontend demo and shows a development message if no backend is configured.
