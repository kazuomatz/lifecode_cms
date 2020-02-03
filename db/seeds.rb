

u = User.create(name:'システム管理者',email:'admin@lifecode.jp',password:'l1f3c0d3',role:1)
u.confirmed_at = DateTime.now
u.save

Migration::City.load_data
Migration::Prefecture.load_data
Migration::Group.load_data
