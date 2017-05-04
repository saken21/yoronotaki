(function(window,$) {

	var _$win,_$pages,_$bg,_$loadItem,_$showItem,_$battle,_$zukan;

	var CARD_W = 300;
	var CARD_H = 400;

	$(document).on('ready',function() {

		_$win      = $(window);
		_$pages    = $('#all').find('.page');
		_$bg       = $('#bg');
		_$loadItem = $('#loadItem');
		_$showItem = $('#showItem');
		_$zukan    = $('#zukan');
		_$battle   = $('#battle');

		_$loadItem.find('button').on('click',loadItem);

		$('#globalnavi').find('li').on('click',function() {

			var key = $(this).prop('class');
			_$pages.hide().filter('#' + key).fadeIn(300);

			if (key == 'zukan') showZukan();
			if (key == 'battle') startBattle();

			return;

		}).eq(0).trigger('click');

		return;

	});

	function loadItem() {

		var inputdata = _$loadItem.find('input').prop('value');
		_$loadItem.find('input').prop('value','');

		if (inputdata.length < 1) {

			alert('注文番号を入力してください');
			return false;

		}

		$.ajax({

			type     : 'GET',
			url      : 'http://54.249.51.28/api_mock2.php?code=' + inputdata,
			dataType : 'json',
			success  : onSuccess

		});

		function onSuccess(data) {

			if (data.status == 'NG') {

				alert('存在しないコードです。再度ご入力ください。');
				return;

			}

			showItem(data.result);

		}

		return false;

	}

	function showItem(data) {

		var name        = data.item_name;
		var description = data.description;
		var url         = data.after.img_url;

		_$loadItem.hide();
		_$showItem.show();

		showBg();

		var $hyotan      = _$showItem.find('.hyotan').hide();
		var $item        = _$showItem.find('.item').hide();
		var $powerup     = _$showItem.find('.powerup').hide();
		var $description = _$showItem.find('.description').hide().text(description);

		$item.find('img').prop('src',url);

		setTimeout(function() {
			
			$hyotan.css({ opacity:0, top:-100 }).show().animate({ opacity:1, top:0 },300,'easeOutBack')
			.delay(600).transition({ rotate:-20 },60).transition({ rotate:20 },40)
			.transition({ rotate:-10 },30).transition({ rotate:10 },60).transition({ rotate:0 },40,zoomItem);

			return;

		},1000);

		function zoomItem() {

			zoom(400,0,0);

			setTimeout(function() {

				$item.show();

				zoom(-30,.5,500,'easeInOutBack',function() {

					zoom(10,.45,600,'linear',function() {
						zoom(100,1,400,'easeInOutBack',showDescription);
					});

				});

			},300);

			return;

		}

		function zoom(t,ratio,speed,easing,func) {

			var winW  = _$win.width();
			var toW   = CARD_W * ratio;
			var toH   = CARD_H * ratio;

			$item.animate({ left:(winW - toW) * .5, top:t, width:toW, height:toH }, speed, easing,func);

		}

		function showDescription() {

			$description.fadeIn(300,next);
			return;

		}

		function next() {

			_$showItem.on('click',function() {

				back();
				_$showItem.off('click');

				return;

			});

			return;

		}

		return;

	}

	function back() {

		_$showItem.hide();
		_$loadItem.fadeIn(300);

		hideBg();

		return;
		
	}

	function showBg() {

		_$bg.fadeIn(600);
		return;

	}

	function hideBg() {

		_$bg.fadeOut(300);
		return;

	}

	function startBattle() {

		var $list     = _$battle.find('li');
		var $gage     = _$battle.find('.gage');
		var $win      = _$battle.find('.win');
		var isShaking = false;

		$gage.css({ width:'88%' });
		$win.css({ opacity:0, top:0, fontSize:'120px' }).transition({ rotate:-20 });

		$list.css({ opacity:0, top:-20 }).each(function(index) {
			$(this).delay(100 * index).animate({ opacity:1, top:0 }, 200, 'easeOutBack');
		});

		setTimeout(function() {

			shake(_$battle);
			_$battle.on('click',hit);

			return;


		},1000);

		function shake($target) {

			if (isShaking) return;
			isShaking = true;

			$target.animate({ left:-5 },30).animate({ left:5 },30)
			.animate({ left:-6 },30).animate({ left:6 },30)
			.animate({ left:-4 },30).animate({ left:8 },30)
			.animate({ left:-6 },30).animate({ left:3 },30)
			.animate({ left:0 },30,function() {
				isShaking = false;
			});

			return;

		}

		function hit() {

			if (isShaking) return;

			var gageW = $gage.width();
			gageW = gageW - Math.floor(100 * Math.random());

			if (gageW < 5) {

				gageW = 0;
				win();
			
			}

			shake($list);
			_$battle.find('.gage').stop().animate({ width:gageW },300);

			return;

		}

		function win() {

			_$battle.off('click');

			$win.delay(300).animate({ opacity:1, top:200, fontSize:'60px' },500,'easeInOutBack',function() {

				_$battle.on('click',function() {

					_$battle.off('click');
					$('#globalnavi').find('li').eq(0).trigger('click');

					return;

				});

			});

			return;

		}

		return;

	}

	function showZukan() {

		var $wrap = _$zukan.find('ul').empty();

		$.ajax({

			type     : 'GET',
			url      : 'http://54.249.51.28/get_charas_api.php',
			dataType : 'json',
			success  : onSuccess

		});

		function onSuccess(data) {

			var list = data.charas;
			var html = '';

			list.reverse();

			for (var i= 0; i < list.length; i++) {

				var info = list[i];

				html += '<li>';
				html += '<span class="image"><img src="' + info.img_url + '"></span>';
				html += '<span class="name">' + info.name + '</span>';
				html += '</li>';
			
			}

			$wrap.html(html).find('li').css({ opacity:0, top:20 }).each(function(index) {
				$(this).delay(1000 + 50 * index).animate({ opacity:1, top:0 },200,'easeOutBack');
			});

		}

		return;

	}

	function trace(text) {

		console.log(text);

	}

	return;

})(window,jQuery);
