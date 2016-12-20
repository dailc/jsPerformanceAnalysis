/**
 * 作者: dailc
 * 时间: 2016-11-23
 * 描述:  js性能分析之js数组遍历
 */
(function() {

	//集成模板，拓展自己的数据
	var performaceAnalysis = window.PerformaceAnalysisLitemlate.extend({
		/**
		 * @description 自定义初始化数据
		 */
		customInitParams: function() {
			var self = this;
			self.perCountDom.value = 1;
			self.allLoopCountDom.value = 10;
			self.retryCount = parseInt(self.allLoopCountDom.value);
			self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
			//默认的几种类别
			app.event.bindEvent('.array-length-type', function() {
				var index = this.selectedIndex; // 选中索引
				var value = this.options[index].value; // 选中文本
				self.arrayLength = parseInt(value);
				self.resetArray();
			}, 'change');
			self.arrayLength = 3000;
			self.resetArray();
		},
		/**
		 * @description 活动分析模式,返回键值对
		 */
		getCustumAnalysisType: function() {
			return {
				"loopCompare": "数组中间值寻找"
			};
		},
		/**
		 * @description 重置数组
		 */
		resetArray: function() {
			var self = this;
			var array1 = [],
				array2 = [];
			var baseCount = self.arrayLength;
			var random1 = ~~(Math.random() * 100 + baseCount);
			var random2 = ~~(Math.random() * 100 + baseCount);
			for(var i = 0; i < random1; i++) {
				array1.push(~~(Math.random() * baseCount));
			}
			for(var i = 0; i < random2; i++) {
				array2.push(~~(Math.random() * baseCount));
			}
			var sortArray = function(a, b) {
				return a - b;
			};
			array1.sort(sortArray);
			array2.sort(sortArray);
			self.arrayX = array1;
			self.arrayY = array2;
			
			//代码前提显示文本 
			var preCode = self.getAllCustumPreCode();
			//先显示前提代码
			if(preCode['loopCompare']) {
				document.getElementById('pre-code-tips').innerHTML = preCode['loopCompare'].trim();
			}
		},
		getAllCustumPreCode: function() {
			var self = this;
			var html1 = self.getArrayShow(self.arrayX);
			var html2 = self.getArrayShow(self.arrayY);
			var html = '';
			html += 'var arrayX=' + html1 + ';\n';
			html += 'var arrayY=' + html2 + ';\n';
			return {
				"loopCompare": html
			};
		},
		/**
		 * @description 得到一个很长数组的省略显示
		 * @param {Array} arr
		 */
		getArrayShow: function(arr) {
			var self = this;
			var html = '[随机数组]';
			var count = 9;

			if(arr) {
				html = '[';
				for(var i = 0, len = arr.length;
					(i < len - 1) && i < count; i++) {
					html += arr[i] + ',';
					if(i !== 0 && i % 3 === 0) {
						html += '<br/>';
					}
				}
				if(arr.length > (count + 1)) {
					html += '...省略' + (arr.length - count - 1) + '个元素...,';
					html += '<br/>';
				}

				html += arr[arr.length - 1] + ']';
			}
			return html;
		},
		/**
		 * @description 得到默认的提示
		 */
		getCustomAttentionTips: function() {
			//默认什么都不做
			var html = '';
			html += '<p>主要对比两种不同算法在求排序数组中间值时的时间消耗</p>';

			html += '<p>一种为普通的数组合并，然后再排序，再找中间值</p>';

			html += '<p>一种为通过找k小值方法来找到中间值</p>';
			return html;
		},
		/**
		 * @description 初始化一些前提代码
		 */
		setCustomPreCode: function(callback) {
			var self = this;
			callback && callback(self.arrayX, self.arrayY);
		},
		/**
		 * @description 将详情显示出来
		 * @param {Number} sum 执行runTimesCount总共耗时多少毫秒
		 * @param {Number} perSecond 平均每秒执行多少次
		 * @param {Number} meanDeviationsPercent 平均差为百分之多少
		 */
		customeShowTips: function(sum, perSecond, meanDeviationsPercent, a, b, tmp, arr) {
			var self = this;
			var html = '';

			html += '<span class="block">';
			html += '总耗时:' + sum + 'ms';
			html += '</span>';
			html += '<span class="block">';
			html += '平均每秒执行:' + perSecond.toFixed(2) + '次';
			html += '</span>';
			html += '<span class="block">';
			html += '执行平均差:' + meanDeviationsPercent.toFixed(2) + '%';
			html += '</span>';

			return html;

		},
		getAllCustomData: function() {
			var allData = {
				//一个item
				"tmp_arrayMerge": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_arrayMerge",
					'name': '普通数组合并，然后再找中间值<br/>第一种方式',
					"codeHtml": function() {
						return document.getElementById('code-arrayMerge').innerHTML;
					},
					"runCode": function(perCount, array1, array2) {
						var originArray1 = array1.slice(0);
						var originArray2 = array2.slice(0);
						var findMedianSortedArrays1 = function(nums1, nums2) {
							var concatArray = nums1.concat(nums2);
							concatArray.sort(function(a, b) {
								return a - b;
							});
							var len = concatArray.length;
							var medium = 0;
							if(len % 2 === 0) {
								medium = (concatArray[~~(len / 2) - 1] + concatArray[~~(len / 2)]) / 2;
							} else {
								medium = concatArray[~~(len / 2)];
							}

							return medium;
						};
						var begin = (new Date()).getTime();
						var result = findMedianSortedArrays1(array1, array2);
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: originArray1,
							b: originArray2,
						};
					},
				},
				//一个item
				"tmp_findkth": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_findkth",
					'name': '通过寻找k小值的方式找到排序数组中间值<br/>第二种方式',
					"codeHtml": function() {
						return document.getElementById('code-findkth').innerHTML;
					},
					"runCode": function(perCount, array1, array2) {
						var originArray1 = array1.slice(0);
						var originArray2 = array2.slice(0);
						var findMedianSortedArrays2 = function(nums1, nums2) {
							var m = nums1.length,
								n = nums2.length;
							var total = m + n;

							//找到两个排序数组中的第k个小数，内部假设m小于n
							var findKth = function(X, Y, m, n, k) {
								if(m > n) {
									//颠倒mn的顺序
									return findKth(Y, X, n, m, k);
								} else if(m === 0) {
									//如果X数组为空，那么K肯定就在Y数组中
									return Y[k - 1];
								} else if(k === 1) {
									//只有一位，由于是升序，所以必然是X[0]或Y[0]
									return Math.min(X[0], Y[0]);
								}

								//divide k into two parts,最小为1
								//可以肯定得是partA和partB都<=K
								var partA = ~~Math.min(k / 2, m),
									partB = k - partA;
								//console.log("partA:"+partA+',partB:'+partB+',k:'+k);
								//console.log("X:"+JSON.stringify(X)+',Y:'+JSON.stringify(Y));
								//第一位数其实是X[0]，因为程序从0开始
								//以下判断时关键，每一次都可以去掉不符合要求的一部分，进行精简
								if(X[partA - 1] < Y[partB - 1]) {
									return findKth(X.slice(partA), Y, m - partA, n, k - partA);
								} else if(X[partA - 1] > Y[partB - 1]) {
									return findKth(X, Y.slice(partB), m, n - partB, k - partB);
								} else {
									//如果X数组中的第partA位和Y数组中的第partB为相等
									//由于X中有1,...,partA
									//Y中有1,...,partB
									//两者加起来刚好为k,而不管k在X中还是Y中，都必须满足X[k]>=X[partA]=X[partB]
									//所以k只可能是partA或partB(原因是X和Y中加起来已经有K个数小于等于X[k]了，所以K只能在这里面)
									return X[partA - 1];
								}
							};

							if(total % 2 !== 0) {
								return findKth(nums1, nums2, m, n, ~~(total / 2) + 1);
							} else {
								return(findKth(nums1, nums2, m, n, ~~(total / 2) + 1) + findKth(nums1, nums2, m, n, ~~(total / 2))) / 2;
							}
						};
						var begin = (new Date()).getTime();
						var result = findMedianSortedArrays2(array1, array2);
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: originArray1,
							b: originArray2,
						};
					},
				},

			};
			return allData;
		},
	});
	new performaceAnalysis();

})();