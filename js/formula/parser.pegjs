Formula "formula" = And / Or / Atom

Atom = neg:Negation? _ prop:Property {
    var value = neg ? false : true;
    return { property: prop, value: value }
}

And = _ "(" _ head:Formula tail:(_ Conjunction _ Formula)+ _ ")" _ {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
          result.push(tail[i][3]);
      }
      return { and: result };
    }

Or = _ "(" _ head:Formula tail:(_ Disjunction _ Formula)+ _ ")" _ {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
          result.push(tail[i][3]);
      }
      return { or: result };
    }

_ "whitespace"
  = [ \t\n\r]*

// /!\ Important /!\
// If you add any new important symbols, make sure that the are also removed
//   from the character set for properties
Negation    "negation"      = "~" / "not "
Conjunction "conjunction"   = "++" / "+" / "&&" / "&"  // N.B. "+" / "++" breaks!
Disjunction "disjunction"   = "||" / "|"
Property    "property name" = prop:[^~+&|()]+ {
    return prop.join("").trim()
}
