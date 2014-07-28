var tooltip =  d3.select("body").append("div")
    .attr("id","tooltip")
    .html("")
    .attr("class", "tooltip")
    .style("opacity", 0);

function mousemove()
{
//	console.log(d3.event.pageX);
	tooltip
		.style("left", (d3.event.pageX +20) + "px")
		.style("top", (d3.event.pageY - 12) + "px");
}     
