#Textifyed
A simple jQuery plug-in with TinyMCE support which helps you manage textareas on the page. 

##Usage
Textifyed is very easy to use. Set up the html syntax like the example below.
````
    <div class="containerDiv"></div>
    <textarea id="txtDescription"></textarea>
    <a href="#" class="btnDone">Done</a>
    <a href="#" class="btnCancel">Cancel</a>
````

##Initialization
Initialize textify by the following code
````
    var textifyed = require('textifyed');
    $('textarea').textfiyed({text: '', div: '.containerDiv'});
````

##Options
Textifyed allows you to pass in various options 

###trigger
The event that will be used to toggle the visibility of textarea. Default is 'click'.

###placeholder
The placeholder text to be displayed if the no text is entered. Defaults to 'Click to add text..'

###text
The text to be displayed in the div and textarea.

###div
The div which will be used by the plug-in.

###Editor
The TinyMCE Editor constructor which will be used to create rich text experience. If no Editor instance is passed then the default textarea behavior will be used.


##Events
Textifyed uses an event based system to communicate with other modules. All the events are namespaced to avoid conflicts with other libraries
###textify:notesDivClick
Triggered when the div is clicked.

###textify:done
Triggered when the done button is clicked.

###textify:cancel
Triggered when the cancel button is clicked.

##Demo
Please visit http://idesi.github.io/Textifyed/ for a live demo and futher code examples

