$(function(){
	var data = [];
	init(data);
});
function init(data){
	new sChart('mycanvas', 'line', data, {
		title: '内存使用时段图',
		bgColor: '#D5E4EB',
		titleColor: '#00887C',
		fillColor: 'red',
		contentColor: 'rgba(46,199,201,0.3)'
	});
}
function jsReadFiles(files) {
	var data = [];
	if (files.length) {
		var file = files[0];
		if(/image+/.test(file.type) == false){
			var reader = new FileReader();
			reader.onload = function() {
				usedArr = [];
				arr = this.result.split(/[\n]/);
				var index = 0;
				memory = {};
				for(var i=0;i<arr.length;i++){
					memory = new Object();
					if(arr[i].replace(/(^\s*)|(\s*$)/g, "") == ""){
						continue;
					}
					if(!isNaN(arr[i].split(",")[1])){
						memory.name=arr[i].split(",")[0].split(/\s/)[1].replace(/(^\s*)|(\s*$)/g, "");						
						memory.value=parseInt(arr[i].split(",")[1].replace(/(^\s*)|(\s*$)/g, ""));
						data.push(memory);
						index++;
					}										
				}
				//console.log(data);
				init(data);
			}
			reader.readAsText(file);	
		}
		/* if (/text+/.test(file.type)) {//
			reader.onload = function() {
				$('body').append('<pre>' + this.result + '</pre>');
			}
			reader.readAsText(file);
		} else if(/image+/.test(file.type)) {
			reader.onload = function() {
				$('body').append('<img src="' + this.result + '"/>');
			}
			reader.readAsDataURL(file);
		}else{
			
		} */
	}
}
function clearChart(){
	$('#divMemory').empty();
	var canvas = '<canvas id="mycanvas" width="1000" height="400"></canvas>\
				  <div id="divFileChoice">\
					<input type="file" id="choiceFile" onchange="jsReadFiles(this.files)"/>\
					<input type="button" value="clear" onclick="clearChart()"/>\
				  </div>';
	$('#divMemory').append(canvas);
	var data = [];
	init(data);
//	location.reload();
}