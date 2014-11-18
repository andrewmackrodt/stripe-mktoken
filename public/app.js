$(function () {
	var localStorageKey = 'stripe_publishable_key';

	var $number = $('#stripe_card_number').select2({
		createSearchChoice: function (term, data) {
			if ($(data).filter(function () { return 0 === this.text.localeCompare(term); }).length === 0) {
				return { id: term, text: term };
			}
		},
		multiple: false,
		data: [
			{ id: '4242424242424242', text: '4242 4242 4242 4242 - Visa' },
			{ id: '4012888888881881', text: '4012 8888 8888 1881 - Visa' },
			{ id: '4000056655665556', text: '4000 0566 5566 5556 - Visa (debit)' },
			{ id: '5555555555554444', text: '5555 5555 5555 4444 - MasterCard' },
			{ id: '5200828282828210', text: '5200 8282 8282 8210 - MasterCard (debit)' },
			{ id: '5105105105105100', text: '5105 1051 0510 5100 - MasterCard (prepaid)' },
			{ id: '378282246310005', text: '3782 822463 10005 - American Express' },
			{ id: '371449635398431', text: '3714 496353 98431 - American Express' },
			{ id: '6011111111111117', text: '6011 1111 1111 1117 - Discover' },
			{ id: '6011000990139424', text: '6011 0009 9013 9424 - Discover' },
			{ id: '30569309025904', text: '3056 9309 0259 04 - Diners Club' },
			{ id: '38520000023237', text: '3852 0000 0232 37 - Diners Club' },
			{ id: '3530111333300000', text: '3530 1113 3330 0000 - JCB' },
			{ id: '3566002020360505', text: '3566 0020 2036 0505 - JCB' }
		]
	});

	var $key = $('#stripe_key').change(function () {
		var key = $(this).val();

		if ('' !== key) {
			localStorage.setItem(localStorageKey, key);
		} else {
			localStorage.removeItem(localStorageKey);
		}
	});

	var $form     = $('#stripe_form').submit(function () { return false; });
	var $cvc      = $('#stripe_cvc');
	var $expMonth = $('#stripe_exp_month');
	var $expYear  = $('#stripe_exp_year');
	var $submit   = $('#stripe_submit');
	var $result   = $('#result');

	$submit.click(function () {
		var updateMessageCallback = function (success, message) {
			$result.removeClass('error');
			if (!success)
				$result.addClass('error');
			$result.text(message);
		};

		try {
			Stripe.setPublishableKey($key.val());

			Stripe.card.createToken($form, function (status, response) {
				var success = !response.error;
				var message = success
						? response.id
						: response.error.message;

				updateMessageCallback(success, message)
			});
		} catch (e) {
			updateMessageCallback(false, e)
		}

		return false;
	});

	setTimeout(function () {
		if ('' === $key.val())
			$key.val(localStorage.getItem(localStorageKey));
		if ('' === $cvc.val())
			$cvc.val(343);
		if ('' === $expMonth.val())
			$expMonth.val(12);
		if ('' === $expYear.val())
			$expYear.val((new Date().getFullYear()) + 2);
	}, 200);
});