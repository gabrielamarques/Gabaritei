class AddModelFields < ActiveRecord::Migration
  
  def change
  
    # Registration requests
    add_column :registration_requests, :first_name, :string
    add_column :registration_requests, :last_name, :string
    add_column :registration_requests, :email, :string
    add_column :registration_requests, :birthdate, :datetime
    add_column :registration_requests, :text, :text
    add_column :registration_requests, :response_date, :datetime
    add_column :registration_requests, :response, :text
    add_column :registration_requests, :accepted, :boolean

    # Media
    add_column :media, :reference, :string
    add_column :media, :is_attachment, :boolean
    add_attachment :media, :data

    # Roles
    add_column :roles, :name, :string
    add_column :roles, :description, :text

    # Permissions
    add_column :permissions, :name, :string

    # Subjects
    add_column :subjects, :name, :string
    add_column :subjects, :description, :text

    # Fields
    add_column :fields, :name, :string
    add_column :fields, :description, :text

    # Users
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :birthdate, :datetime
    add_column :users, :about, :text
    add_attachment :users, :avatar

    # Courses
    add_column :courses, :name, :string
    add_column :courses, :description, :text
    add_attachment :courses, :avatar

    # Questions
    add_column :questions, :text, :text
    add_column :questions, :answer, :text
    add_column :questions, :hot, :boolean
    add_column :questions, :source, :string
    add_column :questions, :date, :datetime
    add_column :questions, :style, :string
    add_column :questions, :tags, :string

    # Question choice
    add_column :question_choices, :text, :string
    add_column :question_choices, :correct, :boolean

    # Course registration request
    add_column :course_registration_requests, :text, :text
    add_column :course_registration_requests, :response_date, :datetime
    add_column :course_registration_requests, :response, :text
    add_column :course_registration_requests, :accepted, :boolean

    # Course news
    add_column :course_news, :title, :string
    add_column :course_news, :text, :text
    add_column :course_news, :date, :datetime

    # Ratings
    add_column :ratings, :value, :integer

    # Responses
    add_column :responses, :text, :text

    # Tests
    add_column :tests, :name, :string
    add_column :tests, :description, :text

    # Test questions
    add_column :test_questions, :max_score, :decimal, precision: 4, scale: 2
    
    # Test responses
    add_column :test_responses, :score, :decimal, precision: 4, scale: 2
    add_column :test_responses, :comment, :text 
    
    # Contents
    add_column :contents, :name, :string
    add_column :contents, :description, :text
    add_column :contents, :access_count, :integer
    add_column :contents, :download_protected, :boolean
    add_column :contents, :shareable, :boolean

    # Data import
    add_column :data_imports, :model, :integer
    add_column :data_imports, :status, :integer, default: -1
    add_attachment :data_imports, :data

    # Lesson
    add_column :lessons, :title, :string
    add_column :lessons, :description, :text

    # Setting
    add_column :settings, :preferred_language, :integer

  end
  
end
