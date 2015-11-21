var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };


policycompass.viz.bars = function (options) {

    // Object

    var self = {};

    // Get options data

    for (key in options) {
        self[key] = options[key];
    }

    self.parentSelect = "#" + self.idName;


    self.drawBars = function (bars) {
        console.log(bars.values);
        var width = self.width, height = self.height;
        margin = self.margin;
        var colorScale = d3.scale.category10();

        //var xScale = d3.scale.linear().domain([0,bars.length]).range([margin,width-margin]).clamp(true);

        var xScale = d3.scale.linear().domain([0, bars.values.length - 1]).range([0, self.width]).clamp(true);

        //var hScale = d3.scale.linear().domain([0,d3.max(bars)]).range([0,100]).clamp(true);

        var hScale = d3.scale.linear().domain([0, d3.max(bars.values)]).range([0, 300]).clamp(true);


        //var myBars = self.svg.selectAll("rect").data(bars);

        barsArray = bars.values;
        var myBars = self.svg.selectAll("rect").data(barsArray);

        myBars.transition().duration(2000).attr("height", function (d, i) {
            return hScale(d);
        }).attr("y", function (d, i) {
            return height / 2 - hScale(d);
        });

        myBars.enter().append("rect").attr("x", function (d, i) {
            return xScale(i);
        })//.attr("x", function(d,i){return 300;})

            .attr("y", function (d, i) {
                return height / 2 - hScale(d);
            }).attr("width", function (d, i) {

                var myW = ((width - 2 * margin) / barsArray.length) / 2.0;
                //console.log (myW);
                return myW;

            }).attr("height", function (d, i) {
                return hScale(d);
            }).attr("class", "barras").style("fill", function (d, i) {
                return colorScale(d);
            });


        var myText = self.svg.selectAll("text").data(bars.labels);


        myText.enter().append("text").attr("x", function (d, i) {
            var myW = ((self.width - 2 * self.margin) / bars.labels.length) / 2.0;
            myW = (myW / 2) - 1;
            //console.log (myW);

            return xScale(i) + (myW);
        }).attr("y", function (d, i) {
            return self.height / 2 + self.margin;
        }).attr("text-anchor", "center").text(function (d, i) {
            return i;
        })

    }


    self.init = function () {


        self.svg = d3.select(self.parentSelect).append("svg").attr("width", self.width).attr("height", self.height).style("float", "left").append("g");


    }

    self.render = function (data) {


        if (Object.keys(data).length === 0) {

        } else {
            self.drawBars(data);
        }


    }


    self.init();

    return self;


}
