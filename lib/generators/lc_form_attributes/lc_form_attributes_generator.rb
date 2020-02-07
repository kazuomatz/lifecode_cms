class LcFormAttributesGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def create_admin_model
    @file_name = file_name
    template 'rails/models/model.erb', File.join(Rails.root,'app/models/admin', "#{file_name.underscore}.rb")
  end

  def create_form_attributes_yaml
    model = class_eval(file_name.singularize.camelize)
    create_file "config/form_attributes/#{file_name.singularize.underscore}.yml", model.initial_form_attributes.to_yaml
  end

end
