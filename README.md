# JS Crusher
[JS Crusher] is a Javascript packer that takes some JS code and tries to minimize it through string replacements.
It is very suitable for competitions such as [JS1K](http://js1k.com).

It is based on [@possan's crusher](https://github.com/possan/jsintros/blob/master/a/src/crush.js), with some improvements taken from [JSCrush](http://www.iteral.com/jscrush/). JS Crusher achieves a good compression rate thanks to some extra passes with a better approach for choosing candidates for replacements.

Especial kudos to [KodeClutz's post on Demystifying JSCrush](http://blog.nikhilism.com/2012/04/demystifying-jscrush.html) which explains how JSCrush works.
