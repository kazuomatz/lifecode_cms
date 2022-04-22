class AddUsersPermanentLock < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :permanent_lock, :boolean, default: false
  end
end
