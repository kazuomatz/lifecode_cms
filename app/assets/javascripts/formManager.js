var FormManager;

(function () {
	function LCForm(options) {
		this.maps = [];
		this.settings = $.extend(true, {
			el: 'form',
			modal: false,
			create: false,
			img_noimage: $('#image-path').data('noimage-image-path'),
			img_nodocument: $('#image-path').data('nodocument-image-path'),
			img_document: $('#image-path').data('document-image-path'),
			icheck_options: {
				checkboxClass: 'icheckbox',
				radioClass: 'iradio'
			},
			select2_options: {
				width: '100%',
				language: "ja",
				allowClear: false,
				placeholder: '選択してください'
			},
			datepicker_options: {
				format: 'yyyy/mm/dd',
				language: 'ja',
				autoclose: true,
				clearBtn: true,
				beforeShowDay: function (date) {
					var day_of_week = date.getDay();

					if (isHoliday(date)) {
						return {classes: 'holiday'}
					} else if (day_of_week === 0) {
						return {classes: 'sunday'}
					} else if (day_of_week === 6) {
						return {classes: 'saturday'}
					}
				}
			},
			timepicker_options: {
				showMeridian: false,
				defaultTime: false
			},
			parsley_options: {
				excluded: 'input[type=button], input[type=submit], input[type=reset], [disabled] ',
				classHandler: function (el) {
					return el.$element.closest('.container-input');
				},
				errorsContainer: function (el) {
					return el.$element.closest('.container-input');
				}
			},
			initialized: function () {
			}
		}, options);

		// parsley独自バリデーション設定
		window.Parsley.addValidator('extension', {
			validate: function (value, requirement) {
				var extension = value.split('.').pop();
				return requirement.split(' ').indexOf(extension) >= 0
			},
			messages: {
				'ja': '指定した拡張子のファイルを選択してください。'
			}
		});

		window.Parsley.addValidator('requiredGroup', {
			validate: function (value, requirement) {
				var result = true;

				if (value !== '') {
					return result;
				}

				$('[data-parsley-required-group="' + requirement + '"]').each(function () {
					if ($(this).val() !== '') {
						result = false;
						return false;
					}
				});

				return result;
			}
		});

		window.Parsley.addValidator('uniquenessGroup', {
			validate: function (value, requirement, instance) {
				var result = true;

				if (value === '') {
					return result;
				}

				$('[data-parsley-uniqueness-group="' + requirement + '"]')
					.not('#' + instance.$element.attr('id')).each(function () {
					if ($(this).val() === value) {
						result = false;

						return false;
					}
				});

				return result;
			}
		});

		this.comfirm = false;
	}

	// 初期化
	LCForm.prototype.init = function (el, opt) {
		var self = this;
		if (opt) {
			$.extend(self.settings, opt);
		}
		var settings = self.settings;
		var noimage = settings.img_noimage;
		var nodocument = settings.img_nodocument;
		var document = settings.img_document;

		var $el = (el === undefined || el == null) ? $(settings.el) : $(el);

		// 項目の削除、ラベル化
		self.itemDelete();
		self.itemToLabel();

		// parsley初期化
		if (el !== undefined) {
			$el.find('input, select').each(function () {
				$(this).parsley().destroy();
				$(this).parsley(settings.parsley_options);
			});
		} else {
			$el.parsley(settings.parsley_options);
		}

		$el.on('submit', function () {
			self.setPrefectureNames();
			self.setSpatial();
			return true;
		});

		// カウンター初期化
		$el.find('._counter').each(function () {
			var $input = $(this).siblings('input[maxlength], textarea[maxlength]');
			$(this).html('<span>' + $input.val().length + '</span>/' + $input.attr('maxlength'));
		});

		// 文字数カウンター初期化
		$el.find('._input-count').on('keyup keydown keypress change', function () {
			var $counter = $(this).siblings('._counter').children('span');
			$counter.html($(this).val().length);
		});

		// テキストエリアのautosize適用
		autosize($el.find('textarea'));

		// ファイルインプットの初期化
		$el.find('.container-fileinput').each(function () {
			var $file_input = $(this);

			var $el_input = $file_input.find('input[type="file"]');
			var $delete_btn = $file_input.find('.btn-file-delete');
			var param_name = 'delete_' + $file_input.find('input[type=file]').attr('id');
			var attr = '[name=' + param_name + ']';

			$el_input.hide();

			// ファイル削除ボタン動作
			if ($delete_btn[0]) {
				$delete_btn.on('click', function () {
					$el_input.trigger('filedelete');
				});
			}

			if ($el_input.hasClass('_image')) {
				// 画像
				var $el_img = $file_input.find('img');

				$el_input.on('change', function () {
					if (this.files.length) {
						if (this.files[0].type.match('image.*')) {
							if ($el_img[0]) {
								var height = $el_img.height() === 0 ? 150 : $el_img.height();
								var file = this.files[0];

								$el_img.fadeOut('normal', function () {
									var filereader = new FileReader();
									filereader.onload = function (e) {
										var type = getImageFileType(e.target.result)
										if(type) {
											var imageFilereader = new FileReader();
											imageFilereader.onload = function (e) {
												var url = createObjectURL ? createObjectURL(file) : e.target.result;

												// 削除用のinputを無効化
												$file_input.find('input[type!=file]').prop('disabled', true);

												// 画像の置き換え
												var img = new Image();
												img.onload = function () {
													EXIF.getData(img, function () {
														var url = rotate(img);
														$el_img.attr('src', url).fadeIn();
														$file_input.removeClass('empty');
														img = null;
													});
												};
												img.onerror = function () {
													self.clearFileInput($el_input);
													swal("エラー", "不正な画像が選択されました", 'error')
													$el_img.fadeIn('normal');
												}
												img.src = url;
												$delete_btn.show();
												$el.find(attr).remove();
											}
											imageFilereader.readAsDataURL(file);
										}
										else {
											self.clearFileInput($el_input);
											swal("エラー", "不正な画像が選択されました", 'error')
											$el_img.fadeIn('normal');
										}
									};
									filereader.readAsArrayBuffer(file);
								});

								$(this).trigger('setimage');
							}
						} else {
							$el_img.attr('src', document);
							$delete_btn.show();
							$el.find(attr).remove();
						}
					}
				}).on('filedelete', function () {
					self.clearFileInput($(this));
					$(this).parsley().validate();

					$delete_btn.hide();

					// 画像の置き換え
					$el_img.fadeOut('normal', function () {
						$el_img.attr('src', noimage).fadeIn();
						$file_input.addClass('empty');
					});
					if ($el.find(attr).length == 0) {
						var delete_param = $('<input/>');
						delete_param.attr('type', 'hidden');
						delete_param.attr('value', true);
						delete_param.attr('name', param_name)
						$el.append(delete_param)
					}
				});
			} else {
				$el_input.on('change', function () {
					if (this.files.length) {
						var $el_img = $file_input.find('img');
						$el_img.attr('src', document);
						$delete_btn.show();
						$el.find(attr).remove();
					}
				}).on('filedelete', function () {
					self.clearFileInput($(this));
					$(this).parsley().validate();
					var $el_img = $file_input.find('img');
					$delete_btn.hide();

					// 画像の置き換え
					$el_img.fadeOut('normal', function () {
						$el_img.attr('src', nodocument).fadeIn();
						$file_input.addClass('empty');
					});
					if ($el.find(attr).length == 0) {
						var delete_param = $('<input/>');
						delete_param.attr('type', 'hidden');
						delete_param.attr('value', true);
						delete_param.attr('name', param_name)
						$el.append(delete_param)
					}
				});
			}
		});

		// チェックボックス、ラジオボタン初期化
		$el.find('input').iCheck(settings.icheck_options).on('ifChanged', function () {
			if ($(this).hasClass('_nested')) {
				var $container = $(this).closest('.container-checkbox_nested');
				var $child = $container.find('[data-parent=' + $(this).val() + ']');

				if ($(this).iCheck('update')[0].checked) {
					$child.fadeIn();
				} else {
					$child.fadeOut(function () {
						$(this).find('input:checkbox').iCheck('uncheck');
					});
				}
			}

			$(this).parsley().validate();
		});

		// select2初期化
		if ($el.find('._select2').length > 0) {
			$el.find('._select2').each(function () {
				var $select2 = $(this);
				if ($select2.data('ajax')) {
					var url = $select2.data('url');
					var object = $select2.data('object');
					var textName = $select2.data('text-name');
					var option_items = $select2.data('option-items');
					var selectMessage = $select2.data('select-message');

					var options = $.extend(settings.select2_options, {
							ajax: {
								url: url,
								dataType: 'json',
								delay: 250,
								data: function (params) {
									var query = {
										name: params.term
									};
									return query;
								},
								processResults: function (data) {
									results = $.map(data[object], function (object) {
										var ret = {
											id: object.id,
											text: object[textName]
										};
										if (option_items) {
											$.each(option_items.split(","), function () {
												ret[this] = object[this];
											});
										}
										return ret;
									});
									return {
										results: results
									};
								}
							}
						}
					);
					if (selectMessage) {

						var op = {
							language: {
								noResults: function () {
									return selectMessage;
								}
							}
						}
						options = $.extend(options, op);
					}
					var select2 = $select2.select2(options);
				} else {
					$select2.select2(settings.select2_options);
				}
			});
		}

		// bootstrap-datepicker初期化
		$el.find('._input-date').each(function () {
			var options = $.extend({}, settings.datepicker_options);

			if ($(this).data('format')) {
				options['format'] = $(this).attr('data-format');
			}

			if ($(this).data('mode')) {
				options['minViewMode'] = $(this).attr('data-mode');
			}

			$(this).datepicker(options).on('hide', function () {
				$(this).parsley().validate();
			});

			$(this).on('change', function () {
				var date = new Date($(this).val());
				if (date.toString() === "Invalid Date") {
					$(this).parent().find('.text-week').text('');
					$(this).parent().find('.text-week').removeClass(function (index, className) {
						return (className.match(/\bweek\S+/g) || []).join(' ');
					});
					$(this).parent().find('svg').removeClass(function (index, className) {
						return (className.match(/\bweek\S+/g) || []).join(' ');
					});
					return
				}
				var day_of_week = date.getDay();
				var className = 'week week_' + day_of_week;
				var week = '(' + weekStrings[day_of_week] + ')';
				if (isHoliday(date)) {
					className += ' week_holiday'
				}
				$(this).parent().find('svg').removeClass(function (index, className) {
					return (className.match(/\bweek\S+/g) || []).join(' ');
				});
				$(this).parent().find('svg').removeClass(function (index, className) {
					return (className.match(/\bweek\S+/g) || []).join(' ');
				});
				$(this).parent().find('svg').addClass(className);

				$(this).parent().find('.text-week').text(week);
				$(this).parent().find('.text-week').removeClass(function (index, className) {
					return (className.match(/\bweek\S+/g) || []).join(' ');
				});
				$(this).parent().find('.text-week').addClass(className);
			})
		});

		// bootstrap-timepicker初期化
		$el.find('._input-time').each(function () {
			var options = $.extend({}, settings.timepicker_options);

			if ($(this).data('meridian')) {
				options['showMeridian'] = $(this).data('meridian');
			}

			$(this).timepicker(options).on('hide.timepicker', function () {
				$(this).parsley().validate();
			});
		});

		// 郵便番号住所自動入力ボタン動作
		$el.find('._btn-zipcode').on('click', function () {
			if ($(this).data('input') && $($(this).data('input'))[0]) {
				var $el_input = $($(this).data('input'));

				$.ajax({
					url: '/zip_code/search',
					data: {'zipcode': $el_input.val()},
					dataType: 'json'
				}).done(function (res) {
					if (res && res.code === 200) {
						if ($(this).data('prefecture') && $($(this).data('prefecture'))[0]) {
							var $el_prefecture = $($(this).data('prefecture'));

							$el_prefecture.val($el_prefecture.find('option[data-name="' + res.data.pref + '"]').val());
							$el_prefecture.trigger('change', {name: res.data.city});
						}

						if ($(this).data('address') && $($(this).data('address'))[0]) {
							$($(this).data('address')).val(res.data.town);
						}
					}
				}.bind(this));
			}
		});

		// 都道府県選択初期化
		$el.find('._el-prefecture').on('change', function (e, city) {
			var $el_city = $($(this).data('city'));
			var target = $el_city.data('target');
			if (!$(this).val()) {
				$el_city.html('<option value="">- 選択 -</option>');
				return;
			}
			if ($el_city[0]) {
				$.ajax({
					url: '/master/cities/' + $(this).val(),
					type: 'get',
					data: {target: target}
				}).done(function (data) {
					self.setCities($el_city, data, city);
				}).fail(function () {

				}).always(function () {

				});
			}
		});

		//郵便番号貼り付け
		$el.find('._el-zipcode').on('paste', function () {
			var t = this;
			setTimeout(function () {
				$(t).val($(t).val().replace(/-/g, ''));
			}, 5);
		});

		// 市区町村選択初期化
		$el.find('._el-city').each(function () {
			var $el_city = $(this);
			if ($($el_city.data("prefecture"))) {
				var $el_prefecture = $($el_city.data("prefecture"));
				if ($el_prefecture[0]) {
					var prefecture_id = $el_prefecture.val();
					if (prefecture_id != $($(this).find("option")[1]).data("prefecture")) {
						$.ajax({
							url: '/master/cities/' + prefecture_id,
							type: 'get'
						}).done(function (data) {
							self.setCities($el_city, data, null);
						}).fail(function () {

						}).always(function () {

						});
					}
				}
			}
		});
		// 大ジャンル選択初期化
		$el.find('._el-genre').on('change', function (e, genre) {
			var $el_sub_genre = $($(this).data('sub-genre'));
			if ($el_sub_genre[0]) {
				$.ajax({
					url: '/master/genres/' + $(this).val(),
					type: 'get'
				}).done(function (data) {
					self.setSubGenres($el_sub_genre, data, genre);
				}).fail(function () {

				}).always(function () {

				});
			}
		});

		//日付セレクターの初期化
		$el.find('._date_input_selector').each(function () {
			var target = $(this);
			var yearSelector = $($(target).find("select")[0]);
			var date = new Date();
			var year = date.getFullYear();
			var weekContainer = $(target).find(".week-container");

			var to = year;
			var from = year - 100;

			if (yearSelector.data('max-year')) {
				to = parseInt(yearSelector.data('max-year'));
			}
			if (yearSelector.data('min-year')) {
				from = parseInt(yearSelector.data('min-year'));
			}

			yearSelector.html('');
			var defaultYear = yearSelector.data('default-year');
			if (defaultYear) {
				defaultYear = parseInt(defaultYear);
			} else {
				defaultYear = from + parseInt((to - from) / 2);
			}

			for (var y = from; y <= to; y++) {
				var opt = $("<option></option>");
				opt.val(y);
				if (yearSelector.data('era') == true) {
					opt.text(y + '(' + getEra(new Date(y, 1, 1)) + ')');
				} else {
					opt.text(y);
				}
				if (y == defaultYear) {
					opt.attr('selected', true);
				}
				yearSelector.append(opt);
			}
			var monthSelector = $($(target).find("select")[1]);
			for (var i = 1; i <= 12; i++) {
				var opt = $("<option></option>");
				opt.val(i);
				opt.text((i < 10 ? '0' : '') + i);
				if (i == 6) {
					opt.attr('selected', true);
				}
				monthSelector.append(opt);
			}
			var daySelector = $($(target).find("select")[2]);
			$('#' + yearSelector.attr('id') + ', #' + monthSelector.attr('id')).on('change', function () {
				var year = yearSelector.val();
				var month = monthSelector.val();
				var day = daySelector.val();
				if (year == '' || month == '' || day == '') {
					return;
				}
				var lastDay = new Date(year, month, 0).getDate();
				daySelector.html('');
				for (var i = 1; i <= lastDay; i++) {
					var opt = $("<option></option>");
					opt.val(i);
					opt.text((i < 10 ? '0' : '') + i);
					if (!day) {
						if (i == parseInt(lastDay / 2)) {
							opt.attr('selected', true);
						}
					} else {
						if (i == parseInt(day)) {
							opt.attr('selected', true);
						}
					}
					daySelector.append(opt);
				}
			});

			if (yearSelector.data('era') == true) {
				$('#' + yearSelector.attr('id') + ', #' + monthSelector.attr('id') + ', #' + daySelector.attr('id')).on('change', function () {
					var year = yearSelector.val();
					var month = monthSelector.val();
					var day = daySelector.val();
					if (year == '' || month == '' || day == '') {
						return;
					}
					var era = getEra(new Date(year, month - 1, day));
					yearSelector.find('option').each(function () {
						if ($(this).val() == year) {
							$(this).text(year + '(' + era + ')');
							return;
						}
					});
				});
			}

			var setWeek = function (dateString) {
				if (dateString == '') {
					weekContainer.html('');
					return;
				}
				var date = new Date(dateString);
				var day_of_week = date.getDay();
				var className = 'week week_' + day_of_week;
				var week = '(' + weekStrings[day_of_week] + ')';
				if (isHoliday(date)) {
					className += ' week_holiday'
				}
				var span = $('<span></span>');
				span.addClass(className);
				span.text(week);
				weekContainer.html('');
				weekContainer.append(span);
			};

			$('#' + yearSelector.attr('id') + ', #' +
				monthSelector.attr('id') + ', #' +
				daySelector.attr('id')).on('change', function () {
				var year = yearSelector.val();
				var month = monthSelector.val();
				var day = daySelector.val();
				var target = yearSelector.attr('id').replace('_year', '');
				if (year == '' || month == '' || day == '') {
					setWeek('');
					$('#' + target).val('');
					return;
				}
				$('#' + target).val(year + "/" + month + "/" + day);
				setWeek(year + "/" + month + "/" + day);
			});

			if (yearSelector.data('selected')) {
				$(yearSelector).val(parseInt(yearSelector.data('selected')));
			}

			if (monthSelector.data('selected')) {
				$(monthSelector).val(parseInt(monthSelector.data('selected')));
			}

			$(yearSelector).trigger('change');
			if (daySelector.data('selected')) {
				$(daySelector).val(parseInt(daySelector.data('selected')));
			}

			var year = yearSelector.val();
			var month = monthSelector.val();
			var day = daySelector.val();
			if (year != '' && month != '' && day != '') {
				setWeek(year + "/" + month + "/" + day);
			}
		});


		$el.find('.color-picker').colorpicker();
		$el.find('.color-picker').on('colorpickerChange', function (event) {
			$(this).parent().find('svg').css('color', event.color.toString());
		});

		// currency
		$el.find('._input-currency').maskMoney({
				thousands:',',
				allowZero: true,
				precision: '0'
			}
		).maskMoney('mask');

		var buttons = $('.regist-buttons');
		buttons.hide();
		setTimeout(function () {
			buttons.show();
			buttons.addClass('animated bounceInRight');
		}, 100);


		// 確認ボタン動作
		$el.find('._btn-confirm').on('click', function () {
			$el.parsley().whenValidate().done(function () {
				self.changeStatus();
			});
		});

		// 戻るボタン動作
		$el.find('._btn-back').on('click', function () {
			if (self.confirm) {
				self.changeStatus();
			}
		});
		settings.initialized();
	};

	LCForm.prototype.getParsleyOptions = function () {
		return this.settings.parsley_options;
	};

	// IEチェック
	LCForm.prototype.isIE = function (version) {
		if (navigator.appName !== 'Microsoft Internet Explorer') {
			return false;
		}

		if (version === 10) {
			return new RegExp('msie\\s' + ver, 'i').test(navigator.userAgent);
		}

		var div = document.createElement('div'), status;
		div.innerHTML = '<!--[if IE ' + version + ']> <i></i> <![endif]-->';
		status = div.getElementsByTagName('i').length;
		document.body.appendChild(div);
		div.parentNode.removeChild(div);

		return status;
	};

	// fileInputクリア
	LCForm.prototype.clearFileInput = function ($fileinput) {
		if (this.isIE(9) || this.isIE(10)) {
			var $srcFrm = $fileinput.closest('form');
			var $tmpFrm = $(document.createElement('form'));
			var $tmpEl = $(document.createElement('div'));

			$fileinput.before($tmpEl);
			if ($srcFrm.length) {
				$srcFrm.after($tmpFrm);
			} else {
				$tmpEl.after($tmpFrm);
			}

			$tmpFrm.append($fileinput).trigger('reset');
			$tmpEl.before($fileinput).remove();
			$tmpFrm.remove();
		} else {
			$fileinput.val('');
		}
	};


	LCForm.prototype.setSubGenres = function ($el_sub_genre, subGenres, selected) {

		$el_sub_genre.html("");
		if ($el_sub_genre.attr('placeholder')) {
			var opt = $("<option value=''></option>");
			opt.text($el_sub_genre.attr('placeholder'));
			$el_sub_genre.append(opt);
		}
		for (var i = 0; i < subGenres.length; i++) {
			var genre = subGenres[i];
			var opt = $("<option>");
			opt.text(genre.name);
			opt.attr("value", genre.id);
			opt.attr("data-parent-code", genre.parent);
			opt.attr("data-name", genre.name);
			if (selected && genre.name == selected.name) {
				opt.attr('selected', 'true');
			}
			$el_sub_genre.append(opt);
		}
	};

	// 市区町村設定
	LCForm.prototype.setCities = function ($el_city, cities, selected) {

		$el_city.html("");
		if ($el_city.attr('placeholder')) {
			var opt = $("<option value=''></option>");
			opt.text($el_city.attr('placeholder'));
			$el_city.append(opt);
		}

		for (var i = 0; i < cities.length; i++) {
			var city = cities[i];
			var opt = $("<option>");
			opt.text(city.name);
			opt.attr("value", city.id);
			opt.attr("data-lat", city.lat);
			opt.attr("data-lng", city.lng);
			opt.attr("data-prefecture", city.prefecture_id);
			opt.attr("data-name", city.name);
			if (selected && city.name == selected.name) {
				opt.attr('selected', 'true');
			}
			$el_city.append(opt);
		}

	};

	// 指定部分の削除
	LCForm.prototype.itemDelete = function () {
		$('[data-delete=true]').each(function () {
			$(this).remove();
		});
	};

	// 入力項目ラベル変換
	LCForm.prototype.itemToLabel = function (el) {
		var self = this;
		var $el = el === undefined ? $(this.settings.el) : $(el);

		// テキストエリア、テキスト
		$el.find('input, textarea').not(':checkbox, :radio, :hidden, :file, :submit, :reset, :button, :image, :password').each(function () {
			var $form_group = $(this).closest('.form-group');

			if ($form_group.data('tolabel')) {
				if (self.settings.create) {
					$form_group.remove();
				} else {
					var text = '(未設定)';
					if ($(this).val().length !== 0) {
						text = $(this).val().replace('\n', '<br/>');
					}

					$form_group.find('.label_required').remove();
					$form_group.find('.container-input').html('').append($('<p></p>', {class: 'el-label', html: text}));
				}
			}
		});

		// リスト
		$el.find('select').each(function () {
			var $form_group = $(this).closest('.form-group');

			if ($form_group.data('tolabel')) {
				if (self.settings.create) {
					$form_group.remove();
				} else {
					var text = '';

					if ($form_group.data('label')) {
						text = $form_group.data('label');
					} else {
						var $selected_option = $(this).find('option:selected');

						text = $selected_option.html();
						if (text === '') {
							text = '(未設定)';
						}
					}

					$form_group.find('.label_required').remove();
					$form_group.find('.container-input').html('').append($('<p></p>', {class: 'el-label', html: text}));
				}
			}
		});

		// ラジオ
		$el.find('._container-radio').each(function () {
			var $form_group = $(this).closest('.form-group');

			if ($form_group.data('tolabel')) {
				if (self.settings.create) {
					$form_group.remove();
				} else {
					var $checked_radio = $(this).find(':radio:checked');

					var text = '(未設定)';
					if ($checked_radio.length !== 0) {
						text = $('label[for="' + $checked_radio.attr('id') + '"]').html();
					}

					$form_group.find('.label_required').remove();
					$form_group.find('.container-input').html('').append($('<p></p>', {class: 'el-label', html: text}));
				}
			}
		});

		// チェックボックス
		$el.find('._container-checkbox, .container-checkbox_nested').each(function () {
			var $form_group = $(this).closest('.form-group');

			if ($form_group.data('tolabel')) {
				if (self.settings.create) {
					$form_group.remove();
				} else {
					var $checked_checkbox = $(this).find(':checkbox:checked');

					var text = '(未設定)';
					if ($checked_checkbox.length !== 0) {
						text = $.map($checked_checkbox, function (obj) {
							return $('label[for="' + $(obj).attr('id') + '"]').html();
						}).join(' / ');

						if (!text) {
							text = '設定'
						}
					}

					$form_group.find('.label_required').remove();
					$form_group.find('.container-input').html('').append($('<p></p>', {class: 'el-label', html: text}));
				}
			}
		});

		if (self.settings.modal == false) {
			self.initMap();
		}
	};

	LCForm.prototype.initMap = function () {
		var self = this;
		var $el = $(self.settings.el);
		$el.find(".map_view").each(function () {
			self._initMap(this);
		});
	};

	// 状態切替
	LCForm.prototype.changeStatus = function () {
		this.confirm = !this.confirm;

		if (!this.confirm) {
			$('.el-confirm').remove();
			$('._container-btn-confirm, ._show-confirm').hide();
			$('textarea, input[type!=file], select, .select2, ._hide-confirm, ._container-btn-input, ._container-radio, ._container-checkbox, .container-checkbox_nested').not('.sweet-alert input').show();
			$('html, body').animate({scrollTop: $('#pageTop').offset().top}, 500, 'swing');

		} else {
			$('._hide-confirm, ._container-btn-input, .select2').hide();
			$('._container-btn-confirm, ._show-confirm').show();

			// テキストエリア、テキスト
			$('input, textarea').not(':checkbox, :radio, :hidden, :file, :submit, :reset, :button, :image, :password').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var text = '(設定なし)';
					if ($(this).val().length !== 0) {
						text = $(this).val().replace('\n', '<br/>');
					}

					$(this).hide();
					$(this).after($('<p></p>', {class: 'el-confirm', html: text}));
				}
			});

			// パスワード
			$('input:password').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var text = '(変更なし)';
					var length = $(this).val().length;

					if ($(this).val().length !== 0) {
						if (length < 2) {
							text = new Array(length + 1).join('●')
						} else {
							text = $(this).val().slice(0, 2);
							text += new Array(length - 2 + 1).join('●');
						}
					}

					$(this).hide();
					$(this).after($('<p></p>', {class: 'el-confirm', html: text}));
				}
			});

			// ファイルインプット(画像以外)
			$('.container-fileinput').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var $el_input = $(this).find('input[type="file"]');

					if (!$el_input.hasClass('_image') && $(this).hasClass('empty')) {
						$(this).after($('<p></p>', {class: 'el-confirm', html: '(設定なし)'}));
					}
				}
			});

			// リスト
			$('select').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var $selected_option = $(this).find('option:selected');

					var text = $selected_option.html();
					if (text === '') {
						text = '(設定なし)';
					}

					$(this).hide();
					$(this).after($('<p></p>', {class: 'el-confirm', html: text}));
				}
			});

			// ラジオ
			$('._container-radio').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var $checked_radio = $(this).find(':radio:checked');

					var text = '(設定なし)';
					if ($checked_radio.length !== 0) {
						text = $('label[for="' + $checked_radio.attr('id') + '"]').html();
					}

					$(this).hide();
					var p = $('<div class="col-sm-8"><p>' + text + '</p></div>');
					$(this).after($(p, {class: 'el-confirm'}));
				}
			});

			// チェックボックス
			$('._container-checkbox, .container-checkbox_nested').each(function () {
				if (!$(this).parents('._hide-confirm')[0]) {
					var $checked_checkbox = $(this).find(':checkbox:checked');

					var text = '(設定なし)';
					if ($checked_checkbox.length !== 0) {
						text = $.map($checked_checkbox, function (obj) {
							return $('label[for="' + $(obj).attr('id') + '"]').html();
						}).join(' / ');

						if (!text) {
							text = '設定'
						}
					}

					$(this).hide();
					$(this).after($('<p></p>', {class: 'el-confirm', html: text}));
				}
			});
			$('html, body').animate({scrollTop: $('#pageTop').offset().top}, 500, 'swing');
		}
	};


	LCForm.prototype.setPrefectureNames = function () {
		var self = this;
		var $el = $(self.settings.el);
		$el.find('._el-prefecture').each(function () {
			var name = $("#" + this.id + " option:selected").text();
			$('#' + this.id.replace("_prefecture_code", "_prefecture_name")).val(name);
		});
		$('._el-city').each(function () {
			var name = $("#" + this.id + " option:selected").text();
			$('#' + this.id.replace("_city_code", "_city_name")).val(name);
		});
		return true;
	};

	LCForm.prototype.setSpatial = function () {
		var self = this;
		var $el = $(self.settings.el);

		$el.find('._spatial').each(function () {
			var spatial = $(this);
			var geom = '#' + spatial.attr('id');
			var lat = $(geom + '_lat').val();
			var lng = $(geom + '_lng').val();
			$(geom).val('POINT(' + lng + ' ' + lat + ')');
		});
	};


	LCForm.prototype._initMap = function (el) {
		if (typeof google === 'undefined') {
			return;
		}
		var nameBase = $(el).attr('id').replace("_map", '');
		var $lat_input = $('#' + nameBase + '_lat');
		var $lng_input = $('#' + nameBase + '_lng');
		var lat = parseFloat($lat_input.val());
		var lng = parseFloat($lng_input.val());

		var map = new google.maps.Map(document.getElementById($(el).attr('id')), {
			center: {
				lat: lat,
				lng: lng
			},
			zoom: 17
		});
		this.maps.push(map);
		marker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			map: map,
			title: "POINT",
			icon: {
				url: '/images/marker.png',
				scaledSize: new google.maps.Size(48, 48)
			},
			draggable: false
		});

		google.maps.event.addListener(map, 'center_changed', function () {
			var position = map.getCenter();
			marker.setPosition(position);
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				marker.setAnimation(null);
			}, 1000);
			$lat_input.val(position.lat());
			$lng_input.val(position.lng());
		});


		$($lat_input).on("paste", function () {
			var target = $(this);
			setTimeout(function () {
				var text = $(target).val();
				var lanlng = text.split(",");
				if (lanlng.length == 2) {
					var lat = parseFloat(lanlng[0]);
					var lng = parseFloat(lanlng[1]);
					if (lat != 0.0 && lng != 0.0) {
						$lat_input.val(lat);
						$lng_input.val(lng);
						map.setCenter({lat: lat, lng: lng});
					}
				}
			}, 10);
		});

		$("#" + nameBase + "_lat, #" + nameBase + "_lng").on("keyup", function () {
			var lat = $lat_input.val();
			var lng = $lng_input.val();
			map.setCenter(new google.maps.LatLng(lat, lng));
		});

		$('#' + nameBase + '_revert-btn').on("click", function () {
			$lat_input.val(lat);
			$lng_input.val(lng);
			map.setCenter(new google.maps.LatLng(lat, lng));
		});


		$('#' + nameBase + '_address-btn').on('click', function () {
			var geocoder = new google.maps.Geocoder();
			var address = "";
			var prefectureElement = '#' + $(this).data('prefecture');
			if (!prefectureElement) return;
			address = $(prefectureElement + ' option:selected').text();

			var cityElement = '#' + $(this).data('city');
			if (!cityElement) return;
			address += $(cityElement + ' option:selected').text();

			var address1Element = '#' + $(this).data('address1');
			if (address1Element) {
				address += $(address1Element).val();
			}

			geocoder.geocode(
				{
					'address': address
				},
				function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0].geometry) {
							var latlng = results[0].geometry.location;
							$lat_input.val(latlng.lat());
							$lng_input.val(latlng.lng());
							map.setCenter(latlng);
						}
					}
				}
			);
		});
	};

	LCForm.prototype.formRefresh = function () {


	};

	FormManager = LCForm;
})();

// parsley独自バリデーション設定
window.Parsley.addValidator('greaterOrEqualto', {
	validate: function (value, requirement) {
		if (value === '' || $(requirement).val() === '') {
			return true;
		}
		return value >= $(requirement).val();
	}
});

window.Parsley.addValidator('datetimeGreater', {
	validate: function (value, requirement, parsleyInstance) {
		var $el_start_date = $(parsleyInstance.$element.data('start-date'));
		var $el_end_date = $(parsleyInstance.$element.data('end-date'));
		var $el_start_time = $(parsleyInstance.$element.data('start-time'));
		var $el_end_time = $(parsleyInstance.$element.data('end-time'));

		$el_start_date.parsley().reset();
		$el_end_date.parsley().reset();
		if ($el_start_time.length > 0) {
			$el_start_time.parsley().reset();
		}
		if ($el_end_time.length > 0) {
			$el_end_time.parsley().reset();
		}

		var startDate = $el_start_date.val();
		var endDate = $el_end_date.val();

		var startTime = "00:00";
		if ($el_start_time.length > 0) {
			startTime = $el_start_time.val();
		}

		var endTime = "00:00";
		if ($el_end_time.length > 0) {
			endTime = $el_end_time.val();
		}

		if (startDate === '' || endDate === '') {
			return true;
		} else if (startTime === '' || endTime === '') {
			return true;
		}

		var s1 = Date.parse(startDate + ' ' + startTime);
		var s2 = Date.parse(endDate + ' ' + endTime);
		return s1 <= s2;
	}
});

