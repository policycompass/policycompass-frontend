var policycompass = policycompass || {
        'version': 0.1,
        'controller': {},
        'viz': {},
        'extras': {}
    };

policycompass.viz.map = function (options) {

    // Object

    var self = {};

    // Get options data

    for (key in options) {
        self[key] = options[key];
    }

    self.parentSelect = "#" + self.idName;


    self.init = function () {


        self.width = 1200, self.height = 700, self.selectedProperty = "population"
        self.baseColors = d3.scale.category20();
        self.svg = d3.select(self.parentSelect).append("svg").attr("width", self.width).attr("height", self.height).on("mousemove", mousemove).call(d3.behavior.zoom().on("zoom", self.redraw)).append("g");

        self.subunits = topojson.feature(self.es, self.es.objects.subunits),

            self.projection = d3.geo.albers().center([0, 40.23]).rotate([3.43, 0]).parallels([
                40, 60
            ]).scale(4000).translate([self.width / 2, self.height / 2]);

        self.path = d3.geo.path().projection(self.projection);


        queue()//.defer(d3.json, "es.json")
            .defer(d3.tsv, "ine.tsv").await(self.ready);

    }

    self.redraw = function () {
        self.svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    };

    self.ready = function (error, ine) {
        //console.log("READY");
        var provincesData = {};
        ine.forEach(function (d, i) {
            if (i == 0) {
                self.fillSelector(Object.keys(d));
            }
            Object.keys(d).forEach(function (k) {
                var v = parseFloat(d[k]);
                if (!isNaN(v)) {
                    d[k] = v;
                }
            });
            provincesData[d.provincia] = d;
        });
    }
    self.fillSelector = function (keys) {
        keys = keys.filter(function (e) {
            return e !== "provincia";
        })
        d3.select("#selector").selectAll("option").data(keys).enter().append("option").attr("value", function (d) {
            return d;
        }).text(function (d) {
            return d;
        });
        d3.select("#selector").on("change", function () {
            var sel = document.getElementById("selector");
            selectedProperty = sel.options[sel.selectedIndex].value;
            updateColors();
        });
    };
    self.updateColors = function () {
        var tempColor = baseColors(selectedProperty), tempScale = d3.scale.linear().domain([
            d3.min(ine, function (d) {
                return d[selectedProperty];
            }), d3.max(ine, function (d) {
                return d[selectedProperty];
            })
        ]).range([
            d3.rgb(tempColor).brighter(3), d3.rgb(tempColor).darker(3)
        ]).clamp(true);
        svg.selectAll(".subunit.ESP").transition().duration(1000).style("fill", function (d) {
            if ("properties" in d) {
                if ("name" in d.properties) {
                    if (d.properties.name in provincesData) {
                        if (provincesData[d.properties.name][selectedProperty] !== "-") {
                            return tempScale(provincesData[d.properties.name][selectedProperty]);
                        }
                    }
                }
            }
            return "#ddc";
        });
    };

    function mouseout() {
        tooltip.style("opacity", 0.0);
    }

    self.render = function () {
        self.svg.selectAll(".subunit").data(topojson.feature(self.es, self.es.objects.subunits).features).enter().append("path").attr("class", function (d) {
            return "subunit " + d.id.slice(0, 3);
        }).on("mouseover", function (d) {

            //console.log(d.properties.name);
            //posMouse = d3.mouse(this);
            //posX = posMouse[0];
            //posY = posMouse[1];

            tooltip.style("opacity", 1.0).html("key=" + d.properties.name);

        }).on("mouseout", mouseout).on("click", function (d, i) {
            console.log(d);
        }).attr("d", self.path);
        self.svg.append("path").datum(topojson.mesh(self.es, self.es.objects.subunits, function (a, b) {
            return a !== b && a.id.slice(0, 3) === "ESP";
        })).attr("d", self.path).attr("class", "subunit-boundary");
        self.svg.append("path").datum(topojson.mesh(self.es, self.es.objects.subunits, function (a, b) {
            return a === b && a.id.slice(0, 3) !== "ESP";
        })).attr("d", self.path).attr("class", "subunit-boundary OTHER");
        self.svg.selectAll(".subunit-label").data(topojson.feature(self.es, self.es.objects.subunits).features).enter().append("text").attr("class", function (d) {
            return "subunit-label " + d.id.slice(0, 3);
        }).attr("transform", function (d) {
            return "translate(" + self.path.centroid(d) + ")";
        }).attr("dy", ".35em").text(function (d) {
            return d.id.slice(0, 3) === "ESP" ? d.properties.name : "";
        });
    };

    self.init();
    return self;

}
