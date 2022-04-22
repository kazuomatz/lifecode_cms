class LcFormAttributesGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def create_admin_model
    @file_name = file_name
    template 'rails/models/model.erb', File.join(Rails.root,'app/models/admin', "#{file_name.underscore}.rb")
  end

  def create_form_attributes_yaml
    model = class_eval(file_name.singularize.camelize)
    file =  File.join(Rails.root,"config/form_attributes/#{file_name.singularize.underscore}.yml")
    if File.exist? file
      create_file file, model.merge_form_attributes.to_yaml
    else
      create_file file, model.initial_form_attributes.to_yaml
    end
  end

  def add_permission
    class_eval(file_name.singularize.camelize).add_permission
  end

end
