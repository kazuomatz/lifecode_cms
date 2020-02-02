class CreateArticles < ActiveRecord::Migration[6.0]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :catch
      t.boolean :is_publish, default: false
      t.text :content, length: 4294967295
      t.references :user
      t.timestamps
    end
  end
end
