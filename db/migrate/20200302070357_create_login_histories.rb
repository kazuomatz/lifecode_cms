class CreateLoginHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :login_histories do |t|
      t.string :user_type #0: 管理者  1: 店舗オーナー
      t.string :account
      t.string :name
      t.integer :user_id
      t.string :ip_address
      t.integer :status, default: 0 # 0: error  1: success  -1: locked
      t.timestamps
    end
  end
end
