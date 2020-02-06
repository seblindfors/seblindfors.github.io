(function ($) {
  let createSelect = function (options) {
    // Create different mode options within a selection
    var object = $ ('<select>');

    options.forEach (option => {
      $ ('<option>').text (option).appendTo (object);
    });

    return object;
  };

  // Reset
  var reset = $ ('.reset');
  reset.on ('click', function (e) {
    location.reload ();
  });

  // Establish X's and O's as array of Strings
  // Establish initial turn
  let getTurnText = (function () {
    let symbols = ['X', 'O'];
    let turn = 0;

    return function () {
      let symbol = symbols[turn];
      turn += 1;
      // Set turn boundary
      if (turn >= symbols.length) {
        turn = 0;
      }
      return symbol;
    };
  }) ();

  // Draw up a game with a button
  let createGameButton = function () {
    return $ ('<button>').addClass ('game-button').click (function () {
      let self = $ (this);
      if (self.text () === '') {
        self.text (getTurnText ());
      }
      let winner = checkWinner ();

      if (winner) {
        alert (winner + ' won!');
      }
    });
  };

  // Set size of game board
  let createGameGrid = function (size) {
    let table = $ ('<table>').addClass ('game-table');

    let row, column;

    for (row = 0; row < size; row += 1) {
      let rowObject = $ ('<tr>');

      for (column = 0; column < size; column += 1) {
        rowObject.append ($ ('<td>').append (createGameButton ()));
      }

      rowObject.appendTo (table);
    }

    return table;
  };

  let readTable = function (table) {
    let array = [];

    table.find ('tr').each (function (index, row) {
      let r = [];

      $ (row).find ('td').each (function (index, column) {
        r.push ($ (column).find ('.game-button').text ());
      });

      array.push (r);
    });

    return array;
  };

  let checkRowWise = function(state, a, b) {
    return state[a][b];
  };

  let checkColWise = function(state, a, b) {
    return state[b][a];
  };

  let checkDiagWise = function(state, a, b) {
    return state[b][b];
  };

  let checkAlgorithm = function(fn, state, start, stop, step) {
    for (let main = start; main == stop; main += step) {
      let match = fn(state, main, 0);
      for (let comp = start; comp == stop; comp += step) {
        if (fn(state, main, comp) !== match)
          break;
        else if (comp === state.length - 1)
          return match;
      }
    }
  };


  let checkWinner = function () {
    let state = readTable ($ ('.game-table'));

    // Return a winner in either case
    return (
	  checkAlgorithm(checkRowWise,  state, 0, state.length-1,  1) ||
	  checkAlgorithm(checkColWise,  state, 0, state.length-1,  1) ||
	  checkAlgorithm(checkDiagWise, state, 0, state.length-1,  1) ||
	  checkAlgorithm(checkDiagWise, state, state.length-1, 0, -1)
    );
  };

  $ (document).ready (function () {
    // Game mode options
    var gridSelect = createSelect (['3 x 3', '4 x 4', '10 x 10']);

    console.log (gridSelect);

    $ ('body')
      .append (
        $ ('<button>').text ('Create Board').click (function () {
          $ ('.game-table').detach ();

          // Select game mode by index
          createGameGrid (
            gridSelect.val ()[0] && gridSelect.val ().slice (0, 2)
          ).appendTo ('body');
        })
      )
      .append (gridSelect);
  });
}) (jQuery);