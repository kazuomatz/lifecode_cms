class User < ApplicationRecord
  # Include default devise modules. Others available are:
  devise :database_authenticatable, :lockable, :rememberable, :recoverable, :confirmable, :trackable
  acts_as_paranoid

  has_many :groups_users
  has_many :groups, through: :groups_users
  has_one_attached :avatar

  def operator_role?
    role == 2
  end

  def administrator_role?
    role == 1
  end

  def normal_role?
    role == 3
  end

  def grater_than_equal_to_normal_role?
    true
  end

  def grater_than_equal_to_operator_role?
    role == 1 || role == 2
  end

  def self.search(params = {})
    users = User.all
    users = users.where('name like ?', "%#{params[:name]}%") if params[:name].present?
    users = users.where('name_kana like ?', "%#{params[:name_kana]}%") if params[:name_kana].present?
    users = users.where('email like ?', "%#{params[:email]}%") if params[:email].present?
    users
  end

  def role_name
    if administrator_role?
      Settings.admin.user.role["1"]
    elsif operator_role?
      Settings.admin.user.role["2"]
    else
      Settings.admin.user.role["3"]
    end
  end
end
