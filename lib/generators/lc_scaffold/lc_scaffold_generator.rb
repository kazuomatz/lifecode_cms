# encoding: UTF-8
class LcScaffoldGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)
  class_option :only, type: :string

  def set_options
    if options[:only].nil?
      @exec_methods = %w(form_view list_view search_view edit_view new_view index_view controller route)
    else
      @exec_methods = [options[:only]]
    end
  end

  def create_controller
    @file_name = file_name
    if @exec_methods.index('controller')
      template 'rails/controllers/controller.erb', File.join(Rails.root,'app/controllers/admin', "#{file_name.pluralize}_controller.rb")
    end
  end

  def create_views
    @file_name = file_name
    @view_path = "app/views/admin/#{file_name.pluralize}"
    create_form if @exec_methods.select{ |m| m.index('form_view') }.length > 0
    create_list_view if @exec_methods.index('list_view')
    create_search_view if @exec_methods.index('search_view')
    create_edit_view if @exec_methods.index('edit_view')
    create_new_view if @exec_methods.index('new_view')
    create_index_view if @exec_methods.index('index_view')
  end

  def add_route
    if @exec_methods.index('route')
      route "namespace :admin do\n  resources :#{file_name.pluralize.underscore}\nend\n"
    end
  end

  protected

  def create_form
    item = var_model_item
    if item.nil?
      file = File.join(Rails.root,@view_path, "_form.html.erb")
      template 'rails/views/_form.html.erb', file
      replace_erb_tag file

      file = File.join(Rails.root,@view_path, "modal_form.html.erb")
      template 'rails/views/modal_form.html.erb', file
      replace_erb_tag file
    elsif
      file = File.join(Rails.root,'tmp',"#{file_name.pluralize}_form_#{item}.erb")
      template 'rails/views/_item.html.erb', file
      replace_erb_tag file
    end
  end

  def create_list_view
    file = File.join(Rails.root,@view_path, "_list.html.erb")
    template 'rails/views/_list.html.erb', file
    replace_erb_tag file
  end

  def create_search_view
    file = File.join(Rails.root,@view_path, "_search_box.html.erb")
    template 'rails/views/_search_box.html.erb', file
    replace_erb_tag file
  end

  def create_edit_view
    file = File.join(Rails.root,@view_path, "edit.html.erb")
    template 'rails/views/edit.html.erb', file
    replace_erb_tag file
  end

  def create_new_view
    file = File.join(Rails.root,@view_path, "new.html.erb")
    template 'rails/views/new.html.erb', file
    replace_erb_tag file
  end

  def create_index_view
    file = File.join(Rails.root,@view_path, "index.html.erb")
    template 'rails/views/index.html.erb', file
    replace_erb_tag file
  end

  def model_name
    @file_name.classify
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

  def var_model_item
    item = @exec_methods.select {|m| m.index('form_view') }[0]
    if item
      items = item.split(':')
      if items.length == 2
        items[1]
      else
        nil
      end
    else
      nil
    end
  end

  def source_root
    "/#{File.expand_path('templates', __dir__)}"
  end

  def replace_erb_tag(file)
    gsub_file(file,'<$$','<%')
    gsub_file(file,'$$>','%>')
  end
end
