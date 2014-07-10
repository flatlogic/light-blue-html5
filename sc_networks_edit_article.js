$(function(){
    $('#page-title').click(function(){
        alert('in-place edit on click.\n\nCheck\nhttp://vitalets.github.io/x-editable/demo-bs3.html ' +
            '\n\nor\nhttp://jquery-in-place-editor.googlecode.com/svn/trunk/demo/index.html ' +
            '\n\nfor options')
    });
    $('.email-content-changeable').click(function(){
        alert('opens inline editor');
    });
    $('.widget').widgster();
});