var SearchManager = function constructor(container, pagination, url) {
  this.url = url;
  this.$container = $(container);
  this.$pagination = $(pagination);
  this.page = 1;
  var t = this;

  this.$pagination.on('ajax:success', function (e, data) {
    var view_data = data === undefined ? e.detail[0] : data;
    t.$pagination.html(view_data.pagination);
    t.$container.html(view_data.content);
    t.page = view_data.page;
  });
};

SearchManager.prototype.getList = function (page, searchParams) {
  var time = 0;
  var params = {};

  Object.keys(searchParams).forEach(function (key, index) {
    if (searchParams[key]) {
      params[key] = searchParams[key];
    }
  });
  params.page = page;

  var t = this;
  setTimeout(function () {
    $.ajax({
      url: t.url,
      data: params,
      dataType: 'json'
    }).done(function (res, status, xhr) {
      if (res.status == 'OK') {
        t.$pagination.trigger('ajax:success', [res, status, xhr])
      } else {
        //alert('一覧の更新に失敗しました');
      }
    }).fail(function (res, status) {
      if (status === 'abort') {
        return;
      }
      //alert('一覧の更新に失敗しました');
    }).always(function () {

    });
  }, time);
};
