// function to display Chat Statistics
var stats = function () {
	var dataPoints = [];
	var chart = new CanvasJS.Chart("chat-stats", {
			title : {
				text : "Chat-Statistics"
			},
      axisX:{
        title:"Time(per 10sec)",
      },
      axisY:{
        title:"Chat Frequency",
      },
			data : [{
					type : "spline",
					dataPoints : dataPoints
				}
			]
		});

	chart.render();

	var updateCount = 0;
	var updateChart = function(s) {
  updateCount++;
    s.forEach(function(item){
    dataPoints.push({
      y : item
    });
  })

    chart.options.title.text = "Chat-Stats:Update " + updateCount;
		chart.render();

	};
  return updateChart;
}
