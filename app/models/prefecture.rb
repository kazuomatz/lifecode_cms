class Prefecture < ApplicationRecord
  has_many :areas
  has_many :companies
end
