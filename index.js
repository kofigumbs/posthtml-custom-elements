const fs = require('fs');
const path = require('path');

const getCustomElements = (tree, visitedComponents, bodyScripts, bodyTemplates) => {
  tree.walk(node => {
    if (node.tag && node.tag.includes('-') && !visitedComponents.has(node.tag)) {
      // find and parse corresponding element definition file
      visitedComponents.add(node.tag);
      const componentPath = node.tag.replace('.', path.sep) + '.html';
      const componentFile = fs.readFileSync(componentPath, 'utf8');
      const componentScript = [];
      const componentTemplate = { tag: 'template', attrs: { 'data-component': node.tag }, content: [] };
      const componentChildren = tree.parser(componentFile);
      // partition script and template
      for (const child of componentChildren)
        child.tag === 'script' ? componentScript.push(child.content) : componentTemplate.content.push(child);
      // append script and template to accumulator
      bodyScripts.push(`
        customElements.define('${node.tag}', class extends HTMLElement {
          connectedCallback() {
            console.log('${node.tag}');
            this.attachShadow({ mode: 'open' }).appendChild(document.querySelector('[data-component="${node.tag}"]').content.cloneNode(true));
            ${componentScript}
          }
        });
      `);
      bodyTemplates.push(componentTemplate);
      // recursive step
      componentChildren.walk = tree.walk;
      componentChildren.parser = tree.parser;
      getCustomElements(componentChildren, visitedComponents, bodyScripts, bodyTemplates);
    }
    return node;
  });
};

module.exports = () => {
  return tree => {
    let visitedComponents = new Set();
    let bodyScripts = [];
    let bodyTemplates = [];
    let bodyUpdated = false;
    getCustomElements(tree, visitedComponents, bodyScripts, bodyTemplates);
    tree.walk(node => {
      if (!bodyUpdated && node.tag === 'body') {
        bodyUpdated = true;
        bodyTemplates.forEach(template => node.content.push(template));
        node.content.push({ tag: 'script', attrs: {}, content: bodyScripts });
      }
      return node;
    });
    return tree;
  };
};
