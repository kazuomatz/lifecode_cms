# README

## Product Name

LifeCode CMS for Rails 6.1

## Ruby version

3.0.1

## System dependencies

- Rails 6.1

### RDBMS
- MySQL 5.7x / 8.0

### Requirements for Ruby Libraries
- ImageMagick 6.9x / 7.x

### Requirements for Frontend
- jQuery 3
- Bootstrap 4
- coreUI 2.0x (https://coreui.io/)
- parsley.js (https://parsleyjs.org/)
- iCheck(https://github.com/fronteed/icheck)
- Fontawesome 5 Free (https://fontawesome.com/)
- bootstrap-datepicker, bootstrap-timepicker 
- 郵便番号データ配信サービス（https://zipcloud.ibsnet.co.jp/)

## Getting Started
```
$ bundle
$ yarn install
$ rake db:create
$ rake db:migrate
$ rake db:seed
```

## Author
Kazuomatz(kazuomatz@lifecode.jp)

## Collaborator
sakaki (formManager.js, searchView / permission management design)

## License
MIT

# LifeCode CMS

LifeCode CMSは、業務アプリケーション、Webアプリ、ネイティブアプリなどのコンテンツを管理するシステムを素早く構築するためのフレームワークを実装しています。

## 特徴

* ユーザー登録、ログイン周りの機能を装備。
* モデルベースのコンテンツ登録画面の自動生成。
* 住所入力、日付入力といった日本のコンテンツ登録に必要なUIを自動生成。
* 入力値のバリデーションを自動設定。柔軟なカスタマイズも可能。

## 用途

* Webシステムにおけるコンテンツの登録・更新管理の機能をスピーディーに開発したい。
* 操作性のよい入力インターフェイスや基本的なバリデーションが実装されたWebフォームを作りたい。

## 利用シーン

Life Code CMSは、ユーザー管理とコンテンツ管理に特化したシステムです。基本的には、管理権限のあるユーザーが利用するシステムを前提にしています。
Life Code CMSで登録したデータをAPI化することで、エンドユーザー向けにVue.jsやReactといったモダンなフロントエンドを用いたアプリケーションや、ネイティブアプリケーションを構築することが可能です。

## LifeCode CMSを使用した開発者の対象

ある程度、Ruby on Railsの開発経験があることが望ましいです。Railsの設計哲学であるDRY(Don't repeat yourself:同じ繰り返しをしない) /　Convention over Configuration(設定より規約）に準じて設計されています。
時に、規約によった自動化がRailsの学習の弊害になる場合がありますので、Rails初学者がLifeCode CMSを使用する際には気をつけて下さい。

LifeCode CMSで使用しているJavaScriptはES2015ではありません。またjQueryに依存しています。LifeCode CMSをベースに開発する際に、CMS側はモダンなJSライブラリーを利用する際には注意が必要かもしれません。
もちろん、同じRailsアプリケーション内にNuxtJSを導入して、エンドユーザー向けの画面をモダンな感じで構築するといった開発方法は可能です。

## 概要

Ruby on Railsには、Scaffoldというジェネレータが標準で含まれています。Scaffoldジェネレータは、定義したモデルをもとに、ViewとControllerを自動生成し、以下の７つのアクションからなるアプリケーションの土台を作ることができます。

- index(一覧画面の表示）
- show（レコード項目の画面表示）
- new（新規レコード登録画面の表示）
- edit（レコード編集画面の表示）
- create（レコードの作成）
- update（レコードの更新）
- destroy（レコードの削除）

Scaffoldは便利な機能ですが、できあがるフォームはとてもシンプルで、実際の業務で利用するとなると機能的には不足が多く、Scaffoldで作成されたViewに様々な実装が必要になります。

LifeCode CMSのScaffoldは、一般的に日本のコンテンツ管理に必要な入力項目に対応したユーザーインタフェイスを自動生成することができます。


- テキストエリアの文字数制限（テキストカウンター付）

  <img src="https://user-images.githubusercontent.com/2704723/78959736-dcb45180-7b26-11ea-8f3f-d8064b8e946d.jpg" width='50%'/>


- カレンダーでの日付入力(祝日表示付き)

  <img src="https://user-images.githubusercontent.com/2704723/78956499-737c1080-7b1d-11ea-8d16-315482146fff.jpg" width='35%'/>

- 郵便番号入力による自動住所入力
- 都道府県、市区町村のプルダウン(都道府県と連動して市区町村を表示)

  <img src="https://user-images.githubusercontent.com/2704723/78958668-c0fb7c00-7b23-11ea-85e9-ecd00402729c.jpg" width='70%'/>

- 画像・写真のアップロード(プレビュー付)

  <img src="https://user-images.githubusercontent.com/2704723/78959172-14ba9500-7b25-11ea-89d1-d22f4915a79f.jpg" width='70%'/>


- 入力値のバリデーション

  <img src="https://user-images.githubusercontent.com/2704723/78959347-a0342600-7b25-11ea-8e74-f4083dbd37e2.jpg" width='70%'/>


また、Rails標準のScaffoldと同様、一覧表示、レコードの新規作成・編集、削除機能も自動生成されます。

# 事前準備

LifeCode CMSはRailsのジェネレータコマンド（rails g)を数回入力するだけで、簡単にモデルベースの入力画面ができてしまいます。

手始めに、会社情報を登録するWebアプリケーションを作ってみましょう。

まず、LifeCode CMSを利用するために必要なものを用意してください。

## ImageMagick
LifeCode CMSでは画像を扱うGemとしてminiMagickを使用します。miniMagickはImageMagickを必要としますので、開発環境にImageMagickがない場合はインストールして下さい。
Macであれば、以下でインストールできます。

~~~bash
$ brew install imagemagick
~~~

## yarn

nodeモジュールをインストールするので、yarnを使えるようにして下さい。

## RDBMS

MySQL 5.7.x / 8.xに対応しています。

## Ruby

2.6.5 を推奨しています。それ以前のRubyでも動くと思います。別のバージョンを使用する場合は、.ruby-versionファイルとGemfileのRubyのバージョンを書き換えて下さい。


# Getting Start

まずはこのレポジトリをcloneまたはforkしてください。


## nodeモジュールとGemライブラリのインストール
プロジェクトディレクトリーに移動して、nodeモジュールとGemライブラリをインストールします。

~~~bash
$ yarn install
~~~

~~~bash
$ bundle
~~~

## database.yml

config/database.ymlを編集して、自分の環境のMySQLに接続できるようにして下さい。

## システム管理者のログインアカウントの設定

db/seeds.rbファイルのemailとpasswordを適切なものに変更します。

~~~ruby
##
#  Init Database
#
email = 'admin@example.com'
password = 'your-password'

user = User.create(name:'システム管理者',email: email ,password: password, role:1)
user.confirmed_at = DateTime.now
user.save
~~~

## データベースの作成・マイグレーション・初期化

~~~bash
$ bundle exec rake db:create
$ bundle exec rake db:migrate
$ bundle exec rake db:seed
~~~

## Rails アプリケーションの起動

~~~bash
$ rails s
rails s
=> Booting Puma
=> Rails 6.0.2.1 application starting in development
=> Run `rails server --help` for more startup options
[55878] Puma starting in cluster mode...
[55878] * Version 3.12.2 (ruby 2.6.5-p114), codename: Llamas in Pajamas
[55878] * Min threads: 5, max threads: 5
[55878] * Environment: production
[55878] * Process workers: 1
[55878] * Preloading application
[55878] * Listening on tcp://0.0.0.0:3000
[55878] * Listening on unix:////Users/xxxxxx/lifecode_cms/tmp/sockets/puma.sock?umask=0111
[55878] Use Ctrl-C to stop
[55878] - Worker 0 (pid: 55895) booted, phase: 0

~~~

起動したら、http://localhost:3000 にアクセスしてみましょう。

  <img src="https://user-images.githubusercontent.com/2704723/78963255-e5f6eb80-7b31-11ea-9b02-7e11c006146f.jpg" width='70%'/>

とりあえず真っ白な画面が表示されたら成功です。
右上のログインをクリックして、先ほど設定したメールアドレスとパスワードを入力してログインして下さい。

  <img src="https://user-images.githubusercontent.com/2704723/78963257-e7c0af00-7b31-11ea-88f1-c9222c6caaa2.jpg" width='70%'/>

ログインが成功したら以下の画面が表示されるかと思います。

  <img src="https://user-images.githubusercontent.com/2704723/78963258-e98a7280-7b31-11ea-9541-c9dda3804fd8.jpg" width='70%'/>

LifeCode CMSではログイン機能、ユーザー登録機能も標準で装備しています。メニューの「ユーザー管理」でユーザーを登録することもできますが、まずは、会社情報の入力フォームを一気に作ってしまいましょう。


## Modelの作成

会社情報ですので、Companyモデルを作りましょう。

```
$ bundle exec rails g model company
```

マイグレーションファイルができますので、以下のように書き換えて下さい。

db/migrate/2020XXXXXXXX_create_companies.rb


~~~ruby
class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :name, comment: '会社名'
      t.string :kana, comment: '会社名カナ'
      t.text :description, comment: '会社概要'
      t.string :zip_code, comment: '郵便番号'
      t.string :prefecture_code, comment: '都道府県'
      t.string :prefecture_name, comment: '都道府県名'
      t.string :city_code, comment: '市区町村'
      t.string :city_name, comment: '市区町村名'
      t.string :address1, comment: '町名番地'
      t.string :address2, comment: '建物など'
      t.string :email, comment: 'メールアドレス'
      t.string :url, comment: 'サイトURL'
      t.string :president_name, comment: '代表者氏名'
      t.datetime :establishment_at, comment: '設立年月日'
      t.integer :capital, comment: '資本金'
      t.timestamps
    end
  end
end
~~~

commentを書くのがポイントです。理由はのちほど。

では、migrationを実行します。

~~~bash
$ bundle exec rake db:migrate
~~~

これで会社の情報を入力するテーブルができました。さらに、会社の写真を入れるフィールドを追加しましょう。写真はRails標準機能のActiveStorageを使用します。ActiveStorageに必要なマイグレーションは最初のマイグレーションに含めてありますので実行済みです。

Companyモデルのクラスファイルに、次のように１行加えるだけで、Companyに写真をアタッチすることができます。

app/models/company.rb


~~~ruby
class Company < ApplicationRecord
  has_one_attached :image  # 画像のアタッチメント
end
~~~

## LifeCode CMSのジェネレーターを起動

ここからがLideCode CMSの出番です。
まず、フォームの属性ファイルを生成するジェネレータを実行します。

~~~bash
$ bundle exec rails g lc_form_attributes company
      create  app/models/admin/company.rb
      create  config/form_attributes/company.yml
~~~

続けて、scaffoldを作成するためのジェネレータを実行します。

~~~bash
$ bundle exec rails g lc_scaffold company
      create  app/controllers/admin/companies_controller.rb
      create  app/views/admin/companies/_form.html.erb
        gsub  app/views/admin/companies/_form.html.erb
        gsub  app/views/admin/companies/_form.html.erb
      create  app/views/admin/companies/modal_form.html.erb
        gsub  app/views/admin/companies/modal_form.html.erb
        gsub  app/views/admin/companies/modal_form.html.erb
      create  app/views/admin/companies/_list.html.erb
        gsub  app/views/admin/companies/_list.html.erb
        gsub  app/views/admin/companies/_list.html.erb
      create  app/views/admin/companies/_search_box.html.erb
        gsub  app/views/admin/companies/_search_box.html.erb
        gsub  app/views/admin/companies/_search_box.html.erb
      create  app/views/admin/companies/edit.html.erb
        gsub  app/views/admin/companies/edit.html.erb
        gsub  app/views/admin/companies/edit.html.erb
      create  app/views/admin/companies/new.html.erb
        gsub  app/views/admin/companies/new.html.erb
        gsub  app/views/admin/companies/new.html.erb
      create  app/views/admin/companies/index.html.erb
        gsub  app/views/admin/companies/index.html.erb
        gsub  app/views/admin/companies/index.html.erb
       route  namespace :admin do
  resources :companies
end
~~~

## 入力画面の確認

いくつかファイルが作成されました。これらのファイルはあとで見ることとして、もう一度、Railsアプリケーションを起動して、http://localhost:3000 にアクセスしてみます。
ログオフした場合は、再度ログインして下さい。

  <img src="https://user-images.githubusercontent.com/2704723/78966133-f743f600-7b39-11ea-98c6-47a3d837fc08.jpg" width='70%'/>

フォーム一覧に「Company」というリンクが追加されているかと思いますのでクリックして下さい。


一覧画面ができています。ラベルが「Company登録」とやや残念な感じになっていますが、そこは気にせず、「+ Company追加」をクリックして下さい。

  <img src="https://user-images.githubusercontent.com/2704723/78980979-e905d200-7b59-11ea-8182-242ff94ec078.jpg" width='70%'/>

Companyの入力フォームができています！

  <img src="https://user-images.githubusercontent.com/2704723/79030282-370aec00-7bd3-11ea-941e-61af2fdf2237.jpg" width='70%'/>


このフォームでは、郵便番号での住所の取得、都道府県の選択切り換えによる市区町村の連動、日付のカレンダー入力、入力必須項目や、メールアドレスやURLのバリデーションも実装されています。
また、マイグレーションファイルで設定したコメントが項目のラベル名となっていること、あと、項目のアイコン、電話やメールなどが項目に応じて適切なアイコンが表示されていることに注目してください。


  <img src="https://user-images.githubusercontent.com/2704723/79030818-f8c2fc00-7bd5-11ea-9a33-198b8ff5340b.jpg" width='70%'/>

 適当にデータを入力して登録してみます。

  <img src="https://user-images.githubusercontent.com/2704723/79030821-fbbdec80-7bd5-11ea-89f1-fabc25659048.jpg" width='70%'/>

一覧画面に戻り、登録したデータが一覧表示されていることが確認できると思います。一覧画面では、データの検索、編集画面の呼び出し、データの削除も行えます。

これで、会社情報を登録するアプリケーションの土台が完成しました。


## カスタマイズ

生成されたアプリケーションの土台をカスタマイズしていきます。カスタマイズするには、フォームの属性ファイルをlc_form_attributesコマンドで生成したことを思い出して下さい。
フォームの属性ファイルは、config/form_attributesディレクトリーに"model名".ymlという形式で生成されています。Companyモデルのフォーム属性ファイルなので、company.ymlファイルが存在していると思います。

このファイルを見ていきましょう。

~~~yml
---
:label: Company
:icon: fas fa-info-circle
:columns:
- :name: name
  :label: 会社名
  :icon: fas fa-info-circle
  :type: :string
  :column: 4
  :placeholder: ''
  :validate:
    :required: true
    :required_message: ''
    :max_length: -1
    :max_length_message: ''
    :min_length: -1
    :min_length_message: ''
    :pattern: ''
    :pattern_message: ''
    :length: ''
    :length_message: ''
:
:
~~~

最初の２行がモデルの情報になります。先ほど、一覧画面にCompany一覧というラベルが表示されていましたが、1行目のラベルを「会社情報」などに変更すれば、会社情報一覧に表示が変わります。
iconは、FontAwesomeアイコンのクラス名です。クラス名を変更することで会社情報のアイコンを変更することができます。アイコンの検索は[こちら](https://fontawesome.com/icons?d=gallery&m=free)から行えます。


３行目のcolumnsは、Companyクラスのカラムの定義になります。

### カラムの定義

|項目|説明|
|:--|:--|
|name| カラム名です。ここは変更しないで下さい。|
|label| ラベル名です。マイグレーションファイルにコメントを記述しておくとコメントの文字列をここに設定します。|
|type| データ型です。このデータ型に応じた入力コンポーネントをlc_scaffoldジェネレータが生成します。 |
|column| カラム数です。LifeCode CMS はBootstrapのレイアウトを採用しているので、BootstrapのGridシステムのカラム数を設定します。4〜12が妥当な値です。|
|placeholder| inputタグなどのplaceholder属性に設定される値です。|
|validate| LifeCode CMSは、JavaScriptのバリデーションライブラリー[Parsley](https://parsleyjs.org)を使用してます。Parsleyのvalidateの設定値をここに設定します。|

#### 生成されるUI

LifeCode CMSのScaffoldは、フォームの属性ファイルをもとにUIを生成します。生成されるUIは、(1)データ型、(2)カラム名により決定されます。

(1) データ型によるUIの決定

データ型によりフォームの属性ファイルのtype値が設定され、type値によりUIが自動生成されます。

|項目|説明|
|:--|:--|
|:string| データ型がstringの場合は、type値は:stringになります。type=textのinputタグが生成されます。|
|:text| データ型がtextの場合は、:textがデフォルトになります。textareaタグが生成されます。データ型ががstringであっても改行を含めたい場合は、type値を:textに設定すればtextareaが生成されます|
|:integer|type=textのinputタグが生成されます。整数値以外は入力不可となるバリデーションが設定されます。|
|:float| type=textのinputタグが生成されます。実数値以外は入力不可となるバリデーションが設定されます。|
|:decimal| type=textのinputタグが生成されます。実数値以外は入力不可となるバリデーションが設定されます。|
|:boolean| 「有効」、「無効」というラベルのラジオボタンが生成されます。|
|:datetime| 日付の入力UIが生成されます。|
|:timestamp| 日付の入力UIが生成されます。|
|:currency| 金額の入力フィールドが生成されます。3桁ごとにカンマ（,)が挿入されます。 |

* データ型をcurrencyに設定した場合、バリデーションのパターンを以下のように変更して下さい。

```
:pattern: "[+-]?[0-9,]+"
```

(2) カラム名によるUIの決定

カラム名によりUIを自動生成します。

|項目|説明|
|:--|:--|
|url|カラム名にurlを含む場合、URLフィールドと認識し、URLのバリデーションが設定されます。|
|mail|カラム名にmailを含む場合、mailフィールドと認識し、メールアドレスのバリデーションが設定されます。|
|name|カラム名にnameを含む場合、入力必須項目として設定されます。|
|title|カラム名にtitleを含む場合、入力必須項目として設定されます。|

##### 住所入力

住所入力に関するUIの生成には、カラム名を以下の規則で設定します。

|カラム名|説明|
|:--|:--|
|xxx_prefecture_code|都道府県コードのカラムです(:string)|
|xxx_prefecture_name|都道府県名のカラムです(:strng)|
|xxx_city_code|市区町村コードのカラムです(:string)|
|xxx_city_name|市区町村名（○○市、○○区、○○郡○○町）のカラムです(:string)|
|xxx_address1|住所１（一般的に町名番地）のカラムです(:string)|
|xxx_address2|住所2（一般的に建物名など）のカラムです(:string)|

xxx_はプレフィックスです。都道府県〜建物等まで同じプレフィックスをつけることでひとつの住所を表すカラムグループと見なされます。
プレフィックスは省略可能です。このように項目を設定することで、都道府県を選択すると市区町村が連動するプルダウンメニューが生成されます。

さらに同じプレフィックスを付けた郵便番号のカラムをつけると、郵便番号を入力すると住所が自動入力されるUIが生成されます。

|カラム名|説明|
|:--|:--|
|xxx_zip_code|郵便番号のカラムです(:string)|


  <img src="https://user-images.githubusercontent.com/2704723/78958668-c0fb7c00-7b23-11ea-85e9-ecd00402729c.jpg" width='70%'/>


以下が、フォーム属性ファイル都道府県、市区町村の定義部分になります。prefecture_codeの default_prefecture_code、default_city_codeは都道府県と市区町村の初期値になります。以下の例では、新規登録時には、22: 静岡県  221015: 静岡市葵区が選択されています。
これらのコードは、prefectures / citiesのテーブルに設定されています。

~~~yaml
- :name: prefecture_code
  :label: 都道府県コード
  :icon: fas fa-info-circle
  :type: :string
  :column: 4
  :default_prefecture_code: 22
  :default_city_code: 221015
  :city_column: city_code
  :placeholder: ''
- :name: prefecture_name
  :label: 都道府県名
  :icon: fas fa-info-circle
  :type: :string
  :column: 4
  :placeholder: ''
  :validate:
    :required: false
    :required_message: ''
    :max_length: -1
    :max_length_message: ''
    :min_length: -1
    :min_length_message: ''
    :pattern: ''
    :pattern_message: ''
    :length: ''
    :length_message: ''
- :name: city_code
  :label: 市区町村コード
  :icon: fas fa-info-circle
  :type: :string
  :column: 4
  :prefecture_column: prefecture_code
  :placeholder: ''
- :name: city_name
  :label: 市区町村名
  :icon: fas fa-info-circle
  :type: :string
  :column: 4
  :placeholder: ''
  :validate:
    :required: false
    :required_message: ''
    :max_length: -1
    :max_length_message: ''
    :min_length: -1
    :min_length_message: ''
    :pattern: ''
    :pattern_message: ''
    :length: ''
    :length_message: ''
~~~


##### ラジオボタングループ

  <img src="https://user-images.githubusercontent.com/2704723/79063289-a10eb880-7cdb-11ea-96e2-2c9bef99666f.jpg" width='50%'/>

このようなラジオボックスを使ったUIも設定可能です。
データ型はboolean, integer, float, decimal,stringで利用可能です。


~~~yml
- :name: sex
  :label: 性別
  :icon: fas fa-info-circle
  :type: :integer
  :column: 4
  :options:
    - :label: 女性
      :value: 0
    - :label: 男性
      :value: 1
~~~

以下のように、labelとvalueからなるoptionsを追加します。



##### 日付入力

カレンダー入力、プルダウン形式、時間入力付きが生成可能です。

~~~yml
- :name: date1
  :label: 開始日
  :icon: fas fa-info-circle
  :type: :datetime
  :date_ui: :calendar
  :column: 3
  :show_time: false
~~~

いちばんシンプルな形です。date_uiが :calendar(デフォルト）に設定されていると、テキストフィールドをクリックするとカレンダーが表示されるUIが生成されます。

  <img src="https://user-images.githubusercontent.com/2704723/78956499-737c1080-7b1d-11ea-8d16-315482146fff.jpg" width='35%'/>


show_time を trueにすると時間の入力UIが生成されます。

  <img src="https://user-images.githubusercontent.com/2704723/79063672-edf38e80-7cdd-11ea-8145-e6c8a37c71ff.jpg" width='50%'/>


プルダウン形式

~~~yml
- :name: date1
  :label: 開始日
  :icon: fas fa-info-circle
  :type: :datetime
  :date_ui: :selector
  :column: 6
  :show_time: false
  :min_year: ''
  :max_year: ''
  :default_year: ''
  :era: false
~~~

日付を年月日にわけてプルダウンで選択するUIが生成されます。

  <img src="https://user-images.githubusercontent.com/2704723/79063902-a79f2f00-7cdf-11ea-9302-2ebdf53ee807.jpg" width='50%'/>

プルダウン形式の場合は、columnの数は6を推奨します。
min_yearは選択肢の年と最小値、max_yearは最大値を示します。min_year省略時は100年前、max_year省略時は現在の年になります。
default_yearはデフォルトで選択される年です。省略時は表示している年の中間の値を選択します。

eraをtrueにすると、元号が合わせて表示されます。

  <img src="https://user-images.githubusercontent.com/2704723/79064068-a1f61900-7ce0-11ea-9848-8af30ab6fb2d.jpg" width='50%'/>


##### ファイルアップロードの実装

画像やファイルアップロードのためのUIを実装するには、クラスファイルに、ActiveStorageのAttachmentを記述します。

```ruby
class Company < ApplicationRecord
  has_one_attached :avatar
  has_one_attached :document
end
```

ファイルの参照はAdminネームスペースではなく、ApplicationRecordを派生したクラスの方に記述して下さい。
今のところ ActiveStorageのhas_one_attachedマクロのみに対応しています。 複数のファイルをアタッチできるhas_many_attachedマクロには対応していません。

カラム名がimage,photo,avatar,icon,pictureを含む場合は画像登録用、その他の場合は添付ファイル登録用のUIが生成されます。

以下がフォーム属性ファイルの内容です。

```yaml
- :name: avatar
  :label: プロフィール画像
  :type: :attachment
  :content_type: image/jpeg,image/png
  :column: 4
  :validate:
    :required: ''
    :required_message: ''
- :name: document
  :label: 添付文書
  :type: :attachment
  :content_type: application/pdf
  :column: 4
  :validate:
    :required: ''
    :required_message: ''
```

content_typeにmime typeを記述することで添付できるファイルを制限できます。
画像ファイルの場合は、JPEG、PNG、その他のファイルの場合はPDFがデフォルトです。


### バリデーション

LifeCode CMSは、JavaScriptのバリデーションライブラリー[Parsley](https://parsleyjs.org)を使用してます。Parsleyのvalidateの設定値をここに設定します。以下のバリデーションが設定できます。


|属性|説明|
|:--|:--|
|required|trueに設定すると入力必須項目になり、ラベルの横に「入力必須」と表示がされます。|
|max_length|文字数の最大値を設定します。textareaの場合は、この値が設定されていると文字数カウンターが表示されます。|
|min_length|文字数の最小を設定します。|
|pattern|設定した正規表現に基づいてバリデーションします。|
|range|設定した値の範囲のチェックを行います。1から10の範囲でないとエラーにしたい場合は、[1,10] と設定します。|
|length|設定した文字数の範囲のチェックを行います。1から10文字の場合は、[1,10] と設定します。5文字の場合は、[5,5] と設定します。|
|min|許容される値の最小値を設定します。|
|max|許容される値の最大値を設定します。|
|datetime_greater|日付の大小比較をチェックします。例えば、開始日と終了日の項目がある場合の大小比較をチェックします。show_time=trueが設定されていた場合は時間の大小比較も行います。|

date_time_greaterの例
開始日:start_at 終了日：end_at の設定


```yml
- :name: start_at
  :label: 開始日
  :icon: fas fa-info-circle
  :type: :datetime
  :column: 6
  :show_time: true
  :date_ui: :selector
  :min_year:
  :max_year:
  :default_year: ''
  :era: true
  :validate:
    :required: false
    :required_message: ''
    :datetime_greater: 'start_at < end_at'
    :datetime_greater_message: ''
- :name: end_at
  :label: 終了日
  :icon: fas fa-info-circle
  :type: :datetime
  :column: 3
  :show_time: false
  :date_ui: :selector
  :min_year: ''
  :max_year: ''
  :default_year: ''
  :validate:
    :required: false
    :required_message: ''
    :datetime_greater: 'start_at < end_at'
    :datetime_greater_message: ''
```

start_at、end_at の　datetime_greater属性に 'start_at < end_at'を設定します。


#### バリデーションのエラーメッセージ

バリデーションのエラーメッセージを変更することもできます。それぞれのバリデーション属性に、"_message"をつけた属性を設定すると、そのエラーが発生したときのエラーメッセージを変更できます。省略時は、Pasley.jsの日本語の標準エラーメッセージが表示されます。

## LifeCode Scaffoldジェネレータで生成されるファイル

では、ここで、LifeCode Scaffoldジェネレータで生成されるファイルを整理します。
先の例の会社情報(Company)で生成されたファイルは以下の通りです。
なお、ジェネレータが自動生成したファイルはインデントが正しくない場合があります。エディタのインデント機能などを使って整形して下さい。

~~~
rails_root
  |
  |- app
      |- controllers
      |   |- admin
      |       |- companies_controller.rb
      |- models
      |   |- admin
      |       |- company.rb
      |- views
      |   |- admin
      |       |- companies
      |           |- _form.html.erb
      |           |- _list.html.erb
      |           |- _search_box.html.erb
      |           |- edit.html.erb
      |           |- index.html.erb
      |           |- modal.html.erb
      |           |- new.html.erb

~~~

これらに加えて、config/routesと、settings/permission.ymlファイルも書き換えられます。

これらのファイルで、会社情報の一覧表示、新規作成画面、編集画面、削除を実現しています。Railsのscaffoldではこれに加えshowアクションが実装されていますが、showはデータを管理する画面では編集画面で代替できるため実装していません。

### Model関連

|ファイル|説明|
|:--|:--|
|company.rb| モデルファイルをAdminスコープで継承したクラスファイルです。この中にsearchメソッドが実装されています。このsearchメソッドは一覧画面の検索項目を追加した際に機能追加をする必要があります。|

### View関連

|ファイル|説明|
|:--|:--|
|_form.html.erb| フォーム属性ファイルで自動生成されたフォームの画面です。editとnewから共通で呼ばれます。基本的にはフォーム属性ファイルを変更する開発で事足りるかもしれませんが、レイアウトをいじったり、データ項目が追加になったり、他のモデルとの連携を考慮する場合は編集するケースがあるかと思います。再度、scaffoldを実行すると上書きされてしまいますので、何か手を入れた後のscaffold実行は、元ファイルを残してマージするなどの手段を考慮する必要があります|
|_list.html.erb| 一覧表示のViewになります。一覧表示の項目を変更したい場合は、このファイルを修正することになります。|
|_search_box.html.erb| 一覧画面の検索項目を記述しています。LifeCode Scaffoldジェネレータはデフォルトでnameまたはtitleと、都道府県が設定されていれば都道府県の検索項目を生成します。|
|index.html.erb| 一覧画面のViewファイルです。|
|edit.html.erb| 編集画面のViewファイルです。|
|new.html.erb| 新規作成画面のViewファイルです。|
|modal.html.erb| フォーム属性ファイルの中の edit_mode属性を :modal に設定すると、新規登録画面と編集画面をモーダル表示にすることができます。このファイルはモーダル表示用のViewファイルになります。|

### Controller関連

|ファイル|説明|
|:--|:--|
|companies_controller.rb| Companyクラスを操作する一連の処理が生成されています。|


### routesファイル

LifeCode Scaffoldジェネレータは、congit/routes.rb ファイルにルーティングを設定します。冗長な形式で書き出されますので、気になる場合はきれいにして下さい。

~~~ruby
Rails.application.routes.draw do
  namespace :admin do
    resources :people
  end
  namespace :admin do
    resources :companies
  end
  :
  :
~~~

ちょっときれいではないので、以下のように修正するとよいでしょう。

~~~ruby
Rails.application.routes.draw do
  namespace :admin do
    resources :people
    resources :companies
  end
  :
  :
~~~


### Permission

LifeCode CMSでは、ユーザーのロールを設定できます。デフォルトでは、1:システム管理者、2:コンテンツ作成者、3:一般ユーザーが設定されています。
こちらは、config/settings.ymlに設定されています。

config/settings.yml

~~~yml
# 管理画面
admin:
  ## ユーザー
  user:
    role:
      1: 'システム管理者'
      2: 'コンテンツ管理者'
      3: '一般ユーザー'
    role_value:
      administrator: 1
      operator: 2
      normal: 3
~~~

これらのロールをController単位または、Action単位でアクセス権を設定できます。

settings/permission.yml

~~~yml
---
permission:
  top: '1,2,3'
  articles: '1,2,3'
  inquiries: '1,2,3'
  groups: '1,2'
  users:
    index: '1,2'
    new: '1,2'
    edit: '1,2,3'
    create: '1,2'
    update: '1,2,3'
    destroy: '1,2,3'
    confirm_user: '1,2,3'
    lock: '1,2'
  companies: '1,2,3'
  people: '1,2,3'
~~~

1,2,3の数字は、ロールの値です（1:システム管理者、2:コンテンツ作成者、3:一般ユーザー）
デフォルトでは、companiesコントローラーのすべてのアクションに1,2,3のロールを持つユーザーがアクセス権を持っています。

~~~yml
---
permission:
:
:
  companies:
    index: '1,2,3'
    edit: '1,2'
    new: '1,2'
    create: '1,2'
    destroy: '1,2'
~~~

このように書き換えると、一覧表示はすべてのユーザーが可能、編集操作系は3:一般ユーザーがアクセス不可となり403エラーが返ります。
例えば、一般ユーザーに自身の作成したレコードのみ編集系操作を与えたい場合があるかと思いますが、その場合は、アクションレベルでは権限を与え、コントロール内で作成者をチェックするような処理を入れることになります。

### 一覧検索項目の追加

一覧検索項目の追加は、_search_box.html.erbと company.rbファイルの変更が必要です。
まず、_search_box.html.erbに追加したい検索項目のUIを追加します（inputタグやselectなどを実装します）。

以下はデフォルトの状態です。

views/admim/companies/_search_box.html.erb

~~~html
<div class="card search-box">
  <div class="card-header">
    <strong><i class="fas fa-search"></i>　<%= Settings.form.label.search %></strong>
  </div>
  <div class="card-body">
    <div class="row">
      <%- column = Company.form_column('name') -%>
      <div class="col-sm-4">
        <div class="form-group">
          <label for="<%= column[:name] %>"><%= column[:label] %></label>
          <input type="text" class="form-control" id="<%= column[:name] %>" name="<%= column[:name] %>" value="<%= params[:name] %>"/>
        </div>
      </div>

      <!-- 省略 (都道府県/市区町村の検索項目が出力されています)--->

      <hr/>
      <div class="col-sm-12 search-box-buttons">
        <button type="button" class="clear-button btn btn-primary btn-lg"><i class="fas fa-redo"></i> <%= Settings.form.label.clear %></button>
        <button type="button" class="search-button btn btn-primary btn-lg"><i class="fas fa-search"></i> <%= Settings.form.label.search %></button>
      </div>
    </div>
  </div>
</div>
~~~

デフォルトでは、会社名と都道府県、市区町村の検索項目が作成されています。これに、代表者氏名（president_name）でも検索できるよう検索項目を追加してみましょう。


~~~html
<div class="card search-box">
  <div class="card-header">
    <strong><i class="fas fa-search"></i>　<%= Settings.form.label.search %></strong>
  </div>
  <div class="card-body">
    <div class="row">
      <%- column = Company.form_column('name') -%>
      <div class="col-sm-4">
        <div class="form-group">
          <label for="<%= column[:name] %>"><%= column[:label] %></label>
          <input type="text" class="form-control" id="<%= column[:name] %>" name="<%= column[:name] %>" value="<%= params[:name] %>"/>
        </div>
      </div>

      <!-- 追加：代表者名の検索項目 --->
      <%- column = Company.form_column('president_name') -%>
      <div class="col-sm-4">
        <div class="form-group">
          <label for="<%= column[:name] %>"><%= column[:label] %></label>
          <input type="text" class="form-control" id="<%= column[:name] %>" name="<%= column[:name] %>" value="<%= params[:name] %>"/>
        </div>
      </div>
      <!-- 追加：代表者名の検索項目 ここまで--->

      <!-- 省略 (都道府県/市区町村の検索項目が出力されています)--->

      <hr/>
      <div class="col-sm-12 search-box-buttons">
        <button type="button" class="clear-button btn btn-primary btn-lg"><i class="fas fa-redo"></i> <%= Settings.form.label.clear %></button>
        <button type="button" class="search-button btn btn-primary btn-lg"><i class="fas fa-search"></i> <%= Settings.form.label.search %></button>
      </div>
    </div>
  </div>
</div>
~~~

このファイルの下に検索パラメーターをajaxで送信するJavaScriptが記述されています。ここに、president_nameを追加します。

~~~html
<%- content_for :add_js do %>
  <script>
    // search Parameter
    function searchParams() {
      return {
        'page': '<%= params[:page] || 1 %>',
        'name' : $('[name="name"]').val(),
        'prefecture_code' : $('[name="prefecture_code"]').val(),
        'city_code' : $('[name="city_code"]').val(),
        'president_name' : $('[name="president_name"]').val()     /* 会社代表者名を追加 */
      };
    }
    $(function() {
      new FormManager({el: '.search-box'}).init();
    })
  </script>
<%- end %>
~~~

Companyモデルにpresident_nameパラメータの検索条件を追加します。

app/models/admin/company.rb


~~~ruby
module Admin
  class Company < Company
    class << self
      def search(params)
        objects = self.all
        if params[:name].present?
          objects = objects.where(name: params[:name])
        end
        if params[:prefecture_code].present?
          objects = objects.where(prefecture_code: params[:prefecture_code])
        end
        if params[:city_code].present?
          objects = objects.where(city_code: params[:city_code])
        end

        # president_nameを追加
        if params[:president_name].present?
          objects = objects.where(president_name: params[:president_name])
        end

        objects
      end
    end
  end
end
~~~

例では完全一致のコードを示しましたが、場合によっては部分一致にするなど、適宜記述して下さい。


### lc_scaffoldのオプション

lc_scaffoldジェネレーターには、以下のオプションがあります。データベースのマイグレーションでデータベースの項目が増えたときなど、自動生成したいファイルを限定したいときに使用します。

```bash
$ bundle exec rails g lc_scaffold [model名] --only form_view
```

onlyを指定することで、自動生成するファイルを限定できます。指定できるファイルは、form_view,list_view,search_view,edit_view,new_view,index_view,controller,routeです。
また、form_viewを指定したとき、以下のように記述すると、その項目のみのHTMLをRails.root/tmpディレクトリーに書き出します。

```bash
# CompanyのnameカラムのみのHTMLを書き出す。
$ bundle exec rails g lc_scaffold company --only form_view:name
```

### データベースのマイグレーションに伴う注意事項

データベースのマイグレーションを行って、カラムの追加が削除があった場合に、lc_form_attributesジェネレータを再実行すると、フォーム属性ファイルの既存のカラム定義については変更されません。
削除されたカラムは、フォーム属性ファイルから削除され、追加のあったカラムはフォーム属性ファイルに追加されます。


カラムの追加があった場合、controllerの permit_params メソッドに、追加になったカラムを追加する必要があります。

```ruby
def permit_params
  @attr = params.require('admin_person').permit(
        :name, :sex, :birthday, :fee, :float, :tax, :birthday_time, :option1  # option1というカラムが追加になった場合、ここに追加
  )
end
````

カラムの削除があった場合、そのカラムを参照しているViewは動作しなくなりますので、再度、lc_scaffoldジェネレータを実行するか、form_view, search_view, index_viewから削除されたカラムを参照している箇所は編集して削除を行って下さい。






