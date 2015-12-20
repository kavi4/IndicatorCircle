//==============ANGREEMENT=================================
/*
	options =
	{
		//required
		size:
		data:
		container:

		padding:
		maxValue:100
		minValue:0
		unit:%
		prefix:inCi
		dotRadius:4*lineWidth
		foregroundWidth:1
		dotMargin:3*linewWidth

		
		dotMod: 1-have || 0-none
		styleMod: 1-generate stylesheet || 2-generate attr || 0-none
		signMod: 1 || 0-none
		backgroundMod: 0-none || 1-have
		
		//style
		
		dotColor    :#40d47e
		signColor   :white
		signFont    :Arial
		signFontSize:24
		backgroundColor :#95a5a6
		foregroundColor:#40d47e
		
		
	}


*/
//=========================================================

; var indicCircle = (function(){

	var result = {};

	result.build = function(opt)
	{
		var data = opt.data,
			size = opt.size,
		    container = d3.select(opt.container);

		var unit      = opt.unit      || " %",
			padding   = opt.padding   || size*0.1;
			prefix    = opt.prefix    || "inCi"; prefix += "-",
			dotColor  = opt.dotColor  || "#40d47e",
			signColor = opt.signColor || "white",
			signFont  = opt.signFont  || "Arial",

			foregroundWidth = opt.foregroundWidth || 1,
			dotRadius       = opt.dotRadius       || 4*(opt.foregroundWidth || 1),
			signFontSize    = opt.signFontSize    || "24pt",
			dotStrokeColor  = opt.dotStrokeColor  || "#40d47e",
			backgroundColor = opt.backgroundColor || "#95a5a6",
			foregroundColor = opt.foregroundColor || "#40d47e",

			dotMargin = opt.dotMargin !== undefined ? opt.dotMargin : foregroundWidth*3,
			maxValue  = opt.maxValue  !== undefined ? opt.maxValue : 100,
			minValue  = opt.minValue  !== undefined ? opt.minValue : 0,
			dotMod    = opt.dotMod    !== undefined ? opt.dotMod   : 1,
			signMod   = opt.signMod   !== undefined ? opt.signMod  : 1,
			styleMod  = opt.styleMod  !== undefined ? opt.styleMod : 1,
			backgroundMod   = opt.backgroundMod   !== undefined ? opt.backgroundMod : 1;

			
			

		var body = container.append("svg")
						   .attr("width",size+"px")
						   .attr("height",size+"px")
						   .attr("viewBox","0 0 "+size+" "+size)


		if(styleMod == 1){
    		//======================BUILD STYLESHEET===========================
    		
    		function getRand(){return Math.floor(Math.random() * (1000 - 0 + 1)) + 0;}

			var cl_lineFill      = prefix+"fil" +getRand()+getRand()+getRand();
			var cl_notLoadedFill = prefix+"fil" +getRand()+getRand()+getRand();
			var cl_dotFill       = prefix+"fil" +getRand()+getRand()+getRand();
			var cl_sign          = prefix+"sign"+getRand()+getRand()+getRand();

			var style = "<defs><style type='text/css'><![CDATA[*]]></style></defs>";
			var stylesheet = "."+cl_lineFill+"{fill:"+foregroundColor+";}."+cl_dotFill+"{fill:"+dotColor+"}"+" ."+cl_notLoadedFill+"{fill:"+backgroundColor+"}"+" ."+cl_sign+"{text-anchor:middle;fill:"+signColor+"; font-family:"+signFont+"; font-size:"+signFontSize+"; dominant-baseline:middle;}";
			style = style.replace("*",stylesheet)
			body[0][0].innerHTML = style;
    	}

		var scaleR = d3.scale.linear()//линейная зависимость по радиусу
							 .domain([minValue,maxValue])
							 .range([0,360]);

		var radius = (size - 2 * padding)/2;
		var center = size/2;
		var dotRad = scaleR(data) * Math.PI/180;

		var arc = d3.svg.arc()
						.innerRadius(radius)
						.outerRadius(radius + foregroundWidth)
						.startAngle(0);
		if(backgroundMod)
		var background = body.append("path")
						     .datum({endAngle:getEndAngleBack(data)})
    					     .attr("d", arc)
    					     .attr("transform","translate("+center+","+center+")")
    					     
    					     .classed(prefix+"background",true)

		var foreground = body.append("path")
							 .classed(prefix+"foreground",true)
						     .datum({endAngle:getEndAngleForeg(data)})
						     .attr("d",arc)
						     .attr("transform","translate("+center+","+center+")")
						     
		if(dotMod)
    	var dot = body.append("circle")
    				  .classed(prefix+"dot",true)
    				  .datum({angle:dotRad})
    				  .attr("r",dotRadius)
    				  .attr("cx",center - radius * Math.sin(dotRad))
    				  .attr("cy",center - radius * Math.cos(dotRad))
    				  
    	if(signMod)
    	var sign = body.append("text")
    					.text(data+" "+unit)
    					.attr("x",center)
    					.attr("y",center)


    	function getEndAngleForeg(data){
    	if(dotMod)
    		return ((-scaleR(data) + dotRadius/2 + dotMargin)) * Math.PI/180;
    		return (-scaleR(data)) * Math.PI/180;
    	}

    	function getEndAngleBack(data){
    		if(dotMod)
    		return ((scaleR(maxValue - data)- dotRadius/2  - dotMargin)) * Math.PI/180;
    		return (scaleR(maxValue - data)) * Math.PI/180;

    		
    	}

    	if(styleMod == 1)
    	{
    		if(backgroundMod)
    		background.classed(cl_notLoadedFill,true)
			foreground.classed(cl_lineFill ,true)
			if(dotMod)
			dot.classed(cl_dotFill,true)
			if(signMod)
			sign.classed(cl_sign,true)
    	}
    	if(styleMod >= 2 )
    	{
    		if(backgroundMod)
    		background.attr("fill",backgroundColor);
    		foreground.attr("fill",foregroundColor);
    		if(dotMod)
    		dot.attr("fill",dotColor)
    		if(signMod)
    		sign.attr("fill",signColor)
	    		.attr("font-size",signFontSize)
	    		.attr("font-family",signFont)
	    		.attr("text-anchor","middle")
	    		.attr("dominant-baseline","middle")
    	}

    	var subResult = {};
    	subResult.update = function(indata,duration)
    	{
    		foreground.transition()
    					.duration(duration)
    					.attrTween("d",function(d)
    					{
		    				var f = d3.interpolate(d.endAngle,getEndAngleForeg(indata));
		      				return function(t)
		      				{
		      					d.endAngle = f(t);
		      					return arc(d);
		      				}	
		    			}
    					);
    					console.dir(background)
    		if(backgroundMod)
    		background.transition()
    				  .duration(duration)
    				  .attrTween("d",function(d)
    					{
		    				var f = d3.interpolate(d.endAngle,getEndAngleBack(indata));
		      				return function(t)
		      				{
		      					d.endAngle = f(t);
		      					return arc(d);
		      				}	
		    			}
    					);
    		if(dotMod)
    		dot.transition()
    			.duration(duration)
    			.attrTween("cx",function(d)
    			{
    				var end = scaleR(indata) * Math.PI/180;
    				var f = d3.interpolate(d.angle,end);
    				return function(t)
    				{	
    					d.angle = end;
    					return center-radius*Math.sin(f(t));
    				}
    			})
    			.attrTween("cy",function(d)
    			{
    				var end = scaleR(indata) * Math.PI/180;
    				var f = d3.interpolate(d.angle,end);
    				return function(t)
    				{console.log("f")
    					 d.angle = end;
    					return center-radius*Math.cos(f(t));
    				}
    			});
    			if(signMod)
    			sign.transition()
    				.duration(duration)
    				.tween('text',function(){
    					var current = +this.textContent.replace(unit,"").replace(" ","");
    					var inter = d3.interpolateRound(current,indata);
    					return function(t){
    						this.textContent = inter(t)+unit;
    					}
    				});
    	}
    	subResult.rebuild = function(opt)
    			{
    				svg.remove();
	    			indicCircle.build(opt);
	    		}
    			return subResult;
	}
	
	return result;
})(document);