"use strict";

// Run me with Node to see my output!

import * as P from "parsimmon";
import {Parser} from "parsimmon";
// @ts-ignore
import util from "util";


///////////////////////////////////////////////////////////////////////

let MathParser = P.createLanguage({
  expr: r => P.seq(P.digits, P.alt(r.sExpr1r, r.sExpr2r)).or(P.digits),

  sExpr1r: r => P.seqMap(r.plus.or(r.minus), P.seq(P.digits, P.alt(r.sExpr1r, r.sExpr2r)).or(P.digits), (a, b) => [a, b]),
  sExpr2r: r => P.seqMap(r.multiply.or(r.divide), P.seq(P.digits, r.sExpr2r).or(P.digits), (a, b) => [a, b]),

  plus: () => P.string('+').thru(p => p.skip(P.optWhitespace)),
  minus: () => P.string('-').thru(p => p.skip(P.optWhitespace)),

  multiply: () => P.string('*').thru(p => p.skip(P.optWhitespace)),
  divide: () => P.string('/').thru(p => p.skip(P.optWhitespace))
});

///////////////////////////////////////////////////////////////////////

let text = "3+4/5";

let ast = MathParser.expr.tryParse(text);
console.log(util.inspect(ast, {showHidden: false, depth: null}));