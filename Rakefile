task :pdf => "_site/index.html" do
    sh "wkhtmltopdf _site/index.html cv_eliseo_papa.pdf"
end

file "_site/index.html" do
    sh "jekyll"
end

task :default => ["html"]