var jscrusher = (function() {
  // jscrush-ish
  // based on https://github.com/possan/jsintros/blob/master/a/src/crush.js
  // and www.iteral.com/jscrush/

  var allChars = [];
  function calcsafechars(inputscript) {
    var usedChars = {},   // the chars that appear in the code to be crushed
        i;

    if (~allChars.length) {
      for (i=127;--i;i-10&&i-13&&i-34&&i-39&&i-92&&allChars.push(String.fromCharCode(i)));
    }

    for (i=0; i<inputscript.length; i++) {
      var ch = inputscript[i];
      usedChars[ch] = true;
    }

    return allChars.filter(function(c) {
      return !(c in usedChars);
    });
  }

  function count(inputscript, subset) {
    var n = inputscript.split(subset).length - 1;
    return n;
  }

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  function smartQuotes(str) {
    var a = str.split('"').length;
    var b = str.split("'").length;
    if (a >= b) {
      return '\'' + str.replace(/'/g, '\\\'') + '\'';
    } else {
      return '\"' + str.replace(/"/g, '\\\"') + '\"';
    }
  }

  // todo: should probably use http://en.wikipedia.org/wiki/Longest_repeated_substring_problem
  // todo: http://stackoverflow.com/questions/4484440/the-most-frequent-substring-of-length-x
  function findOutBestCandidates(inputscript, strategy) {
    var candidates = [];

    var maxSavings = 0,
        stop = false;
    // pass 1, find all long words
    for (var L = 2; !stop; L++) {
      var hasWords = false;
      for (var i=0, l = inputscript.length ; i<l-L; i++) {
        var word = inputscript.substring(i, i+L);
        var n = count(inputscript, word);
        if (n > 1) {
          hasWords = true;
          candidates = candidates.filter(function(cw) {
            return word.indexOf(cw.word) === -1 || cw.n > n;
          });
          var savings = (n * L) - (n + L + 2);
          if (savings > 0 && savings >= maxSavings * (strategy === 0 ? 1 : 0.8)) {
              candidates.push({
                word: word,
                n: n,
                total: savings
              });
            }
            maxSavings = Math.max(maxSavings, savings);
        }
      }
      if (!hasWords) {
        stop = true;
      }
    }

    candidates.sort(function(a,b) {
      return b.total - a.total;
    });

    return {candidates: candidates};
  }

  function generateOutput(swaps, leftover) {
    var output = '_='+smartQuotes(leftover);
    output += ';for(Y in $="' + swaps.map(function(swap) {return swap.to;}).join('');
    output += '")with(_.split($[Y]))_=join(pop());eval(_)';
    return output;
  }

  function crush(inputscript, strategy) {

    var swaps = [],
        leftover = inputscript,
        previousOutput = null,

        stop = false,

        safechars = null;


    while (!stop) {
      safechars = calcsafechars(leftover);  // we can gain some extra rounds

      var findOut = findOutBestCandidates(leftover, strategy);
      var candidates = findOut.candidates;

      if (candidates.length) {
        var max = candidates[0].total;
        var candidatesWithMax = candidates.filter(function(candidate) {
          return candidate.total >= 0.8 * max;
        });

        var index;
        if (strategy === 0) {
          index = 0;
        } else if (strategy === 1) {
            var maxLength = 0;
            candidatesWithMax.forEach(function(c, i) {
            if (c.word.length > maxLength) {
              index = i;
              maxLength = c.word.length;
            }});
          } else if (strategy === 2) {
            var minLength = Infinity;
            candidatesWithMax.forEach(function(c, i) {
            if (c.word.length < minLength) {
              index = i;
              minLength = c.word.length;
            }});
          }

        var word = candidates[index].word;

        if (safechars.length > 0) {
          var safechar = safechars.splice(0, 1)[0];
          try {
            var newString = leftover.split(word).join(safechar);
            newString += safechar + word;

            var copySwaps = swaps.slice();
            copySwaps.forEach(function(swap) {
              swap.from = swap.from.split(word).join(safechar);
            });
            copySwaps.push({ from: word, to: safechar });

            var output = generateOutput(copySwaps, newString);
            if (previousOutput === null || previousOutput.length > output.length) {
              previousOutput = output;
              leftover = newString;
              swaps = copySwaps;
            } else {
              stop = true;
            }
          } catch(e) {
            console.error(e);
          }

        } else {
          stop = true;
        }
      } else {
        stop = true;
      }
    }

    var output = '_='+smartQuotes(leftover);
    output += ';for(Y in $="' + swaps.reverse().map(function(swap) {return swap.to;}).join('');
    output += '")with(_.split($[Y]))_=join(pop());eval(_)';

    if (inputscript.length <= output.length) {
      return inputscript;
    } else {
      return output;
    }
  }

  function compress(text) {
    var minCode = null;

    var code0 = crush(text, 0);
    minCode = code0;

    var code1 = crush(text, 1);
    if (code1.length < minCode.length) {
      minCode = code1;
    }

    var code2 = crush(text, 2);
    if (code2.length < minCode.length) {
      minCode = code2;
    }

    return minCode;
  }

  return { compress: compress};
})();
