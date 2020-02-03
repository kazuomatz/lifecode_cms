module Admin

  class User < User
    has_many :groups_users, class_name: 'Admin::GroupsUser'
    has_many :groups, through: :groups_users, class_name: 'Admin::Group'
  end

end
