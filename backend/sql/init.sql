-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create initial tables
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(50),
    alert_type VARCHAR(100),
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    effective_time TIMESTAMP WITH TIME ZONE,
    expires_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cameras (
    id SERIAL PRIMARY KEY,
    camera_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326),
    province VARCHAR(3),
    image_url VARCHAR(500),
    last_updated TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS idx_alerts_geometry ON alerts USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_cameras_location ON cameras USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_alerts_expires ON alerts (expires_time);