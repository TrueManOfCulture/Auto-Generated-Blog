-- Create the articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Use UUID for unique IDs
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert at least 3 initial articles (Requirement 4)
INSERT INTO articles (title, content) 
VALUES 
('The Rise of Serverless Containers', 'The world of cloud computing is constantly evolving...'),
('Node.js vs. Deno: A Performance Deep Dive', 'While Node.js remains the industry standard, Deno offers new security features...'),
('Building a CI/CD Pipeline with AWS CodeBuild', 'Automating your deployments saves time and ensures consistency...');