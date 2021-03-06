# A question can be used in a {Test test}, or just be available as an exercise in a {Course course}.
# It must belong to a category ({Subject subject} or {Field field}). It can contain {Medium medium}.
# It can be {Recommendation recommended}, {Rating rated} and {Response answered} by users.
# If its style is "multiple choice", it contains {QuestionChoice choices} as well.
#
# == Schema Information
#
# Table name: questions
#
#  id         :integer          not null, primary key
#  owner_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  text       :text
#  answer     :text
#  hot        :boolean
#  source     :string(255)
#  date       :datetime
#  style      :string(255)
#  tags       :string(255)
#
# Indexes
#
#  index_questions_on_owner_id  (owner_id)
#

class Question < ActiveRecord::Base

	include ActionView::Helpers::TextHelper
	include ActionView::Helpers::SanitizeHelper

	# These are the available questions styles.
	STYLES = [
		STYLE_WRITTEN = 'written', 
		STYLE_CHOICE = 'choice'
	]

	# @!attribute text
	# 	Text of the question.
	# 	@return [String] the text of the question.

	# @!attribute answer
	# 	Official answer of the question. To be used in corrections.
	# 	@return [String] the answer of the question.	

	# @!attribute hot
	# 	Determines if a question is "hot" or not.
	# 	@return [Boolean] +true+ if the question is "hot", +false+ otherwise.

	# @!attribute source
	# 	The source of the question (if it is not created by the owner).
	# 	@return [String] the source of the question.

	# @!attribute date
	# 	Date of the question creation. If the question is extracted from a {Question#source source},
	# 	this attribute should keep the date of publication.
	# 	@return [DateTime] the date of the question.

	# @!attribute style
	# 	The style of the question.
	# 	@return [String] the style of the question.

	# @!group Belongs to
	
	# The owner is the {User user} who created the question.
	# @return [User] user who created the question.
	# @see User#questions
	belongs_to :owner, class_name: "User"
	
	# @!endgroup

	# @!group Has many

	# All {Lesson lessons} that have access to the question.
	# @return [Array<Lesson>] a list of all lessons that have access to the question.
	# @see Lesson#questions
	has_many :lessons, through: :lesson_questions
	
	# All {Subject subjects} to which the question belongs.
	# @return [Array<Subject>] a list of all subjects to which the question belongs.
	# @see Subject#questions
	has_many :subjects, through: :question_categories, source: :category, source_type: "Subject"
	
	# All {Field fields} to which the question belongs.
	# @return [Array<Field>] a list of all fields to which the question belongs.
	# @see Field#questions
	has_many :fields, through: :question_categories, source: :category, source_type: "Field"
	
	# All {QuestionChoice choices} of the question in case of a multiple choice question.
	# @return [Array<QuestionChoice>] a list containing all the question choices.
	# @see QuestionChoice#question
	has_many :question_choices

	# All {Medium medium} objects possessed by the question.
	# @return [Array<Medium>] a list of all medium objects of the question.
	# @see Medium#owner
	has_many :media, as: :owner

	# All {Rating ratings} of the question.
	# @return [Array<Rating>] a list of all ratings of the question.
	# @see Rating#question
	has_many :ratings

	# All {Recommendation recommendations} of the question.
	# @return [Array<Recommendation>] a list of all recommendations of the question.
	# @see Recommendation#resource
	has_many :recommendations, as: :resource

	# All {Response responses} to the question.
	# @return [Array<Response>] a list of all responses to the question.
	# @see Response#question
	has_many :responses											
	
	# All {Test tests} containing the question.
	# @return [Array<Test>] a list of all tests containing the question.
	# @see Test#questions
	has_many :tests, through: :test_questions

	# All {Subject subjects} and {Field fields} to which the question belongs.
	# @note This method cannot be used to modify the categories to which the question belongs.
	#  The {Question#subjects subjects} and {Question#fields fields} methods should be used instead.
	# @return [Array<Subject, Field>] a list of all subjects and fields to which the question belongs.
	def categories
		subjects + fields
	end

	def category_list
		list = ""
		categories.each do |c|
			list = list + c.name + "; "
		end
		list.chop.chop
	end

	# @!endgroup

	def owner_name
		owner.first_name + ' ' + owner.last_name
	end

	def description
		strip_tags(truncate(text, length: 100, escape: false))
	end

	def can_be_accessed?(user_id)
		return LessonQuestion.where("lesson_questions.question_id = :question_id AND EXISTS (SELECT 1 FROM user_courses, courses, lessons WHERE lesson_questions.lesson_id = lessons.id AND lessons.course_id = courses.id AND user_courses.course_id = courses.id AND user_courses.user_id = :user_id)", {question_id: id, user_id: user_id}).length > 0
	end

	def done(user)
		return Response.where(owner_id: user.id, question_id: id).length > 0
	end

	has_many :lesson_questions
	has_many :question_categories
	has_many :test_questions
	
end
