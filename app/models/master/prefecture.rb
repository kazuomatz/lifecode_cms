module Master
  class Prefecture < Prefecture
    has_many :areas
    has_many :companies
  end
end