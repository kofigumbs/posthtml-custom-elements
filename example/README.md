Running `node posthtml.js` builds [`index.html`](./index.html) and outputs the following HTML:

```html
<!DOCTYPE html>
<!-- "main" component -->
<body>
  <!-- this line causes ./hello-world.html to be loaded -->
  <hello-world></hello-world>
<template data-component="hello-world"><style>
  /* this style is scoped, so it only applied to the h1 in this file */
  h1 { background-color: red }
</style>

<h1>Hello,</h1>

<!-- this line causes ./greet-by-name.html to be loaded -->
<greet-by-name></greet-by-name>
</template><template data-component="greet-by-name"><h1 id="out"></h1>
<input id="in" autofocus="">

<!-- this script is only loaded once (at the end of the body) but is evaluated for each occurance on the page -->

</template><script>
        customElements.define('hello-world', class extends HTMLElement {
          connectedCallback() {
            console.log('hello-world');
            this.attachShadow({ mode: 'open' }).appendChild(document.querySelector('[data-component="hello-world"]').content.cloneNode(true));
            
          }
        });
      
        customElements.define('greet-by-name', class extends HTMLElement {
          connectedCallback() {
            console.log('greet-by-name');
            this.attachShadow({ mode: 'open' }).appendChild(document.querySelector('[data-component="greet-by-name"]').content.cloneNode(true));
            
  const root = this.shadowRoot || document; // declare `root` such that it works standalone on in custom element
  const in_ = root.getElementById('in');
  const out = root.getElementById('out');
  const listener = () => out.innerText = in_.value || '__type something__';
  listener();
  in_.addEventListener('input', listener);

          }
        });
      </script></body>
```
