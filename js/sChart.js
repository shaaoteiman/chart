/*!
 * sChart JavaScript Library v2.0.1
 * http://blog.gdfengshuo.com/example/sChart/ | Released under the MIT license
 * Date: 2018-04-16T18:59Z
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.sChart = factory(root);
    }
})(this, function (root) {
    'use strict';
    /**
     * ����ͼ��
     * @param {String} canvas ����Ԫ��id
     * @param {String} type ͼ������
     * @param {Array} data ����ͼ�������
     * @param {Object} options ͼ����� ��ѡ����
     */
    function sChart(canvas, type, data, options) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.dpi = window.devicePixelRatio || 1;
        this.type = type;
        this.data = data; // ���ͼ������
        this.dataLength = this.data.length; // ͼ�����ݵĳ���
        this.showValue = true; // �Ƿ���ͼ������ʾ��ֵ
        this.autoWidth = false; // ����Ƿ�����Ӧ
        this.width = this.canvas.width * this.dpi; // canvas ���
        this.height = this.canvas.height * this.dpi; // canvas �߶�
        this.topPadding = 50 * this.dpi;
        this.leftPadding = 50 * this.dpi;
        this.rightPadding = 50 * this.dpi;
        this.bottomPadding = 50 * this.dpi;
        this.yEqual = 5; // y��ֳ�5�ȷ�
        this.yLength = 0; // y�������֮�����ʵ����
        this.xLength = 0; // x�������֮�����ʵ����
        this.yFictitious = 0; // y�������֮����ʾ�ļ��
        this.yRatio = 0; // y��������ʵ���Ⱥ�������ı�
        this.bgColor = '#ffffff'; // Ĭ�ϱ�����ɫ
        this.fillColor = '#1E9FFF'; // Ĭ�������ɫ
        this.axisColor = '#666666'; // ��������ɫ
        this.contentColor = '#eeeeee'; // ���ݺ�����ɫ
        this.titleColor = '#000000'; // ͼ�������ɫ
        this.title = ''; // ͼ�����
        this.titlePosition = 'top'; // ͼ�����λ��: top / bottom
        this.radius = 100 * this.dpi; // ��ͼ�뾶�ͻ���ͼ��Բ�뾶
        this.innerRadius = 70 * this.dpi; // ����ͼ��Բ�뾶
        this.colorList = ['#1E9FFF', '#13CE66', '#F7BA2A', '#FF4949', '#72f6ff', '#199475', '#e08031', '#726dd1']; // ��ͼ��ɫ�б�
        this.legendColor = '#000000'; // ͼ��������ɫ
        this.legendTop = 40 * this.dpi; // ͼ�����붥���߶�
        this.totalValue = this.getTotalValue(); // ��ȡ��ͼ�����ܺ�
        this.init(options);
    }
    sChart.prototype = {
        init: function (options) {
            if (this.dataLength === 0) {
				this.data = [{name:'',value:1}];
                //return false;
            }
            if (options) {
                var dpiList = ['topPadding', 'leftPadding', 'rightPadding', 'bottomPadding', 'radius', 'innerRadius', 'legendTop'];
                for (var key in options) {
                    if (key === 'colorList' && Array.isArray(options[key])) {
                        this[key] = options[key].concat(this[key])
                    } else if (dpiList.indexOf(key) > -1) {
                        this[key] = options[key] * this.dpi;
                    } else {
                        this[key] = options[key];
                    }
                }
            }

            // ����������Զ���ߵĻ�����Ϳ����Ϊ��Ԫ�صĿ��
            if (options.autoWidth) {
                this.width = this.canvas.width = this.canvas.parentNode.offsetWidth * this.dpi;
                this.height = this.canvas.height = this.canvas.parentNode.offsetHeight * this.dpi;
                this.canvas.setAttribute('style', 'width:' + this.canvas.parentNode.offsetWidth + 'px;height:' + this.canvas.parentNode.offsetHeight + 'px;')
            } else {
                this.canvas.setAttribute('style', 'width:' + this.canvas.width + 'px;height:' + this.canvas.height + 'px;');
                this.canvas.width *= this.dpi;
                this.canvas.height *= this.dpi;
            }

            if (this.type === 'bar' || this.type === 'line') {
                this.yLength = (this.height - this.topPadding - this.bottomPadding - 10) / this.yEqual;
                this.xLength = (this.width - this.leftPadding - this.rightPadding - 10) / this.dataLength;
                this.yFictitious = this.getYFictitious(this.data);
                this.yRatio = this.yLength / this.yFictitious;
                this.drawBarUpdate();
            } else {
                this.drawPieUpdate();
            }
			//this.detect(event);
			this.canvas.addEventListener('mousemove', (function(){
				//this.canvas = sChart.prototype;
				var x=event.clientX-this.canvas.getBoundingClientRect().left;
				var y=event.clientY-this.canvas.getBoundingClientRect().top;
				for (var i = 0; i < this.dataLength; i++) {
					
					//this.ctx.arc(this.data[i].left + this.xLength / 4, this.data[i].top, 2, 0, 2 * Math.PI, true);
					
					if((x <= (this.data[i].left+1)&&x >= (this.data[i].left-1)) 
						&& (y <= (this.data[i].top+1)&&y >= (this.data[i].top-1))){
						this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
						//this.init(this.options);
						this.drawBarUpdate();
						this.ctx.font = 12 * this.dpi + 'px Arial';
						this.ctx.fillStyle = this.titleColor;
						this.ctx.beginPath();
						if (this.showValue) {
							//this.ctx.font = 12 * this.dpi + 'px Arial';
							this.ctx.fillText(
								'M:'+this.data[i].value,
								this.data[i].left-15,
								this.data[i].top - 18
							);
							this.ctx.fillText('T:'+this.data[i].name,this.data[i].left,this.data[i].top - 5);
						}
						break;
					}
					if(i == this.dataLength-1){
						this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
						//this.init(this.options);
						this.drawBarUpdate();
					}
				}
			}).bind(this),true);
        },
        /**
         * ������������״ͼ������ͼ
         */
        drawBarUpdate: function () {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.drawAxis();
            this.drawPoint();
            this.drawTitle();
            this.drawBarChart();
        },
        /**
         * ���������ı�״ͼ����ͼ
         */
        drawPieUpdate: function () {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.drawLegend();
            this.drawTitle();
            this.drawPieChart();
        },
        /**
         * �����ݻ��Ƴ���״������
         */
        drawBarChart: function () {
			
            this.ctx.fillStyle = this.fillColor;
            this.ctx.strokeStyle = this.fillColor;
            for (var i = 0; i < this.dataLength; i++) {
                this.data[i].left = this.leftPadding + this.xLength * (i+0.5);
                this.data[i].top = parseInt(this.height - this.bottomPadding - this.data[i].value * this.yRatio);
                this.data[i].right = this.leftPadding + this.xLength * (i+0.75);
                this.data[i].bottom = this.height - this.bottomPadding;

                // ��������
                if (this.type === 'line') {
                    this.ctx.beginPath();
                   // this.ctx.arc(this.data[i].left + this.xLength / 4, this.data[i].top, 0.1, 0, 2 * Math.PI, true);
                    //this.ctx.fill();
                    if (i !== 0) {
                        this.ctx.moveTo(this.data[i].left+2, this.data[i].top);
                        this.ctx.lineTo(this.data[i - 1].left+2, this.data[i - 1].top);
                    }
                    this.ctx.stroke();
                } else if (this.type === 'bar') {
                    // ������״
                    this.ctx.fillRect(
                        this.data[i].left,
                        this.data[i].top,
                        this.data[i].right - this.data[i].left,
                        this.data[i].bottom - this.data[i].top
                    );
                }
               
						/* this.ctx.font = 12 * this.dpi + 'px Arial';
						this.ctx.beginPath();
						if (this.showValue) {
							//this.ctx.font = 12 * this.dpi + 'px Arial';
							this.ctx.fillText(
								this.data[i].value,
								this.data[i].left,
								this.data[i].top - 5
							);
						} */
            }
        },
		
        /**
         * �����ݻ��Ƴ���״����
         */
        drawPieChart: function () {
            var x = this.width / 2,
                y = this.height / 2,
                x1 = 0,
                y1 = 0;
            for (var i = 0; i < this.dataLength; i++) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.colorList[i];
                this.ctx.moveTo(x, y);
                this.data[i].start = i === 0 ? -Math.PI / 2 : this.data[i - 1].end;
                this.data[i].end = this.data[i].start + this.data[i].value / this.totalValue * 2 * Math.PI;
                // ��������
                this.ctx.arc(x, y, this.radius, this.data[i].start, this.data[i].end);
                this.ctx.closePath();
                this.ctx.fill();

                this.data[i].middle = (this.data[i].start + this.data[i].end) / 2;
                x1 = Math.ceil(Math.abs(this.radius * Math.cos(this.data[i].middle)));
                y1 = Math.floor(Math.abs(this.radius * Math.sin(this.data[i].middle)));

                this.ctx.strokeStyle = this.colorList[i];
                // ���Ƹ������α��ϵ�����
                if(this.showValue){
                    if (this.data[i].middle <= 0) {
                        this.ctx.textAlign = 'left';
                        this.ctx.moveTo(x + x1, y - y1);
                        this.ctx.lineTo(x + x1 + 10, y - y1 - 10);
                        this.ctx.moveTo(x + x1 + 10, y - y1 - 10);
                        this.ctx.lineTo(x + x1 + this.radius / 2, y - y1 - 10);
                        this.ctx.stroke();
                        this.ctx.fillText(this.data[i].value, x + x1 + 5 + this.radius / 2, y - y1 - 5);
                    } else if (this.data[i].middle > 0 && this.data[i].middle <= Math.PI / 2) {
                        this.ctx.textAlign = 'left';
                        this.ctx.moveTo(x + x1, y + y1);
                        this.ctx.lineTo(x + x1 + 10, y + y1 + 10);
                        this.ctx.moveTo(x + x1 + 10, y + y1 + 10);
                        this.ctx.lineTo(x + x1 + this.radius / 2, y + y1 + 10);
                        this.ctx.stroke();
                        this.ctx.fillText(this.data[i].value, x + x1 + 5 + this.radius / 2, y + y1 + 15);
                    } else if (this.data[i].middle > Math.PI / 2 && this.data[i].middle < Math.PI) {
                        this.ctx.textAlign = 'right';
                        this.ctx.moveTo(x - x1, y + y1);
                        this.ctx.lineTo(x - x1 - 10, y + y1 + 10);
                        this.ctx.moveTo(x - x1 - 10, y + y1 + 10);
                        this.ctx.lineTo(x - x1 - this.radius / 2, y + y1 + 10);
                        this.ctx.stroke();
                        this.ctx.fillText(this.data[i].value, x - x1 - 5 - this.radius / 2, y + y1 + 15);
                    } else {
                        this.ctx.textAlign = 'right';
                        this.ctx.moveTo(x - x1, y - y1);
                        this.ctx.lineTo(x - x1 - 10, y - y1 - 10);
                        this.ctx.moveTo(x - x1 - 10, y - y1 - 10);
                        this.ctx.lineTo(x - x1 - this.radius / 2, y - y1 - 10);
                        this.ctx.stroke();
                        this.ctx.fillText(this.data[i].value, x - x1 - 5 - this.radius / 2, y - y1 - 5);
                    }
                }
            }
            // ��������ǻ���ͼ������һ����Բ
            if (this.type === 'ring') {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.bgColor;
                this.ctx.arc(x, y, this.innerRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        },
        /**
         * ����������
         */
        drawAxis: function () {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.axisColor;
            // y����, +0.5��Ϊ�˽��canvas��1���ػ���ʾ��2���ص�����
            this.ctx.moveTo(this.leftPadding + 0.5, this.height - this.bottomPadding + 0.5);
            this.ctx.lineTo(this.leftPadding + 0.5, this.topPadding + 0.5);
            // x����
            this.ctx.moveTo(this.leftPadding + 0.5, this.height - this.bottomPadding + 0.5);
            this.ctx.lineTo(this.width - this.rightPadding - 0.5, this.height - this.bottomPadding + 0.5);
            this.ctx.stroke();
        },
        /**
         * �����������ϵĵ��ֵ
         */
        drawPoint: function () {
            // x�������
            this.ctx.beginPath();
            this.ctx.font = 12 * this.dpi + 'px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = this.axisColor;
            for (var i = 0; i < this.dataLength; i++) {
                var name = this.data[i].name;
                var xlen = this.xLength * (i + 1);
                this.ctx.moveTo(this.leftPadding + xlen + 0.5, this.height - this.bottomPadding + 0.5);
                this.ctx.lineTo(this.leftPadding + xlen + 0.5, this.height - this.bottomPadding + 5.5);
               // this.ctx.fillText(name, this.leftPadding + xlen - this.xLength / 2, this.height - this.bottomPadding + 15 * this.dpi);
            }
           // this.ctx.stroke();

            // y�������
            this.ctx.beginPath();
            this.ctx.font = 12 * this.dpi + 'px Microsoft YaHei';
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = this.axisColor;
            this.ctx.moveTo(this.leftPadding + 0.5, this.height - this.bottomPadding + 0.5);
            this.ctx.lineTo(this.leftPadding - 4.5, this.height - this.bottomPadding + 0.5);
            this.ctx.fillText(0, this.leftPadding - 10, this.height - this.bottomPadding + 5);
            for (var i = 0; i < this.yEqual; i++) {
                var y = this.yFictitious * (i+1);
                var ylen = this.yLength * (i + 1);
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.axisColor;
                this.ctx.moveTo(this.leftPadding + 0.5, this.height - this.bottomPadding - ylen + 0.5);
                this.ctx.lineTo(this.leftPadding - 4.5, this.height - this.bottomPadding - ylen + 0.5);
                this.ctx.stroke();
                this.ctx.fillText(y, this.leftPadding - 10, this.height - this.bottomPadding - ylen + 5);
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.contentColor;
                this.ctx.moveTo(this.leftPadding + 0.5, this.height - this.bottomPadding - ylen + 0.5)
                this.ctx.lineTo(this.width - this.rightPadding - 0.5, this.height - this.bottomPadding - ylen + 0.5);
                this.ctx.stroke();
            }
        },
        /**
         * ����ͼ�����
         */
        drawTitle: function () {
            if (this.title) {
                this.ctx.beginPath();
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = this.titleColor;
                this.ctx.font = 16 * this.dpi + 'px Microsoft YaHei';
                if (this.titlePosition === 'bottom' && this.bottomPadding >= 40) {
                    this.ctx.fillText(this.title, this.width / 2, this.height - 5)
                } else {
                    this.ctx.fillText(this.title, this.width / 2, this.topPadding / 2 + 5)
                }
            }
        },
        /**
         * ���Ʊ�״ͼ����ͼ��ͼ��
         */
        drawLegend: function () {
            for (var i = 0; i < this.dataLength; i++) {
                this.ctx.fillStyle = this.colorList[i];
                this.ctx.fillRect(10, this.legendTop + 15 * i * this.dpi, 20, 11);
                this.ctx.fillStyle = this.legendColor;
                this.ctx.font = 12 * this.dpi + 'px Microsoft YaHei';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(this.data[i].name, 35, this.legendTop + 10 + 15 * i * this.dpi);
            }
        },
        /**
         * y�������֮����ʾ�ļ��
         * @param data ����ͼ�������
         * @return y��������
         */
        getYFictitious: function (data) {
            var arr = data.slice(0);
            arr.sort(function (a, b) {
                return -(a.value - b.value);
            });
            var len = Math.ceil(arr[0].value / this.yEqual);
            /* var pow = len.toString().length - 1;
            pow = pow > 2 ? 2 : pow;
            return Math.ceil(len / Math.pow(10, pow)) * Math.pow(10, pow); */
			return len;
        },
        /**
         * ��ȡ��״����ͼ�������ܺ�
         * @return {Number} total
         */
        getTotalValue: function () {
            var total = 0;
            for (var i = 0; i < this.dataLength; i++) {
                total += this.data[i].value;
            }
            return total;
        }
    }
    return sChart;
});