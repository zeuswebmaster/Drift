'use strict';

var ImageProc = function(image) {
	this.imageData = {};
	this.imageData.data = image.data.slice();
	this.imageData.width = image.width;
	this.imageData.height = image.height;
}

ImageProc.prototype.map = function(x,min,max,a,b){
	return ((b-a)*(x-min)/(max-min))+a;  
}

ImageProc.prototype.brightness = function(amount) {
	var imageData = this.imageData;

	amount = this.map(amount,-100,100,-255,255);

	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			red = red+amount;
			green = green+amount;
			blue = blue+amount;
			if(red>255) red=255;
			if(red<0) red=0;
			if(green>255) green=255;
			if(green<0) green=0;
			if(blue>255) blue=255;
			if(blue<0) blue=0;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}

ImageProc.prototype.sepia = function(amount) {
	if (amount == 0) {
		return this;
	}
	
	var imageData = this.imageData;

	amount = amount / 5.0;
	amount *= 255.0/100.0;

	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			var luma = red*0.3 + green*0.59 + blue*0.11;
			red = luma + 40;
			green = luma + 20;
			blue = luma - amount;
			if(red>255) red=255;
			if(red<0) red=0;
			if(green>255) green=255;
			if(green<0) green=0;
			if(blue>255) blue=255;
			if(blue<0) blue=0;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}

ImageProc.prototype.contrast = function(amount) {
	var imageData = this.imageData;

	var value = (100.0 + amount) / 100.0;
	value *= value;

	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var r=imageData.data[index];
			var g=imageData.data[index+1];
			var b=imageData.data[index+2];
			var red = r / 255.0;
			var green = g / 255.0;
			var blue = b / 255.0;
			red = (((red - 0.5) * value) + 0.5) * 255.0;
			green = (((green - 0.5) * value) + 0.5) * 255.0;
			blue = (((blue - 0.5) * value) + 0.5) * 255.0;
			if(red>255) red=255;
			if(red<0) red=0;
			if(green>255) green=255;
			if(green<0) green=0;
			if(blue>255) blue=255;
			if(blue<0) blue=0;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}

ImageProc.prototype.saturation = function(amount) {
	var imageData = this.imageData;

	amount = (100.0 + amount) / 100.0;
	console.log("saturation amount = ", amount);
	var Pr = 0.299;
	var Pg = 0.587;
	var Pb = 0.114;
	for (var i=0;i<imageData.width;i++) {
		for (var j=0;j<imageData.height;j++) {
			var index = (j*4)*imageData.width+(i*4)
			var r = imageData.data[index];
			var g = imageData.data[index+1];
			var b = imageData.data[index+2];
			var P = Math.sqrt(r*r*Pr + g*g*Pg + b*b*Pb);
			imageData.data[index]   = P+(r-P)*amount;
			imageData.data[index+1] = P+(g-P)*amount;
			imageData.data[index+2] = P+(b-P)*amount;
		}   
	}
	return this;
}

export default ImageProc;