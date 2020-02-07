class Point
	def self.from_x_y(x, y)
		x.present? && y.present? ? "POINT(#{x} #{y})" : nil
	end
end