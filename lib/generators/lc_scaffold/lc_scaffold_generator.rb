# encoding: UTF-8
class LcScaffoldGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def create_controller
    @file_name = file_name
    template 'rails/controllers/controller.erb', File.join(Rails.root,'app/controllers/admin', "#{file_name.pluralize}_controller.rb")
  end

  def create_views
    @file_name = file_name
    template 'rails/views/_form.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_form.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_form.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_form.html.erb"),'$$>','%>')

    template 'rails/views/_list.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_list.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_list.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_list.html.erb"),'$$>','%>')

    template 'rails/views/_search_box.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_search_box.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_search_box.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "_search_box.html.erb"),'$$>','%>')

    template 'rails/views/edit.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "edit.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "edit.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "edit.html.erb"),'$$>','%>')

    template 'rails/views/new.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "new.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "new.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "new.html.erb"),'$$>','%>')

    template 'rails/views/index.html.erb', File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "index.html.erb")
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "index.html.erb"),'<$$','<%')
    gsub_file(File.join(Rails.root,'app/views/admin',"#{file_name.pluralize}", "index.html.erb"),'$$>','%>')
  end

  def add_route
    route "namespace :admin do\n  resources :#{file_name.pluralize.underscore}\nend\n"
  end

  private

  def model_name
    @file_name.singularize.camelize
  end

  def model
    class_eval model_name
  end

  def var_model
    @file_name.singularize.underscore
  end

  def var_models
    @file_name.pluralize.underscore
  end

  def source_root
    "/#{File.expand_path('templates', __dir__)}"
  end
end
