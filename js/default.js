

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

						// input
						var $originalWidth = $ImageSize.find('input[name="originalWidth"]');
						var $originalHeight = $ImageSize.find('input[name="originalHeight"]');
						var $targetWidth = $ImageSize.find('input[name="targetWidth"]');
						var $targetHeight = $ImageSize.find('input[name="targetHeight"]');
						var $point = $ImageSize.find('input[name="point"]');

						// checkbox
						var $originalWidthCheck = $ImageSize.find('input[name="originalWidthCheck"]');
						var $originalHeightCheck = $ImageSize.find('input[name="originalHeightCheck"]');
						var $targetWidthCheck = $ImageSize.find('input[name="targetWidthCheck"]');
						var $targetHeightCheck = $ImageSize.find('input[name="targetHeightCheck"]');


						// 키 입력되었을 때 이미지 사이즈 계산하기
						$ImageSize.on('keyup change', 'input[type="number"]', function() {

							// number
							var $originalWidthNumber = Number($ImageSize.find('input[name="originalWidth"]').val());
							var $originalHeightNumber = Number($ImageSize.find('input[name="originalHeight"]').val());
							var $targetWidthNumber = Number($ImageSize.find('input[name="targetWidth"]').val());
							var $targetHeightNumber = Number($ImageSize.find('input[name="targetHeight"]').val());
							var $pointNumber = Number($ImageSize.find('input[name="point"]').val());

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
	


