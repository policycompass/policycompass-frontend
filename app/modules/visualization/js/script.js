$(document).ready(function() {
/*
  $('.menu-item-search .parent, .menu-item-user-options .parent, .menu-item-language .parent').css('cursor','pointer').click(function(){
      
     $('.menu-item .parent').not(this).removeClass("active").next().hide();
     $(this).toggleClass("active").next().toggleClass("active").toggle(200);
  }).next().hide();
*/
      $('.button-modify').click(function(){
        $(this).toggleClass('active');
        $('.button-save').toggleClass('disabled');
        
        // alert('d');
        $('.fields').toggleClass('active');
        event.preventDefault();

      });
  
$( "#tabs" ).tabs();
$( ".fcm-editor #tabs" ).tabs({ active: 2 });
$( ".body-designer #tabs" ).tabs({ active: 1 });


$('.button-map').addClass('disabled');
$('.button-map, .button-graph').click(function(){
alert("buton-map o graph")
   if($(this).hasClass('disabled')) {

  $(this).toggleClass('disabled').siblings().toggleClass('disabled');
  // $(this).toggleClass('disabled');
  
   
   }
  event.preventDefault();
});


  $('.metrics-boton').css('cursor','pointer').click(function(){
     var str = $('.designer-metrics-wrap').html();
     // alert(str);
     $('.designer-metrics').after(str);
     
  });
  $('.metric-forms-button').css('cursor','pointer').click(function(){
    $(this).parent().next().toggle(200);
      
  });

   $('.metric-list-item').css('cursor','pointer').click(function(){
   alert("metric-list-item")
    $(this).addClass('active');
    var str =  $(this).attr("name");
    // alert(str);
    $('#' + str + '').addClass('active');

   });
   
 $('.metric-delete-button').css('cursor','pointer').click(function(){
    $(this).parent().parent().removeClass('active');
    var str =  $(this).parent().parent().attr("id");
    // alert(str);
    
    $(".metric-list-item[name='"+ str +"']").removeClass('active');
      
  });
  
  $( '#info-content div:not(:first)' ).hide();
  $( '#nav li:first-of-type').addClass('current');
  
  
       
       
      $('#info-nav li').click(function(e) {
        $('#info-content div').hide();
        $('#info-nav .current').removeClass("current");
        $(this).addClass('current');
        var clicked = $(this).find('a:first').attr('href');

        $('#info-content ' + clicked).fadeIn(500);
        e.preventDefault();
        }).eq(0).addClass('current');
        
        
        
       // BOTON METRICS
       $('#metrics-list').hide();
      $('.button-metrics').click(function(e) {
      	alert("button-metrics");
        $(this).toggleClass('active');
        $('#metrics-list').toggle('slow');
        
        ;
      });
       
        
        
        
      

});
/*
		var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
		var lineChartData = {
			labels : ["January","February","March","April","May","June","July","August"],
			datasets : [
				{
					label: "My First dataset",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				},
				{
					label: "My Second dataset",
					fillColor : "rgba(151,187,205,0.2)",
          
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(151,187,205,1)",
					data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				}
			]

		}
		*/

	window.onload = function(){
	/*
		var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true,
      bezierCurve : false,
       scaleFontFamily: "open sans",
        scaleFontSize: 14,
		});
		*/
	}


