"use strict";

// Run me with Node to see my output!

import * as P from "parsimmon";
import {Parser} from "parsimmon";
// @ts-ignore
import util from "util";


///////////////////////////////////////////////////////////////////////

let MathParser = P.createLanguage({
  expr: r => P.alt(P.digits, P.seq(P.digits, r.l2Expr), P.seq(P.digits, r.l1Expr)),

  l1Expr: r => P.seqMap(r.plus.or(r.minus), P.digits, (o, e) => [o, e]),
  l2Expr: r => P.seqMap(r.multiply.or(r.divide), P.seq(r.l1Expr).or(P.digits), (o, e) => [o, e]),

  plus: () => P.string('+').thru(p => p.skip(P.optWhitespace)),
  minus: () => P.string('-').thru(p => p.skip(P.optWhitespace)),
  plusOrMinus: r => P.alt(r.plus, r.minus),

  multiply: () => P.string('*').thru(p => p.skip(P.optWhitespace)),
  divide: () => P.string('/').thru(p => p.skip(P.optWhitespace)),
  multiplyOrDivide: r => P.alt(r.multiply, r.divide),

  operator: r => P.alt(r.plusOrMinus, r.multiplyOrDivide)
});

///////////////////////////////////////////////////////////////////////

let text = "3/4+4";

let ast = MathParser.expr.tryParse(text);
console.log(util.inspect(ast, {showHidden: false, depth: null}));