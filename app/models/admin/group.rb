module Admin
  class Group < Group
    has_many :groups_users, class_name: 'Admin::GroupsUser'
    has_many :users, through: :groups_users, class_name: 'Admin::User'
    acts_as_paranoid
  end
end
