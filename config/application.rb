require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LifecodeCms
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.generators.system_tests = nil

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    # time_zone
    config.time_zone = 'Asia/Tokyo'
    config.autoload_paths += %W(#{config.root}/lib)
    # locale
    config.i18n.default_locale = :ja
    config.assets.precompile += %w( public.css public.js )

    config.active_storage.routes_prefix = '/active_storage_images/'

    Settings.add_source!("#{Rails.root}/config/settings/permission.yml")
    Settings.add_source!("#{Rails.root}/config/settings/form.yml")
    Settings.reload!

    # feature
    # Rails.application.config.active_storage.previewers << DOCXPreviewer
  end
end
