-- Extension's Metadata
CREATE TABLE extension_metadata (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User General Settings
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY,
    is_paid_user BOOLEAN NOT NULL DEFAULT FALSE,
    settings JSONB NOT NULL DEFAULT '{}',
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plugins
CREATE TABLE plugins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_core BOOLEAN NOT NULL DEFAULT FALSE,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    dependencies JSONB
);

-- Plugins' Settings
CREATE TABLE plugin_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_settings(user_id),
    plugin_id INTEGER REFERENCES plugins(id),
    settings JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, plugin_id)
);

-- Feature Flags
CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    plugin_id INTEGER REFERENCES plugins(id),
    flag_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plugin_id, flag_name)
);

-- Other JSON Data
CREATE TABLE other_data (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
