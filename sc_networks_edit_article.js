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

    function checkOverlap(){
        var $wizard = $('#article-wizard'),
            $content = $('#article-content'),
            rect1 = $wizard[0].getBoundingClientRect(),
            rect2 = $content[0].getBoundingClientRect(),
        //credit http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
            overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        $wizard[overlap ? 'addClass' : 'removeClass']('widget-overlaping');
    }
    checkOverlap();
    $(window).scroll(checkOverlap);
});