var masonry = {

	//P_01.jpg到P_162.jpg
	root: "http://cued.xunlei.com/demos/publ/img/",
	scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
	columnNum: 0,
	columnWidth: 210,
	container: document.getElementById("container"),
	indexImage: 0,
	timer: 0,
	getIndex: function(index) {
		if (index < 10)
			index = "00" + index;
		else if (index < 100)
			index = "0" + index;
		return index;
	},
	create: function() {
		this.columnNum = Math.floor(document.body.clientWidth / this.columnWidth);
		var htmlColumn = '',
			self = this,
			start;
		for (start = 0; start < this.columnNum; start++) {
			htmlColumn += '<span id="column-' + start + '" class="column" style="width:' + this.columnWidth + 'px;">' +
				function() {
					var html = '',
						i = 0;
					for (i = 0; i < 5; i++) {
						self.indexImage = start + self.columnNum * i;
						var index = self.getIndex(self.indexImage);
						html += '<a href="###" class="pic_a"><img src="' + self.root + 'P_' + index + '.jpg"/></a>';
					}
					return html;
				}() + "</span> ";
		}
		htmlColumn += '<span id="detect" class = "column" style="width:' + this.columnWidth + 'px;">';
		this.container.innerHTML = htmlColumn;

		this.detectLeft = document.getElementById("detect").offsetLeft;
		return this; //鏈式調用
	},
	appendDectect: function() {
		for (var i = 0; i < this.columnNum; i++) {
			var eleColumn = document.getElementById("column-" + i);
			if (eleColumn) {
				if (eleColumn.offsetTop + eleColumn.scrollTop< this.scrollTop + (document.documentElement.clientHeight || window.innerHeight)) { //window.innerHeight視口高度
					this.append(eleColumn);
				}
			}
		}

		return this;
	},
	append: function(column) {
		this.indexImage = this.indexImage === 162 ? 0 : this.indexImage + 1;
		var index = this.getIndex(this.indexImage);
		var imgUrl = this.root + "P_" + index + ".jpg";
		var aEle = document.createElement("a");
		aEle.href = "###";
		aEle.className = "pic_a";
		aEle.innerHTML = '<img src="' + imgUrl + '" />';	
		column.appendChild(aEle);
		return this;
	},
	resize: function() {
		var self = this;
		window.onresize = function() {
			var eleDetect = document.getElementById("detect"),
				//var a = ex1&&ex2,若ex1=false,則a = ex1,否則a = ex2
				detectLeft = eleDetect.offsetLeft;
			if (Math.abs(detectLeft - self.detectLeft) > 50) {
				//標簽偏離異常，更新佈局				
				self.refresh();
			}
		};
		return this;
	},
	refresh: function() {
		var arrHtml = [],
			arrAll = [],
			maxLength = 0;
		for (var i = 0; i < this.columnNum; i++) {
			//arrHTML是一個數組
			var arrColumn = document.getElementById("column-" + i).innerHTML.match(/<a(?:.|\s|\r|\n)*?a>/gi); //最後一個?表示非貪婪匹配，(?:pattern)表示匹配pattern,但不獲取這一匹配的子字符串
			if (arrColumn) {
				maxLength = Math.max(maxLength, arrColumn.length);
				//arrAll是一個二維數組
				arrAll.push(arrColumn);
			}
		}
		for (var k = 0; k < this.columnNum; k++) {
			for (var j = 0; j < maxLength; j++) {
				if (arrAll[k][j]) {
					arrHtml.push(arrAll[k][j]);
				}
			}
		}

		if (arrHtml && arrHtml.length) {
			this.columnNum = Math.floor(document.body.clientWidth / this.columnWidth);
			var self = this,
				htmlColumn = '',
				line = Math.floor(arrHtml.length / this.columnNum);
			for (i = 0; i < this.columnNum; i++) {
				htmlColumn += '<span id="column-' + i + '" class="column" style="width:' + this.columnWidth + 'px;">' +
					function() {
						var html = '',
							k;
						for (k = 0; k < line; k++) {
							html += arrHtml[i + k * self.columnNum];
						}
						//看看是否補全
						html = html + (arrHtml[i + line * self.columnNum] || '');
						return html;
					}() + '</span> '; //此處要加個空格，方能實現兩端對齊
			}

			htmlColumn += '<span id="detect" class="column" style="width:' + this.columnWidth + 'px;">';
			this.container.innerHTML = htmlColumn;
			this.detectLeft = document.getElementById("detect").offsetLeft;
			//檢測
			this.appendDectect();
		}
		return this;
	},
	scroll: function() {
		var self = this;
		window.onscroll = function() {

			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			//提高性能，滾動前後距離大於100px再處理
			if (Math.abs(self.scrollTop - scrollTop) > 200) {

				self.scrollTop = scrollTop;
				self.appendDectect();
			}
		};
		return this;
	},
	init: function() {
		if (this.container)
			this.create().scroll().resize(); //注冊事件		
	}
};

masonry.init();