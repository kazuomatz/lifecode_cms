module Migration
  class Group < ApplicationRecord
    class << self
      def load_data
        Group.create(name: 'Group1')
        Group.create(name: 'Group2')
        Group.create(name: 'Group3')
        Group.create(name: 'Group4')
        Group.create(name: 'Group5')
      end
    end
  end
end
