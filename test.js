function compareCSPs(customerCSP, myCSP) {
	const customerDirectives = parseCSP(customerCSP);
	const myDirectives = parseCSP(myCSP);
	const gapDirectives = [];

	for (const directive in myDirectives) {
	  if ((!customerDirectives[directive] || !(customerDirectives[directive].includes('*') || customerDirectives[directive].includes('nonce'))) && (!myDirectives[directive].every(value => !customerDirectives[directive] || customerDirectives[directive].includes(value)))) {
	    const found = customerDirectives[directive].some(element => element.includes('.visualwebsiteoptimizer.com'));
	    if (!found) {
	      gapDirectives.push(directive);
	    }
	  }
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

describe("compareCSP()", function() {
  it("should return an empty array when CSP values match", function() {
    const customerCSP = "default-src 'self'; script-src 'self'";
    const myCSP = "default-src 'self'; script-src 'self'";
    expect(compareCSPs(customerCSP, myCSP)).toEqual([]);
  });

  it("should return an array of mismatched directives when CSP values don't match", function() {
    const customerCSP = "default-src 'self'; script-src 'self' example.com";
    const myCSP = "default-src 'self'; script-src 'self' google.com";
    expect(compareCSPs(customerCSP, myCSP)).toEqual(["script-src"]);
  });

  it("should handle multiple mismatched directives", function() {
    const customerCSP = "default-src 'self'; script-src 'self' example.com; img-src 'self'";
    const myCSP = "default-src 'self'; script-src 'self' google.com; font-src 'self'";
    expect(compareCSPs(customerCSP, myCSP)).toEqual(["script-src"]);
  });

  it("should handle CSP values with quoted values and extra whitespace", function() {
    const customerCSP = " default-src 'self'; script-src 'self' 'unsafe-inline' example.com ; ";
    const myCSP = "default-src 'self'; script-src 'self' 'unsafe-inline' google.com";
    expect(compareCSPs(customerCSP, myCSP)).toEqual(["script-src"]);
  });

  it("should handle CSP values with missing directives", function() {
    const customerCSP = "default-src 'self'";
    const myCSP = "default-src 'self'; script-src 'self'";
    expect(compareCSPs(customerCSP, myCSP)).toEqual([]);
  });

  it("should handle CSP values with wildcard directives", function() {
    const customerCSP = "default-src 'self' *; script-src 'self'";
    const myCSP = "default-src 'self'; script-src 'self'";
    expect(compareCSPs(customerCSP, myCSP)).toEqual([]);
  });
});
