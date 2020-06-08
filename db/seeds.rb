##
#  Init Database
#
email = 'admin@example.com'
password = 'your-password'

user = User.create(name: 'システム管理者', email: email, password: password, role: 1)
user.confirmed_at = DateTime.now
user.save

Migration::City.load_data
Migration::Prefecture.load_data
Migration::Group.load_data
