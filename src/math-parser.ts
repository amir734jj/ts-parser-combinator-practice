"use strict";

// Run me with Node to see my output!

import * as P from "parsimmon";
import {Parser} from "parsimmon";
// @ts-ignore
import util from "util";


///////////////////////////////////////////////////////////////////////

// Use the JSON standard's definition of whitespace rather than Parsimmon's.
let whitespace = P.regexp(/\s*/m);

// JSON is pretty relaxed about whitespace, so let's make it easy to ignore
// after most text.
function token(parser: Parser<string>) {
  return parser.skip(whitespace);
}

// Several parsers are just strings with optional whitespace.
function word(str: string) {
  return P.string(str).thru(token);
}

let MathParser = P.createLanguage({
  expr: r => P.alt(r.sExpr2, r.sExpr1, r.number),
  sExpr1: r => P.seqMap(r.iExpr, P.optWhitespace, r.plusOrMinus, P.optWhitespace, r.expr, (a, s1, b, s2, c) => [a, b, c]),
  sExpr2: r => P.seqMap(r.iExpr, P.optWhitespace, r.multiplyOrDivide, P.optWhitespace, r.expr, (a, s1, b, s2, c) => [a, b, c]),
  iExpr: r => P.alt(r.iExpr, r.number).notFollowedBy(r.operator),

  number: () =>
    token(P.regexp(/[0-9]+/))
      .map(Number)
      .desc("number"),

  plus: () => word("+"),
  minus: () => word("-"),
  plusOrMinus: r => P.alt(r.plus, r.minus),

  multiply: () => word("*"),
  divide: () => word("/"),
  multiplyOrDivide: r => P.alt(r.multiply, r.divide),

  operator: r => P.alt(r.plusOrMinus, r.multiplyOrDivide)
});

///////////////////////////////////////////////////////////////////////

let text = "3 / 4 - 5 * 6 + 5";

let ast = MathParser.expr.tryParse(text);
console.log(util.inspect(ast, {showHidden: false, depth: null}));