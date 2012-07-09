## Work in progress - no files yet! ##

# TicTacToeJS #

## Unbeatable TicTacToe javascript player ##

### Author and License ###

![Marco Amado's Gravatar](http://1.gravatar.com/avatar/1a11649fa31edc86ddbfa4466ebf560b?s=40&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D40&r=G)
Marco Amado [mjamado@dreamsincode.com]

Creative Commons 2.5 Portugal BY-NC-SA

### Introduction ###

There are three ways to make an unbeatable game AI:

1.  Process every move in the game ahead of time, and play through the line of best result at every step &ndash; this is a brute-force approach;
2.  Implement a neural network &ndash; this will start pretty dumb, but after a few thousand games it should be unbeatable;
3.  Implement an heuristics-based solution, making it play like an expert human would.

Tic-tac-toe is a very good candidate to a brute-force approach: the total number of plays is 9!, or 362880; actually, it would be much less, since most of the plays can be achieved by rotating the board. However, there's not much "I" in that AI...

The neural network solution is a fun one, and often used in complex scenarios, given that somebody has the time (or the scripted games) to train it. Away from the code of the neural network itself (which could be reused for a bazillion other things), this solution would be the smallest one, code-wise.

The heuristic solution is the most dificult to implement for most type of games. It implies creating a set of rules to be followed, for every possible situation. Again, tic-tac-toe is suitable to this kind of solution, because only three moves, at most, can be problematic, the fourth and the eventual fifth can be played for the win or tie.

This was the solution I implemented.

### Quick rundown of importante pieces of code ###

At every step, a request is made for a play (function `playChoose`), with a *what* and a *where*:

- the *what* is either *center*, *corner*, *wall*, a combination of these, or *undefined*, which is interpreted as *anything*;
- the *where* is an object with a *what*, and one or more of a *me*, a *you, and a *none*:
  - *what* is what to look for in the board: valid values are *anything*, *rowOrCol* and *rowAndCol* (other could be implemented, but are not needed so...);
  - *me*, *you* and *none* are quantities of plays in the *what*: 0, 1 or 2.

Therefore, I can ask for something like `playChoose(undefined, {what: "anything", me: 2})`, and it'll find a position where there's allready two plays by me. This is actually called in the game, and it's a search for a winning play.

You can see that last call in the `play` function. Everytime there's a play to be made, the following *questions* are asked to the engine:

- can I win now?
- in case I can't, do I have to block a winning position from the opponent?

If everything went normally, a strategic play must be made. I won't rundown the options: there's a flowchart in this repository (`tictactoe.png`) with the full strategy, and I implement it fully in the `strategicPlay` function.

A last word of warning about the code: beware of the board rotation in the `playChoose` function. I could've done that in tenths of other ways, but that was what looked more sleek, although I'll admit it's not the easiest to understand.

### How to use just about anywhere ###

`tictactoe.js` is strongly tied with *jQuery*. This was made for a project that allready had it, might as well use it. It's **not** a *jQuery* plugin, therefore it's fairly easy to decouple it.

First and foremost, include the .js file (or a minimized, gzipped one) in your page:

```html
<script type="text/javascript" src="tictactoe.js"></script>
```

Then, style the game components via CSS. I included a SCSS file with everything necessary (don't know what SCSS is? [What a good day to learn](http://sass-lang.com/)).

Finally, anywhere you would see fit, call it:

```javascript
tictactoe.init('ticTacToeHolder');
```

If you want, as a second parameter, you can pass an object with translations for the game strings (here are the portuguese ones):

```javascript
{
	me: "Eu",
	you: "Tu",
	ties: "Empates",
	iwon: "Ganhei!",
	youwon: "Ganhaste!",
	tie: "É um empate!"
}
```

That's pretty much it. Have fun!