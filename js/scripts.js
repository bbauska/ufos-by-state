$(document).ready(function(e) {
	$(".showNRchartTable").click(function(event){
		event.stopPropagation();
		var tableToShow = $(".NRchartTableDiv");
		
		if( $(tableToShow).css("display") == "none"){
			window.scrollTo(0, 0);
			// if(!$.browser.msie || $.browser.version > 8){
			$("#main-nav-wrapper").css("display","none");
			// }
			var tableDivWidth = $("#tableDiv").css("width").replace(/px/gi,"");
			tableContainerWidth = tableDivWidth < ($(document).width() - ($(document).width()*0.1)) ? tableDivWidth : ($(document).width() - ($(document).width()*0.1));
			tableContainerWidth += "px";
			$(".NRchartTableDiv").attr("data-width", tableContainerWidth).css("height",$(".NRchartTableDiv table").height() < $(document).height() ? $(document).height() : $(".NRchartTableDiv table").height() +"px").css("width","");
			if( $("#tableWrapper").length<1){
				tableToShow.find("table").wrap('<div id="tableWrapper"></div>');
			};
			$(tableToShow).show().find("table").focus();	
			$("#tableWrapper").css("height", $(".NRchartTableDiv table").height() < $(window).height() - 150  ? $(".NRchartTableDiv table").height() + 20 :  $(window).height() - 150 + "px").css("width","auto").css("maxWidth",tableContainerWidth);
		
		}else{
			$(".NRchartTableDiv").css("width",$(".NRchartTableDiv").attr("data-width"));
			$(tableToShow).hide();
			$("#main-nav-wrapper").css("display","");
		}
	});

	$(".NRchartTableDiv").click(function(event){
		event.stopPropagation();
	});

	$("#tableDiv").click(function(event) {
		$(this).find("#tableWrapper > table").unwrap();
		event.stopPropagation();
			var tableToShow = $(".NRchartTableDiv");
			if( $(tableToShow).css("display") != "none"){
				$(tableToShow).hide();	
				$("#main-nav-wrapper").show();
			}
		});
	$("#tableDiv table").click(function(){
		return false;
	});		
});

//show tables accessibility
$(document).ready(function(){
	//tabs - focus and keyboard access
	$('.chartAndTableGroup ul.tabs li').each(function(){
		$(this).attr('tabindex','0');
		$(this).keydown(function(e){
			if(e.keyCode == 13){
				$(this).click();//trigger click event
			};
		});
	});
	
	//show tables - focus and keyboard access
	$('.showNRchartTable a').click(function(event){
		if( $(this).text()=="Show table" ){
			$('.NRchartTableDiv').find('table .tableTitle, table th, table td').each(function(){
				$(this).attr('tabindex','0');//make tabbable
				$(this, '.NRchartTableDiv .showNRchartTable').blur(function(){//if move outside of popup
					setTimeout(function(){
						if( $(document.activeElement).parents().hasClass('NRchartTableDiv') == false ){
							$('.NRchartTableDiv .showNRchartTable a').focus();
						}; 
					}, 1);
				});
			});
			setTimeout(function(){//set initial focus
				$('.NRchartTableDiv').find('.showNRchartTable a').focus();
			}, 1);
		}else if( $(this).text()=="Hide table" ){
			setTimeout(function(){//set initial focus
				$('.chartAndTableGroup a').focus();
			}, 1);
		};
		event.preventDefault();
	});
	
});

function supportsSVG() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
}
if (!supportsSVG()) {
    $("#mapHeader").text("Please use a newer browser to see the interactive map");
}

//add commas util
function addCommas(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

///function for setting up legend with boxes and text
var setupLegend = function(map_options, values_array){
	
        ///set up legend text
        var modDifference = function(val) {
            //correct legend number format
            if (values_array[0] > 100) {
                var mod = 1;
                return addCommas(Number(val) - mod);
            } else {
                var mod = .1;
                var num = Number(val) - mod;
                return num.toFixed(1);
            }
        }
        var dec = map_options.decimals;
        var signs = map_options.signs;
        $("#key1").text(signs[0] + addCommas(Number(map_options.rangeHigh).toFixed(dec)) + signs[1] + " and above");
        $("#key2").text(signs[0] + addCommas(Number(map_options.rangeMidHigh).toFixed(dec)) + signs[1] + " to " + signs[0] + modDifference(map_options.rangeHigh) + signs[1]);
        $("#key3").text(signs[0] + addCommas(Number(map_options.rangeMidLow).toFixed(dec)) + signs[1] + " to " + signs[0] + modDifference(map_options.rangeMidHigh) + signs[1]);
        $("#key4").text(signs[0] + addCommas(Number(map_options.rangeLow).toFixed(dec)) + signs[1] + " to " + signs[0] + modDifference(map_options.rangeMidLow) + signs[1]);
        $("#key5").text(signs[0] + modDifference(map_options.rangeLow) + signs[1] + " and below");
		var border_radius = map_options.map_type === "metro" ? "50px" : "0px";
        $(map_options.colors).each(function(i, e) {
            $(".legendBox:eq("+i+")" ).css("background-color", e).css("border-radius", border_radius);
        });
};
///end setupLegend

///function for organizing area values into an array and ranges
var organizeValues = function(map_options, mapDataObj, keyName){
	
	///gets and returns a sorted values array from a passed object and keyname
	var getValuesArray = function(mapDataObj, keyName){
		 var values_array = [];
			$.each(mapDataObj, function() {
				values_array.push(this[keyName]);
			});
			values_array = values_array.sort(function(a, b) {
				return a - b
			});
		return values_array;
	}

	///gets a sorted values array from a passed object and keyname ("color_val")
	map_options.values_array = getValuesArray(mapDataObj, keyName);
	//map_options.values_array.sort();

	///get ranges func
	var getRange = function(val){
		//console.log(map_options.values_array);
		return map_options.values_array[Math.floor(map_options.values_array.length * val)];
	}
	
	//divide array ranges into quintiles
	map_options.rangeHigh = map_options.rangeHigh || getRange(.85);
	map_options.rangeMidHigh = map_options.rangeMidHigh || getRange(.6);
	map_options.rangeMidLow = map_options.rangeMidLow || getRange(.4);
	map_options.rangeLow = map_options.rangeLow || getRange(.2);
}

//////////function for coloring map based on state values //////////////////////
var colorMap = function(map_options, mapID) {
        var colors = map_options.colors;

		 ///color states
		 var color_item = map_options.map_type === "metro" ? "circle" : "circle, path";
        $(color_item, mapID).each(function(index, element) {
			var state_value = $(this).attr("statevalue") || $(this).attr("loc_value");
			state_value = Number(state_value);
            var stateColor = "";
            if (isNaN(state_value)) {
                stateColor = "rgb(211, 211, 211)"; //gray
            } else if (state_value >= map_options.rangeHigh) {
                stateColor = colors[0];
            } else if (state_value >= map_options.rangeMidHigh) {
                stateColor = colors[1];
            } else if (state_value >= map_options.rangeMidLow) {
                stateColor = colors[2];
            } else if (state_value >= map_options.rangeLow) {
                stateColor = colors[3];
            } else {
                stateColor = colors[4];
            }
            $(this).css("fill", stateColor);
			$(this).attr("fill", stateColor);
        });

        ///set up previous fill for legend highlighting
        $("path, circle", mapID).each(function(index, element) {
            var thisColor = $(this).css("fill");
            $(this).attr("previousfill", thisColor);
            $(this).attr("enabled", "true");
        });
    } ///end color map

//function that replaces current statevalue with one of its extra_vals, depending on an index passed
var resetAreaValues = function(area, time_index, $chartDiv){
	$(area).attr("statevalue", $(area).attr("extra_vals").split(";")[time_index]);
};

///animateMap function, called when slider is changed
var animateMap = function(map_options, time_index, $chartDiv) {
    $("#time_title").text(map_options.extra_val_titles[time_index]);
	
	//replaces current statevalue with one of its extra_vals
	$("path, circle", $chartDiv).each(function(i, area){
		resetAreaValues(area, time_index, $chartDiv);
	});
	
	//recolor map
	colorMap(map_options, $chartDiv);
	
}

//moves the slider forward one
var stepForward = function(){
	var $map_slider = $("#map_slider");
	var new_val = $map_slider.val() === $map_slider.attr("max") ? 0 : Number($map_slider.val()) +1;
	$map_slider.val(new_val).trigger("input");
}

//playingAnimation is set or cleared as an animation interval 
var playingAnimation;

//toggleMapPlay function, called when play or pause button is clicked
var toggleMapPlay = function(button, map_options, $chartDiv){
	button.toggleClass("playing");

	//if play button is shown, start play interval, and change button to pause icon
	if(button.hasClass("playing")){
		button.html("||")
		.css({"font-size":"150%",
			"letter-spacing": "-6px"
			});
			
			//start animation
			playingAnimation = setInterval(stepForward, 500);
	} else{
		button.html("&#9658;")
		.css({"font-size":"180%",
			"letter-spacing": "0px"
			});
			
			//stop animation
			clearInterval(playingAnimation);
	}
	
}

///////////////function for initializing map animation controls, background data and functionality
var setupAnimation = function(map_options, $chartDiv) {

///set up play/pause button
	var setupPlayButton = function(){
		var play_button = document.createElement("span");
		$(play_button).attr({
			id: "map_play_button"
		})
		.css({
			position: "absolute",
			top: "51px",
			left: "114px",
			cursor: "pointer",
			fontSize: "180%",
			fontWeight: "bold",
			color: "",
			zIndex: 450
		})
		.html("&#9658;");
		
		//set up play button functionality
        $(play_button).on("click", function(e) {
            toggleMapPlay($(this), map_options, $chartDiv);
        });
		$chartDiv.prepend(play_button);
	}

///set up slider
    var setupRange = function() {
        var slider = document.createElement("input");
        $(slider).attr({
                type: "range",
				name: "slider",
                max: map_options.extra_val_titles.length -1,
                min: 0,
                value: map_options.extra_val_titles.length -1,
                id: "map_slider"
            })
            .css({
                width: "350px",
                position: "absolute",
                top: "56px",
                left: "140px",
                cursor: "pointer",
				zIndex: 450
            });

        //set up slide functionality
        $(slider).on("input change", function() {
            animateMap(map_options, $(this).val(), $chartDiv);
        });
        $chartDiv.prepend(slider);
			//set up slider label
		var sliderLabel = document.createElement("label");
	$(sliderLabel).attr({
					for:$(slider).attr("id")
	}).css({
					display:"none"
	}).html("Animation Slider");
	$chartDiv.prepend(sliderLabel);

    };
	
///set up time title 
    var setupTimeTitle = function($chartDiv) {
        var time_title = document.createElement("span");
        $(time_title).attr({
                id: "time_title"
            })
            .css({
                position: "absolute",
                left: "500px",
                top: "56px",
                fontWeight: "bold",
                color: "#6b0000",
                fontSize: "115%",
				zIndex: 450
            })
			.text(map_options.extra_val_titles[map_options.extra_val_titles.length -1]);
        $chartDiv.prepend(time_title);
    }
    var $chartDiv = $("#chartDiv");
	setupPlayButton($chartDiv);
    setupRange($chartDiv);
    setupTimeTitle($chartDiv);
};

///end setupAnimation
///////set up legend box highlighting function
var setupLegendHover = function() {
    $(".legendBox").each(function(index, element) {
        var thisColor = $(this).css("background-color");
        $(this).attr("previousfill", thisColor);
		$(this).attr("tabIndex", 0);
    });

    //hover
    $(".legendElement").hover(function() {
        var thisElement = $(this);
        var thisColor = $(".legendBox", thisElement).attr("previousfill");

        if ($(this).hasClass("on")) {
            $(".legendBox", thisElement).css("background-color", "rgb(0, 105, 191)"); //blue
        }
        $("path, circle").each(function(index, element) {
            if (($(this).attr("enabled")) === "true") { //if not gray   
                if (($(this).css("fill")) == thisColor) {
                    $(this).css("fill", "rgb(0, 105, 191)"); //blue
                }
            }
        });
    }, function() { //mouse out
        var thisElement = $(this);
        var boxColor = $(".legendBox", thisElement).attr("previousfill");
        if ($(this).hasClass("on")) {
            $(".legendBox", thisElement).css("background-color", boxColor);
        } else { //change box color back to normal color, not blue else change back to gray
            $(".legendBox", thisElement).css("background-color", "rgba(248, 245, 245, 0.20)");
        }
        $("path, circle").each(function(index, element) {
            if (($(this).attr("enabled")) === "true") { //if not gray
                $(this).css("fill", $(this).attr("previousfill"));
            }
        });
    });
	//accessibility - focus and blur
    $(".legendBox").focus(function() {
		var thisElement = $(this).parent(".legendElement");
		var thisColor = $(this).attr("previousfill");
			
		if( $(this).parent(".legendElement").hasClass("on") ){
			$(this).css("background-color", "rgb(0, 105, 191)"); //blue
		};
		$("path, circle").each(function(index, element) {
			if (($(this).attr("enabled")) === "true") { //if not gray   
				if (($(this).css("fill")) == thisColor) {
					$(this).css("fill", "rgb(0, 105, 191)"); //blue
				};
			};
		});
    });
	$(".legendBox").blur(function() {
        var thisElement = $(this).parent(".legendElement");
        var boxColor = $(this).attr("previousfill");
        if( $(this).parent(".legendElement").hasClass("on") ){
            $(".legendBox", thisElement).css("background-color", boxColor);
        } else { //change box color back to normal color, not blue else change back to gray
            $(".legendBox", thisElement).css("background-color", "rgba(248, 245, 245, 0.20)");
        };

        $("path, circle").each(function(index, element) {
            if (($(this).attr("enabled")) === "true") { //if not gray
                $(this).css("fill", $(this).attr("previousfill"));
            }
        });
    });
}

///set up map hover highlighting and tooltip	
var setupMapHover = function(map_options) {
var SVGfill;
var hover_item = map_options.map_type === "metro" ? "circle" : "circle, path";
    $(hover_item, "#USAmap").hover(function(event) {
            var displayName = 'showStates';

            ///assign previous colors
            SVGfill = $(this).css("fill");
            $(this).css({
                "fill": "rgb(0, 105, 191)" //blue
            }); //highlight

            //////show tooltip////
            //set up state name
            var stateName = $(this).attr("statename") || $(this).attr("loc_name");
			var stateValue = $(this).attr("statevalue") || $(this).attr("loc_value");

            //set up state value
            if (stateValue) {
                if (stateValue == "N/A") {
                    var stateDataValue = "N/A";
                } else {
                    var stateDataValue = map_options.signs[0] + addCommas(Number(stateValue).toFixed(map_options.decimals)) + map_options.signs[1];
                }
            } else {
                var stateDataValue = "N/A";
            }

            //set up extra values if not an animated map
            if (!map_options.is_animated) {
                $("#extraDataSpan").html("");
                if ($(this).attr("extra_vals")) {
                    $(this).attr("extra_vals").split(";").forEach(function(e, i) {
                        if (map_options.extra_val_signs) {
                            var dollar_sign = map_options.extra_val_signs[i] ? map_options.extra_val_signs[i][0] : "";
                            var percent_sign = map_options.extra_val_signs[i] ? map_options.extra_val_signs[i][1] : "";
                        } else {
                            var dollar_sign = "";
                            var percent_sign = "";
                        }
                        var s = map_options.extra_val_titles[i] +
                            ": <span style='font-weight: bold'>" +
                            dollar_sign + e + percent_sign +
                            "</span><br>";
                        s = s.replace("$-", "-$")
                        $("#extraDataSpan").append(s);
                    });
                }
            }

            //insert text and show tooltip
            $("#stateName").html(stateName);
            //	$("#dataText").html(selectedDate);
            $("#dataValue").html(stateDataValue.replace("$-", "-$"));
            $("#mapToolTip").css("display", "block");
        },
        function() {
            $(this).css({
                "fill": SVGfill
            }); //highlight

            $("#mapToolTip").css("display", "none");
        });

		//accessibility - focus and blur
		$("#USAmap").attr("focusable","false");
		$(hover_item, "#USAmap").attr("tabIndex",0).attr("focusable","true");
		$(hover_item, "#USAmap").focus(function(event) {
            var displayName = 'showStates';

            ///assign previous colors
            SVGfill = $(this).css("fill");
            $(this).css({
                "fill": "rgb(0, 105, 191)" //blue
            }); //highlight

            //////show tooltip////
            //set up state name
            var stateName = $(this).attr("statename") || $(this).attr("loc_name");
			var stateValue = $(this).attr("statevalue") || $(this).attr("loc_value");

            //set up state value
            if (stateValue) {
                if (stateValue == "N/A") {
                    var stateDataValue = "N/A";
                } else {
                    var stateDataValue = map_options.signs[0] + addCommas(Number(stateValue).toFixed(map_options.decimals)) + map_options.signs[1];
                }
            } else {
                var stateDataValue = "N/A";
            }

            //set up extra values if not an animated map
            if (!map_options.is_animated) {
                $("#extraDataSpan").html("");
                if ($(this).attr("extra_vals")) {
                    $(this).attr("extra_vals").split(";").forEach(function(e, i) {
                        if (map_options.extra_val_signs) {
                            var dollar_sign = map_options.extra_val_signs[i] ? map_options.extra_val_signs[i][0] : "";
                            var percent_sign = map_options.extra_val_signs[i] ? map_options.extra_val_signs[i][1] : "";
                        } else {
                            var dollar_sign = "";
                            var percent_sign = "";
                        }
                        var s = map_options.extra_val_titles[i] +
                            ": <span style='font-weight: bold'>" +
                            dollar_sign + e + percent_sign +
                            "</span><br>";
                        s = s.replace("$-", "-$")
                        $("#extraDataSpan").append(s);
                    });
                }
            }

            //insert text and show tooltip
            $("#stateName").html(stateName);
            //	$("#dataText").html(selectedDate);
            $("#dataValue").html(stateDataValue.replace("$-", "-$"));

            $("#mapToolTip").css("display", "block");

        });
		$(hover_item, "#USAmap").blur(function(event) {
					$(this).css({
						"fill": SVGfill
					}); //highlight

					$("#mapToolTip").css("display", "none");
        });

}//end setupMapHover

////functions for making extra values and titles and adding them to the svg
var extra_values = {

    //load extra values function (used in tooltip or with animation)
    makeExtraValues: function(map_options, mapDataObj, thisRow) {
      
	  	var skip = map_options.is_animated ? 0 : 1;
	    var extra_vals = [];
		if(map_options.is_animated){
				$("td", thisRow).each(function() {
					extra_vals.push($(this).text());
				});
		}else{ //if not animated, skip the first cell
				$("td:gt(0)", thisRow).each(function() {
					extra_vals.push($(this).text());
				});
		}
        return extra_vals.join(";");
    },

	//add extra_titles
    makeExtraValueTitles: function(map_options) {
		var skip = map_options.is_animated ? 0 : 1;
        var extra_val_titles = [];
        $("#tableDiv thead tr").each(function() {
            $("th:gt("+skip+")", $(this)).each(function() {
                extra_val_titles.push($(this).text());
            });
        });
        return extra_val_titles;
    }

};
var organizeValues1 = function(map_options, mapDataObj, keyName){
    
    ///gets and returns a sorted values array from a passed object and keyname
    var getValuesArray = function(mapDataObj, keyName){
         var values_array = [];
            $.each(mapDataObj, function() {
                values_array.push(this[keyName]);
            });
    
            values_array = values_array.sort(function(a, b) {
                return a - b
            });
        
        return values_array;
    }

    ///gets a sorted values array from a passed object and keyname ("color_val")
    map_options.values_array = getValuesArray(mapDataObj, keyName);
    //map_options.values_array.sort();

    ///get ranges func
    var getRange = function(val){
        //console.log(map_options.values_array);
        return map_options.values_array[Math.floor(map_options.values_array.length * val)];
    }
    
    //divide array ranges into quintiles
    map_options.rangeHigh = map_options.rangeHigh || getRange(.85);
    map_options.rangeMidHigh = map_options.rangeMidHigh || getRange(.6);
    map_options.rangeMidLow = map_options.rangeMidLow || getRange(.4);
    map_options.rangeLow = map_options.rangeLow || getRange(.2);
    return map_options
}

////////////////function for loading data into map from table//////////////////////////////	
var loadMapData = function(map_options) {

    var mapID = "#" + map_options.renderTo;

    ///set up mapData JS object from table

    var mapDataObj = {};
	//so it will grab middle cell to color by in the case of animted maps, or first with normal maps
	var cell_num = map_options.is_animated ? map_options.range_column_index : 0; 

	///load state names and state color vals from table
    $("#tableDiv tbody tr").each(function(index, element) {
        var thisRow = $(this);
        var thisState = $("th", thisRow).text().trim();
		var color_val = Number($("td:eq("+cell_num+")", thisRow).text().replace(/,/g, "").replace(/\$/g, "").replace(/%/g, ""));
		color_val = isNaN(color_val) ? null : color_val;
        mapDataObj[thisState] = {
            stateName: thisState,
            color_val: color_val
        };
		

        ///add extra data values 
        mapDataObj[thisState].extra_vals = extra_values.makeExtraValues(map_options, mapDataObj, thisRow);

    });

    //add extra_titles
    map_options.extra_val_titles = extra_values.makeExtraValueTitles(map_options);

    ///change map header
    $("#mapHeader").text($("#tableDiv caption").text());
    //change map subhead 
    $("#mapSubHeader").text(map_options.sub_title);

    ///take selected values from each state object and place in coresponding svg state paths
    $.each(mapDataObj, function() {
        $("circle[loc_name='"+this.stateName+"'], path[loc_name='"+this.stateName+"']", $(mapID)).attr({
            "statevalue": this.color_val,
			"loc_value": this.color_val,
            "extra_vals": this.extra_vals,
			"class": isNaN(this.color_val) ? "hidden" : "visible"
        });
    });
	
	//hide circles that weren't used
	$("circle:not(.visible)", $(mapID)).hide();

	//call organizeValues function - sets ranges and values_array in map_options
	// organizeValues(map_options, mapDataObj, "color_val");
    console.log(map_options);
    var map_options = organizeValues1(map_options, mapDataObj, "color_val");
    console.log(map_options);

    // console.log('organized',organized);
    ///call colorMap function 
    colorMap(map_options, mapID);
	
	//set up legend
    console.log(map_options,map_options.values_array);
	setupLegend(map_options, map_options.values_array);

    //set up animation controls, background data, and functionality if this is an animated map
    if (map_options.is_animated) {
        setupAnimation(map_options);
		$("#map_slider").trigger("input"); //color map again to set at desired time
    }
    setupMapHover(map_options);
		//update tabbing order, legend after svg map
		var legendCode = $("#Legend")[0].outerHTML;
		$("#Legend").remove();
		$("#USAmap").after(legendCode);
    setupLegendHover();
}
