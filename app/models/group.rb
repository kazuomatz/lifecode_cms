class Group < ApplicationRecord
  has_many :groups_users
  has_many :users, through: :groups_users
  acts_as_paranoid

  def self.search(params = {})
    groups = Group.all
    groups = groups.where('name like ?', "%#{params[:name]}%") if params[:name].present?
    groups
  end

end
