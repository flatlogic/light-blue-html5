$(function(){

    function initEasyPieCharts(){
        $('#easy-pie1').easyPieChart({
            barColor: Sing.colors['brand-info'],
            trackColor: Sing.colors['gray-100'],
            scaleColor: false,
            lineWidth: 10,
            size: 120
        });

        $('#easy-pie2').easyPieChart({
            barColor: Sing.colors['brand-danger'],
            trackColor: Sing.colors['gray-100'],
            scaleColor: Sing.colors['brand-danger'],
            lineCap: 'butt',
            lineWidth: 22,
            size: 140,
            animate: 1000
        });

        $('#easy-pie3').easyPieChart({
            barColor: Sing.colors['brand-warning'],
            trackColor: Sing.colors['gray-100'],
            scaleColor: Sing.colors['brand-warning'],
            lineCap: 'butt',
            lineWidth: 22,
            size: 140,
            animate: 1000
        });

        $('#easy-pie4').easyPieChart({
            barColor:  Sing.palette['brand-info-light'],
            trackColor: false,
            scaleColor: Sing.colors['gray-600'],
            lineCap: 'square',
            lineWidth: 10,
            size: 120,
            animate: 1000
        });

    }


    function pageLoad(){
        $('.widget').widgster();

        initEasyPieCharts();
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});