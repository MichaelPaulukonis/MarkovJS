/**
 * Markov Constructor
 * Creates chain based on input str and order 
 *
 * @param  <String> str
 * @param  number order  
 * @return void
 */
var Markov = function (str, order) {
  this.init(str, order);
};

Markov.prototype = (function () {
  var NONWORD = "NONWORD",
      state,
      input,
      markovChain,
      chainOrder,
      init,
      makeChain,
      pushChain,
      each,
      pick,
      initState,
      nextState,
      getChain;

  /**
   * Initialization of Markov Chain
   * Sets the order of chain states
   *
   * @param  <String> str
   * @param  number order 
   * @return void
   */
  init = function (str, order) {
    order = Number(order);
    chainOrder = order > 0 ? order : 1;
    input = str;
    makeChain(input);
  };

  /**
   * Create the chain
   *
   * @param  void
   * @return void
   */
  makeChain = function () {
    initState();
    markovChain = {};
    var strList = input.split(''),
        i,
        c;
    for (i = 0; i < strList.length; i++) {
      c = strList[i];
      pushChain(c);
      nextState(c);
    }
    pushChain(NONWORD);
  };

  /**
   * Insert a single token
   *
   * @param  <String> tok
   * @return void
   */
  pushChain = function (tok) {
    var chain = markovChain,
        i;
    for (i = 0; i < (chainOrder - 1); i++) {
      if (typeof chain[state[i]] === 'undefined') {
        chain[state[i]] = {};
      }
      chain = chain[state[i]];
    }
    if (typeof chain[state[chainOrder - 1]] === 'undefined') {
      chain[state[chainOrder - 1]] = [];
    }
    chain[state[chainOrder - 1]].push(tok);
  };

  /**
   * Markov Chain output
   * Apply lambda to each tok returned 
   *
   * @param  <Function> lambda
   * @return void
   */
  each = function (lambda) {
    initState();
    for (;;) {
      var p = pick();
      if (p === NONWORD) {
        break;
      } else {
        lambda.apply(null, [p]);
      }
      nextState(p);
    }
  };

  /**
   * Get single tok
   *
   * @param  void
   * @return string
   */
  pick = function () {
    var chain = markovChain,
        i,
        r;
    for (i = 0; i < chainOrder; i++) {
      chain = chain[state[i]];
    }
    r = Math.floor(Math.random() * chain.length);
    return chain[r];
  };

  /**
   * State initialization
   *
   * @param  void
   * @return void
   */
  initState = function () {
    state = [];
    for (var i = 0; i < chainOrder; i++) {
      state[i] = NONWORD;
    }
  };

  /**
   * Update state with new token
   *
   * @param  <String> tok
   * @return void
   */
  nextState = function(tok) {
    for (var i = 0; i < (chainOrder - 1); i++) {
      state[i] = state[i + 1];
    }
    state[chainOrder - 1] = tok;
  };

  /**
   * Get the generated chain
   *
   * @param  void
   * @return <Object>
   */
  getChain = function () {
    return markovChain;
  };

  return {
    init:     init,
    each:     each,
    getChain: getChain
  };
})();
