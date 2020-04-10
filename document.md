
# LifeCode CMS

## Railsアプリケーションをすばやく開発するために

Ruby on Railsには、Scaffoldというジェネレータが標準で含まれています。Scaffoldジェネレータは、定義したモデルをもとに、ViewとControllerを自動生成し、以下の７つのアクションからなるアプリケーションの土台を作ることができます。

- index(一覧画面の表示）
- show（レコード項目の画面表示）
- new（新規レコード登録画面の表示）
- edit（レコード編集画面の表示）
- create（レコードの作成）
- update（レコードの更新）
- destroy（レコードの削除）

Scaffoldは便利な機能ですが、できあがるフォームはとてもシンプルで、実際の業務で利用するとなると機能的には不足が多く、Scaffoldで作成されたViewに様々な実装が必要になります。

LifeCode CMSのScaffoldは、一般的に日本の業務アプリケーションに必要な入力項目に対応したユーザーインタフェイスを自動生成することができます。


- テキストエリアの文字数制限（テキストカウンター付）

  <img src="https://user-images.githubusercontent.com/2704723/78959736-dcb45180-7b26-11ea-8f3f-d8064b8e946d.jpg" width='50%'/>


- カレンダーでの日付入力(祝日表示付き)

  <img src="https://user-images.githubusercontent.com/2704723/78956499-737c1080-7b1d-11ea-8d16-315482146fff.jpg" width='35%'/>

- 郵便番号入力による自動住所入力
- 都道府県、市区町村のプルダウン(都道府県連動、市区町村表示)

  <img src="https://user-images.githubusercontent.com/2704723/78958668-c0fb7c00-7b23-11ea-85e9-ecd00402729c.jpg" width='70%'/>

- 画像・写真のアップロード(プレビュー付)

  <img src="https://user-images.githubusercontent.com/2704723/78959172-14ba9500-7b25-11ea-89d1-d22f4915a79f.jpg" width='70%'/>


- 入力値のバリデーション

  <img src="https://user-images.githubusercontent.com/2704723/78959347-a0342600-7b25-11ea-8e74-f4083dbd37e2.jpg" width='70%'/>


また、Rails標準のScaffoldと同様、一覧表示、レコードの新規作成・編集、削除機能のも自動生成されます。

# 事前準備

LifeCode CMSはジャネレータコマンド（rails g)を数回入力するだけで、簡単にモデルベースの入力画面ができてしまいます。

手始めに、会社情報を登録するWebアプリケーションを作ってみましょう。

まず、LifeCode CMSを利用するために必要なものを用意してください。

## ImageMagick
LifeCode CMSでは画像を扱うGemとしてminiMagickを使用します。miniMagickが開発環境にない場合はインストールして下さい。
Macであれば、以下でインストールできます。

```
$ brew install imagemagick
```

## yarn

nodeモジュールをインストールするので、yarnを使えるようにして下さい。

## RDBMS

MySQL 6.7.x / 8.xに対応しています。

## Ruby

2.6.5 を推奨しています。それ以前のRubyでも動くと思います。別のバージョンを使用する場合は、.ruby-versionファイルとGemfileのRubyのバージョンを書き換えて下さい。


# Getting Start

まずはこのレポジトリをcloneまたはforkしてください。


## nodeモジュールとGemライブラリのインストール
nodeモジュールとGemライブラリをインストールします。

```
$ yarn install
```

```
$ bundle
```

## database.yml

config/database.ymlを編集して、自分の環境のMySQLに接続できるようにして下さい。

## システム管理者のログインアカウントの設定

db/seeds.rbファイルのemailとpasswordを適切なものに変更します。

```ruby:db/seeds.rb
##
#  Init Database
#
email = 'admin@example.com'
password = 'your-password'

user = User.create(name:'システム管理者',email: email ,password: password, role:1)
user.confirmed_at = DateTime.now
user.save
```

## データベースの作成・マイグレーション・初期化

```
$ bundle exec rake db:create
$ bundle exec rake db:migrate
$ bundle exec rake db:seed
```

## Rails アプリケーションの起動

```
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

```

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
$ bundle exec rake g model company
```

マイグレーションファイルができますので、以下のように書き換えて下さい。

db/migrate/2020XXXXXXXX_create_companies.rb


```ruby:db/migrate/2020XXXXXXXX_create_companies.rb
class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :name, comment: '会社名'
      t.string :kana, comment: '会社名カナ'
      t.text :description, comment: '会社名概要'
      t.string :zip_code, comment: '郵便番号'
      t.string :prefecture_code, comment: '都道府県コード'
      t.string :prefecture_name, comment: '都道府県名'
      t.string :city_code, comment: '市区町村コード'
      t.string :city_name, comment: '市区町村名'
      t.string :address1, comment: '町名番地'
      t.string :address2, comment: '建物など'
      t.string :email, comment: 'メールアドレス'
      t.string :url, comment: 'サイトURL'
      t.string :president_name, comment: '代表者氏名'
      t.datetime :establishment_at, comment: '設立年月日'
      t.timestamps
    end
  end
end
```

commentを書くのがミソです。

では、migrationを実行します。

```
$ bundle exec rake db:migrate
```

これで会社の情報を入力するテーブルができました。さらに、会社の写真を入れるフィールドを追加しましょう。写真はRails標準機能のActiveStorageを使用します。ActiveStorageに必要なマイグレーションは最初のマイグレーションに含めてありますので実行済みです。

Companyモデルのクラスファイルに、次のように１行加えるだけで、Companyに写真をアタッチすることができます。

app/models/company.rb


```ruby:app/models/company.rb
class Company < ApplicationRecord
  has_one_attached :image  # 画像のアタッチメント
end
```

## LifeCode CMSのジェネレーターを起動

ここからがLideCode CMSの出番です。
まず、フォームの属性ファイルを生成するジェネレータを実行します。

```
$ bundle exec rails g lc_form_attributes company
      create  app/models/admin/company.rb
      create  config/form_attributes/company.yml
```

続けて、scaffoldを作成するためのジェネレータを実行します。

```
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
```

いくつかファイルが作成されました。ここれらのファイルはあとで見ることとして、もう一度、Raisアプリケーションを起動して、https://localhost:3000 にアクセスしてみます。
ログオフした場合は、再度ログインして下さい。

  <img src="https://user-images.githubusercontent.com/2704723/78966133-f743f600-7b39-11ea-98c6-47a3d837fc08.jpg" width='70%'/>

フォーム一覧に「Company」というリンクが追加されているかと思いますのでクリックして下さい。


一覧画面ができています。ラベルが「Company登録」とやや残念な感じににあっていますが、「+ Company追加」をクリックして下さい。

  <img src="https://user-images.githubusercontent.com/2704723/78980979-e905d200-7b59-11ea-8182-242ff94ec078.jpg" width='70%'/>

Companyの入力フォームができています。

  <img src="https://user-images.githubusercontent.com/2704723/78981109-32562180-7b5a-11ea-88e0-681e8e556caf.jpg" width='70%'/>



