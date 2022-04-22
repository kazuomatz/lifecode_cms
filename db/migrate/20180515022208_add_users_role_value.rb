class AddUsersRoleValue < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :role, :integer, default: 3
    add_column :users, :name, :string
    add_column :users, :name_kana, :string
    add_column :users, :deleted_at, :datetime
  end
end
