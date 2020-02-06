class LcScaffoldGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def create_controller
    @file_name = file_name
    template 'rails/controllers/controller.erb', File.join(Rails.root,'app/controllers/admin', "#{file_name.pluralize}_controller.rb")
  end

  def create_views
    @file_name = file_name
    template 'rails/views/_form.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_form.html.erb")
  end
end
