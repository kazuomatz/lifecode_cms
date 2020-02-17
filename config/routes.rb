Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
    end
  end

  get 'admin', to: 'admin/top#index'
  resources :uploads, only: [:create, :destroy]

  namespace :admin do
    get 'top/index'
    resources :users
    resources :groups
    resources :articles
    resources :inquiries
  end

  namespace :public do
  end

  namespace :master do
    resources :cities, only: [:show, :index]
  end

  root 'top#index'
  get 'top/index'

  put '/admin/users/lock/:id', to: 'admin/users#lock'
  delete '/admin/users/lock/:id', to: 'admin/users#lock'

  devise_for :users, only: [:session, :password, :confirmation], controllers: {
      sessions: 'users/sessions',
      passwords: 'users/passwords',
      unlocks: 'users/unlocks',
      confirmations: 'users/confirmations'
  }
  patch '/admin/users/confirm/:id', to: 'admin/users#confirm_user', as: 'users_confirm'

end
