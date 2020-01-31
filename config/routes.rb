Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
    end
  end

  get 'admin', to: 'admin/top#index'

  namespace :admin do
    get 'top/index'
    resources :users
  end

  namespace :public do
  end

  namespace :master do
    resources :cities, only: [:show, :index]
  end

  root 'top#index'
  get 'top/index'

  put '/users/lock/:id', to: 'users#lock'
  delete '/users/lock/:id', to: 'users#lock'

  devise_for :users, only: [:session, :password, :confirmation], controllers: {
      sessions: 'users/sessions',
      passwords: 'users/passwords',
      unlocks: 'users/unclocks',
      confirmations: 'users/confirmations'
  }
  patch '/users/confirm/:id', to: 'users#confirm_user', as: 'users_confirm'

end
