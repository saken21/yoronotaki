(function(window,$) {

	var _$loadItem,_$showItem;

	$(document).on('ready',function() {

		_$loadItem = $('#loadItem');
		_$showItem = $('#showItem');

		_$loadItem.find('button').on('click',loadItem);

		return;

	});

	function loadItem() {

		if (_$loadItem.find('input').prop('value').length < 1) {

			alert('注文番号を入力してください');
			return;

		}

		showItem();

		return;

	}

	function showItem() {

		_$loadItem.hide();

		setTimeout(function() {

			_$showItem.fadeIn(300);
			_$showItem.find('.image').css({ top:-20 }).animate({ top:0 },240,'easeOutBack');

			return;

		},600);

		return;

	}

	function trace(text) {

		console.log(text);

	}

	return;

})(window,jQuery);
