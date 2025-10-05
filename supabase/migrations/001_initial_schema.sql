-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    difficulty SMALLINT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    category VARCHAR(100) NOT NULL,
    accent VARCHAR(20) NOT NULL,
    thumbnail TEXT,
    transcript_en JSONB NOT NULL,
    transcript_cn JSONB NOT NULL,
    checkpoints JSONB NOT NULL,
    ai_analysis JSONB,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create learning_records table
CREATE TABLE IF NOT EXISTS learning_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    progress DECIMAL(5, 2) DEFAULT 0, -- percentage 0-100
    watch_duration INTEGER DEFAULT 0, -- in seconds
    points_earned INTEGER DEFAULT 0,
    checkpoints_passed JSONB DEFAULT '[]'::jsonb,
    words_collected JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, video_id)
);

-- Create collections table (user favorites)
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, video_id)
);

-- Create word_bank table
CREATE TABLE IF NOT EXISTS word_bank (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    example_sentence TEXT,
    source_video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    review_count INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    mastery_level SMALLINT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, word)
);

-- Create indexes for better query performance
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_difficulty ON videos(difficulty);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_learning_records_user_id ON learning_records(user_id);
CREATE INDEX idx_learning_records_video_id ON learning_records(video_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_word_bank_user_id ON word_bank(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_records_updated_at BEFORE UPDATE ON learning_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_bank ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Learning records policies
CREATE POLICY "Users can view own learning records" ON learning_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning records" ON learning_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning records" ON learning_records
    FOR UPDATE USING (auth.uid() = user_id);

-- Collections policies
CREATE POLICY "Users can view own collections" ON collections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collections" ON collections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON collections
    FOR DELETE USING (auth.uid() = user_id);

-- Word bank policies
CREATE POLICY "Users can view own word bank" ON word_bank
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own words" ON word_bank
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own words" ON word_bank
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own words" ON word_bank
    FOR DELETE USING (auth.uid() = user_id);

-- Videos are public to read
CREATE POLICY "Anyone can view videos" ON videos
    FOR SELECT USING (true);