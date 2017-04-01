

/*

	@webCalcFn

*/

;(function(window, document){
	
	var window = window;
	var document = document;

	var $window = $(window);
	var $document = $(document);
	
	var webCalcFn = {

		imageSize: {
			init: function() {

						
				var $ImageSize = $('#ImageSize');
				var $ImageSize_history = $('#ImageSize_history');

				// input
				var $originalWidth = $ImageSize.find('input[name="originalWidth"]');
				var $originalHeight = $ImageSize.find('input[name="originalHeight"]');
				var $targetWidth = $ImageSize.find('input[name="targetWidth"]');
				var $targetHeight = $ImageSize.find('input[name="targetHeight"]');
				var $point = $ImageSize.find('input[name="point"]');

				var $originalWidthNumber;
				var $originalHeightNumber;
				var $targetWidthNumber;
				var $targetHeightNumber;
				var $pointNumber;

				// checkbox
				var $originalWidthCheck = $ImageSize.find('input[name="originalWidthCheck"]');
				var $originalHeightCheck = $ImageSize.find('input[name="originalHeightCheck"]');
				var $targetWidthCheck = $ImageSize.find('input[name="targetWidthCheck"]');
				var $targetHeightCheck = $ImageSize.find('input[name="targetHeightCheck"]');

				var ImageSize_data = {
					historyList: []
				}
				if (localStorage.getItem('ImageSize_historyList')) {
					ImageSize_data = webCalcFn.storage.get('ImageSize_historyList');
				}

				// 키 입력되었을 때 이미지 사이즈 계산하기
				$ImageSize.on('keyup change', 'input[type="number"]', function() {

					// number
					$originalWidthNumber = Number($ImageSize.find('input[name="originalWidth"]').val());
					$originalHeightNumber = Number($ImageSize.find('input[name="originalHeight"]').val());
					$targetWidthNumber = Number($ImageSize.find('input[name="targetWidth"]').val());
					$targetHeightNumber = Number($ImageSize.find('input[name="targetHeight"]').val());
					$pointNumber = Number($ImageSize.find('input[name="point"]').val());

					// 소수점 입력 값이 0보다 작을 때 삭제
					if ( $pointNumber < 0 || $pointNumber > 4) {
						alert('소수점은 0~4까지\nDecimal point between 0 and 4');
						return this.value = '';
					}

					// Target value 중 하나 입력되면 다른 Target value 삭제
					if (this.name === 'targetWidth') {
						$targetHeight.val('');
					} else if (this.name === 'targetHeight') {
						$targetWidth.val('');
					}

					// 이벤트 실행
					if ( $originalWidthNumber && $originalHeightNumber) {
						if ($targetWidthNumber || $targetHeightNumber) {

							var ratio = $originalWidthNumber / $originalHeightNumber;
							var result = 0;

							// 결과 값 구하기
							if ($targetWidthNumber) {
								result = $targetWidthNumber / ratio;
							} else {
								result = $targetHeightNumber * ratio;
							}

							// 소수점 설정
							if ($point.val()) {
								result = result.toFixed($pointNumber);
							}

							// 결과 값 출력
							if ($targetWidthNumber) {
								$targetHeight.val(result);
							} else {
								$targetWidth.val(result);
							}

						}
					}

				});

				// Localstorage에 data가 있을 때
				if (ImageSize_data.historyList.length > 0) {
					webCalcFn.handlebars.imageSize(ImageSize_data);
				}

				$ImageSize.on('click submit', '.btn-success', function(event) {
					event.preventDefault();

					if (!$originalWidth.val() || !$originalHeight.val() || !$targetWidth.val() || !$targetHeight.val()) {
						return alert('값을 입력하세요\nPlease enter value');
					}

					// result
					var result = {
						no: ImageSize_data.historyList.length+1,
						originalWidth: $originalWidthNumber,
						originalHeight: $originalHeightNumber,
						targetWidth: $targetWidthNumber,
						targetHeight: $targetHeightNumber,
						decimalPoint: $pointNumber,
					}
					ImageSize_data.historyList.push(result);

					// localstorage에 저장
					webCalcFn.storage.set('ImageSize_historyList', ImageSize_data);

					// historyList에 출력
					webCalcFn.handlebars.imageSize(result);

				});
			},
			fn: {
				emptyCheck: function () {
					// 데이터가 있을 때, 없을 때 처리

					var $ImageSize_history = $('#ImageSize_history');

					if (webCalcFn.storage.get('ImageSize_historyList').historyList.length > 0) {

						if (!$ImageSize_history.find('.emptyList').hasClass('hidden')) {
							$ImageSize_history.find('.emptyList').addClass('hidden');
						}
						if ($ImageSize_history.find('table').hasClass('hidden')) {
							$ImageSize_history.find('table').removeClass('hidden');
						}
						$ImageSize_history.find('tr.success').removeClass('success');
					} else {
						if ($ImageSize_history.find('.emptyList').hasClass('hidden')) {
							$ImageSize_history.find('.emptyList').removeClass('hidden');
						}
						if (!$ImageSize_history.find('table').hasClass('hidden')) {
							$ImageSize_history.find('table').addClass('hidden');
						}
					}
				}
			},
			count: 0
		},

		handlebars: {
			imageSize: function(data) {
				var arr = {
					historyList: []
				};
				var type = '';

				if (data) {
					if (!data.historyList) {
						arr.historyList.push(data);
					} else {
						arr = data;
					}

					// 내림차순 정렬
					arr.historyList.sort(function(a, b){
						return b.no - a.no;
					});
				}

				var $ImageSize_history = $('#ImageSize_history');
				
				//핸들바 템플릿 가져오기
				var handlebars_ImageIsze_source = $("#ImageSize_historyList").html();

				//핸들바 템플릿 컴파일
				var handlebars_ImageIsze_template = Handlebars.compile(handlebars_ImageIsze_source);

				//핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var html = handlebars_ImageIsze_template(arr);

				// 데이터가 있을 때, 없을 때 처리
				webCalcFn.imageSize.fn.emptyCheck();

				//생성된 HTML을 DOM에 주입
				$ImageSize_history.find('table tbody').prepend(html);

				if (webCalcFn.imageSize.count === 0) {
					$ImageSize_history.find('tr.success').removeClass('success');
				}
				webCalcFn.imageSize.count++;
			}
		},

		storage: {
			set: function (name, data) {
				if (arguments.length === 0) {
					return null;
				}

				localStorage.setItem(name, JSON.stringify(data));
			},
			get: function (name) {
				return JSON.parse(localStorage.getItem(name));
			}
		},


		// test
		test: function() {
			alert('test');
		},
		one: {
			two : function() {
				alert('test');
			}
		}
	};




	// 문서가 로드되었을 때
	$document.ready(function() {

		// #ImageSize
		webCalcFn.imageSize.init();

	});




	// 외부로 노출
	window.webCalcFn = webCalcFn;
})(window, document);
	


