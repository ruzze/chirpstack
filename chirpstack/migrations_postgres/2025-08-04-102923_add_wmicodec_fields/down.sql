-- This file should undo anything in `up.sql`
ALTER TABLE device_profile
        DROP COLUMN wmi_codec_fields;
