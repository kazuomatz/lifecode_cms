Vue.component('paperweb-textarea', {
  template: '<div>' + '<div class="form-inline link-tool">' + '<button type="button" class="btn btn-primary" @click="insertLinkTag($event)">' + '<i class="fa fa-link"></i> リンクを設定' + '</button>' + '</div>' + '<textarea ref="textArea" class="form-control" ' + '@input="resizeTextArea($event)" @select="selectText($event)" ' + ':value="value"></textarea>' + '</div>',
  props: ['value', 'index'],
  mounted: function () {
  },
  methods: {
    resizeTextArea: function (evt) {
      autoResizeTextArea(evt.target);
      this.value = evt.target.value;
      this.$emit('input', this.value);
    },
    selectText: function (evt) {
      var txt = $(evt.target).selection();
      this.linkEnabled = txt.length > 0;
    },
    insertLinkTag: function (event) {
      var textArea = $(".form-group[data-index=" + this.index + "]").find("textarea");
      var selectedString = $(textArea).selection();
      if (selectedString.length > 0) {
        var pos = $(textArea).selection('getPos');
        var text = $(textArea).val();
        var length = text.length;

        //リンクマークダウンの中を選択していないかをチェック
        var start = pos.start - 2;
        var b1 = false;
        while (start > 0) {
          var t = text.substr(start, 2);
          if (t[0] == ")") {
            break;
          }
          if (t == "](" || t[0] == "[") {
            b1 = true;
            break;
          }
          start -= 1;
        }
        var b2 = false;
        var b3 = false;
        start = pos.end;
        while (start < length) {
          var t = text.substr(start, 2);
          if (t == "])") {
            b3 = true;
          }
          if (t[0] == "[") {
            break;
          }
          if ((t[0] == ")" || t[0] == "]") && b3 == true) {
            b2 = true;
            break;
          }
          start += 1;
        }

        if (!b1 && !b2) {
          $(textArea).selection('insert', {text: '[', mode: 'before'})
            .selection('insert', {text: '](link)', mode: 'after'});
        }
      }
    }
  },
  data: function () {

    return {
      linkEnabled: false,
      linkURL: "",
      textAreaMinHeight: 114
    }
  }

});


Vue.component('paperweb-movie', {
  template: '<div>' + '<textarea rows="3" @paste="pasteTag" placeholder="ここにYouTubeの共有リンク(https://youtu.be/xxxxxx)か、埋め込みタグ(<iframe>〜</iframe>)を貼り付けて下さい。" ref="textArea" class="form-control" ' + ':value="value" v-if="! movieLoaded " v-model="embedText"></textarea>' + '<div ref="movieFrame" v-if="movieLoaded">' + '<iframe width="560" height="315" :src="yotubeEmbedLink" frameborder="0" allowfullscreen></iframe>' + '<div>' + '<button type="button" class="btn btn-primary modify-button" v-show="movieLoaded" @click="showEdit()"><i class="fa-pencil-square-o fa"></i> 修正</button>' + '</div>' + '</div>' + '<div v-if="!movieLoaded"><button type="button" class="btn btn-primary showMovieButton" v-show="!movieLoaded" @click="showMovie()"><i class="fa-film fa"></i> 確認</button></div>' + '<label class="alert-danger alert" v-show="error">貼り付けた内容が正しくありません。</label>' + '</div>',
  props: ['value', 'index'],

  mounted: function () {
    if (this.value && this.value.length > 0) {
      this.movieId = this.value;
      this.movieLoaded = true;
      this.embedText = this.youtubeLink;
    }
  },
  computed: {
    yotubeEmbedLink: function () {
      return "https://www.youtube.com/embed/" + this.movieId
    },
    youtubeLink: function () {
      return "https://youtu.be/" + this.movieId

    }
  },
  methods: {
    showEdit: function () {
      this.value = "";
      this.movieLoaded = false;
      this.embedText;
    },
    showMovie: function () {
      var t = this;
      var movieId = t.parseEmbedText(t.embedText);
      if (movieId.length > 0) {
        t.movieId = movieId;
        t.movieLoaded = true;
        t.value = t.movieId;
        t.$emit('input', t.movieId);
      } else {
        t.error = true;
        t.value = text;
      }
    },

    pasteTag: function (evt) {
      var t = this;
      setTimeout(function () {
        t.error = false;
        var text = $(evt.target).val();
        this.embedText = text;
        var movieId = t.parseEmbedText(text);
        if (movieId.length > 0) {
          t.movieId = movieId
          t.movieLoaded = true;
          t.value = t.movieId;
          t.$emit('input', t.movieId);
        } else {
          t.error = true;
          t.value = text;
        }
      }, 500);
    },
    parseEmbedText: function (text) {
      this.embedText = text;
      if (text.indexOf("https://youtu.be/") == 0) {
        return text.replace("https://youtu.be/", "");
      } else if (text.indexOf("<iframe") >= 0 && text.indexOf("https://www.youtube.com/embed/") >= 0) {
        var elm = $(text);
        var src = elm.attr("src");
        return src.replace("https://www.youtube.com/embed/", "");
      }
      return "";
    }
  },
  data: function () {
    return {
      textAreaMinHeight: 114,
      movieId: "",
      error: false,
      movieLoaded: false,
      embedText: ''
    }
  }

});


var PaperWebEditor = function constructor(container, option) {
  this.container = container;
  this.option = option;
  if (!option) {
    this.option = {};
  }
};

PaperWebEditor.prototype.getVue = function (opt) {
  var obj = this;

  Vue.directive('sortable', {
    inserted: function (el, binding) {
      new Sortable(el, binding.value || {});
    }
  });
  var vue = new Vue({
    el: obj.container,
    mounted: function () {
      var t = this;
      var iCheckOptions = {
        checkboxClass: 'icheckbox_peoplee',
        radioClass: 'iradio_peoplee'
      };
      $('.public.iCheck').iCheck(iCheckOptions)
        .on("ifChanged", function () {
          if ($(this).val() == "true") {
            t.public = true;
          } else {
            t.public = false;
          }
        });

    },
    data: {
      authenticity_token: opt.authenticity_token,
      itemTypes: [
        {name: "h1", label: '見出し１'},
        {name: "h2", label: '見出し２'},
        {name: "h3", label: '見出し３'},
        {name: "p", label: '本文'},
        {name: "img", label: '画像'},
        {name: "blockquote", label: '引用'},
        {name: "movie", label: '動画'},
      ],
      contentItems: [],
      selectedItem: 'h1',
      preview: false,
      uploading: false,
      descriptionLength: 120,
      option: $.extend(obj.option, opt),
      articleId: null,
      title: "",
      description: "",
      public: false,
      publicExists: true,
      previewContent: "",
      deleteArticlePhotoIds: [],
      previewURL: '/admin/articles/preview'
    },
    computed: {},
    watch: {
      public: function () {
        if (this.public) {
          $('.public.iCheck:eq(0)').iCheck("check");
        } else {
          $('.public.iCheck:eq(1)').iCheck("check");
        }
      }
    },
    methods: {

      showPreview: function () {
        var t = this;
        var data = {
          "authenticity_token": t.authenticity_token,
          "title": this.title,
          "description": this.description,
          "items": JSON.stringify(t.getItems())
        };

        $.ajax(
          {
            url: this.previewURL,
            type: 'post',
            data: data
          }
        ).done(
          function (response) {
            t.previewContent = response;
            t.preview = true;
          }
        ).fail(
          function () {
          }
        );
      },


      yotubeEmbedLink: function (movieId) {
        return "https://www.youtube.com/embed/" + movieId;
      },

      setTextLength: function (e) {
        var textCount = $(e.target).val().length;
        $(e.target).parent().find(".counter").text(textCount + " / " + this.descriptionLength);
        if (textCount > this.descriptionLength) {
          $(e.target).parent().find(".counter").addClass("over");
        } else {
          $(e.target).parent().find(".counter").removeClass("over");
        }
      },
      addItem: function () {
        this.contentItems.push({type: this.selectedItem, value: ''});
      },

      deleteItem: function (index) {
        var t = this;
        if (t.contentItems[index].type == "img" && t.contentItems[index].article_photo_id) {
          t.deleteArticlePhotoIds.push(t.contentItems[index].article_photo_id);
        }
        t.contentItems.splice(index, 1);
      },

      getItemTypeLabel: function (type) {
        var label = "";
        $.each(this.itemTypes, function (index, val) {
          if (val.name == type) {
            label = val.label;
            return;
          }
        });
        return label;
      },

      getItemTypeIcon: function (type) {
        if (type == "h1" || type == "h2" || type == "h3") {
          return "fa fa-header"
        } else if (type == "p") {
          return "fa fa-paragraph"
        } else if (type == "img") {
          return "fa fa-picture-o"
        } else if (type == "blockquote") {
          return "fa fa-quote-right"
        } else if (type == "movie") {
          return "fa fa-video-camera"
        }
        return ""
      },


      onSortUpdate: function (event) {

      },

      recoverImage: function (index) {

        var t = this;
        if (t.contentItems[index].type == "img" && t.contentItems[index].article_photo_id) {
          //更新画像を削除する
          var method = 'delete';
          var url = t.option.photoUploadURL;
          url = url + "/" + this.contentItems[index].article_photo_id;
          t.uploading = true;
          $.ajax({
            url: url,
            type: method,
            data: {"authenticity_token": t.authenticity_token}
          })
            .done(
              function (response) {
                t.uploading = false;
                t.contentItems[index].article_photo_id = t.contentItems[index].original_article_photo_id;
                t.contentItems[index].url = t.contentItems[index].original_url;
                t.contentItems[index].recoverable = false;
              }
            )
            .fail(
              function () {
                t.uploading = false;
                t.contentItems[index].recoverable = false;
              }
            );
        }
      },

      markdownToHTML: function (text) {
        var converter = new showdown.Converter();
        return converter.makeHtml(text);
      },

      getItems: function () {
        var t = this;
        var items = [];
        $.each($(".content-items .form-group[data-index]"), function (index, elm) {
          var index = $(elm).attr("data-index");
          var item = $.extend({}, t.contentItems[index]);
          //Object.assign(item, t.contentItems[index]);
          delete item.original_article_photo_id;
          delete item.original_url;
          delete item.recoverable;
          items.push(item);
        });
        return items;
      },

      uploadItems: function () {

        if (this.title.length == 0 || this.description.length == 0) {
          return;
        }

        var items = this.getItems();
        var t = this;
        var url = t.option.contentUploadURL;
        var mask = $('<div class="mask"></div>');
        var method;

        //DBから削除対象の写真をピックアップ
        $.each(t.contentItems, function () {
          if (this.article_photo_id && this.original_article_photo_id && (this.article_photo_id != this.original_article_photo_id)) {
            if (t.deleteArticlePhotoIds.indexOf(this.original_article_photo_id) < 0) {
              t.deleteArticlePhotoIds.push(this.original_article_photo_id);
            }
          }
        });

        var data = {
          "authenticity_token": t.authenticity_token,
          "items": JSON.stringify(items),
          "delete_photo_ids": JSON.stringify(t.deleteArticlePhotoIds)
        };

        if (t.articleId) {
          method = 'put';
          url = url + "/" + t.articleId;
        } else {
          method = 'post';
        }

        if (this.title) {
          data.title = this.title;
        }

        if (this.description) {
          data.description = this.description;
        }

        if (this.public) {
          data.public = this.public;
        }

        t.uploading = true;
        $.ajax({
          url: url,
          type: method,
          data: data
        })
          .done(
            function (response) {
              mask.fadeOut();
              console.log('succes!');  // レスポンスがあったとき
              t.uploading = false;
              if (t.option.successRedirectURL) {
                location.href = t.option.successRedirectURL;
              }
            }
          )
          .fail(
            function () {
              mask.fadeOut();
              progress.remove();
              t.uploading = false;
            }
          );

      },

      onDragLeave: function (event, index) {
        console.log("drag leave");
        var target = $(".image-container[data-index=" + index + "]").find("img");
        $(target).css({
          cursor: 'normal',
          border: 'none'
        });
        event.preventDefault();
        return true;
      },

      onDragOver: function (event, index) {
        var target = $(".image-container[data-index=" + index + "]").find("img");
        $(target).css({
          cursor: 'move',
          border: 'solid 3px #7eb119'
        });
        event.preventDefault();
        return true;
      },

      onDropFile: function (event, index) {
        event.preventDefault();
        var target = $(".image-container[data-index=" + index + "]").find("img");
        $(target).css({
          cursor: 'normal',
          border: 'none'
        });
        if (event.dataTransfer.files.length > 0) {
          this.fileUpload(event.dataTransfer.files[0], index);
        }
      },

      fileUpload: function (file, index) {
        var t = this;
        var container = $(".image-container[data-index=" + index + "]");
        var el_img = $(container.find("img"));

        if (file.type.match('image.*')) {
          var progress = $('<div class="progress">' +
            '<div class="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>' +
            '</div>');

          var mask = $('<div class="mask"></div>');
          if (el_img) {
            var width = el_img.width() >= 360 ? 360 : el_img.width();
            var height = el_img.height();
            var filereader = new FileReader();
            filereader.onload = function (e) {
              var url = createObjectURL ? createObjectURL(file) : e.target.result;
              // 画像の置き換え
              var img = new Image();
              img.onload = function () {
                EXIF.getData(img, function () {
                  var url = rotate(img);
                  var ratio = width / img.width;
                  el_img.attr('src', url);
                  mask.width(width);
                  mask.height(img.height * ratio);

                  img = null;

                  $(el_img).parent().append(mask);
                  progress.width(width - 40);
                  $(el_img).parent().append(progress);

                  var formData = new FormData();
                  formData.append("image", file);
                  formData.append("authenticity_token", t.authenticity_token);

                  var method = "post";
                  var url = t.option.photoUploadURL;

                  t.uploading = true;

                  $.ajax({
                    url: url,
                    type: method,
                    processData: false,
                    contentType: false,
                    data: formData,
                    xhr: function () {
                      var XHR = $.ajaxSettings.xhr();
                      if (XHR.upload) {
                        XHR.upload.addEventListener('progress', function (e) {
                          var progre = parseInt(e.loaded / e.total * 100);
                          progress.find(".progress-bar").css({width: progre + '%'});
                        }, false);
                      }
                      return XHR;
                    }
                  })
                    .done(
                      function (response) {
                        t.contentItems[index].url = response.url;
                        t.contentItems[index].article_photo_id = response.article_photo_id;
                        t.contentItems[index].recoverable = true;
                        progress.remove();
                        mask.fadeOut();
                        t.uploading = false;
                      }
                    )
                    .fail(
                      function () {
                        mask.fadeOut();
                        progress.remove();
                        t.uploading = false;
                      }
                    );
                });
              };
              img.src = url;
            };
            filereader.readAsDataURL(file);
          }
        }
      },
      onFileChange: function (event, index) {
        var t = this;
        var file = event.target;
        //var container = $($(file).parent().parent().parent());
        var container = $(".image-container[data-index=" + index + "]");

        if (file.files.length > 0) {
          t.fileUpload(file.files[0], index);
        }
      }
    }
  });
  return vue;
};


var autoResizeTextArea = function (target) {

  var target = $(target).get(0);
  if (target.scrollHeight == 0 && target.offsetHeight == 0) {
    return;
  }
  if (target.scrollHeight > target.offsetHeight) {
    $(target).height(target.scrollHeight);
  } else {
    var lineHeight = Number($(target).css("lineHeight").split("px")[0]);

    while (true) {
      $(target).height($(target).height() - lineHeight);
      if (target.scrollHeight > target.offsetHeight) {
        $(target).height(target.scrollHeight);
        break;
      }
    }
  }
};


