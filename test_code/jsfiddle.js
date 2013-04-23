	//Stuff that TCR put into JSFIDDLE.
//This is the JS code for the iframe that lets the parent talk to the child, etc.

$('iframe')[0].contentDocument.body.innerHTML = '<scri' + 'pt>console.log(window);</scr' + 'ipt>hi';

$('button').on('click', function () {
   EVALCHILD($('textarea').val());
});