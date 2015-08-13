# == Schema Information
#
# Table name: contents
#
#  id                 :integer          not null, primary key
#  category_id        :integer
#  category_type      :string(255)
#  user_id            :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  name               :string(255)
#  description        :text
#  access_count       :integer
#  download_protected :boolean
#  shareable          :boolean
#
# Indexes
#
#  index_contents_on_category_id_and_category_type  (category_id,category_type)
#  index_contents_on_user_id                        (user_id)
#

class Content < ActiveRecord::Base
  
	# References
	belongs_to :user
	belongs_to :category, polymorphic: true

	# Referenced by
	has_one :media, as: :owner
	has_many :recommendations, as: :resource
	has_many :course_contents
	has_many :courses, through: :course_contents

end
