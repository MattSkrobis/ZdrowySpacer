Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "locations#index"
  resources :locations, only: :index
  resources :measurements, only: [:current, :chart_data] do
    collection do
      get :chart_data
      get :current
    end
  end
end
