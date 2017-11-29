window.protobject = (function () {
	var statesOvertime = [];
	var areaNames = [];
	var urlPort="";
	var callback = {
			connect: function (wsUrlPort) {
						urlPort=wsUrlPort; 
						callback.subConnect();
					}, 
					
			subConnect: function() {
								var ws = new WebSocket(urlPort); 
								ws.onmessage = function(event){
								digitalizedInterface=JSON.parse(event.data); 
								digitalizedInterface.forEach(function( element, index, array ) {
									if (areaNames.indexOf(element.name) == -1) {
										areaNames.push(element.name);	
										statesOvertime.push({ area: element.name, state: element.returnValue, confidence: element.mean });
									} else {
										statesOvertime.forEach(function( element2, index2, array2 ) {
											if (element2.area == element.name) {
												element2.confidence = element.mean;
												if (element.returnValue!=element2.state) {
													element2.state = element.returnValue;
													var event = new CustomEvent("Protobject."+element2.area, { "detail": {state: element.returnValue, confidence: element.mean} });
													var eventState = new CustomEvent("Protobject."+element2.area+"."+element.returnValue, { "detail": { confidence: element.mean} });
													document.dispatchEvent(event);
													document.dispatchEvent(eventState);
												}
												return false;
											}
										});
									}
								});
								var eventLoop = new CustomEvent("Protobject:Loop", { "detail": {} });
								document.dispatchEvent(eventLoop);
							} 
							ws.onopen = function(){ console.log("Connected to the WebSocket...");   } 
							ws.onclose = function(){ console.log("Connection closed...");  } 
							ws.onerror = function(){ console.log("Connection error... retrying in three seconds...");  setTimeout(function(){ callback.subConnect(); }, 3000);  }

					},				
			get: function (areaName) {
						var returnElement = {};
						statesOvertime.forEach(function( element2, index2, array2 ) {
							if (element2.area == areaName) {
								returnElement = {state: element2.state, confidence: element2.confidence} ;
							}
						});
						return returnElement;
					}, 
					
			getState: function (areaName) {
						var returnElement = {};
						statesOvertime.forEach(function( element2, index2, array2 ) {
							if (element2.area == areaName) {
								returnElement = {state: element2.state, confidence: element2.confidence} ;
							}
						});
						return returnElement.state;
					}, 
			getConfidence: function (areaName) {
						var returnElement = {};
						statesOvertime.forEach(function( element2, index2, array2 ) {
							if (element2.area == areaName) {
								returnElement = {state: element2.state, confidence: element2.confidence} ;
							}
						});
						return returnElement.confidence;
					}, 
			debug: function () {
						return statesOvertime;
					}, 
					
			onEvent: function(eventName, handler) {
								document.addEventListener("Protobject."+eventName, handler, false);
							},
			loop: function(handler) {
								document.addEventListener("Protobject:Loop", handler, false);
							},	
			iftttMaker: function(url) {
								$.get(url)
							}
					
		}
		return callback;
}());