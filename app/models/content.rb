# Contents can be created by {User users} (for example, teachers) as additional resources to their
# {Course courses} and/or {Lesson lessons}. By being associated with a {Medium medium} object, a content can have a wide variety of formats, 
# like PDFs, images, MS Office documents, or even online resources, like YouTube videos.
# They must be associated to a {Subject subject} or a {Field field}, and they can be recommended to one user by
# another user.
# 
# == Schema Information
#
# Table name: contents
#
#  id                 :integer          not null, primary key
#  category_id        :integer
#  category_type      :string(255)
#  owner_id           :integer
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
#  index_contents_on_owner_id                       (owner_id)
#

class Content < ActiveRecord::Base

	# @!attribute name
	# 	Name of the content.
	# 	@return [String] the name of the content.
	#  
	# @!attribute description  
	# 	Description of the content.
	# 	@return [String] the description of the content.
	#
	# @!attribute [r] access_count
	# 	Number of times the content has been accessed.
	# 	@return [Integer] how many times the content has been accessed.
	# 	
	# @!attribute download_protected
	# 	Whether users can or cannot download the content (if it is a file).
	# 	@return [Boolean] "true" if users can download the content, "false" otherwise.

	# @!group Belongs to
	
	# The owner is the {User user} who created the content.
	# @return [User] user who created the content.
	# @see User#contents
	belongs_to :owner, class_name: "User"

	# The category is the {Subject subject} or {Field field} to which the content belongs.
	# @return [Subject, Field] subject or field to which the content belongs.
	# @see Subject#contents
	# @see Field#contents
	belongs_to :category, polymorphic: true
	
	# @!endgroup

	# @!group Has one

	# The {Medium medium} keeps a file or a reference to an online resource.
	# @return [Medium] medium object containing a file or a reference to an online resource.
	# @see Medium#owner
	has_one :medium, as: :owner

	# @!endgroup

	# @!group Has many

	# List of all {Recommendation recommendations} of the content.
	# @return [Array<Recommendation>] all recommendations of the content.
	# @see Recommendation#resource
	has_many :recommendations, as: :resource

	# List of all {Lesson lessons} that have access to the content.
	# @return [Array<Lesson>] all lessons that have access to the content.
	# @see Lesson#contents
	has_many :lessons, through: :lesson_contents

	# @!endgroup

	has_many :course_contents
	has_many :lesson_contents

	def subject
        if category != nil
            category.is_a?(Subject) ? category.name : category.subject.name
        end
    end

    def field
        if category != nil
            category.is_a?(Field) ? category.name : nil
        end
    end

	def attachment_url
		(medium != nil && medium.data != nil) ? medium.data.url : ""
	end

	def embeddable
		if medium != nil
			return medium.embeddable
		else
			return true
		end
	end

	def can_be_accessed?(user_id)
		return shareable || LessonContent.where("lesson_contents.content_id = :content_id AND EXISTS (SELECT 1 FROM user_courses, courses, lessons WHERE lesson_contents.lesson_id = lessons.id AND lessons.course_id = courses.id AND user_courses.course_id = courses.id AND user_courses.user_id = :user_id)", {content_id: id, user_id: user_id}).length > 0
	end

	def self.contents_for_lesson(course_id, lesson_id, user_id = -1)
		course = Course.find(course_id)
		if user_id > 0
			contents = Content.where(owner_id: user_id, category_id: course.category_id, category_type: course.category_type).as_json
		else
			contents = Content.where(category_id: course.category_id, category_type: course.category_type).as_json
		end
		if lesson_id
			contents.each do |content|
				content.merge!({in_lesson: LessonContent.where(lesson_id: lesson_id, content_id: content["id"]).length > 0})
			end
		end
		return contents
	end

end
