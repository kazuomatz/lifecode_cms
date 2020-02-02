class Article < ApplicationRecord
  has_one_attached :main_image
  has_many :uploads, dependent: :destroy
  acts_as_taggable

end
