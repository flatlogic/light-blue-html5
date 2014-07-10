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
            $wizardTrack = $('#article-wizard-track'),
            $content = $('#article-content'),
            rect1 = $wizardTrack[0].getBoundingClientRect(),
            rect2 = $content[0].getBoundingClientRect(),
        //credit http://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
            overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        if (overlap){
            $wizard.addClass('widget-overlaping');
            $wizard.css('position', 'fixed');
        } else {
            $wizard.removeClass('widget-overlaping');
            $wizard.css('position', 'static');
        }
    }
    setTimeout(checkOverlap, 0);
    $(window).on('scroll resize', checkOverlap);
});