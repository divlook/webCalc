

/*

	@webCalcFn

*/

;(function(window, document){
	
	var window = window;
	var document = document;

	var $window = $(window);
	var $document = $(document);
	
	var webCalcFn = {
		
		ready: function() {

			//클릭했을 때 data-web-calc-fn 실행
			$('.webCalcFn-click').each(function(index, el) {
				$(el).attr('onclick', 'javascript:webCalcFn.'+el.dataset.webCalcFn+'()');
			});

		},

		page: {
			index: {
				article: {
					imageSize: function() {

						
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
							ImageSize_data = JSON.parse(localStorage.getItem('ImageSize_historyList'));
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
							if ( $pointNumber < 0 ) {
								alert('소수점은 양수로 입력하세요\nEnter decimal point as a positive number');
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
						if (localStorage.getItem('ImageSize_historyList')) {
							webCalcFn.handlebars.index.article.imageSize(ImageSize_data);
						}
						// webCalcFn.handlebars.index.article.imageSize({
						// 	historyList: [
						// 		{
						// 			no: 1,
						// 			originalWidth: 1920,
						// 			originalHeight: 1080,
						// 			targetWidth: 16,
						// 			targetHeight: 9,
						// 			decimalPoint: 0,
						// 		}
						// 	]
						// });

						$ImageSize.on('click', '.btn-success', function(event) {
							event.preventDefault();
							if (!$originalWidth.val() && !$originalHeight.val() && !$targetWidth.val() && !$targetHeight.val()) {
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

							// historyList에 출력
							webCalcFn.handlebars.index.article.imageSize(result);

							// 데이터가 있을 때, 없을 때 처리
							if (ImageSize_data.historyList.length > 0) {
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
							
							// localstorage에 저장
							localStorage.setItem('ImageSize_historyList', JSON.stringify(ImageSize_data));

						});

					}
				}
			}
		},
		handlebars: {
			index: {
				article: {
					imageSize: function() {

						var data = {};

						var $ImageSize_history = $('#ImageSize_history');
						
						//핸들바 템플릿 가져오기
						var handlebars_ImageIsze_source = $("#ImageSize_historyList").html();

						//핸들바 템플릿 컴파일
						var handlebars_ImageIsze_template = Handlebars.compile(handlebars_ImageIsze_source);


						// data 인자 확인
						for (var i = 0, len = arguments.length; i < len; i++) {
							switch (typeof arguments[i]) {
								case 'object':
									data = arguments[i];
								break;

								default:
								break;
							}
						}

						//핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var html = handlebars_ImageIsze_template(data);


						//생성된 HTML을 DOM에 주입
						$ImageSize_history.find('table tbody').prepend(html);
					}
				}
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

		// init
		webCalcFn.ready();
		// #ImageSize
		webCalcFn.page.index.article.imageSize();

	});




	// 외부로 노출
	window.webCalcFn = webCalcFn;
})(window, document);
	


