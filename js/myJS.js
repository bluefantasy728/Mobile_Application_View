function addEvent(obj,sEvent,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEvent,fn,false);
	}else{
		obj.attachEvent('on'+sEvent,function(){
			fn.call(obj);
		});
	}
}

function removeEvent(obj,sEvent,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(sEvent,fn,false);
	}else{
		obj.detachEvent('on'+sEvent,function(){
			fn.call(obj);
		});
	}
}

