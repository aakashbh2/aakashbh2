function onSubmit() {
  // Get the values of the text boxes
  var customerCSP = document.getElementsByName('textbox1')[0].value;
  var myCSP = document.getElementsByName('textbox2')[0].value;
  compareCSPs(customerCSP, myCSP);
  function compareCSPs(customerCSP, myCSP) {
    const customerDirectives = parseCSP(customerCSP);
    const myDirectives = parseCSP(myCSP);

    const gapDirectives = [];
    const allowedValues = ['*', 'nonce'];

    for (const directive in myDirectives) {
      if ((!customerDirectives[directive] || !(customerDirectives[directive].includes('*') || customerDirectives[directive].includes('nonce'))) && (!myDirectives[directive].every(value => !customerDirectives[directive] || customerDirectives[directive].includes(value)))) {
        const found = customerDirectives[directive].some(element => element.includes('.visualwebsiteoptimizer.com'));
        if (!found) {
          gapDirectives.push(directive);
        }
      }
    }

    if(gapDirectives.length > 0) {
      document.getElementById('printHere').innerHTML = 'Polices that don\'t match are: ' + gapDirectives;
      document.getElementById('printHere').style.color = "red";
    } else {
      document.getElementById('printHere').innerHTML = 'CSP Headers Match';
      document.getElementById('printHere').style.color = "green";
    }
    return gapDirectives;
  }

  function parseCSP(csp) {
    const directives = {};

    csp.split(';').forEach(directive => {
      var dir = directive.trim().split(/\s+/);
      const name = dir[0];
      dir.shift();
      const value = dir;
      directives[name] = value;
    });
    return directives;
  }
}
