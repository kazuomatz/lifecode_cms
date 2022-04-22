module Admin
  class GroupsUser < GroupsUser
    belongs_to :group, class_name: 'Admin::Group'
    belongs_to :user, class_name: 'Admin::User'
  end
end
